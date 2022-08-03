<script setup lang="ts">
import UDanmaku from './UDanmaku.vue'
import UGift from './UGift.vue'
import type { DanmakuProps, GiftProps } from '~/composables/components'
import { isDanmakuProps, isGiftProps } from '~/composables/components'

defineProps<{
  obj?: DanmakuProps | GiftProps
}>()

const store = useStore()
</script>

<template>
  <!-- 类型断言为弹幕 -->
  <UDanmaku
    v-if="isDanmakuProps(obj)"
    :content="obj.content"
    :uname="obj.uname"
    :level="obj.level"
    :label="obj.label"
    :color="obj.color"
    :perhaps-guard="obj.perhapsGuard"
    :ts="obj.ts"
    :uid="obj.uid"
    :show-avatar="store.getConfig.showAvatar"
    :show-guard-tag="store.getConfig.showGuardTag"
    :show-time="store.getConfig.showTime"
    :layout="store.getConfig.layout"
  />
  <!-- 类型断言为礼物 -->
  <UGift
    v-else-if="isGiftProps(obj)"
    :uname="obj.uname"
    :action="obj.action"
    :num="obj.num"
    :face="obj.face"
    :coin-type="obj.coinType"
    :gift-id="obj.giftId"
    :gift-name="obj.giftName"
    :price="obj.price"
    :ts="obj.ts"
  />
</template>
