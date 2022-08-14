<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(defineProps<{
  modelValue?: string
  disabled?: boolean
  minValue?: number
  maxValue?: number
}>(), {
  modelValue: '0',
  disabled: false,
  minValue: 0,
  maxValue: 100,
})

const emits = defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue', emits)
</script>

<template>
  <input v-model="value" inline-block type="range" :min="minValue" :max="maxValue" class="disabled:grayscale">
</template>

<style scoped>
[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
    outline: 0;
    background-color: transparent;
}
[type="range"]::-webkit-slider-runnable-track {
    height: 4px;
    background: #7f7f7f10;
}
[type="range" i]::-webkit-slider-container {
    height: 20px;
    overflow: hidden;
}
[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #646cff;
    border: 1px solid transparent;
    margin-top: -8px;
    border-image: linear-gradient(#646cff,#646cff) 0 fill / 8 20 8 0 / 0px 0px 0 2000px;
}
</style>
