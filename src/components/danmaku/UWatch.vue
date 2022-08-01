<script setup lang="ts">
defineProps<{
  population: string
  fans: string
}>()
</script>

<template>
  <div
    flex
    p-2
    space-x-1
    items-center
  >
    <div>观看人数 {{ population }}</div>
    <div flex-1 />
    <div>粉丝数 {{ fans }}</div>
  </div>
</template>

