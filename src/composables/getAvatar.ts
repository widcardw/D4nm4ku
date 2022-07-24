// useFetch
// import { createFetch, useFetch } from '@vueuse/core'

// const useMyFetch = createFetch({
//   fetchOptions: {
//     mode: 'cors',
//   },
// })

// export default async function (uid: number) {
//   const { data } = await useMyFetch(`https://api.bilibili.com/x/space/app/index?mid=${uid}`).json()
//   console.log(data.value)
//   return (data.value as any).data.info.face
// }

// axios
// import axios from 'axios'
// const BASE_URL = 'https://api.bilibili.com'

// const request = axios.create({
//   baseURL: BASE_URL,
//   timeout: 5000,
// })

// export default async function (uid: number) {
//   const data = (await request.get('/x/space/app/index', {
//     params: { mid: uid },
//   })).data
//   console.log(data)
//   return ''
// }

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
  return (response.data as SpaceApiResponse).data.info.face
}
