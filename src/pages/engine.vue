<script setup lang="ts">
// import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
// import { KeepLiveWS } from 'bilibili-live-ws'
// import { fetch } from '@tauri-apps/api/http'
import { WebviewWindow } from '@tauri-apps/api/window'
// import { useStore } from '~/stores/store'
// import { giftInfo } from '~/composables/api'
// import getLiverInfo from '~/composables/getLiverInfo'
// import parseFanNumbers from '~/composables/parseFanNumbers'
// import type { DanmakuMessage, GiftInfo, SendGiftMessage } from '~/composables/types'
// import getLastMatchedGift from '~/composables/getLastMatchedGift'
// import type { DanmakuProps } from '~/composables/components'
// import { clearDanmaku, danmakuPool, fans, population, pushDanmaku } from '~/composables/globalRefs'
const roomId = useStorage('roomId', '')
// const store = useStore()
// let live: KeepLiveWS | null = null
// const linked = ref(false)
/*
const connectRoom = () => {
  try {
    live = new KeepLiveWS(Number.parseInt(roomId.value))
    linked.value = true

    // 开启连接
    live.on('open', () => {
      // eslint-disable-next-line no-console
      console.log('WebSocket Open')
      // 获取直播间礼物信息
      fetch(`${giftInfo}${roomId.value}`)
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
          store.fans = parseFanNumbers(res)
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
        if (getLastMatchedGift(uname, giftId, timestamp, num))
          return
      }

      if (coin_type === 'silver' && !store.getConfig.showSilverGift)
        return

      if (!store.getConfig.showGoldGift)
        return

      pushDanmaku({
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
      })
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
      pushDanmaku(danmaku)
      // eslint-disable-next-line no-console
      console.log(danmaku)
    })
  }
  catch (e) {
    console.error(e)
  }
}
const disconnectRoom = () => {
  if (live) {
    live.close()
    live = null
    linked.value = false
  }
}
*/

let webview: WebviewWindow | null = null
const createWebview = () => {
  if (webview) {
    webview.close()
    webview = null
  }
  webview = new WebviewWindow('danmakuWidget', {
    url: '/show',
    decorations: true,
    width: 400,
    height: 600,
    transparent: true,
  })
}
</script>

<template>
  <div space-x-2>
    <input v-model="roomId" m-input w-10rem placeholder="输入房间号">
    <!-- <button v-if="!linked" btn @click="connectRoom">
      连接
    </button>
    <button v-else btn @click="disconnectRoom">
      断开
    </button>
    <button btn @click="clearDanmaku">
      清空
    </button> -->
    <button btn @click="createWebview">
      打开弹幕窗口
    </button>
  </div>
</template>
