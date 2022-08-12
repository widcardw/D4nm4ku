use std::io::Write;

#[tauri::command]
pub async fn fetch_image(img_url: String, file_path: String) -> Result<String, String> {
  
  // println!("{}", img_url);
  // println!("{}", file_path);

  if std::path::Path::new(file_path.as_str()).metadata().is_ok() {
    println!("File exists!");
    return Ok(file_path);
  }

  let client = reqwest::Client::new();
  let response = client.get(img_url)
    .send()
    .await
    .unwrap();

  // println!("Fetched image!");

  let dir = std::path::Path::new(file_path.as_str()).parent().unwrap();
  if dir.metadata().is_err() {
    std::fs::create_dir_all(dir).unwrap();
  }

  let mut file = std::fs::File::create(file_path.as_str()).unwrap();
  file.write_all(response.bytes().await.unwrap().as_ref()).unwrap();

  Ok(file_path)
}
