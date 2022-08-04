<script setup lang="ts">
import Avatar from '~/components/img/Avatar.vue'
import { getLightnessFromHex } from '~/composables/randomColor'

const props = defineProps<{
  face: string
  price: number
  color: string
  second: number
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
    <Avatar :src="face" class="w-1.5rem h-1.5rem" />
    <div>
      ￥{{ price }}
    </div>
  </div>
</template>
