<script setup lang="ts">
defineProps<{
  population: string
  fans: string
}>()
</script>

<template>
  <div
    flex justify-between
    p-2
    data-tauri-drag-region
    cursor-move
    class="sel-none"
  >
    <div>观看人数 {{ population }}</div>
    <div>粉丝数 {{ fans }}</div>
  </div>
</template>

<style scoped>
.sel-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
