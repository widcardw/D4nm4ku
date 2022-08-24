use tauri::Manager;

pub fn create_new_view(app_handle: &tauri::AppHandle) {
    let viewer = tauri::WindowBuilder::new(
        app_handle,
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

    let viewer2 = viewer.clone();

    viewer2
      .listen_global("set-click-through", move |event| {
        let enable: bool = serde_json::from_str(event.payload().unwrap()).unwrap();
        set_click_through(&viewer, enable);
      });

}

pub fn set_click_through(window: &tauri::Window, enable: bool) {
  window.with_webview(move |webview| {
    #[cfg(target_os = "macos")]
    unsafe {
      let () = msg_send![webview.ns_window(), setIgnoresMouseEvents: enable];
    }
  })
  .expect("Failed to set click through");
}
