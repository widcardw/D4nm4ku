<script setup lang="ts">
import { listen } from '@tauri-apps/api/event'
import { tryOnBeforeUnmount } from '@vueuse/core'
import SideBar from '~/components/SideBar.vue'
import { useStore } from '~/stores/store'

const store = useStore()
const unlistens: Function[] = []

async function unlistenAdd() {
  unlistens.push(await listen('add-black', (event) => {
    const uid = parseInt(event.payload as string)
    if (!store.config.blackList.includes(uid)) {
      store.config.blackList.push(uid)
      store.settingsSaved = false
    }
  }))
}

unlistenAdd()

tryOnBeforeUnmount(() => {
  unlistens.map(fn => fn())
})
</script>

<template>
  <div class="use-dark">
    <SideBar />
    <div ml-2rem flex-1>
      <RouterView />
    </div>
  </div>
</template>
