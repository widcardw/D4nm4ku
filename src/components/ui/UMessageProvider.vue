<script setup lang="ts">
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

const pushMsg = (msg: Extract<PopMessage, { ts: number }>) => {
  messageQueue.value.push({
    ...msg,
    ts: Date.now(),
  })

  setTimeout(() => {
    messageQueue.value.shift()
  }, 3000)
}

defineExpose({ pushMsg })
</script>

<template>
  <div v-show="messageQueue.length" fixed left-0 right-0 top-2rem flex flex-col pointer-events-none z-999>
    <div
      v-for="it in messageQueue" :key="it.ts"
      p="x-4 y-2" my-2 shadow-lg rounded
      animate-bounce-in ma transition-all
      bg="white dark:zinc-900"
      flex items-center space-x-1
      class="use-dark-msg"
    >
      <div icon-btn :class="iconsDict[it.type]" /> <span>{{ it.content }}</span>
    </div>
  </div>
</template>
