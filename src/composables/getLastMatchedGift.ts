import type { GiftProps } from '~/composables/components'

const getLastMatchedGift = (
  danmakuPool: Array<any>,
  uname: string,
  giftId: number,
  ts: number,
  num: number,
): boolean => {
  for (let i = danmakuPool.length - 1; i >= 0; i--) {
    if (danmakuPool[i].type !== 'gift')
      continue
    const item = danmakuPool[i] as GiftProps
    if (item.uname === uname && item.giftId === giftId) {
      const item = danmakuPool.splice(i, 1) as GiftProps[]
      item[0].num += num
      item[0].ts = ts
      danmakuPool.push(item[0])
      return true
    }
  }
  return false
}

export default getLastMatchedGift
