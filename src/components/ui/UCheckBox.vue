<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  disabled?: boolean
}>(), {
  modelValue: false,
  disabled: false,
})

const emits = defineEmits(['update:modelValue'])

const checked = useVModel(props, 'modelValue', emits)
</script>

<template>
  <label
    class="inline-flex items-center select-none space-x-1 cursor-pointer"
    :checked="checked || null"
    :disabled="disabled || null"
  >
    <input
      v-model="checked"
      type="checkbox"
      :disabled="disabled"
      display-none
      @keypress.enter="checked = !checked"
    >
    <div v-if="checked" i-ri-checkbox-line text-active icon-btn self-center />
    <div v-else i-ri-checkbox-blank-line icon-btn self-center />
    <span><slot /></span>
  </label>
</template>
