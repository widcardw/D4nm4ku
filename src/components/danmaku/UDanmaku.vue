<script setup lang="ts">
import { ref } from 'vue'
import type { DanmakuProps } from '../../composables/components'
import UGuardTag from '../ui/UGuardTag.vue'
import getAvatar from '../../composables/getAvatar'
import MyImg from '../img/MyImg.vue'

interface Props extends DanmakuProps {}

const props = withDefaults(defineProps<{
  content: string
  uname: string
  color: string
  level: number
  label: string
  perhapsGuard: number
  ts: number
  uid: number
  showAvatar?: boolean
  showGuardTag?: boolean
}>(), {

  showAvatar: true,
  showGuardTag: true,
})

const faceUrl = ref('')
getAvatar(props.uid).then((url: string) => {
  faceUrl.value = url
})
</script>

<template>
  <div flex space-x-2>
    <MyImg v-if="showAvatar" :src="faceUrl" />
    <div>
      <div flex space-x-2>
        <div leading-normal font-bold :style="{ color }">
          {{ uname }}
        </div>
        <UGuardTag v-if="level && showGuardTag" :level="level" :label="label" :perhaps-guard="perhapsGuard" />
      </div>
      <div leading-normal>
        {{ content }}
      </div>
    </div>
  </div>
</template>
