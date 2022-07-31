import { useStorage } from '@vueuse/core'
import { KeepLiveWS } from 'bilibili-live-ws'
import { fetch } from '@tauri-apps/api/http'
import { ref } from 'vue'
import { giftInfo } from './api'
import type { DanmakuMessage, GiftInfo, SendGiftMessage } from './types'
import parseFanNumbers from './parseFanNumbers'
import getLiverInfo from './getLiverInfo'
import type { DanmakuProps, GiftProps } from './components'
import getLastMatchedGift from './getLastMatchedGift'
import { useStore } from '~/stores/store'
const roomId = useStorage('roomId', '')
const linked = ref(true)
const store = useStore()
const fans = ref('')
const population = ref('')
const danmakuPool = ref<Array<DanmakuProps | GiftProps>>([])
let live: KeepLiveWS | null = null

const pushObject = (obj: DanmakuProps | GiftProps) => {
  danmakuPool.value.push(obj)
  if (danmakuPool.value.length > 100)
    danmakuPool.value.shift()
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
      getLiverInfo(Number.parseInt(roomId.value))
        .then((res) => {
          // console.log(res)
          fans.value = parseFanNumbers(res)
        })
    })

    // 结束连接
    live.on('close', () => {
      // eslint-disable-next-line no-console
      console.log('WebSocket Close')
    })

    live.on('WATCHED_CHANGE', (data) => {
      const { data: { num } } = data
      population.value = parseFanNumbers(num)
    })

    live.on('ROOM_REAL_TIME_MESSAGE_UPDATA', (data) => {
      const { data: { fans_num } } = data
      fans.value = parseFanNumbers(fans_num)
    })

    live.on('SEND_GIFT', (data: SendGiftMessage) => {
      const { data: { face, timestamp, coin_type, uname, giftName, num, giftId, action, total_coin } } = data
      if (danmakuPool.value.length > 0) {
        if (getLastMatchedGift(danmakuPool.value, uname, giftId, timestamp, num))
          return
      }
      if (coin_type === 'silver' && !store.getConfig.showSilverGift)
        return

      if (!store.getConfig.showGoldGift)
        return

      const gift: GiftProps = {
        type: 'gift',
        uname,
        action,
        num,
        coinType: coin_type,
        face: `${face}@96w_96h`,
        giftId,
        giftName,
        price: total_coin,
        ts: timestamp,
      }
      pushObject(gift)
    })

    live.on('DANMU_MSG', (data: DanmakuMessage) => {
      const { info } = data
      const perhapsLottery = info[0][9]
      if (perhapsLottery !== 0)
        return
      const [, content, [uid, uname, , , , , ,color = ''], [level = 0, label = ''],,,,perhapsGuard] = info
      const ts = info[0][4]

      const danmaku: DanmakuProps = {
        type: 'text',
        uid,
        uname,
        content,
        color,
        level,
        label,
        perhapsGuard,
        ts,
      }

      if (typeof info[0][13] === 'object')
        danmaku.content = info[0][13].url

      pushObject(danmaku)
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
}
