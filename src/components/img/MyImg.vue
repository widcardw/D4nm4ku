<script setup lang="ts">
// import { readBinaryFile } from '@tauri-apps/api/fs'
import { processImgUrl2 } from '~/composables/fetchImgFromBackend'

const props = withDefaults(defineProps<{
  src: string
  errSrc?: string
  uid?: number
}>(), {
  errSrc: '/noface.gif',
})

const realSrc = ref(props.errSrc)

function loadImage() {
  if (props.src.trim() === '')
    return
  processImgUrl2(props.src, props.uid)
    .then(({ blob }) => {
      realSrc.value = blob
    })
}

loadImage()

watch(
  () => props.src,
  loadImage,
)

const onError = () => {
  realSrc.value = props.errSrc
}
</script>

<template>
  <img :loading="errSrc" :src="realSrc" @error="onError">
</template>
