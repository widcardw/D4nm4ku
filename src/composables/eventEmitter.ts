import { WebviewWindow } from '@tauri-apps/api/window'

export function eventEmitter(event: string, payload: any) {
  const showWindow = WebviewWindow.getByLabel('danmakuWidget')
  if (showWindow)
    showWindow.emit(event, payload)

  const senderWindow = WebviewWindow.getByLabel('senderWindow')
  if (senderWindow)
    senderWindow.emit(event, payload)
}
