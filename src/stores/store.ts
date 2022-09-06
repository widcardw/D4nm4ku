import { defineStore } from 'pinia'
import type { GiftInfo, LiveAreaInfo } from '../composables/types'
import type { Answer } from '~/composables/autoSendMsg'
import { eventEmitter } from '~/composables/eventEmitter'

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
  showGuardTag: number
  showAvatar: boolean
  showTime: boolean
  showSilverGift: boolean
  showGoldGift: boolean
  showPopulation: boolean
  showHighlight: boolean
  showEnter: boolean
  showSubscribe: boolean
  canSendMessage: boolean
  textColor: string
  enableTextShadow: boolean
  textShadowColor: string
  bgColor: string
  bgOpacity: string
  blur: boolean
  layout: 'loose' | 'tight'
  autoReply: boolean
  readSc: boolean
  readGift: boolean
  pushGiftIntoHighlight: boolean
  fontFamily: string
  blackList: number[]
}

const defaultConfig: ConfigProps = {
  blackList: [],
  showGuardTag: 0,
  showAvatar: true,
  showTime: false,
  showSilverGift: false,
  showPopulation: true,
  showGoldGift: true,
  showHighlight: true,
  showEnter: false,
  showSubscribe: true,
  pushGiftIntoHighlight: true,
  canSendMessage: false,
  textColor: '#ffffff',
  enableTextShadow: false,
  textShadowColor: '#000000',
  bgColor: '#000000',
  bgOpacity: '128',
  blur: false,
  layout: 'loose',
  autoReply: false,
  readSc: false,
  readGift: false,
  fontFamily: '',
}

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
    liverId: 0,
    giftInfoList: [] as GiftInfo[],
    userInfo: {} as UserInfo,
    config: Object.assign({ ...defaultConfig }, JSON.parse(localStorage.getItem('config') || 'null')) as ConfigProps,
    requestBlockedTimes: 0,
    faqs: [] as Answer[],
    blackList: [] as number[],
    settingsSaved: true,
    linked: false,
    liveConfig: {
      isLive: false,
      liveAreaList: [],
      liveTitle: '',
      addr: '',
      code: '',
    } as liveConfig,
    mediaList: [] as { fileName: string; blob: string }[],
    configLoaded: false,
    clickThrough: false,
    senderEnabled: false,
    previousCanSend: false,
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
        this.config = { ...defaultConfig }
        return this.config
      }
      if (!this.configLoaded) {
        this.config = Object.assign({ ...defaultConfig }, JSON.parse(localStorage.getItem('config') || 'null'))
        this.configLoaded = true
      }
      // this.config = JSON.parse(localStorage.getItem('config') || 'null')

      // if (!this.config) {
      //   this.config = Object.assign({ ...defaultConfig }, this.config)
      //   localStorage.setItem('config', JSON.stringify(this.config))
      // }

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
      eventEmitter('new-faq', this.faqs)
    },
    removeConfig() {
      localStorage.setItem('config', JSON.stringify(defaultConfig))
      this.config = { ...defaultConfig }
      eventEmitter('reset-config', this.config)
    },
    setRoomId(id: string) {
      localStorage.setItem('roomId', id)
    },
  },
})

export type {
  ConfigProps,
}
