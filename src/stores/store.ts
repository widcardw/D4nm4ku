import { defineStore } from 'pinia'
import type { GiftInfo } from '../composables/types'

interface UserInfo {
  oauthKey: string
  mid: number
  mname: string
  expires: number
  bili_jct: string
  sessdata: string
  avatarUrl: string
  lastLogin: number
}

interface ConfigProps {
  showGuardTag: boolean
  showAvatar: boolean
  showTime: boolean
  showSilverGift: boolean
  showGoldGift: boolean
  canSendMessage: boolean
}

export const useStore = defineStore('giftInfoList', {
  state: () => ({
    giftInfoList: [] as GiftInfo[],
    avatarMap: [] as { uid: number; url: string }[],
    userInfo: {} as UserInfo,
    config: {
      showGuardTag: true,
      showAvatar: true,
      showTime: true,
      showSilverGift: false,
      showGoldGift: true,
      canSendMessage: false,
    } as ConfigProps,
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

      // eslint-disable-next-line no-console
      console.log(this.userInfo)
      return this.userInfo
    },
    getConfig(): ConfigProps {
      this.config = JSON.parse(localStorage.getItem('config') || '{}')
      return this.config
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
  },
})

export type {
  ConfigProps,
}
