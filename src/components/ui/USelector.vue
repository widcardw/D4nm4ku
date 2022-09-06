<script setup lang="ts">
import { useVModel } from '@vueuse/core'
const props = withDefaults(defineProps<{
  options?: Array<{ label: string; value: number }>
  modelValue?: number
}>(), {
  options: () => [],
  modelValue: 0,
})

const emits = defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue', emits)
</script>

<template>
  <div flex items-center>
    <label
      flex="~" items-center absolute
      border="~ zinc rounded"
    >
      <select
        v-model="value"
        bg="transparent"
        appearance="none"
        outline="!none"
        transition-all
        flex-1
        p="l-1 r-6"
      >
        <option v-for="o in options" :key="o.value" :value="o.value">
          {{ o.label }}
        </option>
      </select>
      <div i-ri-arrow-down-s-line absolute right-0 pointer-events="none" />
    </label>
  </div>
</template>
