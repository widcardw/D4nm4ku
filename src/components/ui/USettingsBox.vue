<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div>
    <div font-bold>
      {{ title }}
    </div>
    <hr border="zinc/20" py-1>
    <div grid grid-cols-3>
      <slot />
    </div>
  </div>
</template>
