<script setup lang="ts">
import { ref } from 'vue'
interface PopMessage {
  ts: number
  content: string
}
const messageQueue = ref<PopMessage[]>([])

const pushMsg = (msg: string) => {
  messageQueue.value.push({
    ts: Date.now(),
    content: msg,
  })

  setTimeout(() => {
    messageQueue.value.shift()
  }, 3000)
}

defineExpose({ pushMsg })
</script>

<template>
  <div v-if="messageQueue.length" fixed left-0 right-0 mt-4rem flex flex-col>
    <div
      v-for="it in messageQueue" :key="it.ts"
      p-4 my-2 shadow-xl rounded
      animate-bounce-in ma
      bg="white dark:#121212"
    >
      {{ it.content }}
    </div>
  </div>
</template>
