mod ultimate_focus;

use tauri::{Manager, RunEvent, WindowEvent};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Initialize the native Ultimate Focus engine: loads persisted state
      // from the app data dir and registers it as Tauri-managed state.
      // A failure here is logged but does not crash the app; the focus
      // commands will report the engine as unavailable via structured errors.
      if let Err(err) = ultimate_focus::init(app.handle()) {
        log::error!("ultimate focus: initialization failed: {err}");
      }

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      ultimate_focus::commands::get_ultimate_focus_status,
      ultimate_focus::commands::enable_ultimate_focus,
      ultimate_focus::commands::disable_ultimate_focus,
    ])
    .build(tauri::generate_context!())
    .expect("error while building tauri application")
    .run(|_app_handle, event| {
      match event {
        // Window lifecycle: closing the main window while Ultimate Focus is active
        // must NOT stop blocking — hide the window and keep the Rust process alive.
        RunEvent::WindowEvent {
          label,
          event: WindowEvent::CloseRequested { api, .. },
          ..
        } => {
          if ultimate_focus::windows::is_blocking_active() {
            log::info!("orixus: main window close requested while Ultimate Focus active — hiding window to maintain background DNS blocking");
            api.prevent_close();
            if let Some(window) = _app_handle.get_webview_window(&label) {
              let _ = window.hide();
            }
          }
        }
        RunEvent::WindowEvent {
          event: WindowEvent::Destroyed { .. },
          ..
        } => {
          log::info!("orixus: main window destroyed — native focus state preserved");
        }
        // App shutdown: give the blocking engine a chance to restore any
        // system state it changed during the session.
        RunEvent::Exit => {
          log::info!("orixus: app exit — running ultimate focus shutdown");
          let _ = ultimate_focus::windows::stop_blocking();
        }
        _ => {}
      }
    });
}