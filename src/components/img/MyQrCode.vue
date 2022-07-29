<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import QRCode from 'qrcode'

const props = defineProps<{
  url: string
}>()

const canvasRef = ref<HTMLCanvasElement>()

const redrawCanvas = () => {
  QRCode.toCanvas(canvasRef.value, props.url, (err: any) => {
    if (err)
    // eslint-disable-next-line no-console
      console.log(err)
  })
}

onMounted(() => {
  nextTick(() => {
    redrawCanvas()
  })
})

watch(
  () => props.url,
  redrawCanvas,
)
</script>

<template>
  <canvas ref="canvasRef" width="200" height="200" />
</template>
