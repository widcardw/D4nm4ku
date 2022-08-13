<script setup lang="ts">
import MyImg from './MyImg.vue'
defineProps<{
  src: string
  uid?: number
}>()
</script>

<template>
  <MyImg :src="src" :uid="uid" rounded-full shadow-md err-src="/noface.gif" />
</template>

