<script setup lang="ts">
defineProps<{
  level: number
  label: string
  perhapsGuard: 0 | 1 | 2 | 3
}>()
</script>

<template>
  <div flex class="text-0.75rem" border="~ rounded blue">
    <div
      border="r blue"
      rounded-l
      px-1
      wsn
      :style="{
        backgroundColor: `rgba(54, 105, 230, ${level / 25})`,
        color: level <= 20 ? '' : 'white',
      }"
    >
      {{ label }}
    </div>
    <div px-1 wsn>
      {{ level }}
    </div>
  </div>
</template>
