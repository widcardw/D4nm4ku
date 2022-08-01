<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { listen } from '@tauri-apps/api/event'
import { connectRoom, danmakuPool, disconnectRoom, fans, population } from '~/composables/server'
import { isGiftProps } from '~/composables/components'
import UWatch from '~/components/danmaku/UWatch.vue'
import URenderer from '~/components/danmaku/URenderer.vue'
import { useStore } from '~/stores/store'

const store = useStore()
const unlistens: Function[] = []

function parseBoolean(obj: string) {
  return obj === 'true'
}

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

connectRoom()

onBeforeUnmount(() => {
  disconnectRoom()
  unlistens.map(fn => fn())
})

const hex2rgb = (hex: string, opacity: string) => {
  const matches = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i) as [string, string, string, string]
  return `rgba(${parseInt(matches[1], 16)}, ${parseInt(matches[2], 16)}, ${parseInt(matches[3], 16)}, ${parseInt(opacity) / 255})`
}
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
    }"
  >
    <UWatch
      v-if="store.getConfig.showPopulation"
      data-tauri-drag-region shadow
      :population="population" :fans="fans"
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
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
  height: 5px
}

::-webkit-scrollbar-thumb {
  background: rgba(127, 127, 127, 0.5);
  border-radius: 5px;
}
.scroller {
  overscroll-behavior-y: contain;
  scroll-snap-type: y proximity;
}
.scroller > div:last-child {
  scroll-snap-align: end;
}
</style>

