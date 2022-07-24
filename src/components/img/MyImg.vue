<script setup lang="ts">
defineProps<{
  src: string
}>()

const onError = (e: Event) => {
  (e.target as HTMLImageElement).src = '/noface.gif'
}
</script>

<template>
  <img loading="/noface.gif" w-3rem h-3rem :src="src" rounded-full shadow-md @error="onError">
  <!-- <img v-if="loading || !imgVisible" w-3rem h-3rem src="/noface.gif"> -->
</template>
