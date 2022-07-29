<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()

const curPage = ref(1)
const routerSwitch = (target: string, page: number) => {
  curPage.value = page
  router.push(target)
}
</script>

<template>
  <div h-100vh flex flex-col fixed class="bg-#7f7f7f10">
    <div
      m-2 icon-btn i-ri-home-line
      :class="{ 'text-#646cff': curPage === 1 }"
      @click="routerSwitch('/', 1)"
    />
    <div
      m-2 icon-btn i-ri-settings-line
      :class="{ 'text-#646cff': curPage === 2 }"
      @click="routerSwitch('/settings', 2)"
    />
    <div
      m-2 icon-btn i-ri-live-line
      :class="{ 'text-#646cff': curPage === 3 }"
      @click="routerSwitch('/danmaku', 3)"
    />
    <DarkMode m-2 absolute bottom-0 />
  </div>
</template>
