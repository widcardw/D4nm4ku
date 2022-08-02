import { fetch } from '@tauri-apps/api/http'

export default async function (roomId: number) {
  const data = (await fetch(`${roomInfo}${roomId}`, {
    method: 'GET',
    timeout: 5000,
  })).data as any

  //   console.log(data, data.data.uid)
  const data2 = await getCardInfo(data.data.uid) as any

  const fansNumber = data2.data.follower

  //   console.log(fansNumber)
  return fansNumber
}
