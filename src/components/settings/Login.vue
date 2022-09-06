<script setup lang="ts">
import { fetch } from '@tauri-apps/api/http'
import { confirm } from '@tauri-apps/api/dialog'
import { inject, ref } from 'vue'
import MyQrCode from '~/components/img/MyQrCode.vue'
import Avatar from '~/components/img/Avatar.vue'
import { clearLoop, createLoginLoop, interval } from '~/composables/loginLoop'
import logoutAccount from '~/composables/logout'
import { qrcodeGet } from '~/composables/api'
import { useStore } from '~/stores/store'
import { msgKey } from '~/composables/injectionKeys'

const store = useStore()
const msgRef = inject(msgKey)

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

  const success = await createLoginLoop(data.oauthKey)
  if (success)
    msgRef?.value.pushMsg('登录成功！', { type: 'success' })
  msgRef?.value.pushMsg('若头像信息未更新，可点击按钮刷新', { type: 'info' })
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
      msgRef?.value.pushMsg('退出成功', { type: 'success' })
      store.config.autoReply = false
      store.config.canSendMessage = false
    }
    else {
      msgRef?.value.pushMsg('退出失败', { type: 'error' })
    }
  }
}

const refreshLogin = (event: Event) => {
  location.reload();
  (event.target as HTMLElement).classList.toggle('animate-spin')
  setTimeout(() => {
    (event.target as HTMLElement).classList.toggle('animate-spin')
  }, 1000)
}
</script>

<template>
  <div flex space-x-2 items-center>
    <Avatar w-3rem h-3rem :src="store.getUserInfo.avatarUrl || ''" :uid="store.getUserInfo.mid" />
    <div flex-1>
      <div v-if="!store.getUserInfo.mid" flex>
        <div space-x-2 flex items-center>
          <button btn rounded :disabled="!getQrcodeEnabled" @click="login">
            {{ interval ? '刷新' : '登录' }}
          </button>
          <div i-ri-refresh-line icon-btn @click="refreshLogin" />
        </div>
        <div
          v-if="interval" absolute z-998 fixed
          left-0 top-0 bottom-0 right-0
          flex items-center justify-center
          bg="white/80 dark:black/60"
        >
          <MyQrCode absolute :url="qrurl" @close="cancelLogin" />
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
