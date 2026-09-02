//! Ultimate Focus — native focus state manager.
//!
//! Owns the authoritative Focus state for the desktop app. The state lives in
//! the Rust process (behind a Tauri-managed `Mutex`) and is persisted to a JSON
//! file inside the app's data directory, so it survives:
//!   - the React window being closed or reloaded
//!   - the webview being torn down
//!   - app restarts (state is reloaded from disk on startup)
//!
//! This state is intentionally independent from any React/localStorage state
//! and from the browser-extension focus system (which remains a separate,
//! browser-only feature).

use std::fs;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

use serde::{Deserialize, Serialize};

use super::blocker::BlockerHandle;

/// Current phase of the native blocking engine.
///
/// `NotImplemented` is the honest default: Phase 1 ships the state machine,
/// persistence, command surface and blocker *abstraction*, but does not yet
/// claim system-wide website blocking. See `windows.rs` for the documented
/// plan for the real Windows mechanism.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum EnginePhase {
    /// Blocking engine abstraction exists; no system-wide mechanism yet.
    #[default]
    NotImplemented,
    /// A real Windows blocking mechanism is active.
    Active,
    /// The engine attempted to start and failed.
    Failed,
}

/// Persistent native Focus state.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FocusState {
    /// Whether Ultimate Focus is enabled by the user.
    pub enabled: bool,
    /// Unix timestamp (seconds) of when Focus was last enabled.
    #[serde(default)]
    pub activated_at: Option<u64>,
    /// Optional session duration in minutes. `None` = until manually disabled.
    #[serde(default)]
    pub duration_minutes: Option<u64>,
    /// Current phase of the native blocking engine.
    #[serde(default)]
    pub engine_phase: EnginePhase,
    /// Human-readable detail for the last engine error, if any.
    #[serde(default)]
    pub last_error: Option<String>,
}

impl Default for FocusState {
    fn default() -> Self {
        Self {
            enabled: false,
            activated_at: None,
            duration_minutes: None,
            engine_phase: EnginePhase::NotImplemented,
            last_error: None,
        }
    }
}

impl FocusState {
    /// Whether the session has an expiry and it has passed.
    /// An expired session is reported as inactive but is only cleared from
    /// disk when the user next interacts (keeps reads side-effect free).
    pub fn is_expired(&self) -> bool {
        if !self.enabled {
            return false;
        }
        match (self.activated_at, self.duration_minutes) {
            (Some(activated_at), Some(minutes)) => {
                let now = now_unix();
                now >= activated_at.saturating_add(minutes * 60)
            }
            _ => false,
        }
    }

    /// Unix timestamp (seconds) when the session expires, if bounded.
    pub fn expires_at(&self) -> Option<u64> {
        self.activated_at
            .zip(self.duration_minutes)
            .map(|(activated_at, minutes)| activated_at.saturating_add(minutes * 60))
    }
}

/// Runtime handle combining persistent state with the blocking engine.
pub struct FocusManager {
    state: FocusState,
    state_path: PathBuf,
    blocker: BlockerHandle,
}

/// Structured status returned to the frontend.
#[derive(Debug, Clone, Serialize)]
pub struct FocusStatus {
    pub enabled: bool,
    pub activated_at: Option<u64>,
    pub expires_at: Option<u64>,
    pub duration_minutes: Option<u64>,
    /// Whether the native engine is genuinely blocking right now.
    pub blocking_active: bool,
    pub engine_phase: EnginePhase,
    pub last_error: Option<String>,
}

fn now_unix() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

impl FocusManager {
    /// Create a manager, loading any previously persisted state from disk.
    pub fn load(app_data_dir: PathBuf) -> Self {
        let state_path = app_data_dir.join("ultimate_focus_state.json");
        let state = fs::read(&state_path)
            .ok()
            .and_then(|bytes| serde_json::from_slice::<FocusState>(&bytes).ok())
            .unwrap_or_default();

        if state.enabled {
            log::info!("ultimate focus: restored enabled state from disk");
        }

        Self {
            state,
            state_path,
            blocker: BlockerHandle::new(),
        }
    }

    /// Persist the current state to disk. Failures are logged but never panic;
    /// the in-memory state remains authoritative for the running process.
    fn persist(&self) {
        match serde_json::to_vec_pretty(&self.state) {
            Ok(bytes) => {
                if let Err(err) = fs::write(&self.state_path, bytes) {
                    log::error!("ultimate focus: failed to persist state: {err}");
                }
            }
            Err(err) => log::error!("ultimate focus: failed to serialize state: {err}"),
        }
    }

    /// Current structured status (never mutates state).
    pub fn status(&self) -> FocusStatus {
        let blocking_active = self.state.enabled
            && !self.state.is_expired()
            && self.blocker.is_blocking_active();
        FocusStatus {
            enabled: self.state.enabled && !self.state.is_expired(),
            activated_at: self.state.activated_at,
            expires_at: self.state.expires_at(),
            duration_minutes: self.state.duration_minutes,
            blocking_active,
            engine_phase: self.state.engine_phase,
            last_error: self.state.last_error.clone(),
        }
    }

    /// Enable Focus. Starts the blocking engine; on engine failure the state
    /// is NOT reported as enabled (never silently claim active Focus).
    pub fn enable(&mut self, duration_minutes: Option<u64>) -> Result<FocusStatus, String> {
        if self.state.enabled && !self.state.is_expired() {
            // Idempotent: already active. Update duration if provided.
            if duration_minutes.is_some() {
                self.state.duration_minutes = duration_minutes;
                self.persist();
            }
            return Ok(self.status());
        }

        self.state.enabled = true;
        self.state.activated_at = Some(now_unix());
        self.state.duration_minutes = duration_minutes;
        self.state.last_error = None;

        match self.blocker.start_blocking() {
            Ok(()) => {
                self.state.engine_phase = EnginePhase::Active;
                log::info!("ultimate focus: enabled (blocker started)");
            }
            Err(err) => {
                self.state.enabled = false;
                self.state.activated_at = None;
                self.state.engine_phase = EnginePhase::Failed;
                self.state.last_error = Some(err.to_string());
                log::warn!("ultimate focus: enable failed, blocker not started: {err}");
            }
        }

        self.persist();
        Ok(self.status())
    }

    /// Disable Focus and stop the blocking engine.
    pub fn disable(&mut self) -> Result<FocusStatus, String> {
        if !self.state.enabled {
            return Ok(self.status());
        }

        if let Err(err) = self.blocker.stop_blocking() {
            // Still flip state off — a failed stop must not trap the user in
            // Focus — but surface the error.
            self.state.enabled = false;
            self.state.activated_at = None;
            self.state.duration_minutes = None;
            self.state.engine_phase = EnginePhase::Failed;
            self.state.last_error = Some(err.to_string());
            self.persist();
            log::error!("ultimate focus: disabled with blocker stop error: {err}");
            return Err(err.to_string());
        }

        self.state.enabled = false;
        self.state.activated_at = None;
        self.state.duration_minutes = None;
        self.state.engine_phase = EnginePhase::NotImplemented;
        self.state.last_error = None;
        self.persist();
        log::info!("ultimate focus: disabled (blocker stopped)");
        Ok(self.status())
    }
}