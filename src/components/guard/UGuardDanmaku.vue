<script setup lang="ts">
import Avatar from '~/components/img/Avatar.vue'
import { getLightnessFromHex } from '~/composables/randomColor'
const props = defineProps<{
  uname: string
  face: string
  uid: number
  guardLevel: number
  num: number
  price: number
  ts: number
}>()

const bgColor = '#a5dee4'
const bgBottomColor = '#08192D'

const msgRef = inject('msgRef') as any
const faceUrl = ref(props.face)

if (props.face === '') {
  getAvatar(props.uid)
    .then((url: string | undefined) => {
      faceUrl.value = url ?? ''
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
      <Avatar w-3rem h-3rem :src="faceUrl" />
      <div flex-1>
        <div font-bold text-lg>
          {{ uname }}
        </div>
        <div text-sm>
          ￥{{ price }} × {{ num }}
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
      加入大航海
    </div>
  </div>
</template>
