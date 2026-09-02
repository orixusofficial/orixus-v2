//! Ultimate Focus — blocking engine abstraction.

use serde::Serialize;

/// Result type used across the Ultimate Focus engine.
pub type BlockerResult<T> = Result<T, BlockerError>;

/// Structured blocker errors surfaced to the frontend.
#[derive(Debug, Clone, Serialize)]
pub struct BlockerError {
    /// Machine-readable code (e.g. `not_implemented`, `permission_denied`).
    pub code: String,
    /// Human-readable message safe to show in the UI.
    pub message: String,
}

impl std::fmt::Display for BlockerError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} ({})", self.message, self.code)
    }
}

impl std::error::Error for BlockerError {}

impl BlockerError {
    pub fn new(code: &str, message: impl Into<String>) -> Self {
        Self {
            code: code.to_string(),
            message: message.into(),
        }
    }
}

/// Handle to the native blocking engine.
pub struct BlockerHandle {
    /// Whether the backend currently reports active enforcement.
    active: bool,
}

impl BlockerHandle {
    pub fn new() -> Self {
        Self { active: false }
    }

    /// Begin system-wide blocking.
    pub fn start_blocking(&mut self) -> BlockerResult<()> {
        match super::windows::start_blocking() {
            Ok(()) => {
                self.active = true;
                Ok(())
            }
            Err(err) => {
                self.active = false;
                Err(err)
            }
        }
    }

    /// Stop system-wide blocking and restore prior system state.
    pub fn stop_blocking(&mut self) -> BlockerResult<()> {
        self.active = false;
        super::windows::stop_blocking()
    }

    /// True only when a real Windows-level mechanism is enforcing blocks.
    pub fn is_blocking_active(&self) -> bool {
        self.active && super::windows::is_blocking_active()
    }
}

impl Default for BlockerHandle {
    fn default() -> Self {
        Self::new()
    }
}