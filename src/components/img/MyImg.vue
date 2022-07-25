<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  errSrc?: string
}>(), {
  errSrc: '/noface.gif',
})

const onError = (e: Event) => {
  (e.target as HTMLImageElement).src = props.errSrc
}
</script>

<template>
  <img :loading="errSrc" :src="src" @error="onError">
</template>
