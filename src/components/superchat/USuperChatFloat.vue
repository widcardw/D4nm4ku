<script setup lang="ts">
import Avatar from '~/components/img/Avatar.vue'
import { getLightnessFromHex } from '~/composables/randomColor'

interface Props {
  uname: string
  content: string
  face: string
  price: number
  ts: number
  uid: number
  bgBottomColor: string
  bgColor: string
}

defineProps<Props>()

// console.log(getLightnessFromRgb(props.bgBottomColor), getLightnessFromRgb(props.bgColor))
</script>

<template>
  <div w-full rounded text-white>
    <div
      flex items-center shadow space-x-2 p-2 rounded-t
      :style="{
        backgroundColor: bgColor,
        color: getLightnessFromHex(bgColor) > 100 ? '#000' : '#fff',
      }"
    >
      <Avatar :src="face" class="w-1.5rem h-1.5rem" />
      <div flex-1>
        {{ uname }}
      </div>
      <div>￥{{ price }}</div>
    </div>
    <div
      p-2 rounded-b
      :style="{
        backgroundColor: bgBottomColor,
        color: getLightnessFromHex(bgBottomColor) > 100 ? '#000' : '#fff',
      }"
    >
      {{ content }}
    </div>
  </div>
</template>
