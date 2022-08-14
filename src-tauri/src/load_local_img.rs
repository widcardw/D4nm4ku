#[tauri::command]
pub async fn load_local_image(uid_path: String) -> Result<String, String> {
    if std::path::Path::new(uid_path.as_str()).metadata().is_ok() {
        return Ok(uid_path);
    }

    Ok("".into())
}
