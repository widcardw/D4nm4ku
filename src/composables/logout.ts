import { Body, fetch } from '@tauri-apps/api/http'
import getCookies from './getCookies'
import { logOutApi } from './api'

const store = useStore()

const cookies = getCookies()

const form = Body.form({
  biliCSRF: store.getUserInfo.bili_jct,
})

export default async function logout() {
  const response = await fetch(logOutApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'cookie': cookies,
    },
    body: form,
  })

  // eslint-disable-next-line no-console
  console.log(response.data)

  return response.data
}
