<script setup lang="ts">
import { title } from 'process'
import { useFocus, useVModel } from '@vueuse/core'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  disabled?: boolean
  title?: string
}>(), {
  disabled: false,
  title: '请输入',
})

const emits = defineEmits(['update:modelValue'])
const value = useVModel(props, 'modelValue', emits)

const inputRef = ref<HTMLInputElement>()
const { focused } = useFocus(inputRef)
const shouldFloat = computed(() => focused.value || value.value !== '')
</script>

<template>
  <div inline-flex m="x-2 y-2">
    <input
      ref="inputRef"
      v-model="value"
      class="bg-transparent !outline-none leading-loose"
      border="2px rounded zinc-300 dark:zinc-700 focus:#646cff"
      p="x-2 y-1"
      w-15rem transition-all
      :disabled="disabled"
    >
    <div
      absolute transition-all m="x-3 y-10px" op-50
      :class="{
        'scale-80 translate-y--20px bg-white dark:bg-#242424 leading-tight !op-100': shouldFloat,
      }"
      style="transform-origin: left"
      @click="focused = !focused"
    >
      {{ title }}
    </div>
  </div>
</template>
