import { fetch } from '@tauri-apps/api/http'

export default async function (roomId: number) {
  const data = (await fetch(`https://api.live.bilibili.com/room/v1/Room/get_info?id=${roomId}`, {
    method: 'GET',
    timeout: 5000,
  })).data as any

  //   console.log(data, data.data.uid)
  const data2 = (await fetch(`https://api.bilibili.com/x/space/app/index?mid=${data.data.uid}`, {
    method: 'GET',
    timeout: 5000,
  })).data as any

  const fansNumber = data2.data.info.follower

  //   console.log(fansNumber)
  return fansNumber
}
