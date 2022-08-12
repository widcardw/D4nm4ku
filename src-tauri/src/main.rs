#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod send_msg;
mod fetch_img;
use send_msg::send_message;
use fetch_img::fetch_image;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![send_message, fetch_image])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
