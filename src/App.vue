<script setup lang="ts">
import { provide, ref } from 'vue'
import UMessageProvider from './components/ui/UMessageProvider.vue'
import { msgKey } from '~/composables/injectionKeys'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
const msgRef = ref<typeof UMessageProvider>()
provide(msgKey, msgRef)
</script>

<template>
  <RouterView />
  <UMessageProvider ref="msgRef" />
</template>
