<script setup lang="ts">
import SideBar from '~/components/SideBar.vue'
</script>

<template>
  <div class="use-dark">
    <SideBar />
    <div ml-2rem flex-1>
      <RouterView />
    </div>
  </div>
</template>
