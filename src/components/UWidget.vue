<script setup lang="ts">
import { listen } from '@tauri-apps/api/event'
import { tryOnBeforeUnmount, useStorage } from '@vueuse/core'
import { inject } from 'vue'
import UMessageSender from './send/UMessageSender.vue'
import USuperChatPool from '~/components/superchat/USuperChatPool.vue'
import { hex2rgb } from '~/composables/randomColor'
import {
  chatPool,
  connectRoom,
  danmakuPool,
  disconnectRoom,
  fans,
  population,
  selectedSc,
} from '~/composables/server'
import { isGiftProps } from '~/composables/components'
import UWatch from '~/components/danmaku/UWatch.vue'
import URenderer from '~/components/danmaku/URenderer.vue'
import { useStore } from '~/stores/store'
import { getLiverInfo } from '~/composables/getLiverInfo'
import parseFanNumbers from '~/composables/parseFanNumbers'

const store = useStore()
const unlistens: Function[] = []
const msgRef = inject('msgRef') as any

function parseBoolean(obj: string) {
  return obj === 'true'
}

async function initListens() {
  unlistens.push(await listen('show-avatar', (event) => {
    store.config.showAvatar = parseBoolean(event.payload as string)
  }))
  unlistens.push(await listen('show-guard-tag', (event) => {
    store.config.showGuardTag = parseBoolean(event.payload as string)
  }))
  unlistens.push(await listen('show-time', (event) => {
    store.config.showTime = parseBoolean(event.payload as string)
  }))
  unlistens.push(await listen('show-silver-gift', (event) => {
    store.config.showSilverGift = parseBoolean(event.payload as string)
  }))
  unlistens.push(await listen('show-gold-gift', (event) => {
    store.config.showGoldGift = parseBoolean(event.payload as string)
  }))
  unlistens.push(await listen('can-send-message', (event) => {
    store.config.canSendMessage = parseBoolean(event.payload as string)
  }))
  unlistens.push(await listen('text-color-changed', (event) => {
    store.config.textColor = event.payload as string
  }))
  unlistens.push(await listen('text-shadow-color-changed', (event) => {
    store.config.textShadowColor = event.payload as string
  }))
  unlistens.push(await listen('enable-text-shadow', (event) => {
    store.config.enableTextShadow = parseBoolean(event.payload as string)
  }))
  unlistens.push(await listen('bg-color-changed', (event) => {
    store.config.bgColor = event.payload as string
  }))
  unlistens.push(await listen('bg-opacity-changed', (event) => {
    store.config.bgOpacity = event.payload as string
  }))
  unlistens.push(await listen('show-population', (event) => {
    store.config.showPopulation = parseBoolean(event.payload as string)
  }))
  unlistens.push(await listen('blur', (event) => {
    store.config.blur = parseBoolean(event.payload as string)
  }))
  unlistens.push(await listen('layout', (event) => {
    store.config.layout = event.payload as 'loose' | 'tight'
  }))
  unlistens.push(await listen('auto-reply', (event) => {
    store.config.autoReply = parseBoolean(event.payload as string)
  }))
  unlistens.push(await listen('show-highlight', (event) => {
    store.config.showHighlight = parseBoolean(event.payload as string)
  }))
  unlistens.push(await listen('show-enter', (event) => {
    store.config.showEnter = parseBoolean(event.payload as string)
  }))
  unlistens.push(await listen('show-subscribe', (event) => {
    store.config.showSubscribe = parseBoolean(event.payload as string)
  }))
  unlistens.push(await listen('font-changed', (event) => {
    store.config.fontFamily = event.payload as string
  }))
  unlistens.push(await listen('blacklist', (event) => {
    store.config.blackList = JSON.parse(event.payload as string) as number[]
  }))
}

initListens()
connectRoom()

const roomId = useStorage('roomId', '')

getLiverInfo(Number.parseInt(roomId.value))
  .then((res) => {
    // console.log(res)
    fans.value = parseFanNumbers(res)
  })
  .catch((err) => {
    msgRef.value.pushMsg({ type: 'error', content: err.message })
  })

tryOnBeforeUnmount(() => {
  unlistens.map(fn => fn())
  disconnectRoom()
})
</script>

<template>
  <div
    flex flex-col h-100vh
    :class="{
      'backdrop-blur-sm': store.getConfig.blur,
    }"
    :style="{
      background: hex2rgb(store.getConfig.bgColor, store.getConfig.bgOpacity),
      color: store.getConfig.textColor,
      textShadow: store.getConfig.enableTextShadow ? `1px 1px 1px ${store.getConfig.textShadowColor}` : 'none',
      fontFamily: store.getConfig.fontFamily,
    }"
  >
    <UWatch
      v-if="store.getConfig.showPopulation"
      data-tauri-drag-region shadow
      :population="population" :fans="fans"
    />
    <USuperChatPool
      v-if="store.getConfig.showHighlight"
      v-show="chatPool.length > 0"
      v-model="selectedSc"
      data-tauri-drag-region
      :chat-pool="chatPool" z-999 shadow
    />
    <div
      class="scroller"
      flex-1 of-y-auto
      data-tauri-drag-region
    >
      <URenderer
        v-for="it in danmakuPool"
        :key="`${it.ts}${it.uname}${it.type}${isGiftProps(it) ? it.giftId : ''}`"
        :obj="it"
      />
    </div>
    <UMessageSender v-if="store.getConfig.canSendMessage" :no-border="true" />
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* ::-webkit-scrollbar-thumb {
  background: rgba(127, 127, 127, 0.5);
  border-radius: 5px;
} */
.scroller {
  overscroll-behavior-y: contain;
  scroll-snap-type: y proximity;
}
.scroller > div:last-child {
  scroll-snap-align: end;
}
/** {
  pointer-events: v-bind(ct);
}*/
</style>

