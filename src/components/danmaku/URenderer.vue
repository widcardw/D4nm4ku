<script setup lang="ts">
import type { DanmakuProps, GiftProps } from '../../composables/components'
import { isDanmakuProps, isGiftProps } from '../../composables/components'
import UDanmaku from './UDanmaku.vue'
import UGift from './UGift.vue'

defineProps<{
  obj?: DanmakuProps | GiftProps
}>()
</script>

<template>
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
    :show-avatar="true"
    :show-guard-tag="true"
    :show-time="true"
  />
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
