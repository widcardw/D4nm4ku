<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import USuperChat from './USuperChatFloat.vue'
import USuperChatTag from './USuperChatTag.vue'
import type { SuperChatProps } from '~/composables/components'
import { chatPool } from '~/composables/server'

const props = defineProps<{
  chatPool: Array<SuperChatProps>
  modelValue: SuperChatProps | null
}>()

const emits = defineEmits(['update:modelValue'])

const sc = useVModel(props, 'modelValue', emits)

const clickSuperChat = (currentSc: SuperChatProps) => {
  if (sc.value?.ts === currentSc.ts)
    sc.value = null

  else
    sc.value = currentSc
}
</script>

<template>
  <div space-y-1 p-1>
    <div
      flex of-x-auto
      space-x-2
    >
      <USuperChatTag
        v-for="it in chatPool" :key="it.ts"
        :face="it.face"
        :uid="it.uid"
        :price="it.price"
        :color="it.bgBottomColor"
        :second="it.second"
        :ts="it.ts"
        cursor-pointer
        @click="clickSuperChat(it)"
      />
    </div>
    <USuperChat
      v-if="sc"
      :ts="sc.ts"
      :uname="sc.uname"
      :content="sc.content"
      :content-jpn="sc.contentJpn"
      :face="sc.face"
      :price="sc.price"
      :uid="sc.uid"
      :bg-bottom-color="sc.bgBottomColor"
      :bg-color="sc.bgColor"
    />
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
</style>
