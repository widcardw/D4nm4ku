<script setup lang="ts">
import Avatar from '~/components/img/Avatar.vue'
import MyImg from '~/components/img/MyImg.vue'
import { useStore } from '~/stores/store'
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
  uid: number
  blindGift: null | {
    blind_gift_config_id: number
    from: number
    gift_action: string
    original_gift_id: string
    original_gift_name: string
  }
  bgColor: string
}>()

const store = useStore()

// // eslint-disable-next-line no-console
// console.log('gift', props.ts, new Date(props.ts))
</script>

<template>
  <div flex w-full space-x-2 :style="{ backgroundColor: bgColor }" text-white p-2 rounded my-2>
    <Avatar w-3rem h-3rem :src="face" :uid="uid" :is-blob="false" />
    <div flex-1>
      <div flex justify-between text-sm>
        <div font-bold>
          {{ uname }}
        </div>
        <div v-if="coinType === 'gold'" text-amber text-sm>
          ￥{{ price * num / 1000 }}
        </div>
      </div>
      <div font-bold text-lg flex justify-between items-center>
        <div>{{ action }} <span :class="{ 'text-amber': coinType === 'gold' }">{{ blindGift?.original_gift_name }}</span> <span>{{ blindGift?.gift_action }}</span> <span :class="{ 'text-amber': coinType === 'gold' }">{{ giftName }}</span> × {{ num }}</div>
      </div>
    </div>
    <div grid grid-rows-2 />
    <MyImg
      :src="(store.giftInfoList.find(x => x.id === giftId) || { webp: '' }).webp"
      err-src="/loading.gif"
      class="w-3rem h-3rem"
    />
  </div>
</template>
