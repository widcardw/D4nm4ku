import { invoke } from '@tauri-apps/api/tauri'
import getCookies from './getCookies'

const store = useStore()
const roomId = store.getRoomId

const cookie = getCookies()

function sendSingleMsg(msg: string) {
  const payload = {
    msg,
    cookie,
    roomid: roomId,
    csrf: store.getUserInfo.bili_jct,
  }
  invoke('send_msg', payload)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('发送成功')
    })
    .catch((err: string) => {
      throw new Error(err)
    })
}

function sendMsg(msg: string) {
  if (cookie === '')
    throw new Error('尚未登录')

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
