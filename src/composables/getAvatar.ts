import { useStore } from '../stores/store'
import getInfoFromUid from './getInfoFromUid'

const store = useStore()

interface SpaceApiResponse {
  data: {
    info: {
      face: string
    }
  }
}

export default async function (uid: number) {
  const preload = store.avatarMap.find(x => x.uid === uid)
  if (preload) {
    // // eslint-disable-next-line no-console
    // console.log('Load url from cache')
    return preload.url
  }

  const responseData = await getInfoFromUid(uid)
  try {
    const url = `${(responseData as SpaceApiResponse).data.info.face}@96w_96h`
    store.avatarMap.push({ uid, url })
    return url
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
    // eslint-disable-next-line no-console
    console.log(responseData)
  }
}
// https://api.bilibili.com/x/space/app/index?mid=${uid}
// https://api.bilibili.com/x/space/acc/info?mid=${uid}
