import { KeepLiveWS } from 'bilibili-live-ws'
import { fetch } from '@tauri-apps/api/http'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'
import type {
  DanmakuProps,
  GiftProps,
  InteractProps,
  SuperChatProps,
} from './components'
import type {
  DanmakuMessage,
  GiftInfo,
  GuardBuyMessage,
  InteractiveWordMessage,
  SendGiftMessage,
  SuperChatMessage,
} from './types'
import { giftInfo } from './api'
import { autoSendByWord } from './autoSendMsg'
import { guardType } from './data'
import getLastMatchedGift from './getLastMatchedGift'
import parseFanNumbers from './parseFanNumbers'
import { randomColorPair } from './randomColor'
import { priceToSeconds } from './priceToSeconds'
import { processTooLongSymbols } from './tooLongSymbols'
import { useStore } from '~/stores/store'

const roomId = useStorage('roomId', '')
const linked = ref(true)
const store = useStore()
const fans = ref('')
const population = ref('')
const danmakuPool = ref<Array<DanmakuProps | GiftProps | SuperChatProps | InteractProps>>([])
const selectedSc = ref<SuperChatProps | null>(null)
const chatPool = ref<Array<SuperChatProps>>([])
const enterQueue = ref<InteractProps[]>([])

setInterval(() => {
  if (enterQueue.value.length >= 2)
    enterQueue.value.shift()
}, 500)

let live: KeepLiveWS | null = null

const pushObject = (obj: DanmakuProps | GiftProps | SuperChatProps | InteractProps) => {
  danmakuPool.value.push(obj)
  if (danmakuPool.value.length > 100)
    danmakuPool.value.shift()
}

const pushChat = (chat: SuperChatProps) => {
  chatPool.value.push(chat)
  setTimeout(() => {
    chatPool.value = chatPool.value.filter(x => x.ts !== chat.ts)
    if (selectedSc.value?.ts === chat.ts)
      selectedSc.value = null
  }, chat.second * 1000)
}

