import { fetch } from '@tauri-apps/api/http'
import { shortIdToLongApi } from './api'

async function shortToLongResponse(id: number) {
  const response = (await fetch(`${shortIdToLongApi}${id}`)).data as any
  return response
}

async function shortToLong(id: number) {
  const response = await shortToLongResponse(id)
  return response.data.room_id as number | undefined
}

export {
  shortToLong,
}
