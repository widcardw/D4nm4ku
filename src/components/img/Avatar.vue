<script setup lang="ts">
import MyImg from './MyImg.vue'
defineProps<{
  src: string
  uid?: number
  isBlob?: boolean
}>()
</script>

<template>
  <MyImg :src="src" :uid="uid" :is-blob="isBlob" rounded-full shadow-md err-src="/noface.gif" />
</template>

