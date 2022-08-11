<script setup lang="ts">
defineProps<{
  content: string
}>()

const emits = defineEmits(['close'])
</script>

<template>
  <div
    inline-flex
    items-center
    border="~ rounded zinc-300 dark:zinc-700"
    leading-normal
    p="x-2"
    space-x-1
  >
    <span pl-1>{{ content }}</span>
    <div icon-btn text-sm i-ri-close-line @click="emits('close')" />
  </div>
</template>
