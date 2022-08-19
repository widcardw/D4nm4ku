<script setup lang="ts">
import { WebviewWindow } from '@tauri-apps/api/window'
import { useStorage } from '@vueuse/core'
import { inject } from 'vue'
import UMdInput from '~/components/ui/UMdInput.vue'
import { useStore } from '~/stores/store'
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
  webview = WebviewWindow.getByLabel('danmakuWidget')
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
    minHeight: 150,
  })
  store.linked = true
  msgRef.value.pushMsg({
    content: '窗口已开启',
  })
}

function tryToCloseDanmaku() {
  webview = WebviewWindow.getByLabel('danmakuWidget')
  if (!webview) {
    webview = new WebviewWindow('danmakuWidget', {
      url: '/show',
      decorations: false,
      width: 400,
      height: 600,
      transparent: true,
      alwaysOnTop: true,
      title: 'D4nm4ku',
      minWidth: 320,
      minHeight: 150,
    })
  }
  if (webview) {
    webview.close()
    webview = null
    store.linked = false
    // eslint-disable-next-line no-console
    console.log('关闭窗口')
  }
}
</script>

<template>
  <div h-100vh flex flex-col>
    <div flex-1 flex justify-center>
      <div self-end text-2xl>
        D4nm4ku
      </div>
    </div>
    <div flex items-center>
      <div flex-1 />
      <UMdInput v-model="roomId" title="直播间号" :disabled="store.linked" />
      <div flex-1>
        <button
          p-2 m-2
          bg="#646cff"
          rounded-full
          shadow hover:shadow-lg
          op="90 hover:100"
          text-white
          cursor-pointer
          class="disabled:bg-zinc disabled:dark:bg-zinc-600 disabled:dark:text-zinc-800 disabled:cursor-not-allowed"
          :disabled="roomId.trim() === ''"
          @click="createWebview"
        >
          <div v-if="!store.linked" i-ri-arrow-right-line />
          <div v-else i-ri-stop-fill />
        </button>
      </div>
    </div>
    <div flex-1 flex items-end>
      <div mx-a my-2 i-ri-stop-circle-line icon-btn op="10 hover:100" title="应急关闭" @click="tryToCloseDanmaku" />
    </div>
  </div>
</template>
