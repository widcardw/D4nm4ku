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

export type {
  DanmakuProps,
  GiftProps,
}
