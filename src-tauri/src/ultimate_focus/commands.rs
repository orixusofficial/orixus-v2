//! Ultimate Focus — Tauri command surface.
//!
//! Minimal Phase 1 API exposed to the frontend. All commands return
//! structured JSON (`FocusStatus`) or structured error objects — never
//! arbitrary strings. Commands are only callable from the Tauri webview;
//! the browser version of Orixus never invokes them.

use serde::Serialize;
use tauri::State;

use super::{state::FocusStatus, SharedFocusManager};

/// Structured error payload returned to the frontend on failure.
#[derive(Debug, Serialize)]
pub struct CommandError {
    pub code: String,
    pub message: String,
}

impl CommandError {
    fn new(code: &str, message: impl Into<String>) -> Self {
        Self {
            code: code.to_string(),
            message: message.into(),
        }
    }
}

type CommandResult<T> = Result<T, CommandError>;

fn with_manager<T>(
    state: &State<'_, SharedFocusManager>,
    f: impl FnOnce(&mut super::state::FocusManager) -> Result<T, String>,
) -> CommandResult<T> {
    let mut guard = state
        .0
        .lock()
        .map_err(|_| CommandError::new("lock_poisoned", "Focus engine is temporarily unavailable."))?;
    f(&mut guard).map_err(|msg| CommandError::new("engine_error", msg))
}

/// Get the current native Ultimate Focus status.
#[tauri::command]
pub fn get_ultimate_focus_status(
    state: State<'_, SharedFocusManager>,
) -> CommandResult<FocusStatus> {
    with_manager(&state, |manager| Ok(manager.status()))
}

/// Enable Ultimate Focus natively.
///
/// `duration_minutes` is optional; `None` means "until manually disabled".
#[tauri::command]
pub fn enable_ultimate_focus(
    state: State<'_, SharedFocusManager>,
    duration_minutes: Option<u64>,
) -> CommandResult<FocusStatus> {
    with_manager(&state, |manager| manager.enable(duration_minutes))
}

/// Disable Ultimate Focus natively.
#[tauri::command]
pub fn disable_ultimate_focus(state: State<'_, SharedFocusManager>) -> CommandResult<FocusStatus> {
    with_manager(&state, |manager| manager.disable())
}