<script setup lang="ts">
import { confirm } from '@tauri-apps/api/dialog'
import { inject } from 'vue'
import type { Answer } from '../../composables/autoSendMsg'
import UTag from './UTag.vue'
import { useStore } from '~/stores/store'

const emits = defineEmits(['settingsChanged'])
const store = useStore()
const msgRef = inject('msgRef') as any

function pushFaq() {
  store.faqs.push({
    ts: Date.now(),
    keywords: [],
    answer: '',
  })
  emits('settingsChanged')
}

function pushKeyWord(event: Event, faq: Answer) {
  const val = (event.target as HTMLInputElement).value.trim()
  if (val === '' || faq.keywords.includes(val)) {
    msgRef.value.pushMsg('关键词重复！', {
      type: 'warning',
    })
    return
  }

  faq.keywords.push(val);
  (event.target as HTMLInputElement).value = ''
  emits('settingsChanged')
}

async function deleteFaq(index: number) {
  const confirmed = await confirm('确定要删除这个问题吗？', {
    title: '提示', type: 'warning',
  })
  if (confirmed) {
    store.faqs.splice(index, 1)
    emits('settingsChanged')
  }
}

function answerChanged() {
  emits('settingsChanged')
}
</script>

<template>
  <div space-y-2>
    <div
      v-for="(it, index) in store.getFaqs" :key="it.ts"
      py-2 space-y-2
    >
      <div flex items-center space-x-2>
        <div font-bold>
          问题 {{ index + 1 }}
        </div>
        <div flex-1>
          <span v-if="it.answer.trim() === '' || it.keywords.length === 0" text="sm red">*问题不完整，保存时将自动删除</span>
        </div>
        <div i-ri-delete-bin-line icon-btn @click="deleteFaq(index)" />
      </div>
      <div flex space-x-2 items-center>
        <div>关键词语</div>
        <div
          rounded
          flex-1
          text-sm
          border="~ zinc-300 dark:zinc-700"
          p="t-1 l-1 r"
        >
          <UTag
            v-for="(kw, jndex) in it.keywords"
            :key="kw"
            m="r-1 b-1"
            :content="kw"
            @close="it.keywords.splice(jndex, 1)"
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
            @keydown.enter="pushKeyWord($event, it)"
          >
        </div>
      </div>
      <div flex space-x-2 items-center>
        <div>自动回复</div>
        <input
          v-model="it.answer"
          m-input rounded flex-1 text-sm
          @input="answerChanged"
        >
        <span text="sm zinc" absolute right-6>
          {{ it.answer.length <= 20 ? `${it.answer.length}/20` : '过长的消息将会分条发送' }}
        </span>
      </div>
    </div>
    <button
      flex space-x-2 items-center justify-center
      py-1
      border="~ rounded dashed zinc-300 dark:zinc-600 hover:#646cff"
      block w-full
      class="hover:text-#646cff"
      transition
      @click="pushFaq"
    >
      <div i-ri-add-line /> 添加
    </button>
  </div>
</template>
