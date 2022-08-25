#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod send_msg;
mod fetch_img;
mod open_app_dir;
mod load_local_img;
mod new_view;
mod new_sender;

use send_msg::send_message;
use fetch_img::fetch_image;
use open_app_dir::open_app_img_dir;
use load_local_img::load_local_image;

// use tauri::Manager;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
                      send_message,
                      fetch_image,
                      open_app_img_dir,
                      load_local_image,
                      new_sender::create_sender_window,
                      new_view::create_new_danmaku_view,
                      new_view::set_click_through
                    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