const connectRoom = () => {
  try {
    live = new KeepLiveWS(Number.parseInt(roomId.value))
    linked.value = true

    live.on('open', () => {
      // eslint-disable-next-line no-console
      console.log('WebSocket Open')

      fetch(`${giftInfo}${roomId.value}`)
        .then((response) => {
          store.giftInfoList = (response.data as any).data.list.map((it: any) => {
            return {
              id: it.id,
              webp: it.webp,
            } as GiftInfo
          })
        })
    })

    // 结束连接
    live.on('close', () => {
      // eslint-disable-next-line no-console
      console.log('WebSocket Close')
    })

    live.on('heartbeat', (online: number) => {
      population.value = parseFanNumbers(online)
    })

    // 好像这个 api 没用，或许是 bilibili-live-ws 没写进去
    // 欢迎用户进入直播间的 api 好像也没用
    // live.on('ROOM_REAL_TIME_MESSAGE_UPDATA', (data) => {
    //   // eslint-disable-next-line no-console
    //   console.log(data)
    //   const { data: { fans_num } } = data
    //   fans.value = parseFanNumbers(fans_num)
    // })

    live.on('INTERACT_WORD', (data: InteractiveWordMessage) => {
      const { data: { msg_type, uname, uid, uname_color, trigger_time } } = data
      const interact: InteractProps = {
        type: 'interact',
        ts: trigger_time / 1000,
        uid,
        uname,
        unameColor: uname_color,
        action: msg_type,
      }
      if (store.getConfig.showEnter && msg_type === 1) {
        // 用户进入直播间
        // pushObject(interact)
        enterQueue.value.push(interact)
        if (enterQueue.value.length > 20)
          enterQueue.value.splice(0, 15)
      }
      else if (store.getConfig.showSubscribe && msg_type === 2) {
        // 用户关注主播
        pushObject(interact)
      }
    })

    live.on('SEND_GIFT', (data: SendGiftMessage) => {
      const { data: { face, timestamp, coin_type, uname, giftName, num, giftId, action, total_coin, uid, blind_gift } } = data

      if (coin_type === 'silver' && !store.getConfig.showSilverGift)
        return

      if (!store.getConfig.showGoldGift)
        return
      const [bgColor, bgBottomColor] = randomColorPair()

      if (danmakuPool.value.length > 0) {
        if (getLastMatchedGift(danmakuPool.value, uname, giftId, timestamp, num))
          return
      }

      const gift: GiftProps = {
        type: 'gift',
        uname,
        action,
        num,
        coinType: coin_type,
        face: `${face}@96w_96h`,
        giftId,
        giftName,
        price: total_coin, // 实际价格 * 1000
        ts: timestamp,
        uid,
        blindGift: blind_gift,
        bgColor: bgBottomColor,
      }
      pushObject(gift)

      if (store.getConfig.showHighlight && coin_type === 'gold' && store.getConfig.pushGiftIntoHighlight) {
        const chat: SuperChatProps = {
          type: 'superchat',
          uid,
          uname,
          face,
          price: total_coin, // 实际价格 * 1000
          content: `${action}${giftName}`,
          ts: timestamp * 1000,
          second: priceToSeconds(total_coin),
          bgColor,
          bgBottomColor,
        }
        pushChat(chat)
      }
    })

    live.on('DANMU_MSG', (data: DanmakuMessage) => {
      // // eslint-disable-next-line no-console
      // console.log(data)
      const { info } = data
      const perhapsLottery = info[0][9]
      if (perhapsLottery !== 0)
        return
      const [, content, [uid, uname, fang, , , , ,color = ''], [level = 0, label = ''],,,,perhapsGuard] = info
      const ts = info[0][4]
      const tagColor = info[3][9] || 0

      if (store.getConfig.blackList.includes(uid))
        return

      if (store.getConfig.autoReply) {
        setTimeout(() => {
          autoSendByWord(content)
        }, 1000)
      }

      const danmaku: DanmakuProps = {
        type: 'text',
        uid,
        uname,
        content: processTooLongSymbols(content),
        color,
        tagColor,
        fang,
        level,
        label,
        perhapsGuard,
        ts,
      }

      if (typeof info[0][13] === 'object')
        danmaku.content = info[0][13].url

      pushObject(danmaku)
    })

    live.on('SUPER_CHAT_MESSAGE_JPN', (data: SuperChatMessage) => {
      // // eslint-disable-next-line no-console
      // console.log(data)
      const { data: { uid, user_info: { uname, face }, price, message_jpn, message, ts, time, background_color, background_bottom_color } } = data
      const chat: SuperChatProps = {
        type: 'superchat',
        uid: Number.parseInt(uid),
        uname,
        face,
        price: price * 1000, // 实际价格 * 1000
        content: message_jpn === '' ? processTooLongSymbols(message) : processTooLongSymbols(message_jpn),
        ts: ts * 1000,
        second: time,
        bgColor: background_color,
        bgBottomColor: background_bottom_color,
      }

      // // eslint-disable-next-line no-console
      // console.log(chat)

      pushObject(chat)
      if (store.getConfig.showHighlight)
        pushChat(chat)
    })

    // live.on('SUPER_CHAT_MESSAGE', (data) => {
    //   // eslint-disable-next-line no-console
    //   console.log(data)
    // })

    live.on('GUARD_BUY', (data: GuardBuyMessage) => {
      // // eslint-disable-next-line no-console
      // console.log(data)

      const { data: { uid, username, num, price, guard_level, ts } } = data
      const guard: SuperChatProps = {
        type: 'superchat',
        uname: username,
        face: '',
        uid,
        price: price * num, // 实际价格 * 1000
        content: '欢迎加入大航海',
        second: guardType[guard_level].second,
        ts: ts * 1000,
        bgColor: guardType[guard_level].bgColor,
        bgBottomColor: guardType[guard_level].bgBottomColor,
      }

      pushObject(guard)
      if (store.getConfig.showHighlight)
        pushChat(guard)
    })
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
}

const disconnectRoom = () => {
  if (live) {
    live.close()
    live = null
    linked.value = false
  }
}

export {
  connectRoom,
  disconnectRoom,
  population,
  fans,
  danmakuPool,
  linked,
  chatPool,
  selectedSc,
  pushChat,
  enterQueue,
}
