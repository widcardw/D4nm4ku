<script setup lang="ts">
import SideBar from '~/components/SideBar.vue'
</script>

<template>
  <SideBar />
  <div ml-2rem flex-1>
    <RouterView />
  </div>
</template>
