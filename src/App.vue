<script setup lang="ts">
import { ref } from 'vue'
import DarkMode from './components/DarkMode.vue'
import SideBar from './components/SideBar.vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
  <div flex>
    <SideBar />
    <RouterView />
  </div>
</template>
