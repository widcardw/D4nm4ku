<script setup lang="ts">
import { listen } from '@tauri-apps/api/event'
import { tryOnBeforeUnmount } from '@vueuse/core'
import UMessageSender from '../components/send/UMessageSender.vue'
import { useStore } from '../stores/store'
import { hex2rgb } from '~/composables/randomColor'

const store = useStore()

const unlistens: Function[] = []
async function initListens() {
  unlistens.push(await listen('bg-color-changed', (event) => {
    store.config.bgColor = event.payload as string
  }))
  unlistens.push(await listen('bg-opacity-changed', (event) => {
    store.config.bgOpacity = event.payload as string
  }))
  unlistens.push(await listen('text-color-changed', (event) => {
    store.config.textColor = event.payload as string
  }))
  unlistens.push(await listen('text-shadow-color-changed', (event) => {
    store.config.textShadowColor = event.payload as string
  }))
  unlistens.push(await listen('enable-text-shadow', (event) => {
    store.config.enableTextShadow = (event.payload as string) === 'true'
  }))
  unlistens.push(await listen('blur', (event) => {
    store.config.blur = (event.payload as string) === 'true'
  }))
  unlistens.push(await listen('font-changed', (event) => {
    store.config.fontFamily = event.payload as string
  }))
}

initListens()

tryOnBeforeUnmount(() => {
  unlistens.map(fn => fn())
})
</script>

<template>
  <div
    flex items-center
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
    <div cursor-move i-ri-drag-move-line icon-btn data-tauri-drag-region ml-2 />
    <UMessageSender :no-border="true" flex-1 />
  </div>
</template>

<route lang="yaml">
meta:
  layout: none
</route>

