<script setup lang="ts">
import Avatar from '~/components/img/Avatar.vue'
import { getLightnessFromHex } from '~/composables/randomColor'

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

if (props.face === '') {
  getAvatar2(props.uid)
    .then((url) => {
      faceUrl.value = url
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
      color: getLightnessFromHex(color) > 100 ? '#000' : '#fff',
    }"
    p-1 pr-2 text-white
  >
    <Avatar :src="faceUrl" :uid="uid" class="w-1.5rem h-1.5rem" />
    <div>
      ￥{{ price }}
    </div>
  </div>
</template>
