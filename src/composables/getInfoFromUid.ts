import { fetch } from '@tauri-apps/api/http'
import { spaceInfo } from './api'

export default async function (uid: number) {
  const response = await fetch(`${spaceInfo}${uid}`, {
    method: 'GET',
    timeout: 5000,
  })

  return response.data
}
