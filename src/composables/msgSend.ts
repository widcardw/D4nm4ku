import { emit } from '@tauri-apps/api/event'
import getCookies from './getCookies'

const store = useStore()
const roomId = store.getRoomId

const cookie = getCookies()

async function sendSingleMsg(msg: string) {
  const payload = {
    msg,
    cookie,
    roomid: roomId,
    csrf: store.getUserInfo.bili_jct,
  }
  // console.log(payload, cookie)
  emit('send_msg', payload)
}

async function sendMsg(msg: string) {
  for (let i = 0; i * 20 < msg.length; i++) {
    const partial = msg.substring(i * 20, i * 20 + 20)
    setTimeout(() => {
      sendSingleMsg(partial)
    }, i * 1500)
  }
}

export {
  sendMsg,
}
