<script setup lang="ts">
import { ref } from 'vue'
import type { DanmakuProps } from '../../composables/components'
import { guardType } from '../../composables/data'
import UGuardTag from '../ui/UGuardTag.vue'
import getAvatar from '../../composables/getAvatar'
import Avatar from '../Avatar.vue'

interface Props extends DanmakuProps {}

const props = withDefaults(defineProps<{
  content: string
  uname: string
  color: string
  level: number
  label: string
  perhapsGuard: 0 | 1 | 2 | 3
  ts: number
  uid: number
  showAvatar?: boolean
  showGuardTag?: boolean
  showTime?: boolean
}>(), {
  showAvatar: true,
  showGuardTag: true,
  showTime: true,
})

const faceUrl = ref('')
getAvatar(props.uid).then((url: string | undefined) => {
  faceUrl.value = url ?? ''
})

// // eslint-disable-next-line no-console
// console.log('danmaku', props.ts, new Date(props.ts))
</script>

<template>
  <div flex space-x-2 w-full p-2 my-2>
    <!-- 头像 -->
    <Avatar v-if="showAvatar" :src="faceUrl" />
    <div flex-1>
      <div flex justify-between text-sm>
        <div flex space-x-2>
          <!-- 用户名 -->
          <div leading-normal font-bold overflow-x-hidden wsn :style="{ color }">
            {{ uname }}
          </div>
          <!-- 等级标签 -->
          <UGuardTag v-if="level && showGuardTag" :level="level" :label="label" :perhaps-guard="perhapsGuard" />
          <img v-if="perhapsGuard !== 0 && level >= 20" self-center :src="guardType[perhapsGuard].badge" class="w-1.25rem h-1.25rem" mx-1 rounded-full>
        </div>
        <!-- 时间 -->
        <div v-if="showTime" wsn ml-2>
          {{ new Date(ts).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }) }}
        </div>
      </div>
      <!-- 弹幕内容 -->
      <div text-lg>
        <img v-if="content.startsWith('http://')" class="h-2rem" :src="content">
        <span v-else>{{ content }}</span>
      </div>
    </div>
  </div>
</template>
