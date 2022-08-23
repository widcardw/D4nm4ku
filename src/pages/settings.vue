<script setup lang="ts">
import { WebviewWindow } from '@tauri-apps/api/window'
import { confirm } from '@tauri-apps/api/dialog'
import { invoke } from '@tauri-apps/api/tauri'
import { appDir } from '@tauri-apps/api/path'
import { useThrottleFn } from '@vueuse/core'
import { inject, ref } from 'vue'
import USettingsBox from '~/components/ui/USettingsBox.vue'
import UCheckBox from '~/components/ui/UCheckBox.vue'
import UColorPicker from '~/components/ui/UColorPicker.vue'
import { useStore } from '~/stores/store'
import Login from '~/components/settings/Login.vue'
import URadio from '~/components/ui/URadio.vue'
import USlider from '~/components/ui/USlider.vue'
import UMultiList from '~/components/ui/UMultiList.vue'
import UGuardTag from '~/components/danmaku/UGuardTag.vue'
import UBlackList from '~/components/ui/UBlackList.vue'

const msgRef = inject('msgRef') as any
const store = useStore()

const saveSettings = useThrottleFn(() => {
  store.settingsSaved = true
  store.storeConfig()
  msgRef.value.pushMsg({ content: '保存成功', type: 'success' })
}, 1000)

const settingChanged = (event: string, payload: any) => {
  store.settingsSaved = false
  const showWindow = WebviewWindow.getByLabel('danmakuWidget')
  if (showWindow)
    showWindow.emit(event, payload)
}

const pinned = ref(true)
const pinWidget = () => {
  const danmakuWidget = WebviewWindow.getByLabel('danmakuWidget')
  if (danmakuWidget)
    danmakuWidget.setAlwaysOnTop(pinned.value)
}

function openAppDir() {
  appDir()
    .then(async (dir) => {
      return await invoke('open_app_img_dir', { dir })
    })
    .catch((err) => {
      msgRef.value.pushMsg({ content: err.message, type: 'error' })
    })
}

async function clearConfig() {
  const confirmed = await confirm('确定要清空当前设置吗？', {
    title: '还原默认设置', type: 'warning',
  })
  if (confirmed) {
    store.removeConfig()
    msgRef.value.pushMsg({ content: '设置已还原！' })
  }
}
</script>

<template>
  <div p-4 space-y-4>
    <Login />
    <div flex space-x-2>
      <div font-bold text-xl>
        设置项
      </div>
      <div flex-1 />
      <button
        btn rounded
        :disabled="store.settingsSaved"
        @click="saveSettings"
      >
        保存设置
      </button>
      <button
        border="~ zinc hover:#646cff"
        p="x-4 y-1" op="80 hover:100"
        transition-all
        rounded
        title="如果有些新加的设置项无法修改，请尝试重置设置"
        @click="clearConfig"
      >
        还原默认
      </button>
    </div>
    <USettingsBox title="界面布局">
      <div space-x-2>
        <URadio
          v-model="store.config.layout"
          value="loose" name="layout"
          @update:model-value="settingChanged('layout', store.config.layout)"
        >
          松散
        </URadio>
        <URadio
          v-model="store.config.layout"
          value="tight" name="layout"
          @update:model-value="settingChanged('layout', store.config.layout)"
        >
          紧凑
        </URadio>
      </div>
      <UCheckBox
        v-model="store.config.showPopulation"
        @update:model-value="settingChanged('show-population', store.config.showPopulation)"
      >
        显示顶部栏
      </UCheckBox>
      <UCheckBox
        v-model="store.config.showHighlight"
        @update:model-value="settingChanged('show-highlight', store.config.showHighlight)"
      >
        显示高能榜
      </UCheckBox>
    </USettingsBox>
    <USettingsBox title="常规">
      <UCheckBox
        v-model="store.config.showAvatar"
        title="若弹幕数量过多，建议关闭，以免请求超时"
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
        v-model="store.config.showEnter"
        @update:model-value="settingChanged('show-enter', store.config.showEnter)"
      >
        显示进场信息
      </UCheckBox>
      <UCheckBox
        v-model="store.config.showSubscribe"
        @update:model-value="settingChanged('show-subscribe', store.config.showSubscribe)"
      >
        显示关注信息
      </UCheckBox>
    </USettingsBox>
    <USettingsBox title="礼物">
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
        v-model="store.config.pushGiftIntoHighlight"
        @update:model-value="settingChanged('push-gift-into-highlight', store.config.pushGiftIntoHighlight)"
      >
        付费礼物加入高能榜
      </UCheckBox>
    </USettingsBox>
    <USettingsBox title="窗口">
      <UCheckBox
        v-model="pinned"
        @update:model-value="pinWidget"
      >
        窗口置顶
      </UCheckBox>
      <UCheckBox
        v-model="store.config.clickThrough"
        @update:model-value="settingChanged('set-click-through', store.config.clickThrough)"
      >
        点击穿透（仅 macOS）
      </UCheckBox>
      <div
        inline-flex items-center leading-relaxed select-none space-x-1 cursor-pointer
        @click="openAppDir"
      >
        <div text-lg flex items-center>
          <div icon-btn i-ri-folder-open-fill ml-1 />
        </div>
        <span>打开图片缓存目录</span>
      </div>
    </USettingsBox>
    <USettingsBox title="样式">
      <UColorPicker
        v-model="store.config.textColor"
        @update:model-value="settingChanged('text-color-changed', store.config.textColor)"
      >
        文字颜色
      </UColorPicker>
      <div flex space-x-2>
        <UCheckBox
          v-model="store.config.enableTextShadow"
          @update:model-value="settingChanged('enable-text-shadow', store.config.enableTextShadow)"
        >
          文字阴影
        </UCheckBox>
        <UColorPicker
          v-model="store.config.textShadowColor"
          :disabled="!store.config.enableTextShadow"
          @update:model-value="settingChanged('text-shadow-color-changed', store.config.textShadowColor)"
        >
          颜色
        </UColorPicker>
      </div>
      <div flex space-x-1 items-center>
        <div>
          字体
        </div>
        <div flex-1>
          <input
            v-model="store.config.fontFamily"
            w-full
            m-input rounded text-sm
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
            :style="{ fontFamily: store.config.fontFamily }"
            @input="settingChanged('font-changed', store.config.fontFamily)"
          >
        </div>
      </div>
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
    <UBlackList @settings-changed="settingChanged('blacklist', store.getConfig.blackList)" />
    <USettingsBox :title="store.getUserInfo.mid ? '弹幕扩展' : '弹幕扩展（需要登录）'">
      <UCheckBox
        v-model="store.config.canSendMessage"
        :disabled="!store.getUserInfo.mid"
        @update:model-value="settingChanged('can-send-message', store.config.canSendMessage)"
      >
        通过弹幕窗格发送弹幕
      </UCheckBox>
      <UCheckBox
        v-model="store.config.autoReply"
        :disabled="!store.getUserInfo.mid"
        @update:model-value="settingChanged('auto-reply', store.config.autoReply)"
      >
        自动回复
      </UCheckBox>
    </USettingsBox>
    <UMultiList
      v-if="store.config.autoReply"
      ml-2
      @settings-changed="store.settingsSaved = false"
    />
  </div>
</template>
