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

const toggleChecked = () => {
  if (!props.disabled)
    checked.value = !checked.value
}
</script>

<template>
  <div
    flex items-center cursor-pointer leading-relaxed
    :class="{ 'opacity-50': disabled }"
    @click="toggleChecked"
  >
    <div
      class="w-2rem h-1.2rem mx-1 bg-opacity-20"
      flex items-center
      rounded-full transition-all
      :class="{
        'bg-#646cff': checked,
        'bg-zinc': !checked,
      }"
    >
      <div
        class="w-1rem h-1rem ml-0.1rem"
        rounded-full border-transparent transition-all
        :class="{
          'ml-0.9rem bg-#646cff shadow': checked,
          'bg-white dark:bg-zinc-500': !checked,
        }"
      />
    </div>
    <span><slot /></span>
  </div>
</template>
