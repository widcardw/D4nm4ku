<script setup lang="ts">
import { WebviewWindow } from '@tauri-apps/api/window'
import UInputBtn from '~/components/ui/UInputBtn.vue'
const roomId = useStorage('roomId', '')

let webview: WebviewWindow | null = null
const msgRef = inject('msgRef') as any
const btnLabel = ref('连接')
const createWebview = () => {
  if (roomId.value.trim() === '') {
    msgRef.value.pushMsg({
      type: 'warning',
      content: '房间号不能为空！',
    })
    return
  }
  if (webview) {
    webview.close()
    webview = null
    btnLabel.value = '连接'
  }
  webview = new WebviewWindow('danmakuWidget', {
    url: '/show',
    decorations: false,
    width: 400,
    height: 600,
    transparent: true,
    alwaysOnTop: true,
    title: 'D4nm4ku',
  })
  btnLabel.value = '断开'
}
</script>

<template>
  <div>
    <UInputBtn v-model="roomId" @click-btn="createWebview">
      {{ btnLabel }}
    </UInputBtn>
  </div>
</template>
