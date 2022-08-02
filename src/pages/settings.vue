<script setup lang="ts">
import { WebviewWindow } from '@tauri-apps/api/window'

// const msgRef = ref()
const msgRef = inject('msgRef') as any
const store = useStore()
const saveSettings = useThrottleFn(() => {
  store.storeConfig()
  msgRef.value.pushMsg({ content: '保存成功', type: 'success' })
}, 1000)

const settingChanged = (event: string, payload: any) => {
  const showWindow = WebviewWindow.getByLabel('danmakuWidget')
  if (showWindow)
    showWindow.emit(event, payload)
}

const pinned = ref(true)
const pinWidget = () => {
  pinned.value = !pinned.value
  const danmakuWidget = WebviewWindow.getByLabel('danmakuWidget')
  if (danmakuWidget)
    danmakuWidget.setAlwaysOnTop(pinned.value)
}
</script>

<template>
  <div p-4 space-y-4>
    <Login />
    <div flex justify-between>
      <div font-bold text-xl>
        设置项
      </div>
      <button btn @click="saveSettings">
        保存设置
      </button>
    </div>
    <USettingsBox title="常规">
      <UCheckBox
        v-model="store.config.showAvatar"
        @update:model-value="settingChanged('show-avatar', store.config.showAvatar)"
      >
        显示用户头像
      </UCheckBox>
      <UCheckBox
        v-model="store.config.showTime"
        @update:model-value="settingChanged('show-time', store.config.showTime)"
      >
        显示弹幕发送时间
      </UCheckBox>
      <div flex space-x-2>
        <UCheckBox
          v-model="store.config.showGuardTag"
          @update:model-value="settingChanged('show-guard-tag', store.config.showGuardTag)"
        >
          显示标签和等级
        </UCheckBox>
        <UGuardTag v-if="store.config.showGuardTag" label="bilibili" :level="25" :perhaps-guard="3" />
      </div>
      <UCheckBox
        v-model="store.config.showSilverGift"
        @update:model-value="settingChanged('show-silver-gift', store.config.showSilverGift)"
      >
        显示免费礼物
      </UCheckBox>
      <UCheckBox
        v-model="store.config.showGoldGift"
        @update:model-value="settingChanged('show-gold-gift', store.config.showGoldGift)"
      >
        显示付费礼物
      </UCheckBox>
      <UCheckBox
        v-model="store.config.showPopulation"
        @update:model-value="settingChanged('show-population', store.config.showPopulation)"
      >
        显示顶部栏
      </UCheckBox>
      <UCheckBox
        v-model="pinned"
        @update:model-value="pinWidget"
      >
        窗口置顶
      </UCheckBox>
    </USettingsBox>
    <USettingsBox title="样式">
      <UColorPicker
        v-model="store.config.textColor"
        @update:model-value="settingChanged('text-color-changed', store.config.textColor)"
      >
        文字颜色
      </UColorPicker>
      <UColorPicker
        v-model="store.config.bgColor"
        @update:model-value="settingChanged('bg-color-changed', store.config.bgColor)"
      >
        背景颜色
      </UColorPicker>
      <div flex space-x-2 leading-relaxed>
        <USlider
          v-model="store.config.bgOpacity" :min-value="0" :max-value="255" w-100px
          @update:model-value="settingChanged('bg-opacity-changed', store.config.bgOpacity)"
        />
        <span>背景不透明度</span>
      </div>
      <UCheckBox
        v-model="store.config.blur"
        @update:model-value="settingChanged('blur', store.config.blur)"
      >
        毛玻璃效果（不稳定）
      </UCheckBox>
    </USettingsBox>
    <USettingsBox title="弹幕扩展（需要登录）">
      <UCheckBox
        v-model="store.getConfig.canSendMessage"
        :disabled="!store.getUserInfo.mid"
        @update:model-value="settingChanged('can-send-message', store.getConfig.canSendMessage)"
      >
        用户可直接发送弹幕
      </UCheckBox>
    </USettingsBox>
  </div>
</template>
