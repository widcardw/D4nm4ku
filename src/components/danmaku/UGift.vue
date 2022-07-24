<script setup lang="ts">
defineProps<{
  uname: string
  action: string
  num: number
  face: string
  giftName: string
  price: number
  ts?: number
}>()
</script>

<template>
  <div flex>
    <div>感谢</div>
    <img :src="face" class="w-1.5rem h-1.5rem" mx-1 rounded-full>
    <div> <span text-orange>{{ uname }}</span> {{ action }} 的 {{ num }} 个 <span text-orange>{{ giftName }}</span></div>
  </div>
</template>
