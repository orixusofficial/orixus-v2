//! Ultimate Focus — native engine (Phase 2).
//!
//! Module layout:
//!   - `state`          : persistent focus state + `FocusManager`
//!   - `blocker`        : blocking engine abstraction (`BlockerHandle`)
//!   - `windows`        : real Windows integration (snapshot & local DNS resolver)
//!   - `dns_resolver`   : loopback UDP DNS server (127.0.0.1:53 / [::1]:53)
//!   - `blocklist_data` : native domain blocklist matcher
//!   - `commands`       : Tauri command surface exposed to the frontend

pub mod blocker;
pub mod blocklist_data;
pub mod commands;
pub mod dns_resolver;
pub mod state;
pub mod windows;

use std::sync::Mutex;

use tauri::{AppHandle, Manager};

/// Tauri-managed shared state. The `Mutex` serializes all mutations; the
/// manager itself owns persistence and the blocker handle.
pub struct SharedFocusManager(pub Mutex<state::FocusManager>);

/// Initialize the engine at app startup: load persisted state from the
/// app's data directory and register it as Tauri-managed state.
pub fn init(app: &AppHandle) -> Result<(), String> {
    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("failed to resolve app data dir: {e}"))?;

    // Ensure the data directory exists before persisting state into it.
    if let Err(err) = std::fs::create_dir_all(&data_dir) {
        return Err(format!("failed to create app data dir: {err}"));
    }

    windows::set_data_dir(data_dir.clone());

    // Resolve the packaged DNS helper script through Tauri's resource
    // resolver (`BaseDirectory::Resource`). In a production install the
    // process working directory is arbitrary, so the helper must be located
    // via the bundled resource location, not the cwd.
    match app.path().resolve(
        "scripts/orixus-dns-helper.ps1",
        tauri::path::BaseDirectory::Resource,
    ) {
        Ok(path) => windows::set_helper_script_path(path),
        Err(err) => log::warn!(
            "ultimate focus: could not resolve helper script resource: {err}"
        ),
    }

    // Perform emergency startup recovery if an orphaned snapshot exists
    windows::perform_startup_recovery();

    let manager = state::FocusManager::load(data_dir);
    app.manage(SharedFocusManager(Mutex::new(manager)));
    log::info!("ultimate focus: engine initialized (Phase 2 system-wide blocking ready)");
    Ok(())
}