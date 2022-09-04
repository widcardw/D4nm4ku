<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  level: number
  label: string
  perhapsGuard: 0 | 1 | 2 | 3
  tagColor: number
}>()
const c = props.tagColor.toString(16)
const tc = `#${Array(6 - c.length).fill('0').join('')}${c}`
</script>

<template>
  <div
    flex class="text-0.75rem"
  >
    <div
      rounded-l
      px-1
      wsn
      :style="{
        backgroundColor: tc,
      }"
    >
      {{ label }}
    </div>
    <div px-1 wsn bg-white text-black rounded-r text-shadow-none>
      {{ level }}
    </div>
  </div>
</template>
