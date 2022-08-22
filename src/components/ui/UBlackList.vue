<script setup lang="ts">
import { inject } from 'vue'
import { listen } from '@tauri-apps/api/event'
import { tryOnBeforeUnmount } from '@vueuse/core'
import UTag from './UTag.vue'
import { useStore } from '~/stores/store'
const emits = defineEmits(['settingsChanged'])
const store = useStore()
const msgRef = inject('msgRef') as any

function pushItem(event: Event) {
  const uid = Number((event.target as HTMLInputElement).value.trim())
  if (!isNaN(uid) && !store.getConfig.blackList.includes(uid)) {
    store.config.blackList.push(uid)
    emits('settingsChanged')
  }
  else {
    msgRef.value.pushMsg({
      content: '该用户的 uid 已存在或不合法！',
      type: 'warning',
    })
  }
  (event.target as HTMLInputElement).value = ''
}

function deleteItem(i: number) {
  store.config.blackList.splice(i, 1)
  emits('settingsChanged')
}

const unlistens: Function[] = []

async function unlistenAdd() {
  unlistens.push(await listen('add-black', (event) => {
    store.config.blackList.push(parseInt(event.payload as string))
    emits('settingsChanged')
  }))
}

unlistenAdd()

tryOnBeforeUnmount(() => {
  unlistens.map(fn => fn())
})
</script>

<template>
  <div>
    <span font-bold>
      黑名单
    </span>
    <span text-sm op-50>以下 uid 用户发送的弹幕将被屏蔽，右键弹幕也可将用户加入黑名单</span>
    <hr border="zinc/20" py-1>
    <div
      rounded
      flex-1
      text-sm
      border="~ zinc-300 dark:zinc-700"
      p="t-1 l-1 r"
    >
      <UTag
        v-for="(el, i) in store.getConfig.blackList" :key="el"
        :content="el.toString()"
        m="r-1 b-1"
        @close="deleteItem(i)"
      />
      <input
        leading-normal
        border="~ rounded zinc-300 dark:zinc-700"
        content-border
        class="!outline-none"
        px-2 m="r-1 b-1"
        w-8rem
        bg-transparent
        placeholder="按下回车以添加"
        @keydown.enter="pushItem"
      >
    </div>
  </div>
</template>
