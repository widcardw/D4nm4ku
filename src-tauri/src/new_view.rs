use tauri::{Manager, Wry};

#[tauri::command]
pub fn create_new_danmaku_view(app_handle: tauri::AppHandle<Wry>) {
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
      .set_min_size(std::option::Option::Some(tauri::LogicalSize::new(300, 200)))
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
  }

  Ok(enable)
}
