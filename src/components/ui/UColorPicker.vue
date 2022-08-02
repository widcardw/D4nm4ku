<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  disabled?: boolean
}>(), {
  disabled: false,
})

const emits = defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue', emits)
</script>

<template>
  <label
    class="inline-flex items-center leading-relaxed select-none space-x-1 cursor-pointer"
  >
    <input v-model="value" type="color" absolute w-1px op-0>
    <div text-lg flex items-center>
      <div i-ri-checkbox-blank-fill :style="{ color: value }" op-100 icon-btn />
      <div absolute i-ri-checkbox-blank-line icon-btn />
    </div>
    <span>
      <slot />
    </span>
  </label>
</template>
