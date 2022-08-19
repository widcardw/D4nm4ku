<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { inject, ref, watchEffect } from 'vue'
import Avatar from '~/components/img/Avatar.vue'
import { getAvatar2 } from '~/composables/getAvatar'
import { LIGHTNESS_LIMIT, getLightnessFromHex } from '~/composables/randomColor'

const props = defineProps<{
  face: string
  price: number
  color: string
  second: number
  uid: number
  ts: number
}>()

const timestamp = ref(Date.now())
const color2 = `${props.color}7f` // rgbAppendAlpha(props.color)

const { pause } = useIntervalFn(() => {
  timestamp.value = Date.now()
}, 1000)

watchEffect(() => {
  if (timestamp.value - props.ts > props.second * 1000)
    pause()
})

const faceUrl = ref(props.face)
const msgRef = inject('msgRef') as any
const urlIsBlob = ref(false)

if (props.face === '') {
  getAvatar2(props.uid)
    .then(({ url, isBlob }) => {
      faceUrl.value = url
      urlIsBlob.value = isBlob
    })
    .catch(() => {
      msgRef.value.pushMsg({ content: '头像获取失败', type: 'error' })
    })
}
</script>

<template>
  <div
    rounded-full
    inline-flex flex-shrink-0
    :style="{
      background: `linear-gradient(to right, ${color}, ${color} ${100 - (timestamp - ts) / 10 / second}%, ${color2}  ${100 - (timestamp - ts) / 10 / second + 10}%, ${color2})`,
      color: getLightnessFromHex(color) > LIGHTNESS_LIMIT ? '#000' : '#fff',
    }"
    p-1 pr-2 text-white
  >
    <Avatar :src="faceUrl" :uid="uid" class="w-1.5rem h-1.5rem" />
    <div>
      ￥{{ price / 1000 }}
    </div>
  </div>
</template>
