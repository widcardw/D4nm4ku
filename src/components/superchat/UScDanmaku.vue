<script setup lang="ts">
import Avatar from '~/components/img/Avatar.vue'

import { getLightnessFromHex } from '~/composables/randomColor'

defineProps<{
  uname: string
  content: string
  face: string
  price: number
  ts: number
  uid: number
  bgBottomColor: string
  bgColor: string
  second: number
}>()
</script>

<template>
  <div w-full rounded>
    <div
      :style="{
        backgroundColor: bgColor,
        color: getLightnessFromHex(bgColor) > 100 ? '#000' : '#fff',
      }"
      flex space-x-2 p-2 rounded-t
    >
      <Avatar w-3rem h-3rem :src="face" />
      <div flex-1>
        <div font-bold text-lg>
          {{ uname }}
        </div>
        <div text-sm>
          ￥{{ price }}
        </div>
      </div>
    </div>
    <div
      :style="{
        backgroundColor: bgBottomColor,
        color: getLightnessFromHex(bgBottomColor) > 100 ? '#000' : '#fff',
      }"
      p-2 rounded-b
    >
      {{ content }}
    </div>
  </div>
</template>
