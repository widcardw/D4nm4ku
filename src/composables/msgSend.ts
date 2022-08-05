import { emit } from '@tauri-apps/api/event'
import getCookies from './getCookies'

const store = useStore()
const roomId = store.getRoomId

const cookie = getCookies()

async function sendMsg(msg: string) {
  emit('send_msg', {
    msg,
    cookie,
    roomid: roomId,
    csrf: store.getUserInfo.bili_jct,
  })
}

export {
  sendMsg,
}
