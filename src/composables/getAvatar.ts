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

const MAX_REQUEST_BLOCK_TIMES = 10

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
    throw new Error('Failed to fetch avatar!')

  return ''
}
// https://api.bilibili.com/x/space/app/index?mid=${uid}
// https://api.bilibili.com/x/space/acc/info?mid=${uid}
