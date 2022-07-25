import { defineStore } from 'pinia'
import type { GiftInfo } from '../composables/types'

export const useStore = defineStore('giftInfoList', {
  state: () => {
    return {
      giftInfoList: [] as GiftInfo[],
    }
  },
})
