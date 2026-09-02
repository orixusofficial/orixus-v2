//! Ultimate Focus — Windows integration layer (Phase 2).
//!
//! Real system-wide blocking for Windows via local loopback DNS resolver
//! and safe, snapshot-based DNS redirection using a minimal privileged helper.

use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use std::time::{Duration, Instant};

use super::blocker::{BlockerError, BlockerResult};
use super::dns_resolver::{self, DnsResolverHandle};

static RESOLVER_HANDLE: Mutex<Option<DnsResolverHandle>> = Mutex::new(None);
static BLOCKING_ACTIVE: Mutex<bool> = Mutex::new(false);
static DATA_DIR: Mutex<Option<PathBuf>> = Mutex::new(None);

pub fn set_data_dir(dir: PathBuf) {
    if let Ok(mut lock) = DATA_DIR.lock() {
        *lock = Some(dir);
    }
}

fn get_snapshot_path() -> Result<PathBuf, BlockerError> {
    let lock = DATA_DIR
        .lock()
        .map_err(|_| BlockerError::new("lock_failed", "Failed to lock data directory state"))?;
    let dir = lock
        .as_ref()
        .ok_or_else(|| BlockerError::new("not_initialized", "App data dir not set"))?;
    Ok(dir.join("dns_snapshot.json"))
}

fn get_helper_script_path() -> Result<PathBuf, BlockerError> {
    let mut path = std::env::current_dir().unwrap_or_default();
    path.push("src-tauri");
    path.push("scripts");
    path.push("orixus-dns-helper.ps1");

    if path.exists() {
        return Ok(path);
    }

    // Fallback: the same layout relative to the process cwd (e.g. when the
    // process cwd is already `src-tauri/` during `tauri dev`). This MUST
    // resolve to an ABSOLUTE path: the elevated helper process is launched
    // via ShellExecute with a different working directory (typically
    // C:\Windows\System32), so a relative path silently fails to resolve
    // there ("The argument ... does not exist"), no status file is ever
    // written, and the caller only sees `helper_timeout`.
    let alt = std::env::current_dir()
        .unwrap_or_default()
        .join("scripts")
        .join("orixus-dns-helper.ps1");

    if alt.exists() {
        Ok(alt)
    } else {
        Ok(path)
    }
}

/// Startup recovery check: if an orphaned `dns_snapshot.json` exists on disk
/// from a previous crash or abnormal exit, execute emergency DNS restoration.
pub fn perform_startup_recovery() {
    if let Ok(snapshot_path) = get_snapshot_path() {
        if snapshot_path.exists() {
            log::warn!("ultimate focus: detected orphaned dns_snapshot.json from previous crash — running emergency restoration");
            let _ = run_elevated_helper("--restore", &snapshot_path);
        }
    }
}

/// Begin system-wide blocking.
pub fn start_blocking() -> BlockerResult<()> {
    let snapshot_path = get_snapshot_path()?;

    // 1. Start local DNS resolver on 127.0.0.1:53
    let handle = dns_resolver::start_dns_resolver(vec!["1.1.1.1:53".to_string(), "8.8.8.8:53".to_string()])
        .map_err(|e| BlockerError::new("resolver_start_failed", e))?;

    // 2. Invoke elevated helper to snapshot & apply 127.0.0.1 DNS
    match run_elevated_helper("--apply", &snapshot_path) {
        Ok(()) => {
            if let Ok(mut lock) = RESOLVER_HANDLE.lock() {
                *lock = Some(handle);
            }
            if let Ok(mut active) = BLOCKING_ACTIVE.lock() {
                *active = true;
            }
            log::info!("ultimate focus: system-wide Windows blocking successfully activated");
            Ok(())
        }
        Err(err) => {
            // Rollback resolver if helper failed
            handle.stop();
            Err(err)
        }
    }
}

