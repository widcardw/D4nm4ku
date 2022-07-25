<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { KeepLiveWS } from 'bilibili-live-ws'
import { fetch } from '@tauri-apps/api/http'
import type { DanmakuMessage, GiftInfo, SendGiftMessage } from '../composables/types'
import { GiftProps } from '../composables/components'
import type { DanmakuProps } from '../composables/components'
import { giftInfoBaseUrl } from '../composables/data'
import URenderer from '../components/danmaku/URenderer.vue'
import { useStore } from '../stores/store'
import UWatch from '../components/danmaku/UWatch.vue'
import getLiverInfo from '../composables/getLiverInfo'
import parseFanNumbers from '../composables/parseFanNumbers'
const roomId = useStorage('roomId', '')
let live: KeepLiveWS | null = null
const linked = ref(false)
const danmakuPool = ref<Array<DanmakuProps | GiftProps>>([])
const clearPool = () => {
  danmakuPool.value = []
}
const population = ref(0)
const fans = ref('')

const store = useStore()

const getLastMatchedGift = (
  uname: string,
  giftId: number,
  ts: number,
  num: number,
): boolean => {
  for (let i = danmakuPool.value.length - 1; i >= 0; i--) {
    if (danmakuPool.value[i].type !== 'gift')
      continue
    const item = danmakuPool.value[i] as GiftProps
    if (item.uname === uname && item.giftId === giftId) {
      const item = danmakuPool.value.splice(i, 1) as GiftProps[]
      item[0].num += num
      item[0].ts = ts
      danmakuPool.value.push(item[0])
      return true
    }
  }
  return false
}

const connectRoom = () => {
  if (live) {
    live.close()
    live = null
    return
  }
  try {
    live = new KeepLiveWS(Number.parseInt(roomId.value))
    linked.value = true

    // 开启连接
    live.on('open', () => {
      // eslint-disable-next-line no-console
      console.log('WebSocket Open')
      fetch(`${giftInfoBaseUrl}${roomId.value}`)
        .then((response) => {
          store.giftInfoList = (response.data as any).data.list.map((it: any) => {
            return {
              id: it.id, webp: it.webp,
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

    live.on('__CONNECTED__', (data) => {
      // eslint-disable-next-line no-console
      console.log('__CONNECTED__', data)
    })

    live.on('__ERROR__', (data) => {
      // eslint-disable-next-line no-console
      console.log('__ERROR__', data)
    })

    live.on('WATCHED_CHANGE', (data) => {
      const { data: { num } } = data
      population.value = num
    })

    live.on('ROOM_REAL_TIME_MESSAGE_UPDATA', (data) => {
      const { data: { fans_num } } = data
      fans.value = parseFanNumbers(fans_num)
    })

    // 收到礼物
    live.on('SEND_GIFT', (data: SendGiftMessage) => {
      const { data: { face, timestamp, coin_type, uid, uname, giftName, num, giftId, action, total_coin } } = data

      if (danmakuPool.value.length > 0) {
        if (getLastMatchedGift(uname, giftId, timestamp, num))
          return
      }

      danmakuPool.value.push({
        type: 'gift',
        uname,
        action,
        num,
        face,
        coinType: coin_type,
        giftId,
        giftName,
        price: total_coin,
        ts: timestamp * 1000,
      })
      if (danmakuPool.value.length > 200)
        danmakuPool.value.shift()
    })

    // 礼物连击
    // live.on('COMBO_SEND', (data) => {
    //   // eslint-disable-next-line no-console
    //   console.log(data)
    // })

    // 弹幕
    live.on('DANMU_MSG', (data: DanmakuMessage) => {
      const { info } = data
      const [, content, [uid, uname, , , , , ,color = ''], [level = 0, label = ''],,,,perhapsGuard] = info
      const perhapsLottery = info[0][9]
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
      if (perhapsLottery === 0) {
        danmakuPool.value.push(danmaku)
        if (typeof info[0][13] === 'object')
          danmaku.content = info[0][13].url

        if (danmakuPool.value.length > 200)
          danmakuPool.value.shift()
      }
    })
  }
  catch (e) {
    console.error(e)
  }
}
const disconnectRoom = () => {
  live?.close()
  live = null
  linked.value = false
}
</script>

<template>
  <div space-x-1>
    <input v-model="roomId" m-input w-10rem placeholder="输入房间号">
    <button v-if="!linked" btn @click="connectRoom">
      连接
    </button>
    <button v-else btn @click="disconnectRoom">
      断开
    </button>
    <button btn @click="clearPool">
      清空
    </button>
  </div>
  <div>
    <UWatch :population="population" :fans="fans" />
    <!-- <UDanmaku
      v-for="it in danmakuPool"
      :key="it.ts"
      my-2
      :content="it.content"
      :uname="it.uname"
      :level="it.level"
      :label="it.label"
      :color="it.color"
      :perhaps-guard="it.perhapsGuard"
      :ts="it.ts"
      :uid="it.uid"
      :show-avatar="true"
      :show-guard-tag="true"
      :show-time="true"
    /> -->
    <URenderer
      v-for="it in danmakuPool"
      :key="`${it.ts}${it.uname}${it.type}${it.type === 'gift' ? (it as GiftProps).giftId : ''}`"
      :type="it.type"
      :danmaku-props="it.type === 'text' ? it : undefined"
      :gift-props="it.type === 'gift' ? it : undefined"
    />
  </div>
</template>
