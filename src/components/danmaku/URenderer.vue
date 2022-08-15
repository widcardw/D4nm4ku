<script setup lang="ts">
import UDanmaku from '~/components/danmaku/UDanmaku.vue'
import UGift from '~/components/danmaku/UGift.vue'
import UScDanmaku from '~/components/superchat/UScDanmaku.vue'
import type { DanmakuProps, GiftProps, SuperChatProps } from '~/composables/components'
import { isDanmakuProps, isGiftProps, isSuperChatProps } from '~/composables/components'
import { useStore } from '~/stores/store'

defineProps<{
  obj?: DanmakuProps | GiftProps | SuperChatProps
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
    :uid="obj.uid"
  />
  <UScDanmaku
    v-else-if="isSuperChatProps(obj)"
    :uname="obj.uname"
    :uid="obj.uid"
    :ts="obj.ts"
    :second="obj.second"
    :face="obj.face"
    :bg-bottom-color="obj.bgBottomColor"
    :bg-color="obj.bgColor"
    :content="obj.content"
    :price="obj.price"
  />
</template>
