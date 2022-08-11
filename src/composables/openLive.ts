import { Body, fetch } from '@tauri-apps/api/http'
import { liveAreaInfoListApi, startLiveApi, stopLiveApi, updateLiveTitleApi } from './api'
import type { LiveAreaInfo, StartLiveResponse } from './types'
import { useStore } from '~/stores/store'

const store = useStore()
const seletcedArea = useStorage('seletcedArea', '')
const cookie = getCookies()

async function getAreaInfoList() {
  if (store.liveConfig.liveAreaList.length > 0)
    return

  const { data } = await fetch(liveAreaInfoListApi)
  store.liveConfig.liveAreaList = (data as any).data as LiveAreaInfo[]
}

async function updateLiveTitle(roomId: string, title: string) {
  const { data } = await fetch(updateLiveTitleApi, {
    method: 'POST',
    headers: {
      cookie,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: Body.form({
      room_id: roomId,
      title,
      csrf: store.getUserInfo.bili_jct,
    }),
  }) as any
  if (data.code !== 0)
    throw new Error('标题更新失败')
}

async function startLive(roomId: string, area_v2: number, platform: string) {
  const { data }: { data: StartLiveResponse } = await fetch(startLiveApi, {
    method: 'POST',
    headers: {
      cookie,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: Body.form({
      room_id: roomId,
      area_v2: area_v2.toString(),
      platform,
      csrf: store.getUserInfo.bili_jct,
    }),
  })

  // // eslint-disable-next-line no-console
  // console.log(data)

  if (data.code === 0) {
    // eslint-disable-next-line no-console
    console.log('直播开启成功')
    return data.data.rtmp
  }
  else {
    throw new Error(data.msg)
  }
}

async function stopLive(roomId: string) {
  const { data }: { data: { code: number; msg: string } } = await fetch(stopLiveApi, {
    method: 'POST',
    headers: {
      cookie,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: Body.form({
      room_id: roomId,
      csrf: store.getUserInfo.bili_jct,
    }),
  })

  // // eslint-disable-next-line no-console
  // console.log(data)

  if (data.code === 0) {
    // eslint-disable-next-line no-console
    console.log('直播关闭成功')
  }
  else {
    throw new Error(data.msg)
  }
}

export {
  getAreaInfoList,
  updateLiveTitle,
  seletcedArea,
  startLive,
  stopLive,
}
