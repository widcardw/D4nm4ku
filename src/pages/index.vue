<script setup lang="ts">
import { ref } from 'vue'
import USwitch from '~/components/ui/USwitch.vue'
import UCheckBox from '~/components/ui/UCheckBox.vue'

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
