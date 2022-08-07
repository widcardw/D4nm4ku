#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[derive(Clone, serde::Serialize, serde::Deserialize, Debug)]
struct Payload {
  msg: String,
  cookie: String,
  csrf: String,
  roomid: String
}

static API: &str = "https://api.live.bilibili.com/msg/send";

#[tauri::command]
async fn send_msg(msg: String, cookie: String, csrf: String, roomid: String) -> Result<(), String> {

  let client = reqwest::Client::new();
  let csrf2 = csrf.clone();

  let form = reqwest::multipart::Form::new()
    .text("bubblue", "0")
    .text("msg", msg)
    .text("color", "16777215")
    .text("mode", "1")
    .text("fontsize", "25")
    .text("roomid", roomid)
    .text("csrf", csrf)
    .text("csrf_token", csrf2)
    .text("rnd", std::time::SystemTime::now()
      .duration_since(std::time::UNIX_EPOCH)
      .unwrap()
      .as_secs().to_string());


    let response = client
      .post(API)
      .header("cookie", cookie)
      .multipart(form)
      .send()
      .await
      .unwrap();

    if response.status().is_success() {
      return Ok(());
    }

    Err(response.status().to_string().into())
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![send_msg])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
