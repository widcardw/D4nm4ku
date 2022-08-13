import { fetch } from '@tauri-apps/api/http'
import type { CardInfoResponse, SpaceApiResponse } from './types'

async function getSpaceInfo(uid: number) {
  const response = await fetch(`${spaceInfo}${uid}`, {
    method: 'GET',
    timeout: 5000,
  })

  return response.data as SpaceApiResponse
}

async function getCardInfo(uid: number) {
  const response = await fetch(`${cardInfo}${uid}`, {
    method: 'GET',
    timeout: 5000,
  })

  return response.data as CardInfoResponse
}

export {
  getSpaceInfo,
  getCardInfo,
}
