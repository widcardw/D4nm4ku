<script setup lang="ts">
const isChecked = ref(true)
</script>

<template>
  <div>
    <USwitch v-model="isChecked" :disabled="false">
      啊啊啊
    </USwitch>
    <UCheckBox v-model="isChecked">
      必必剥剥
    </UCheckBox>
  </div>
</template>
