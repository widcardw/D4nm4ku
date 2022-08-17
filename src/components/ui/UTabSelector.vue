<script setup lang="ts">
import { onClickOutside, useVModels } from '@vueuse/core'
import { ref } from 'vue'
import { useStore } from '~/stores/store'

const props = defineProps<{
  id: number
  info: string
}>()

const emits = defineEmits(['update:id', 'update:info', 'close'])

const { id, info } = useVModels(props, emits)

const store = useStore()

const currentTab = ref(0)
const currentPage = ref(0)
const dialog = ref<HTMLElement>()

function tabChanged(i: number) {
  currentTab.value = i
  currentPage.value = 0
}

function select(id2: string, area2: string) {
  id.value = parseInt(id2)
  info.value = `${store.liveConfig.liveAreaList[currentTab.value].name} · ${area2}`
}

onClickOutside(dialog, () => {
  emits('close')
})
</script>

<template>
  <div
    fixed
    left-0 top-0 bottom-0 right-0
    flex items-center justify-center
    bg="white/80 dark:black/60"
  >
    <div
      ref="dialog" w-40rem
      h-13rem
      p-6
      shadow absolute
      bg="white dark:#242424"
    >
      <div
        icon-btn absolute top-2 right-2
        i-ri-close-line
        @click="emits('close')"
      />
      <div flex justify-between>
        <button
          v-for="(it, i) in store.liveConfig.liveAreaList"
          :key="it.id"
          :class="{
            'text-#646cff': currentTab === i,
          }"
          icon-btn m="x-2 y-1"
          @click="tabChanged(i)"
        >
          {{ it.name }}
        </button>
      </div>
      <div grid grid-cols-5 text-center place-items-center>
        <button
          v-for="jt in store.liveConfig.liveAreaList[currentTab].list.slice(currentPage * 20, currentPage * 20 + 20)"
          :key="jt.id"
          :title="jt.name"
          icon-btn
          truncate px-4
          w-7rem mb-1
          border="~ zinc-300 dark:zinc-700"
          rounded-full
          @click="select(jt.id, jt.name)"
        >
          {{ jt.name }}
        </button>
      </div>
      <div v-if="store.liveConfig.liveAreaList[currentTab].list.length > 20" flex justify-center>
        <button
          v-for="j in Math.ceil(store.liveConfig.liveAreaList[currentTab].list.length / 20)" :key="j"
          icon-btn
          :class="{ 'text-#646cff': currentPage === j - 1 }"
          m="x-2 y-1"
          @click="currentPage = j - 1"
        >
          {{ j }}
        </button>
      </div>
    </div>
  </div>
</template>
