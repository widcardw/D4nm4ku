import { fetch } from '@tauri-apps/api/http'

async function getLiverInfo(roomId: number) {
  const data = (await fetch(`${roomInfo}${roomId}`, {
    method: 'GET',
    timeout: 5000,
  })).data as any

  //   console.log(data, data.data.uid)
  const data2 = await getCardInfo(data.data.uid) as any

  const fansNumber = data2.data.follower

  //   console.log(fansNumber)
  return fansNumber as number
}

async function getLiveRoomInfoFromUid(uid: number) {
  const spaceData = await getSpaceInfo(uid)
  return {
    roomid: spaceData.data.info.live.roomid,
    title: spaceData.data.info.live.title,
  }
}

export {
  getLiverInfo,
  getLiveRoomInfoFromUid,
}
