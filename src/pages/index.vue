<script setup lang="ts">
import { WebviewWindow } from '@tauri-apps/api/window'
import UInputBtn from '~/components/ui/UInputBtn.vue'
const roomId = useStorage('roomId', '')

let webview: WebviewWindow | null = null
const msgRef = inject('msgRef') as any
const store = useStore()
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
    store.linked = false
    // eslint-disable-next-line no-console
    console.log('关闭窗口')
    return
  }
  webview = new WebviewWindow('danmakuWidget', {
    url: '/show',
    decorations: false,
    width: 400,
    height: 600,
    transparent: true,
    alwaysOnTop: true,
    title: 'D4nm4ku',
    minWidth: 320,
    minHeight: 400,
  })
  store.linked = true
}
</script>

<template>
  <div h-100vh flex flex-col>
    <div flex-1 flex justify-center>
      <div self-end text-2xl>
        D4nm4ku
      </div>
    </div>
    <UInputBtn
      v-model="roomId"
      self-center
      :btn-disabled="roomId.trim() === ''"
      @click-btn="createWebview"
    >
      {{ store.linked ? '断开' : '连接' }}
    </UInputBtn>
    <div flex-1 />
  </div>
</template>
