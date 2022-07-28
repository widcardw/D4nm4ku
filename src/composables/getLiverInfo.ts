import { fetch } from '@tauri-apps/api/http'
import { roomInfo, spaceInfo } from './api'

export default async function (roomId: number) {
  const data = (await fetch(`${roomInfo}${roomId}`, {
    method: 'GET',
    timeout: 5000,
  })).data as any

  //   console.log(data, data.data.uid)
  const data2 = (await fetch(`${spaceInfo}${data.data.uid}`, {
    method: 'GET',
    timeout: 5000,
  })).data as any

  const fansNumber = data2.data.info.follower

  //   console.log(fansNumber)
  return fansNumber
}
