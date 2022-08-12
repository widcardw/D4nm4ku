<script setup lang="ts">
import { fetch } from '@tauri-apps/api/http'
import { confirm } from '@tauri-apps/api/dialog'
import MyQrCode from '~/components/img/MyQrCode.vue'
import Avatar from '~/components/img/Avatar.vue'
import { clearLoop, createLoginLoop, interval } from '~/composables/loginLoop'
import logoutAccount from '~/composables/logout'

const store = useStore()
const msgRef = inject('msgRef') as any

interface QrProps {
  url: string
  oauthKey: string
}

const getQrcodeEnabled = ref(true)
const qrurl = ref('')

// const interval = computed(() => interval.value !== undefined)

const login = async () => {
  getQrcodeEnabled.value = false
  const { data: { data } }: { data: { data: QrProps } } = await fetch(qrcodeGet, { method: 'GET', timeout: 5000 })
  // // eslint-disable-next-line no-console
  // console.log(data)
  getQrcodeEnabled.value = true

  qrurl.value = data.url
  store.userInfo.oauthKey = data.oauthKey

  createLoginLoop(data.oauthKey)
  msgRef.value.pushMsg({ type: 'info', content: '登录后可能需要刷新生效' })
}

const cancelLogin = () => {
  clearLoop()
}

const logout = async () => {
  const confirmed = await confirm('确定要退出登录吗？', { title: '退出登录', type: 'warning' })
  if (confirmed) {
    const resData = await logoutAccount() as any
    if (resData.code === 0) {
      store.removeUserInfo()
      msgRef.value.pushMsg({ type: 'success', content: '退出成功' })
    }
    else {
      msgRef.value.pushMsg({ type: 'error', content: '退出失败' })
    }
  }
}
</script>

<template>
  <div flex space-x-2 items-center>
    <Avatar w-3rem h-3rem :src="store.getUserInfo.avatarUrl || ''" />
    <div flex-1>
      <div v-if="!store.getUserInfo.mid" flex>
        <div space-x-2>
          <button btn rounded :disabled="!getQrcodeEnabled" @click="login">
            {{ interval ? '刷新' : '登录' }}
          </button>
        </div>
        <div v-if="interval" absolute z-998 class="left-1/2 translate--1/2 top-1/2">
          <MyQrCode ma :url="qrurl" @close="cancelLogin" />
        </div>
      </div>
      <div v-else>
        <div>
          {{ store.getUserInfo.mname }}
        </div>
        <div>已登录</div>
      </div>
    </div>
    <button v-if="store.getUserInfo.mid" btn rounded @click="logout">
      退出登录
    </button>
  </div>
</template>
