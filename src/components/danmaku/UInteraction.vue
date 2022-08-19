<script setup lang="ts">
import { inject, ref } from 'vue'
import { getAvatar2 } from '../../composables/getAvatar'
import { useStore } from '../../stores/store'
import Avatar from '../img/Avatar.vue'

const props = defineProps<{
  type: 'interact'
  uname: string
  uid: number
  unameColor: string
  ts: number
  action: 1 | 2
}>()

const store = useStore()
const faceUrl = ref('')
const urlIsBlob = ref(false)
const msgRef = inject('msgRef') as any

if (store.getConfig.showAvatar) {
  getAvatar2(props.uid)
    .then(({ url, isBlob }) => {
      faceUrl.value = url
      urlIsBlob.value = isBlob
    })
    .catch((err: Error) => {
      msgRef.value.pushMsg({ content: err.message, type: 'error' })
    })
}
</script>

<template>
  <div w-full flex space-x-2 p="x-2 y-1">
    <Avatar v-if="store.getConfig.showAvatar" class="w-1.5rem h-1.5rem" :src="faceUrl" :is-blob="urlIsBlob" :uid="uid" />
    <div space-x-1>
      <span leading-normal text-sm op-70 font-bold :style="{ color: unameColor }">
        {{ uname }}
      </span>
      <span leading-normal :style="{ color: action === 1 ? '' : 'gold' }">{{ action === 1 ? '进入了直播间' : '关注了主播' }}</span>
    </div>
  </div>
</template>
