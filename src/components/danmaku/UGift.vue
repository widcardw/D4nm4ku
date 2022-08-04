<script setup lang="ts">
import Avatar from '~/components/img/Avatar.vue'
import MyImg from '~/components/img/MyImg.vue'
defineProps<{
  uname: string
  action: string
  num: number
  face: string
  coinType: 'gold' | 'silver'
  giftId: number
  giftName: string
  price: number
  ts: number
}>()

const store = useStore()

// // eslint-disable-next-line no-console
// console.log('gift', props.ts, new Date(props.ts))
</script>

<template>
  <div flex w-full space-x-2 bg-blue-800 text-white p-2 rounded my-2>
    <Avatar w-3rem h-3rem :src="face" />
    <div flex-1>
      <div flex justify-between text-sm font-bold wsn>
        {{ uname }}
      </div>
      <div font-bold text-lg wsn>
        {{ action }} <span :class="{ 'text-amber': coinType === 'gold' }">{{ giftName }}</span> × {{ num }}
      </div>
    </div>
    <MyImg
      :src="(store.giftInfoList.find(x => x.id === giftId) || { webp: '' }).webp" class="w-3rem h-3rem"
    />
    <div v-if="store.getConfig.showTime" text-sm wsn>
      {{ new Date(ts * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }) }}
    </div>
  </div>
</template>
