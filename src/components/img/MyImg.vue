<script setup lang="ts">
import { readBinaryFile } from '@tauri-apps/api/fs'
import { processImgUrl } from '~/composables/fetchImgFromBackend'

const props = withDefaults(defineProps<{
  src: string
  errSrc?: string
}>(), {
  errSrc: '/noface.gif',
})

const realSrc = ref(props.errSrc)
const store = useStore()

function loadImage() {
  if (props.src.trim() === '')
    return
  processImgUrl(props.src)
    .then(async (path) => {
      const found = store.urlToBlobMap.find(it => it.url === path)
      if (found) {
        realSrc.value = found.blob
      }
      else {
        const content = await readBinaryFile(path) as Uint8Array
        realSrc.value = URL.createObjectURL(new Blob([content.buffer]))
        store.urlToBlobMap.push({
          url: path, blob: realSrc.value,
        })
      }
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
