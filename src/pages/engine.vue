<script setup lang="ts">
import { WebviewWindow } from '@tauri-apps/api/window'
import UInputBtn from '~/components/ui/UInputBtn.vue'
const roomId = useStorage('roomId', '')

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
    alwaysOnTop: true,
    title: 'D4nm4ku',
  })
}
</script>

<template>
  <div>
    <UInputBtn v-model="roomId" @click-btn="createWebview">
      连接
    </UInputBtn>
  </div>
</template>
