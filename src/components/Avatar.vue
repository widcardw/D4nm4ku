<script setup lang="ts">
import MyImg from './img/MyImg.vue'
defineProps<{
  src: string
}>()
</script>

<template>
  <MyImg :src="src" rounded-full w-3rem h-3rem shadow-md err-src="/noface.gif" />
</template>

