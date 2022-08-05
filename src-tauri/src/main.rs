#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;

#[derive(Clone, serde::Serialize, serde::Deserialize, Debug)]
struct Payload {
  msg: String,
  cookie: String,
  csrf: String,
  roomid: String
}

static API: &str = "https://api.live.bilibili.com/msg/send";

async fn send_msg(msg: String, cookie: String, csrf: String, roomid: String) -> Result<(), Box<dyn std::error::Error>> {

  // println!("do!");
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
      .await?;

    // println!("{:?}", response);
    
    Ok(())
}

fn main() {
  tauri::Builder::default()
    .setup(move |app| {
      let listen_to_send_msg = app.listen_global("send_msg", |event| {
        let payload: Payload = serde_json::from_str(event.payload().unwrap()).unwrap();
        tokio::spawn(async move {
          send_msg(
            payload.msg.clone(), 
            payload.cookie.clone(),
            payload.csrf.clone(), 
            payload.roomid.clone()).await.unwrap();
        });
      });

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
