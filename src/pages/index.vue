<script setup lang="ts">
import { ref } from 'vue'
const opacity = ref('0')
</script>

<template>
  <USlider v-model="opacity" />{{ opacity }}
</template>

<route lang="yaml">
meta:
  layout: default
</route>
