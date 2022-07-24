interface DanmakuProps {
  content: string
  uname: string
  color: string
  level: number
  label: string
  perhapsGuard: number
  ts: number
  uid: number
}

interface GiftProps {
  uname: string
  action: string
  num: number
  face: string
  giftName: string
  price: number
  ts: number
}

export type {
  DanmakuProps,
  GiftProps,
}
