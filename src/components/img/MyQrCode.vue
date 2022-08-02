<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'

const props = defineProps<{
  url: string
}>()

const qrcode = useQRCode(props.url)
</script>

<template>
  <div shadow-lg p-4 bg="white dark:#121212" rounded>
    <img :src="qrcode" ma>
    <div>请使用 bilibili 手机客户端扫码</div>
  </div>
</template>
