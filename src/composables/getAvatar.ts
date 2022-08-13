import type { CardInfoResponse, SpaceApiResponse } from './types'

const store = useStore()

const MAX_REQUEST_BLOCK_TIMES = 10

/**
 * @deprecated
 */
export default async function (uid: number) {
  const preload = store.avatarMap.find(x => x.uid === uid)
  if (preload) {
    // // eslint-disable-next-line no-console
    // console.log('Load avatar from cache')
    return preload.url
  }

  if (store.requestBlockedTimes >= MAX_REQUEST_BLOCK_TIMES)
    return ''

  const responseData = await getCardInfo(uid) as CardInfoResponse

  if (responseData.code === 0) {
    const url = `${responseData.data.card.face}@96w_96h`
    store.avatarMap.push({ uid, url })
    return url
  }

  const responseData2 = await getSpaceInfo(uid) as SpaceApiResponse

  if (responseData2.code === 0) {
    const url = `${responseData2.data.info.face}@96w_96h`
    store.avatarMap.push({ uid, url })
    return url
  }

  // // eslint-disable-next-line no-console
  // console.log(responseData)
  store.requestBlockedTimes++
  // eslint-disable-next-line no-console
  console.log(store.requestBlockedTimes)
  if (store.requestBlockedTimes === MAX_REQUEST_BLOCK_TIMES)
    throw new Error('头像获取失败！')

  return ''
}
// https://api.bilibili.com/x/space/app/index?mid=${uid}
// https://api.bilibili.com/x/space/acc/info?mid=${uid}

async function getAvatar2(uid: number): Promise<string> {
  if (store.requestBlockedTimes >= MAX_REQUEST_BLOCK_TIMES)
    return ''

  const responseData = await getCardInfo(uid) as CardInfoResponse
  if (responseData.code === 0) {
    const url = `${responseData.data.card.face}@96w_96h`
    return url
  }

  const responseData2 = await getSpaceInfo(uid) as SpaceApiResponse
  if (responseData2.code === 0) {
    const url = `${responseData2.data.info.face}@96w_96h`
    return url
  }

  store.requestBlockedTimes++

  // eslint-disable-next-line no-console
  console.log(store.requestBlockedTimes)
  if (store.requestBlockedTimes === MAX_REQUEST_BLOCK_TIMES)
    throw new Error('头像获取失败！')

  return ''
}

export { getAvatar2 }
