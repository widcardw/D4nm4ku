#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod send_msg;
mod fetch_img;
mod open_app_dir;
mod load_local_img;
use send_msg::send_message;
use fetch_img::fetch_image;
use open_app_dir::open_app_img_dir;
use load_local_img::load_local_image;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
                      send_message,
                      fetch_image,
                      open_app_img_dir,
                      load_local_image
                    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
