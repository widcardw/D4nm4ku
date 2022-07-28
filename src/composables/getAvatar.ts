import { fetch } from '@tauri-apps/api/http'
import { useStore } from '../stores/store'
import { spaceInfo } from './api'

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

  const response = await fetch(`${spaceInfo}${uid}`, {
    method: 'GET',
    timeout: 5000,
  })
  try {
    const url = `${(response.data as SpaceApiResponse).data.info.face}@72w_72h`
    store.avatarMap.push({ uid, url })
    return url
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
    // eslint-disable-next-line no-console
    console.log(response.data)
  }
}
// https://api.bilibili.com/x/space/app/index?mid=${uid}
// https://api.bilibili.com/x/space/acc/info?mid=${uid}
