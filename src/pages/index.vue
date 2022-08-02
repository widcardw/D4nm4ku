<script setup lang="ts">
const isChecked = ref(true)
const fruit = ref('banana')
</script>

<template>
  <div>
    <USwitch v-model="isChecked" :disabled="false">
      啊啊啊
    </USwitch>
    <UCheckBox v-model="isChecked">
      必必剥剥
    </UCheckBox>
    <div>
      <URadio v-model="fruit" value="apple" name="fruit">
        苹果
      </URadio>
      <URadio v-model="fruit" value="banana" name="fruit">
        香蕉
      </URadio>
      <URadio v-model="fruit" value="orange" name="fruit">
        橘子
      </URadio>
    </div>
  </div>
</template>
