<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
  disabled?: boolean
  name?: string
  value?: string
}>(), {
  disabled: false,
  modelValue: '',
})

const emits = defineEmits(['update:modelValue'])

const model = useVModel(props, 'modelValue', emits)
</script>

<template>
  <label
    class="inline-flex items-center leading-relaxed select-none space-x-1 cursor-pointer"
    :class="{ 'op-50': disabled }"
    :checked="model === value || null"
    :disabled="disabled || null"
  >
    <input
      v-model="model"
      type="radio"
      :value="value"
      :name="name"
      :disabled="disabled"
      display-none
    >
    <div flex items-center text-lg>
      <div i-ri-checkbox-blank-circle-line icon-btn />
      <div
        i-ri-radio-button-line text-active icon-btn absolute
        :class="{ 'scale-0': model !== value }"
      />
    </div>
    <span><slot /></span>
  </label>
</template>
