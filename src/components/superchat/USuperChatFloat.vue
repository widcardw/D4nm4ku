<script setup lang="ts">
import { inject, ref } from 'vue'
import Avatar from '~/components/img/Avatar.vue'
import { getAvatar2 } from '~/composables/getAvatar'
import { LIGHTNESS_LIMIT, getLightnessFromHex } from '~/composables/randomColor'

const props = defineProps<{
  uname: string
  content: string
  face: string
  price: number
  ts: number
  uid: number
  bgBottomColor: string
  bgColor: string
}>()

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
      msgRef.value.pushMsg('头像获取失败', { type: 'error' })
    })
}
// console.log(getLightnessFromRgb(props.bgBottomColor), getLightnessFromRgb(props.bgColor))
</script>

<template>
  <div w-full rounded text-white>
    <div
      flex items-center shadow space-x-2 p-2 rounded-t
      :style="{
        backgroundColor: bgColor,
        color: getLightnessFromHex(bgColor) > LIGHTNESS_LIMIT ? '#000' : '#fff',
      }"
    >
      <Avatar :src="faceUrl" :uid="uid" class="w-1.5rem h-1.5rem" />
      <div flex-1>
        {{ uname }}
      </div>
      <div text-amber>
        ￥{{ price / 1000 }}
      </div>
    </div>
    <div
      p-2 rounded-b break-words
      :style="{
        backgroundColor: bgBottomColor,
        color: getLightnessFromHex(bgBottomColor) > LIGHTNESS_LIMIT ? '#000' : '#fff',
      }"
    >
      {{ content }}
    </div>
  </div>
</template>
