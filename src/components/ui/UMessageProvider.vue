<script setup lang="ts">
import { ref } from 'vue'
import type { MessageProviderOptions } from '~/types'

interface PopMessage {
  ts: number
  content: string
  type: 'success' | 'error' | 'warning' | 'info'
}

const iconsDict = {
  success: 'i-ri-checkbox-circle-line text-green-6',
  error: 'i-ri-close-circle-line text-red-6',
  warning: 'i-ri-error-warning-line text-amber',
  info: 'i-ri-information-line text-blue',
}

const messageQueue = ref<PopMessage[]>([])

const pushMsg = (msg: string, config?: MessageProviderOptions) => {
  const ts = Date.now()
  messageQueue.value.push({
    type: config?.type || 'info',
    content: msg,
    ts,
  })

  setTimeout(() => {
    messageQueue.value.splice(messageQueue.value.findIndex(it => it.ts === ts), 1)
  }, config?.ttl || 3000)
}

defineExpose({ pushMsg })
</script>

<template>
  <TransitionGroup
    tag="div"
    name="msggroup"
    fixed left-0 right-0
    top-2rem
    flex flex-col
    pointer-events-none
    z-999
  >
    <div
      v-for="it in messageQueue" :key="it.ts"
      p="x-4 y-2" my-2 shadow-lg rounded
      ma
      bg="white !dark:zinc-900"
      flex items-center space-x-2
      class="use-dark-msg"
    >
      <div icon-btn :class="iconsDict[it.type]" /><span>{{ it.content }}</span>
    </div>
  </TransitionGroup>
</template>

<style scoped>
.msggroup-move, /* 对移动中的元素应用的过渡 */
.msggroup-enter-active,
.msggroup-leave-active {
  transition: all 0.375s ease;
}

.msggroup-enter-from,
.msggroup-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.01);
}

.msggroup-leave-active {
  position: absolute;
}
</style>
