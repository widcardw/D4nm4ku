<script setup lang="ts">
defineProps<{
  population: number
  fans: string
}>()
</script>

<template>
  <div flex p-2 justify-between>
    <div>观看人数 {{ population }}</div>
    <div>粉丝数 {{ fans }}</div>
  </div>
</template>
