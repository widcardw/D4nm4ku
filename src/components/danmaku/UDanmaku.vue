<script setup lang="ts">
import { guardType } from '~/composables/data'
import UGuardTag from '~/components/danmaku/UGuardTag.vue'
import Avatar from '~/components/img/Avatar.vue'

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
  layout?: 'loose' | 'tight'
}>(), {
  showAvatar: true,
  showGuardTag: true,
  showTime: true,
  layout: 'loose',
})

const faceUrl = ref('')

const msgRef = inject('msgRef') as any

if (props.showAvatar) {
// 异步获取头像的链接，默认为 noface，当加载出来后替换为真实头像
  getAvatar(props.uid)
    .then((url) => {
      faceUrl.value = url
    })
    .catch(() => {
      msgRef.value.pushMsg({ content: '头像获取失败', type: 'error' })
    })
}
</script>

<template>
  <div v-if="layout === 'loose'" flex space-x-2 w-full p="x-2 y-1" my-2>
    <!-- 头像 -->
    <Avatar v-if="showAvatar" w-3rem h-3rem :src="faceUrl" />
    <div flex-1>
      <div flex justify-between text-sm>
        <div flex space-x-2>
          <!-- 用户名 -->
          <div leading-normal font-bold of-x-hidden wsn :style="{ color }">
            {{ uname }}
          </div>
          <!-- 等级标签 -->
          <UGuardTag v-if="level && showGuardTag" :level="level" :label="label" :perhaps-guard="perhapsGuard" />
          <img v-if="perhapsGuard !== 0 && level >= 20" self-center :src="guardType[perhapsGuard].badge" class="w-1.25rem h-1.25rem" mx-1 rounded-full>
        </div>
        <!-- 弹幕发送时间 -->
        <div v-if="showTime" wsn ml-2>
          {{ new Date(ts).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }) }}
        </div>
      </div>
      <!-- 弹幕内容，初步断定为以 http 开头的是链接，采用 img 渲染 -->
      <div text-lg>
        <img v-if="content.startsWith('http://')" class="h-2rem" :src="content" loading="/loading.gif">
        <span v-else>{{ content }}</span>
      </div>
    </div>
  </div>
  <div v-else flex space-x-2 w-full p="x-2 y-1">
    <Avatar v-if="showAvatar" :src="faceUrl" class="w-1.5rem h-1.5rem" />
    <div space-x-1 overflow-ellipsis>
      <span v-if="showTime" wsn text-sm op-50>
        {{ new Date(ts).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }) }}
      </span>
      <span leading-normal font-bold wsn text-sm op-70 :style="{ color }">
        {{ uname }}
      </span>
      <img v-if="perhapsGuard !== 0 && level >= 20" inline-flex w-1rem h-1rem :src="guardType[perhapsGuard].badge" class="w-1.25rem h-1.25rem" rounded-full>
      <img v-if="content.startsWith('http://')" class="h-1.5rem" :src="content" loading="/loading.gif" inline-flex>
      <span v-else>{{ content }}</span>
    </div>
  </div>
</template>
