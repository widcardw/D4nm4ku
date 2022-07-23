<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div h-100vh flex flex-col class="bg-#7f7f7f10">
    <div m-2 icon-btn i-ri-home-line @click="router.push('/')" />
    <div m-2 icon-btn i-ri-settings-line @click="router.push('/settings')" />
    <DarkMode m-2 />
  </div>
</template>
