import { defineStore } from 'pinia'
import type { GiftInfo, LiveAreaInfo } from '../composables/types'
import type { Answer } from '~/composables/autoSendMsg'

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
  autoReply: boolean
  readSc: boolean
  readGift: boolean
}

const defaultConfig = {
  showGuardTag: true,
  showAvatar: true,
  showTime: true,
  showSilverGift: false,
  showPopulation: true,
  showGoldGift: true,
  canSendMessage: false,
  textColor: '#000000',
  bgColor: '#ffffff',
  bgOpacity: '128',
  blur: false,
  layout: 'loose',
  autoReply: false,
  readSc: false,
  readGift: false,
} as ConfigProps

interface liveConfig {
  isLive: boolean
  liveAreaList: LiveAreaInfo[]
  liveTitle: string
  addr: string
  code: string
}

export const useStore = defineStore('stores', {
  state: () => ({
    roomId: '',
    giftInfoList: [] as GiftInfo[],
    avatarMap: [] as { uid: number; url: string }[],
    userInfo: {} as UserInfo,
    config: { ...defaultConfig },
    requestBlockedTimes: 0,
    faqs: [] as Answer[],
    settingsSaved: true,
    linked: false,
    liveConfig: {
      isLive: false,
      liveAreaList: [],
      liveTitle: '',
      addr: '',
      code: '',
    } as liveConfig,
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
      this.config = JSON.parse(localStorage.getItem('config') || 'null')
      if (!this.config)
        this.config = { ...defaultConfig }

      return this.config
    },
    getRoomId(): string {
      this.roomId = localStorage.getItem('roomId') || ''
      return this.roomId
    },
    getFaqs(): Answer[] {
      this.faqs = JSON.parse(localStorage.getItem('faqs') || '[]')
      return this.faqs
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
      // trim faqs
      this.faqs = this.faqs.filter(it => it.answer.trim() !== '' && it.keywords.length !== 0)
      localStorage.setItem('faqs', JSON.stringify(this.faqs))
    },
    setRoomId(id: string) {
      localStorage.setItem('roomId', id)
    },
  },
})

export type {
  ConfigProps,
}
