<script setup lang="ts">
import { fetch } from '@tauri-apps/api/http'
import { computed, ref } from 'vue'
import { qrcodeGet } from '../../composables/api'
import { useStore } from '../../stores/store'
import MyQrCode from '../img/MyQrCode.vue'
import { clearLoop, createLoginLoop, interval } from '../../composables/loginLoop'
import Avatar from '../Avatar.vue'

const store = useStore()

interface QrProps {
  url: string
  oauthKey: string
}

const getQrcodeEnabled = ref(true)
const qrurl = ref('')

const showQrCode = computed(() => interval.value !== 0)

const login = async () => {
  getQrcodeEnabled.value = false
  const { data: { data } }: { data: { data: QrProps } } = await fetch(qrcodeGet, { method: 'GET', timeout: 5000 })
  // // eslint-disable-next-line no-console
  // console.log(data)
  getQrcodeEnabled.value = true

  qrurl.value = data.url
  store.userInfo.oauthKey = data.oauthKey

  createLoginLoop(data.oauthKey)
  // eslint-disable-next-line no-console
  console.log(interval, interval.value)
}

const cancelLogin = () => {
  clearLoop()
}
</script>

<template>
  <div flex space-x-2 items-center>
    <Avatar :src="store.getUserInfo.avatarUrl || ''" />
    <div flex-1>
      <div v-if="!store.getUserInfo.mid" flex>
        <div space-x-2>
          <button btn :disabled="!getQrcodeEnabled" @click="login">
            {{ showQrCode ? '刷新' : '登录' }}
          </button>
          <button v-if="showQrCode" btn @click="cancelLogin">
            关闭二维码
          </button>
        </div>
        <div v-if="showQrCode" absolute class="left-1/2 translate--1/2 top-1/2">
          <MyQrCode ma :url="qrurl" />
        </div>
      </div>
      <div v-else>
        <div>
          {{ store.getUserInfo.mname }}
        </div>
        <div>已登录</div>
      </div>
    </div>
    <button v-if="store.getUserInfo.mid" btn @click="store.removeUserInfo">
      退出登录
    </button>
  </div>
</template>
