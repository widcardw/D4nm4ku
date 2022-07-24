<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { KeepLiveWS } from 'bilibili-live-ws'
import type { DanmakuMessage, SendGiftMessage } from '../composables/types'
import type { DanmakuProps } from '../composables/components'
import UDanmaku from '../components/danmaku/UDanmaku.vue'
import UGift from '../components/danmaku/UGift.vue'
const roomId = useStorage('roomId', '')
let live: KeepLiveWS | null = null
const linked = ref(false)
const danmakuPool = ref<DanmakuProps[]>([])
const clearPool = () => {
  danmakuPool.value = []
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
      console.log('Connected')
    })

    // 结束连接
    live.on('close', () => {
      // eslint-disable-next-line no-console
      console.log('Disconnected')
    })

    // 收到礼物
    // live.on('SEND_GIFT', (data: SendGiftMessage) => {
    //   // eslint-disable-next-line no-console
    //   console.log(data)
    // })

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
        console.log(info)
        danmakuPool.value.push(danmaku)
        if (typeof info[0][13] === 'object')
          // eslint-disable-next-line no-console
          console.log(info[0][13])

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
    <UDanmaku
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
    />
  </div>
</template>
