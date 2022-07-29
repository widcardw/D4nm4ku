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
    class="inline-flex items-center leading-relaxed select-none space-x-1 cursor-pointer"
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
    <div flex items-center text-lg>
      <div i-ri-checkbox-blank-line icon-btn />
      <div
        i-ri-checkbox-fill text-active icon-btn absolute
        :class="{ 'scale-0': !checked }"
      />
    </div>

    <span><slot /></span>
  </label>
</template>
