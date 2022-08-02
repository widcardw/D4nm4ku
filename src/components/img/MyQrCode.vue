<script setup lang="ts">
import QRCode from 'qrcode'

const props = defineProps<{
  url: string
}>()

const canvasRef = ref<HTMLCanvasElement>()

// 重绘二维码
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

// 当 url 变化时，执行重绘
watch(
  () => props.url,
  redrawCanvas,
)
</script>

<template>
  <canvas ref="canvasRef" width="200" height="200" />
</template>
