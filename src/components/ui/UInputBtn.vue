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
  <div rounded flex :class="{ flex: noBorder }">
    <div flex-1>
      <input
        v-model="value"
        m-input rounded-l
        p-1 w-full
        border-r-none
        :disabled="inputDisabled"
        :placeholder="placeholder"
        :class="{ 'border-none': noBorder }"
        @keydown.ctrl.enter.exact="emitEvent"
      >
    </div>
    <button
      btn
      :class="{ 'border-~ border-#646cff disabled:border-zinc-300/20': !noBorder }"
      rounded-r
      :disabled="btnDisabled"
      @click="emitEvent"
    >
      <slot />
    </button>
  </div>
</template>
