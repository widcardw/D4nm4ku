<script setup lang="ts">
import MyImg from './MyImg.vue'
defineProps<{
  src: string
}>()
</script>

<template>
  <MyImg :src="src" rounded-full shadow-md err-src="/noface.gif" />
</template>

