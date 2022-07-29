<script setup lang="ts">
import Login from '../components/settings/Login.vue'
import { useStore } from '../stores/store'
import UCheckBox from '../components/ui/UCheckBox.vue'
import UGuardTag from '../components/ui/UGuardTag.vue'

const store = useStore()
</script>

<template>
  <div p-4 space-y-4>
    <Login />
    <div flex justify-between items-center>
      <div font-bold text-xl>
        设置项
      </div>
      <button btn @click="store.storeConfig">
        保存设置
      </button>
    </div>
    <div>
      <div font-bold>
        常规
      </div>
      <hr border-zinc opacity-20 py-1>
      <div grid grid-cols-3>
        <UCheckBox v-model="store.getConfig.showAvatar">
          显示用户头像
        </UCheckBox>
        <UCheckBox v-model="store.getConfig.showTime">
          显示弹幕发送时间
        </UCheckBox>
        <div flex space-x-2>
          <UCheckBox v-model="store.getConfig.showGuardTag">
            显示标签和等级
          </UCheckBox>
          <UGuardTag v-if="store.getConfig.showGuardTag" label="bilibili" :level="25" :perhaps-guard="3" />
        </div>
        <UCheckBox v-model="store.getConfig.showSilverGift">
          显示免费礼物
        </UCheckBox>
        <UCheckBox v-model="store.getConfig.showGoldGift">
          显示付费礼物
        </UCheckBox>
      </div>
    </div>
    <div>
      <div font-bold>
        发送弹幕扩展（需要登录）
      </div>
      <hr border-zinc opacity-20 py-1>
      <div>
        <UCheckBox
          v-model="store.getConfig.canSendMessage"
          :disabled="!store.getUserInfo.mid"
        >
          主播可直接发送弹幕
        </UCheckBox>
      </div>
    </div>
  </div>
</template>
