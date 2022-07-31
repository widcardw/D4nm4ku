<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { listen } from '@tauri-apps/api/event'
import { connectRoom, danmakuPool, disconnectRoom, fans, population } from '~/composables/server'
import { isGiftProps } from '~/composables/components'
import UWatch from '~/components/danmaku/UWatch.vue'
import URenderer from '~/components/danmaku/URenderer.vue'
import type { ConfigProps } from '~/stores/store'
import { useStore } from '~/stores/store'

const store = useStore()

const unlisten = await listen('saveSettings', (event) => {
  // eslint-disable-next-line no-console
  console.log(event.payload)

  store.config = event.payload as ConfigProps
})

onMounted(() => {
  connectRoom()
})

onBeforeUnmount(() => {
  disconnectRoom()
  unlisten()
})
</script>

<template>
  <div flex flex-col h-100vh>
    <UWatch w-full shadow :population="population" :fans="fans" />
    <div
      class="scroller"
      flex-1 of-y-auto
    >
      <URenderer
        v-for="it in danmakuPool"
        :key="`${it.ts}${it.uname}${it.type}${isGiftProps(it) ? it.giftId : ''}`"
        :obj="it"
      />
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
  height: 5px
}

::-webkit-scrollbar-thumb {
  background: rgba(127, 127, 127, 0.5);
  border-radius: 5px;
}
.scroller {
  overscroll-behavior-y: contain;
  scroll-snap-type: y proximity;
}
.scroller > div:last-child {
  scroll-snap-align: end;
}
</style>

