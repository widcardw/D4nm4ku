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
  showGuardTag: false,
  showAvatar: true,
  showTime: false,
  showSilverGift: false,
  showPopulation: true,
  showGoldGift: true,
  canSendMessage: false,
  textColor: '#ffffff',
  bgColor: '#000000',
  bgOpacity: '128',
  blur: false,
  layout: 'loose',
  autoReply: false,
  readSc: false,
  readGift: false,
} as ConfigProps

const defaultUserInfo: UserInfo = {
  oauthKey: '',
  mid: 0,
  midmd5: '',
  mname: '',
  expires: 0,
  bili_jct: '',
  sessdata: '',
  avatarUrl: '',
  lastLogin: 0,
  sid: '',

}

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
      if (!localStorage.getItem('userInfo')) {
        localStorage.setItem('userInfo', JSON.stringify(defaultUserInfo))
        return defaultUserInfo
      }
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
      if (!localStorage.getItem('config')) {
        localStorage.setItem('config', JSON.stringify(defaultConfig))
        return defaultConfig
      }
      this.config = JSON.parse(localStorage.getItem('config') || 'null')
      if (!this.config) {
        this.config = { ...defaultConfig }
        localStorage.setItem('config', JSON.stringify(this.config))
      }

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
      this.userInfo = { ...defaultUserInfo }
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
