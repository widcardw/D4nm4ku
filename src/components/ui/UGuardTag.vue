<script setup lang="ts">
defineProps<{
  level: number
  label: string
  perhapsGuard: number
}>()
</script>

<template>
  <div flex class="text-0.75rem" border="~ rounded">
    <div v-if="perhapsGuard !== 0 && level >= 20" px-1 self-center>
      <div i-ri-anchor-fill text-blue-500 />
    </div>
    <div border-r px-1 :style="{ backgroundColor: `rgba(54, 105, 230, ${level / 25})`, color: level <= 20 ? '' : 'white' }">
      {{ label }}
    </div>
    <div px-1>
      {{ level }}
    </div>
  </div>
</template>
