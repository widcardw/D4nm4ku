<script setup lang="ts">
import { useClipboard, useStorage } from '@vueuse/core'
import { inject, ref } from 'vue'
import { getAreaInfoList, startLive, stopLive, updateLiveTitle } from '~/composables/openLive'
import { getLiveRoomInfoFromUid } from '~/composables/getLiverInfo'
import { useStore } from '~/stores/store'
import UMdInput from '~/components/ui/UMdInput.vue'
import UTabSelector from '~/components/ui/UTabSelector.vue'

const store = useStore()
const roomId2 = useStorage('roomId2', '')
const selectedAreaId = useStorage('selectedAreaId', 0)
const selectedAreaInfo = useStorage('selectedAreaInfo', '')
const liveTitle = useStorage('liveTitle', '')
const msgRef = inject('msgRef') as any
const isShowAreaSelection = ref(false)
const btnEnabled = ref(true)
const firstLoad = ref(0)
const btnUpdateTitleEnabled = ref(true)
const btnShowAreaEnabled = ref(true)

const { copy } = useClipboard()

if (!store.getUserInfo.mid) {
  msgRef.value.pushMsg({
    content: '需要登录才能开启直播哦',
    type: 'info',
  })
}

function updateLiveRoomInfo() {
  if (roomId2.value.trim() === '' || liveTitle.value.trim() === '') {
    getLiveRoomInfoFromUid(store.getUserInfo.mid)
      .then(({ roomid, title }) => {
        roomId2.value = roomid.toString()
        liveTitle.value = title
      })
  }
}

if (store.getUserInfo.mid)
  updateLiveRoomInfo()

function updateLiveTitle2() {
  btnUpdateTitleEnabled.value = false
  updateLiveTitle(roomId2.value, liveTitle.value)
    .then(() => {
      msgRef.value.pushMsg({
        content: '标题修改成功',
        type: 'success',
      })
    })
    .catch((e: Error) => {
      msgRef.value.pushMsg({
        content: e.message,
        type: 'error',
      })
    })
    .finally(() => {
      btnUpdateTitleEnabled.value = true
    })
}

function showAreaSelection() {
  btnShowAreaEnabled.value = false
  if (firstLoad.value === 0) {
    msgRef.value.pushMsg({
      content: '首次加载可能需要一段时间',
      type: 'info',
    })
    firstLoad.value++
  }
  getAreaInfoList()
    .then(() => {
      isShowAreaSelection.value = !isShowAreaSelection.value
      btnShowAreaEnabled.value = true
    })
}

function startLive2() {
  btnEnabled.value = false
  startLive(roomId2.value, selectedAreaId.value, 'pc')
    .then((rtmp) => {
      store.liveConfig.addr = rtmp.addr
      store.liveConfig.code = rtmp.code
      msgRef.value.pushMsg({
        content: '直播开启成功',
        type: 'success',
      })
      store.liveConfig.isLive = true
    })
    .catch((e: Error) => {
      msgRef.value.pushMsg({
        content: e.message,
        type: 'error',
      })
    })
    .finally(() => {
      btnEnabled.value = true
    })
}

function stopLive2() {
  btnEnabled.value = false
  stopLive(roomId2.value)
    .then(() => {
      msgRef.value.pushMsg({
        content: '直播关闭成功',
        type: 'success',
      })
      store.liveConfig.addr = ''
      store.liveConfig.code = ''
      store.liveConfig.isLive = false
    })
    .catch((e: Error) => {
      msgRef.value.pushMsg({
        content: e.message,
        type: 'error',
      })
    }).finally(() => {
      btnEnabled.value = true
    })
}

function copy2(source: string) {
  copy(source)
  msgRef.value.pushMsg({
    content: '复制成功',
    type: 'success',
  })
}
</script>

<template>
  <div h-100vh flex flex-col>
    <div flex-1 text-2xl flex justify-center>
      <div self-end>
        Live!
      </div>
    </div>
    <div text-center>
      <div>
        <UMdInput v-model="roomId2" title="房间号" />
      </div>
      <div flex items-center>
        <div flex-1 />
        <UMdInput v-model="liveTitle" title="直播标题" />
        <div text-left flex-1 flex items-center>
          <button i-ri-save-line icon-btn :disabled="liveTitle.trim() === ''" @click="updateLiveTitle2" />
        </div>
      </div>
      <div>
        <UMdInput
          v-model="selectedAreaInfo" title="选择分区"
          :disabled="!btnShowAreaEnabled"
          cursor-pointer
          class="disabled:cursor-wait"
          @click="showAreaSelection"
        />
      </div>
      <div v-if="store.liveConfig.isLive" flex items-center>
        <div flex-1 />
        <UMdInput v-model="store.liveConfig.addr" title="RTMP 串流地址" />
        <div text-left flex-1>
          <div i-ri-file-copy-2-line icon-btn title="点击复制" @click="copy2(store.liveConfig.addr)" />
        </div>
      </div>
      <div v-if="store.liveConfig.isLive" flex items-center>
        <div flex-1 />
        <UMdInput v-model="store.liveConfig.code" title="RTMP 串流密钥" />
        <div text-left flex-1>
          <div i-ri-file-copy-2-line icon-btn title="点击复制" @click="copy2(store.liveConfig.code)" />
        </div>
      </div>
      <div m-2 space-x-2>
        <button
          v-if="!store.liveConfig.isLive"
          btn rounded
          :disabled="!btnEnabled || !store.getUserInfo.mid || !selectedAreaId || liveTitle.trim() === ''"
          @click="startLive2"
        >
          开启直播
        </button>
        <button
          v-else
          :disabled="!btnEnabled"
          btn rounded
          @click="stopLive2"
        >
          关闭直播
        </button>
      </div>
    </div>
    <div flex-1 />
  </div>
  <UTabSelector
    v-if="isShowAreaSelection"
    v-model:id="selectedAreaId"
    v-model:info="selectedAreaInfo"
    @update:id="showAreaSelection"
    @close="showAreaSelection"
  />
</template>
