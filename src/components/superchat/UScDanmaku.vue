<script setup lang="ts">
import { inject, ref } from 'vue'
import Avatar from '~/components/img/Avatar.vue'
import { getAvatar2 } from '~/composables/getAvatar'

import { getLightnessFromHex } from '~/composables/randomColor'

const props = defineProps<{
  uname: string
  content: string
  face: string
  price: number
  ts: number
  uid: number
  bgBottomColor: string
  bgColor: string
  second: number
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
      msgRef.value.pushMsg({ content: '头像获取失败', type: 'error' })
    })
}
</script>

<template>
  <div w-full rounded>
    <div
      :style="{
        backgroundColor: bgColor,
        color: getLightnessFromHex(bgColor) > 100 ? '#000' : '#fff',
      }"
      flex space-x-2 p-2 rounded-t
    >
      <Avatar w-3rem h-3rem :src="faceUrl" :uid="uid" :is-blob="urlIsBlob" />
      <div flex-1>
        <div font-bold text-lg>
          {{ uname }}
        </div>
        <div text-sm>
          ￥{{ price }}
        </div>
      </div>
    </div>
    <div
      :style="{
        backgroundColor: bgBottomColor,
        color: getLightnessFromHex(bgBottomColor) > 100 ? '#000' : '#fff',
      }"
      p-2 rounded-b
    >
      {{ content }}
    </div>
  </div>
</template>
