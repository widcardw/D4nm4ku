<script setup lang="ts">
const props = defineProps<{
  level: number
  label: string
  perhapsGuard: 0 | 1 | 2 | 3
  tagColor: number
}>()
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
        backgroundColor: `#${props.tagColor.toString(16).padStart(6, '0')}`,
      }"
    >
      {{ label }}
    </div>
    <div px-1 wsn bg-white text-black rounded-r text-shadow-none>
      {{ level }}
    </div>
  </div>
</template>
