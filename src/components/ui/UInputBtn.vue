<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(defineProps<{
  modelValue: string
  inputDisabled?: boolean
  btnDisabled?: boolean
  noBorder?: boolean
  placeholder?: string
}>(), {
  inputDisabled: false,
  btnDisabled: false,
  noBorder: false,
})

const emits = defineEmits(['update:modelValue', 'clickBtn'])

const emitEvent = () => {
  emits('clickBtn')
  // (event.target as HTMLInputElement).blur()
}

const value = useVModel(props, 'modelValue', emits)
</script>

<template>
  <div rounded inline-block :class="{ flex: noBorder }">
    <input
      v-model="value"
      m-input rounded-l
      class="b-input"
      border-r-none
      :disabled="inputDisabled"
      :placeholder="placeholder"
      :class="{ 'border-none flex-1': noBorder }"
      @keydown.ctrl.enter.exact="emitEvent"
    >
    <button btn rounded-r :disabled="btnDisabled" @click="emitEvent">
      <slot />
    </button>
  </div>
</template>

<style scoped>
.b-input {
  padding-top: calc(0.25rem - 1px);
  padding-bottom: calc(0.25rem - 1px);
}
</style>
