<script setup lang="ts">
import { DanmakuProps, GiftProps } from '../../composables/components'
import UDanmaku from './UDanmaku.vue'
import UGift from './UGift.vue'

type PropsType = 'text' | 'gift'

defineProps<{
  type: PropsType
  danmakuProps?: DanmakuProps
  giftProps?: GiftProps
}>()
</script>

<template>
  <UDanmaku
    v-if="type === 'text'"
    :content="(danmakuProps as DanmakuProps).content"
    :uname="(danmakuProps as DanmakuProps).uname"
    :level="(danmakuProps as DanmakuProps).level"
    :label="(danmakuProps as DanmakuProps).label"
    :color="(danmakuProps as DanmakuProps).color"
    :perhaps-guard="(danmakuProps as DanmakuProps).perhapsGuard"
    :ts="(danmakuProps as DanmakuProps).ts"
    :uid="(danmakuProps as DanmakuProps).uid"
    :show-avatar="true"
    :show-guard-tag="true"
    :show-time="true"
  />
  <UGift
    v-else-if="type === 'gift'"
    :uname="(giftProps as GiftProps).uname"
    :action="(giftProps as GiftProps).action"
    :num="(giftProps as GiftProps).num"
    :face="(giftProps as GiftProps).face"
    :coin-type="(giftProps as GiftProps).coinType"
    :gift-id="(giftProps as GiftProps).giftId"
    :gift-name="(giftProps as GiftProps).giftName"
    :price="(giftProps as GiftProps).price"
    :ts="(giftProps as GiftProps).ts"
  />
</template>
