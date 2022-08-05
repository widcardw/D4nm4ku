import { defineStore } from 'pinia'
import type { GiftInfo } from '../composables/types'

interface UserInfo {
  oauthKey: string
  mid: number
  midmd5: string
  mname: string
  expires: number
  bili_jct: string
  sessdata: string
  avatarUrl: string
  lastLogin: number
  sid: string
}

interface ConfigProps {
  showGuardTag: boolean
  showAvatar: boolean
  showTime: boolean
  showSilverGift: boolean
  showGoldGift: boolean
  showPopulation: boolean
  canSendMessage: boolean
  textColor: string
  bgColor: string
  bgOpacity: string
  blur: boolean
  layout: 'loose' | 'tight'
}

export const useStore = defineStore('stores', {
  state: () => ({
    roomId: '',
    giftInfoList: [] as GiftInfo[],
    avatarMap: [] as { uid: number; url: string }[],
    userInfo: {} as UserInfo,
    config: {
      showGuardTag: true,
      showAvatar: true,
      showTime: true,
      showSilverGift: false,
      showPopulation: true,
      showGoldGift: true,
      canSendMessage: false,
      textColor: '#000000',
      bgColor: '#ffffff',
      bgOpacity: '255',
      blur: false,
      layout: 'loose',
    } as ConfigProps,
    requestBlockedTimes: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      // 登录过期
      if (this.userInfo.lastLogin + this.userInfo.expires * 1000 < new Date().getTime()) {
        localStorage.removeItem('userInfo')
        this.userInfo = {} as UserInfo
        throw new Error('需要重新登录')
      }
      if (!this.userInfo.mid)
        this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

      // // eslint-disable-next-line no-console
      // console.log(this.userInfo)
      return this.userInfo
    },
    getConfig(): ConfigProps {
      this.config = JSON.parse(localStorage.getItem('config') || '{}')
      return this.config
    },
    getRoomId(): string {
      this.roomId = localStorage.getItem('roomId') || ''
      return this.roomId
    },
  },
  actions: {
    storeUserInfo() {
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    },
    removeUserInfo() {
      localStorage.removeItem('userInfo')
      this.userInfo = {} as UserInfo
    },
    storeConfig() {
      localStorage.setItem('config', JSON.stringify(this.config))
    },
    setRoomId(id: string) {
      localStorage.setItem('roomId', id)
    },
  },
})

export type {
  ConfigProps,
}
