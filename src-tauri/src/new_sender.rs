use tauri::{Wry, Manager, async_runtime::block_on};
use tokio::task;

#[tauri::command]
pub async fn show_sender_window(app_handle: tauri::AppHandle<Wry>) {
  let sender_window = app_handle.get_window("sender");

  if let Some(sender_window) = sender_window {
    sender_window.show().expect("Failed to show sender window!");
  } else {
    task::block_in_place(|| block_on(create_sender_window(app_handle)));
  }
}

#[tauri::command]
pub async fn close_sender_window(app_handle: tauri::AppHandle<Wry>) -> Result<(), String> {
  let sender_window = app_handle.get_window("sender");

  if let Some(sender_window) = sender_window {
    if sender_window.close().is_ok() {
       return Ok(());
    }
    return Err("Failed to close sender window!".into());
  }

  Err("No sender window!".into())
}

#[tauri::command]
pub async fn hide_sender_window(app_handle: tauri::AppHandle<Wry>) {
  let sender_window = app_handle.get_window("sender");

  if let Some(sender_window) = sender_window {
    sender_window.hide().expect("Failed to hide sender window!");
  }
}

#[tauri::command]
pub async fn create_sender_window(app_handle: tauri::AppHandle<Wry>) {
    let viewer = tauri::WindowBuilder::new(
        &app_handle,
        "sender",
        tauri::WindowUrl::App("/sender".into())
    )
      .title("D4nm4ku Sender")
      .transparent(true)
      .decorations(false)
      .inner_size(400., 40.)
      .build()
      .unwrap();

    viewer
      .set_min_size(std::option::Option::Some(tauri::LogicalSize::new(200, 40)))
      .expect("Failed to set min size!");

    viewer
      .set_max_size(std::option::Option::Some(tauri::LogicalSize::new(800, 40)))
      .expect("Failed to set min size!");

    viewer
      .set_always_on_top(true)
      .expect("Failed to set always on top");

    window_shadows::set_shadow(&viewer, false)
      .expect("Failed to set window shadows to false!");
}
