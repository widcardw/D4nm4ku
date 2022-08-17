interface DanmakuProps {
  type: 'text'
  content: string
  uname: string
  color: string
  level: number
  label: string
  perhapsGuard: 0 | 1 | 2 | 3
  ts: number
  uid: number
}

function isDanmakuProps(obj: any): obj is DanmakuProps {
  return obj !== undefined && obj.type === 'text'
}

interface GiftProps {
  type: 'gift'
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
}

function isGiftProps(obj: any): obj is GiftProps {
  return obj !== undefined && obj.type === 'gift'
}

type PropsType = 'text' | 'gift'

interface SuperChatProps {
  type: 'superchat'
  uname: string
  content: string
  face: string
  price: number
  ts: number
  uid: number
  bgBottomColor: string
  bgColor: string
  second: number
}

function isSuperChatProps(obj: any): obj is SuperChatProps {
  return obj !== undefined && obj.type === 'superchat'
}

interface GuardBuyProps {
  type: 'guard_buy'
  uname: string
  face: string
  uid: number
  guardLevel: number
  num: number
  price: number
  ts: number
}

function isGuardBuyProps(obj: any): obj is GuardBuyProps {
  return obj !== undefined && obj.type === 'guard_buy'
}

export type {
  DanmakuProps,
  GiftProps,
  PropsType,
  GuardBuyProps,
  SuperChatProps,
}

export {
  isDanmakuProps,
  isGiftProps,
  isSuperChatProps,
  isGuardBuyProps,
}
