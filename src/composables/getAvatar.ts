import { useStore } from '../stores/store'
import {
  getCardInfo,
  getSpaceInfo,
} from './getInfoFromUid'

const store = useStore()

interface SpaceApiResponse {
  code: number
  data: {
    info: {
      face: string
    }
  }
}

interface CardInfoResponse {
  code: number
  data: {
    card: {
      face: string
    }
  }
}

export default async function (uid: number) {
  const preload = store.avatarMap.find(x => x.uid === uid)
  if (preload) {
    // eslint-disable-next-line no-console
    console.log('Load avatar from cache')
    return preload.url
  }

  if (store.requestBlockedTimes >= 10)
    return ''

  const responseData = await getCardInfo(uid) as CardInfoResponse

  if (responseData.code === 0) {
    const url = `${responseData.data.card.face}@96w_96h`
    store.avatarMap.push({ uid, url })
    return url
  }

  const responseData2 = await getSpaceInfo(uid) as SpaceApiResponse
  if (responseData2.code === 0) {
    const url = `${responseData.data.card.face}@96w_96h`
    store.avatarMap.push({ uid, url })
    return url
  }
  // eslint-disable-next-line no-console
  console.log(responseData)
  store.requestBlockedTimes++
  // eslint-disable-next-line no-console
  console.log(store.requestBlockedTimes)
  return ''
}
// https://api.bilibili.com/x/space/app/index?mid=${uid}
// https://api.bilibili.com/x/space/acc/info?mid=${uid}
