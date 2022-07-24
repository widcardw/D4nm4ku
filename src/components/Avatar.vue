<script setup lang="ts">
import MyImg from './img/MyImg.vue'
defineProps<{ src: string }>()
</script>

<template>
  <MyImg :src="src" />
</template>
