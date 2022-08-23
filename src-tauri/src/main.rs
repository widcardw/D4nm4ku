#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod send_msg;
mod fetch_img;
mod open_app_dir;
mod load_local_img;
mod new_view;

use new_view::create_new_view;
use send_msg::send_message;
use fetch_img::fetch_image;
use open_app_dir::open_app_img_dir;
use load_local_img::load_local_image;

use tauri::Manager;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

// use tauri::Manager;

// #[derive(Clone, serde::Serialize, serde::Deserialize)]
// struct ClickTransparentPayload {
//   enable: bool
// }

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
                      send_message,
                      fetch_image,
                      open_app_img_dir,
                      load_local_image
                    ])
    .setup(|app| {
      let app_handle = app.app_handle();
      let _unlisten = app.listen_global("--create-danmaku-viewer", move |_event| {
        create_new_view(&app_handle);
      });

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
