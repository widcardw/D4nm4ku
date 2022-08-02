import { fetch } from '@tauri-apps/api/http'

async function getSpaceInfo(uid: number) {
  const response = await fetch(`${spaceInfo}${uid}`, {
    method: 'GET',
    timeout: 5000,
  })

  return response.data
}

async function getCardInfo(uid: number) {
  const response = await fetch(`${cardInfo}${uid}`, {
    method: 'GET',
    timeout: 5000,
  })

  return response.data
}

export {
  getSpaceInfo,
  getCardInfo,
}
