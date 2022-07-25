import { fetch } from '@tauri-apps/api/http'

interface SpaceApiResponse {
  data: {
    info: {
      face: string
    }
  }
}

export default async function (uid: number) {
  const response = await fetch(`https://api.bilibili.com/x/space/app/index?mid=${uid}`, {
    method: 'GET',
    timeout: 5000,
  })
  try {
    return (response.data as SpaceApiResponse).data.info.face
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
