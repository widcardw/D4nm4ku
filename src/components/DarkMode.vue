<script setup lang="ts">
import { isDark, toggleDark } from '~/composables/dark'
</script>

<template>
  <div icon-btn @click="toggleDark()">
    <div v-if="!isDark" i-ri-sun-line />
    <div v-else i-ri-moon-line />
  </div>
</template>
