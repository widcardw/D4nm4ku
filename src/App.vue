<script setup lang="ts">
import { ref } from 'vue'
import DarkMode from './components/DarkMode.vue'
import UCheckBox from './components/ui/UCheckBox.vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
const isChecked = ref(false)
</script>

<template>
  <button class="btn">
    Some text
  </button>
  <DarkMode />
</template>
