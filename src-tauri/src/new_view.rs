use tauri::{Manager, Wry};

#[tauri::command]
pub async fn create_new_danmaku_view(app_handle: tauri::AppHandle<Wry>) {
    let viewer = tauri::WindowBuilder::new(
        &app_handle,
        "danmakuWidget",
        tauri::WindowUrl::App("/show".into())
    )
      .transparent(true)
      .decorations(false)
      .inner_size(400., 600.)
      .build()
      .unwrap();

    viewer
      .set_min_size(std::option::Option::Some(tauri::LogicalSize::new(200, 200)))
      .expect("Failed to set min size!");

    viewer
      .set_always_on_top(true)
      .expect("Failed to set always on top");

    window_shadows::set_shadow(&viewer, false)
      .expect("Failed to set window shadows to false!");

}

#[tauri::command]
pub fn set_click_through(app_handle: tauri::AppHandle<Wry>, enable: bool) -> Result<bool, String> {
  let option_window = app_handle.get_window("danmakuWidget");
  if let Some(window) = option_window {
    window.with_webview(move |webview| {
      #[cfg(target_os = "macos")]
      unsafe {
        let () = msg_send![webview.ns_window(), setIgnoresMouseEvents: enable];
      }
    })
    .expect("Failed to set click through");
    // tao::window::Window::set_ignore_cursor_events(&window, enable);  // 怎么把 tauri::Window cast 到 tao::window::Window 呢？
  }

  Ok(enable)
}

#[derive(Copy, Clone, serde::Serialize, serde::Deserialize)]
pub struct PosProps {
  width: u32,
  height: u32,
  x: i32,
  y: i32
}

#[tauri::command]
pub fn get_viewer_pos_and_size(app_handle: tauri::AppHandle<Wry>) -> Result<PosProps, String> {
  let option_window = app_handle.get_window("danmakuWidget");
  if let Some(viewer) = option_window {
    let size = viewer.inner_size().unwrap();
    let pos = viewer.inner_position().unwrap();
    let ret = PosProps { width: size.width, height: size.height, x: pos.x, y: pos.y };

    return Ok(ret);
  }

  Err("Failed to get danmaku window!".into())
}

#[tauri::command]
pub fn set_viewer_pos_and_size(app_handle: tauri::AppHandle<Wry>, conf: PosProps) -> Result<bool, String> {
  let option_window = app_handle.get_window("danmakuWidget");
  let PosProps {width, height, x, y} = conf;
  if let Some(viewer) = option_window {
    viewer.set_size(tauri::PhysicalSize { width, height }).unwrap();
    viewer.set_position(tauri::PhysicalPosition { x, y }).unwrap();

    return Ok(true);
  }

  Err("Failed to get danmaku window!".into())
}
