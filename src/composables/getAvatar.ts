import { getCardInfo, getSpaceInfo } from './getInfoFromUid'
import type { CardInfoResponse, SpaceApiResponse } from './types'
import { useStore } from '~/stores/store'

const store = useStore()

const MAX_REQUEST_BLOCK_TIMES = 10

// https://api.bilibili.com/x/space/app/index?mid=${uid}
// https://api.bilibili.com/x/space/acc/info?mid=${uid}

async function getAvatar2(uid: number) {
  const found = store.mediaList.find(it => it.fileName === `avatar_${uid}`)

  if (found) {
    // // eslint-disable-next-line no-console
    // console.log('load avatar from `getAvatar`', uid)
    return { isBlob: true, url: found.blob }
  }

  if (store.requestBlockedTimes >= MAX_REQUEST_BLOCK_TIMES)
    return { isBlob: false, url: '' }

  // // eslint-disable-next-line no-console
  // console.log('fetch avatar url', uid)

  const responseData = await getCardInfo(uid) as CardInfoResponse
  if (responseData.code === 0) {
    const url = `${responseData.data.card.face}@96w_96h`
    return { url, isBlob: false }
  }

  const responseData2 = await getSpaceInfo(uid) as SpaceApiResponse
  if (responseData2.code === 0) {
    const url = `${responseData2.data.info.face}@96w_96h`
    return { url, isBlob: false }
  }

  store.requestBlockedTimes++

  // eslint-disable-next-line no-console
  console.log(store.requestBlockedTimes)
  if (store.requestBlockedTimes === MAX_REQUEST_BLOCK_TIMES)
    throw new Error('头像获取失败！')

  return { isBlob: false, url: '' }
}

export { getAvatar2 }
