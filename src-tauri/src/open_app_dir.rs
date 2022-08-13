use std::process::Command;

#[tauri::command]
pub async fn open_app_img_dir(dir: String) -> Result<(), String> {
    // println!("{}", dir);
    if cfg!(target_os = "windows") {
        Command::new("explorer")
            .arg(&dir)
            .spawn()
            .unwrap();
    } else if cfg!(target_os = "macos") {
        Command::new("open")
            .arg(&dir)
            .spawn()
            .unwrap();
    } else {
        Command::new("xdg-open")
            .arg(&dir)
            .spawn()
            .unwrap();
    }

    Ok(())
}
