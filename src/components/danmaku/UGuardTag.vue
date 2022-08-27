<script setup lang="ts">
defineProps<{
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
        backgroundColor: `#${tagColor.toString(16)}`,
      }"
    >
      {{ label }}
    </div>
    <div px-1 wsn bg-white text-black rounded-r text-shadow-none>
      {{ level }}
    </div>
  </div>
</template>
