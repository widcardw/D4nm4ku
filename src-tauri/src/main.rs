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

// #[cfg(target_os = "macos")]
// #[macro_use]
// extern crate objc;

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
    // .setup(|app| {
    //   let opt_danmaku = app.get_window("danmakuWidget");
    //   if let Some(danmaku_window) = opt_danmaku {
    //     let d = danmaku_window.clone();
    //     danmaku_window.listen("click-transparent", move |event| {
    //       let payload: ClickTransparentPayload = serde_json::from_str(event.payload().unwrap()).unwrap();
    //       let _res = d.with_webview(move |webview| {
    //         #[cfg(target_os = "macos")]
    //         unsafe {
    //           let () = msg_send![webview.ns_window(), setIgnoresMouseEvents: payload.enable];
    //         }
    //       });
    //     });
    //   }

    //   Ok(())
    // })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
