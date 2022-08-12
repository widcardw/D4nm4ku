<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  errSrc?: string
}>(), {
  errSrc: '/noface.gif',
})

const realSrc = ref(props.src)

const onError = () => {
  realSrc.value = props.errSrc
}
</script>

<template>
  <img :loading="errSrc" :src="realSrc" @error="onError">
</template>
