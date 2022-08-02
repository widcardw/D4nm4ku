<script setup lang="ts">
import { WebviewWindow } from '@tauri-apps/api/window'
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
  <div space-x-2 flex justify-center items-center h-100vh>
    <input v-model="roomId" m-input w-10rem placeholder="输入房间号">
    <button btn @click="createWebview">
      连接
    </button>
  </div>
</template>