/// Stop system-wide blocking and restore prior system state.
pub fn stop_blocking() -> BlockerResult<()> {
    let snapshot_path = get_snapshot_path().ok();

    // 1. Stop local DNS resolver handle
    if let Ok(mut lock) = RESOLVER_HANDLE.lock() {
        if let Some(handle) = lock.take() {
            handle.stop();
        }
    }

    if let Ok(mut active) = BLOCKING_ACTIVE.lock() {
        *active = false;
    }

    // 2. Invoke elevated helper to restore DNS configuration
    if let Some(ref path) = snapshot_path {
        if path.exists() {
            run_elevated_helper("--restore", path)?;
        }
    }

    log::info!("ultimate focus: system-wide Windows blocking stopped and prior DNS restored");
    Ok(())
}

/// Whether a real Windows-level mechanism is currently enforcing blocks.
pub fn is_blocking_active() -> bool {
    BLOCKING_ACTIVE.lock().map(|b| *b).unwrap_or(false)
}

fn run_elevated_helper(action: &str, snapshot_path: &PathBuf) -> BlockerResult<()> {
    let helper_script = get_helper_script_path()?;
    let snapshot_str = snapshot_path.to_string_lossy().to_string();
    let script_str = helper_script.to_string_lossy().to_string();
    let status_path = PathBuf::from(format!("{snapshot_str}.status"));

    // Clear stale status file if any
    let _ = fs::remove_file(&status_path);

    // Launch the privileged helper via the Windows-native ShellExecuteExW with
    // the "runas" verb — the same elevation mechanism the previous approach
    // performed indirectly (Rust -> powershell.exe -> Shell.Application COM ->
    // ShellExecute). Going direct removes the intermediate PowerShell process
    // (which added ~1s+ startup per toggle and flashed a console window in
    // packaged GUI builds) and the UAC prompt still appears normally.
    //
    // CRITICAL: this runs on a Tauri command worker thread, which has no
    // message pump. ShellExecuteEx requires the SEE_MASK_NOASYNC flag in
    // that situation (see Microsoft docs: "If the calling thread does not
    // have a message pump... use the SEE_MASK_NOASYNC flag"). Without it the
    // elevation request was silently auto-denied inside the app (error 5 in
    // under a second, no UAC prompt ever shown), while the identical call
    // succeeded from standalone processes.
    //
    // SEE_MASK_NOCLOSEPROCESS additionally returns the elevated helper's
    // process handle, so we can wait for it to exit and capture its REAL
    // exit code instead of inferring success from a timeout window.
    //
    // The elevated helper PowerShell is launched hidden (nShow = SW_HIDE and
    // -WindowStyle Hidden) so no console window ever flashes.
    //
    // The helper arguments remain exactly the bounded pair from before:
    // the action (--apply | --restore) and the snapshot file path. Nothing
    // arbitrary is executed; only this fixed helper script is launched.
    let helper_args = format!(
        "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \"{script_str}\" {action} \"{snapshot_str}\""
    );

    #[cfg(windows)]
    {
        use std::os::windows::ffi::OsStrExt;

        fn to_wide(s: &str) -> Vec<u16> {
            std::ffi::OsStr::new(s)
                .encode_wide()
                .chain(std::iter::once(0))
                .collect()
        }

        // shellapi.h constants (windows-sys does not re-export these).
        const SEE_MASK_NOCLOSEPROCESS: u32 = 0x0000_0040;
        const SEE_MASK_NOASYNC: u32 = 0x0000_0100; // == SEE_MASK_FLAG_DDEWAIT
        const SW_HIDE: i32 = 0;
        const WAIT_OBJECT_0: u32 = 0;
        const WAIT_TIMEOUT: u32 = 0x0000_0102;
        const ERROR_CANCELLED: u32 = 1223;

        let verb = to_wide("runas");
        let file = to_wide("powershell.exe");
        let params = to_wide(&helper_args);

        let mut exec_info: windows_sys::Win32::UI::Shell::SHELLEXECUTEINFOW =
            unsafe { std::mem::zeroed() };
        exec_info.cbSize = std::mem::size_of::<windows_sys::Win32::UI::Shell::SHELLEXECUTEINFOW>()
            as u32;
        exec_info.fMask = SEE_MASK_NOCLOSEPROCESS | SEE_MASK_NOASYNC;
        exec_info.hwnd = std::ptr::null_mut(); // no owner window
        exec_info.lpVerb = verb.as_ptr();
        exec_info.lpFile = file.as_ptr();
        exec_info.lpParameters = params.as_ptr();
        exec_info.lpDirectory = std::ptr::null(); // default working directory
        exec_info.nShow = SW_HIDE; // the elevated helper starts fully hidden

        let launched = unsafe {
            windows_sys::Win32::UI::Shell::ShellExecuteExW(&mut exec_info)
        };

        if launched == 0 {
            let err = unsafe { windows_sys::Win32::Foundation::GetLastError() };
            let reason = if err == ERROR_CANCELLED {
                "elevation was declined by the user (UAC cancelled)".to_string()
            } else {
                format!("ShellExecuteExW failed (Win32 error {err})")
            };
            return Err(BlockerError::new(
                "helper_elevation_failed",
                format!("Failed to request elevation: {reason}"),
            ));
        }

        // Wait for the elevated helper process to exit and capture its real
        // exit code. The generous timeout covers slow helper runs; the UAC
        // decision itself is already resolved by the time we get here, so
        // there is no risk of rolling back the resolver while DNS is still
        // pending application.
        let mut exit_code: u32 = 0;
        let wait_result =
            unsafe { windows_sys::Win32::System::Threading::WaitForSingleObject(exec_info.hProcess, 30_000) };
        unsafe {
            windows_sys::Win32::System::Threading::GetExitCodeProcess(
                exec_info.hProcess,
                &mut exit_code,
            );
            windows_sys::Win32::Foundation::CloseHandle(exec_info.hProcess);
        }

        if wait_result != WAIT_OBJECT_0 {
            if wait_result == WAIT_TIMEOUT {
                let _ = fs::remove_file(&status_path);
                return Err(BlockerError::new(
                    "helper_timeout",
                    "The privileged DNS helper did not exit within 30 seconds.",
                ));
            }
            // WAIT_FAILED or unexpected — fall through to status file check
            // below so a completed helper is not reported as a failure.
        } else if exit_code != 0 {
            // Helper ran and failed. Prefer the structured status message if
            // present; otherwise report the raw exit code.
            if let Ok(content) = fs::read_to_string(&status_path) {
                let trimmed = content.trim();
                let _ = fs::remove_file(&status_path);
                if trimmed.starts_with("ERROR:") {
                    return Err(BlockerError::new("helper_failed", trimmed.to_string()));
                }
            }
            let _ = fs::remove_file(&status_path);
            return Err(BlockerError::new(
                "helper_failed",
                format!("Privileged DNS helper exited with code {exit_code}"),
            ));
        }
    }

    #[cfg(not(windows))]
    {
        let _ = (&action, &helper_args);
        return Err(BlockerError::new(
            "helper_elevation_failed",
            "Elevated DNS helper is only supported on Windows.",
        ));
    }

    // Poll for status file output from elevated helper. The window must be
    // generous enough to cover UAC prompt acceptance time — if the user
    // accepts AFTER this window, the helper would apply DNS while the
    // resolver has already been rolled back, leaving DNS broken.
    let start = Instant::now();
    let timeout = Duration::from_secs(30);

    while start.elapsed() < timeout {
        if status_path.exists() {
            if let Ok(content) = fs::read_to_string(&status_path) {
                let trimmed = content.trim();
                let _ = fs::remove_file(&status_path);

                if trimmed == "SUCCESS" || trimmed == "RESTORED" {
                    return Ok(());
                } else if trimmed.starts_with("ERROR:") {
                    return Err(BlockerError::new("helper_failed", trimmed.to_string()));
                }
            }
        }
        std::thread::sleep(Duration::from_millis(200));
    }

    let _ = fs::remove_file(&status_path);
    Err(BlockerError::new(
        "helper_timeout",
        "Administrator elevation request timed out or was declined by the user.",
    ))
}
