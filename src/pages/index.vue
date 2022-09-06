<script setup lang="ts">
import { WebviewWindow } from '@tauri-apps/api/window'
// import { emit } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/tauri'
import { useStorage, useThrottleFn } from '@vueuse/core'
import { inject, ref } from 'vue'
import UMdInput from '~/components/ui/UMdInput.vue'
import UCheckBox from '~/components/ui/UCheckBox.vue'
import { shortToLong } from '~/composables/shortIdToLong'
import { useStore } from '~/stores/store'
import { eventEmitter } from '~/composables/eventEmitter'
import { usePosition } from '~/stores/position'
import { loadPos } from '~/composables/load_pos'
import { msgKey } from '~/composables/injectionKeys'

const roomId = useStorage('roomId', '')

let webview: WebviewWindow | null = null
const msgRef = inject(msgKey)
const store = useStore()
const isLoadingRoomId = ref(false)
const pos = usePosition()

async function createWebview() {
  if (roomId.value.trim() === '') {
    msgRef?.value.pushMsg('房间号不能为空！', {
      type: 'warning',
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
    const senderWindow = WebviewWindow.getByLabel('senderWindow')
    if (senderWindow)
      senderWindow.close()

    store.clickThrough = false

    return
  }

  await invoke('create_new_danmaku_view')

  store.linked = true
  msgRef?.value.pushMsg('窗口已开启')
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

function roomIdBlured() {
  const fakeId = Number(roomId.value)
  if (fakeId <= 1000) {
    isLoadingRoomId.value = true
    shortToLong(fakeId)
      .then((id) => {
        roomId.value = String(id)
      })
      .catch((err) => {
        msgRef?.value.pushMsg(err.message, {
          type: 'error',
        })
      })
      .finally(() => {
        isLoadingRoomId.value = false
      })
  }
}

async function setClickThrough() {
  if (store.clickThrough) {
    store.previousCanSend = store.config.canSendMessage
    if (store.config.canSendMessage) {
      eventEmitter('can-send-message', false)
      openSenderWindow()
    }
  }
  else {
    store.config.canSendMessage = store.previousCanSend
    if (store.previousCanSend) {
      eventEmitter('can-send-message', store.config.canSendMessage)
      openSenderWindow()
    }
  }

  // eventEmitter('set-click-through', store.clickThrough)
  const res: boolean = await invoke('set_click_through', { enable: store.clickThrough })
  msgRef?.value.pushMsg(`点击穿透功能已${res ? '开启' : '关闭'}`)
}

async function openSenderWindow() {
  if (!store.getUserInfo.mid) {
    msgRef?.value.pushMsg('发送弹幕需要登录')
    return
  }
  let senderWindow = WebviewWindow.getByLabel('senderWindow')
  if (senderWindow) {
    store.senderEnabled = false
    senderWindow.close()
    senderWindow = null
    return
  }

  await invoke('create_sender_window')
  store.senderEnabled = true
  msgRef?.value.pushMsg('弹幕发送浮窗已开启')
}

const pinned = ref(true)
const pinWidget = () => {
  const danmakuWidget = WebviewWindow.getByLabel('danmakuWidget')
  if (danmakuWidget)
    danmakuWidget.setAlwaysOnTop(pinned.value)
}

const storePosition = useThrottleFn(() => {
  pos.storeConfig()
    .then(() => {
      msgRef?.value.pushMsg('保存成功', { type: 'success' })
    })
    .catch((err) => {
      msgRef?.value.pushMsg(`保存失败, ${err.message}`, { type: 'error' })
    })
})

const loadPosition = useThrottleFn(() => {
  const conf = pos.getConfig()
  loadPos(conf)
    .then(() => {
      msgRef?.value.pushMsg('加载成功', { type: 'success' })
    })
    .catch((err) => {
      msgRef?.value.pushMsg(`加载失败, ${err.message}`, { type: 'error' })
    })
})
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
      <UMdInput
        v-model="roomId"
        title="直播间号"
        :disabled="store.linked"
        @blur="roomIdBlured"
      />
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
          :disabled="!roomId.trim().match(/^\d+$/) || isLoadingRoomId"
          @click="createWebview"
        >
          <div v-if="isLoadingRoomId" i-ri-refresh-line animate-spin />
          <div v-else-if="!store.linked" i-ri-arrow-right-line />
          <div v-else i-ri-stop-fill />
        </button>
      </div>
    </div>
    <div flex-1 flex flex-col>
      <div flex>
        <div flex-1 />
        <div flex flex-col>
          <UCheckBox
            v-model="pinned"
            @update:model-value="pinWidget"
          >
            窗口置顶
          </UCheckBox>
          <UCheckBox
            v-model="store.clickThrough"
            title="开启点击穿透后 弹幕窗口将不接受任何鼠标消息"
            :disabled="!store.linked"
            @update:model-value="setClickThrough"
          >
            点击穿透（仅 macOS）
          </UCheckBox>
          <div
            inline-flex items-center leading-relaxed select-none space-x-1 cursor-pointer
            title="开启额外浮动窗口发送弹幕"
            @click="openSenderWindow"
          >
            <div text-lg flex items-center>
              <div icon-btn i-ri-window-line ml-1 />
            </div>
            <span>打开/关闭弹幕发送浮窗</span>
          </div>
          <div inline-flex items-center leading-relaxed select-none space-x-1>
            <div text-lg flex items-center>
              <div icon-btn i-ri-save-line ml-1 />
            </div>
            <div>
              <button text-btn :disabled="!store.linked" @click="storePosition">
                保存
              </button>/<button :disabled="!store.linked" text-btn @click="loadPosition">
                加载
              </button>窗口大小和位置
            </div>
          </div>
        </div>
        <div flex-1 />
      </div>
      <div flex-1 />
      <div mx-a my-2 i-ri-stop-circle-line icon-btn op="10 hover:100" title="应急关闭" @click="tryToCloseDanmaku" />
    </div>
  </div>
</template>
