<script setup lang="ts">
import { watch } from 'vue'
import { WebviewWindow } from '@tauri-apps/api/window'
import Login from '~/components/settings/Login.vue'
import { useStore } from '~/stores/store'
import USwitch from '~/components/ui/USwitch.vue'
import UGuardTag from '~/components/ui/UGuardTag.vue'

const store = useStore()
const saveSettings = () => {
  store.storeConfig()
  // msgProvider.value.pushMsg('保存成功')
  const showWindow = WebviewWindow.getByLabel('danmakuWidget')
  if (showWindow) {
    // eslint-disable-next-line no-console
    console.log('emit')
    showWindow.emit('saveSettings', store.getConfig)
  }
}

watch(
  () => store.getConfig,
  () => {
    saveSettings()
  },
  { deep: true },
)
</script>

<template>
  <div p-4 space-y-4>
    <Login />
    <div font-bold text-xl>
      设置项
    </div>
    <div>
      <div font-bold>
        常规
      </div>
      <hr border-zinc opacity-20 py-1>
      <div grid grid-cols-3>
        <USwitch v-model="store.getConfig.showAvatar">
          显示用户头像
        </USwitch>
        <USwitch v-model="store.getConfig.showTime">
          显示弹幕发送时间
        </USwitch>
        <div flex space-x-2>
          <USwitch v-model="store.getConfig.showGuardTag">
            显示标签和等级
          </USwitch>
          <UGuardTag v-if="store.getConfig.showGuardTag" label="bilibili" :level="25" :perhaps-guard="3" />
        </div>
        <USwitch v-model="store.getConfig.showSilverGift">
          显示免费礼物
        </USwitch>
        <USwitch v-model="store.getConfig.showGoldGift">
          显示付费礼物
        </USwitch>
      </div>
    </div>
    <div>
      <div font-bold>
        发送弹幕扩展（需要登录）
      </div>
      <hr border-zinc opacity-20 py-1>
      <div>
        <USwitch
          v-model="store.getConfig.canSendMessage"
          :disabled="!store.getUserInfo.mid"
        >
          用户可直接发送弹幕
        </USwitch>
      </div>
    </div>
  </div>
</template>
