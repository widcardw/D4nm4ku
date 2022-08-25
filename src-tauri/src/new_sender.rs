use tauri::Wry;

#[tauri::command]
pub fn create_sender_window(app_handle: tauri::AppHandle<Wry>) {
    let viewer = tauri::WindowBuilder::new(
        &app_handle,
        "senderWindow",
        tauri::WindowUrl::App("/sender".into())
    )
      .transparent(true)
      .decorations(false)
      .inner_size(400., 40.)
      .build()
      .unwrap();

    viewer
      .set_min_size(std::option::Option::Some(tauri::LogicalSize::new(300, 40)))
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
