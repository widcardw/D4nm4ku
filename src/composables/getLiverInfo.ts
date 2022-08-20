import { fetch } from '@tauri-apps/api/http'
import { roomInfo } from './api'
import { getCardInfo, getSpaceInfo } from './getInfoFromUid'
import { useStore } from '~/stores/store'

const store = useStore()

async function getLiverInfo(roomId: number) {
  const data = (await fetch(`${roomInfo}${roomId}`, {
    method: 'GET',
    timeout: 5000,
  })).data as any

  //   console.log(data, data.data.uid)
  store.liverId = data.data.uid
  const data2 = await getCardInfo(data.data.uid) as any

  if (data2.code !== 0)
    throw new Error('主播信息获取失败！')

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
