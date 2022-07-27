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

function isDanmakuProps(obj: DanmakuProps | GiftProps | undefined): obj is DanmakuProps {
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
}

function isGiftProps(obj: DanmakuProps | GiftProps | undefined): obj is GiftProps {
  return obj !== undefined && obj.type === 'gift'
}

type PropsType = 'text' | 'gift'

export type {
  DanmakuProps,
  GiftProps,
  PropsType,
}

export {
  isDanmakuProps,
  isGiftProps,
}
