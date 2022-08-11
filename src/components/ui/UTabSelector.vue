<script setup lang="ts">
const props = defineProps<{
  modelValue: {
    id: number
    info: string
  }
}>()

const emits = defineEmits(['update:modelValue', 'close'])

const selected = useVModel(props, 'modelValue', emits)

const store = useStore()

const currentTab = ref(0)
const currentPage = ref(0)

function tabChanged(i: number) {
  currentTab.value = i
  currentPage.value = 0
}

function select(id: string, area2: string) {
  selected.value = {
    id: parseInt(id),
    info: `${store.liveConfig.liveAreaList[currentTab.value].name} · ${area2}`,
  }
}
</script>

<template>
  <div
    w-40rem h-13rem
    p-6
    fixed
    class="left-1/2 top-1/2 translate--1/2"
    shadow
    bg="white dark:#121212"
  >
    <div
      absolute
      icon-btn
      i-ri-close-line
      right-2 top-2
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
</template>
