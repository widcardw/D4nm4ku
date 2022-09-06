<script setup lang="ts">
import { useClipboard, useStorage } from '@vueuse/core'
import { inject, ref } from 'vue'
import { getAreaInfoList, startLive, stopLive, updateLiveTitle } from '~/composables/openLive'
import { getLiveRoomInfoFromRoomId, getLiveRoomInfoFromUid } from '~/composables/getLiverInfo'
import { useStore } from '~/stores/store'
import UMdInput from '~/components/ui/UMdInput.vue'
import UTabSelector from '~/components/ui/UTabSelector.vue'
import { shortToLong } from '~/composables/shortIdToLong'
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

if (!store.getUserInfo.mid)
  msgRef.value.pushMsg('需要登录才能开启直播哦')

function updateLiveRoomInfo() {
  if (roomId2.value.trim() === '' || liveTitle.value.trim() === '') {
    getLiveRoomInfoFromUid(store.getUserInfo.mid)
      .then(({ roomid, title }) => {
        roomId2.value = roomid.toString()
        liveTitle.value = title
        return roomid
      })
      .catch((err) => {
        msgRef.value.pushMsg(`直播间信息获取失败！${err.message}`, {
          type: 'error',
        })
      })
  }
  // 当前如果是开播的状态，但是主播可能手动关闭了弹幕姬，导致弹幕姬只有开播按钮
  // 因此自动检测当前是否在开播状态，如果是，则自动变更按钮
  if (!store.liveConfig.isLive && roomId2.value.trim() !== '' && liveTitle.value.trim() !== '' && selectedAreaId.value) {
    getLiveRoomInfoFromRoomId(parseInt(roomId2.value))
      .then(({ data }) => {
        store.liveConfig.isLive = data.live_status === 1
      })
      .catch((err) => {
        msgRef.value.pushMsg(err.message, {
          type: 'error',
        })
      })
  }
}

if (store.getUserInfo.mid)
  updateLiveRoomInfo()

function updateLiveTitle2() {
  btnUpdateTitleEnabled.value = false
  updateLiveTitle(roomId2.value, liveTitle.value)
    .then(() => {
      msgRef.value.pushMsg('标题修改成功', {
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
    msgRef.value.pushMsg('首次加载可能需要一段时间')
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
      msgRef.value.pushMsg('直播开启成功', {
        type: 'success',
      })
      msgRef.value.pushMsg('请将串流地址和密钥复制到直播软件（如 OBS）后开启推流', {
        ttl: 6000,
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
      msgRef.value.pushMsg('直播关闭成功', {
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
  msgRef.value.pushMsg('复制成功', {
    type: 'success',
  })
}

const loadingRoomId = ref(false)

function roomIdBlur() {
  const fakeId = Number(roomId2.value)
  if (fakeId <= 1000) {
    loadingRoomId.value = true
    shortToLong(fakeId)
      .then((id) => {
        roomId2.value = String(id)
      })
      .catch((err) => {
        msgRef.value.pushMsg(err.message, {
          type: 'error',
        })
      })
      .finally(() => {
        loadingRoomId.value = false
      })
  }
}
</script>

<template>
  <div h-100vh flex flex-col>
    <div flex-1 text-2xl flex justify-center>
      <div self-end>
        {{ store.liveConfig.isLive ? '正在直播' : 'Live!' }}
      </div>
    </div>
    <div text-center>
      <div flex items-center>
        <div flex-1 />
        <UMdInput
          v-model="roomId2"
          title="房间号"
          :disabled="store.liveConfig.isLive"
          @blur="roomIdBlur"
        />
        <div flex-1 flex items-center>
          <div v-if="loadingRoomId" i-ri-refresh-line icon-btn animate-spin />
        </div>
      </div>
      <div flex items-center>
        <div flex-1 />
        <UMdInput v-model="liveTitle" title="直播标题" />
        <div flex-1 flex items-center>
          <div
            v-if="btnUpdateTitleEnabled"
            i-ri-save-line
            icon-btn
            :disabled="liveTitle.trim() === '' || !store.getUserInfo.mid"
            @click="updateLiveTitle2"
          />
          <div v-else i-ri-refresh-line animate-spin icon-btn />
        </div>
      </div>
      <div flex items-center>
        <div flex-1 />
        <UMdInput
          v-model="selectedAreaInfo" title="选择分区"
          :disabled="!btnShowAreaEnabled"
          cursor-pointer
          class="disabled:cursor-wait"
          @click="showAreaSelection"
        />
        <div flex-1 flex items-center>
          <div v-if="!btnShowAreaEnabled" i-ri-refresh-line icon-btn animate-spin />
        </div>
      </div>
      <div v-if="store.liveConfig.isLive" flex items-center>
        <div flex-1 />
        <UMdInput v-model="store.liveConfig.addr" title="RTMP 串流地址" />
        <div flex-1 flex items-center>
          <div i-ri-file-copy-2-line icon-btn title="点击复制" @click="copy2(store.liveConfig.addr)" />
        </div>
      </div>
      <div v-if="store.liveConfig.isLive" flex items-center>
        <div flex-1 />
        <UMdInput v-model="store.liveConfig.code" title="RTMP 串流密钥" />
        <div flex-1 flex items-center>
          <div i-ri-file-copy-2-line icon-btn title="点击复制" @click="copy2(store.liveConfig.code)" />
        </div>
      </div>
      <div m-2 space-x-2>
        <button
          v-if="!store.liveConfig.isLive"
          btn rounded
          :disabled="!btnEnabled || !roomId2.trim().match(/^\d+$/) || !store.getUserInfo.mid || !selectedAreaId || liveTitle.trim() === ''"
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
    <div flex-1 flex items-end>
      <div mx-a my-2 i-ri-stop-circle-line icon-btn op="10 hover:100" title="应急关闭" @click="stopLive2" />
    </div>
  </div>
  <Transition name="selector">
    <UTabSelector
      v-if="isShowAreaSelection"
      v-model:id="selectedAreaId"
      v-model:info="selectedAreaInfo"
      @update:id="showAreaSelection"
      @close="showAreaSelection"
    />
  </Transition>
</template>

<style scoped>
.selector-enter-active,
.selector-leave-active {
  transition: all 0.200s ease;
}

.selector-enter-from,
.selector-leave-to {
  opacity: 0;
}
</style>
