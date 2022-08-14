import { Body, fetch } from '@tauri-apps/api/http'
import { ref } from 'vue'
import { qrcodeLogin } from './api'
import { getCardInfo } from './getInfoFromUid'
import { useStore } from '~/stores/store'

const store = useStore()

const getUrlParams = (url: string) => {
  const purl = new URL(url)
  const paramsStr = purl.search.slice(1)
  const params = new URLSearchParams(paramsStr)
  return {
    DedeUserID: Number.parseInt(params.get('DedeUserID') || ''),
    DedeUserID__ckMd5: params.get('DedeUserID__ckMd5') || '',
    SESSDATA: params.get('SESSDATA') || '',
    bili_jct: params.get('bili_jct') || '',
    Expires: Number.parseInt(params.get('Expires') || ''),
    sid: params.get('sid') || '',
  }
}

const interval = ref<NodeJS.Timer>()

const clearLoop = () => {
  if (interval.value) {
    clearInterval(interval.value)
    interval.value = undefined
  }
}

function createLoginLoop(oauthKey: string) {
  interval.value = setInterval(async () => {
    const response = await fetch(qrcodeLogin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: Body.form({ oauthKey }),
    })

    const { data: loginResponse, rawHeaders }: {
      data: {
        data: -1 | -2 | -4 | -5 | { url: string }
        message: string
      }
      headers: any
      rawHeaders: {
        'set-cookie': string[]
      }
    } = response as any

    if (typeof loginResponse.data === 'object') {
      clearLoop()
      const params = getUrlParams(loginResponse.data.url)
      const fullUserInfo = await getCardInfo(params.DedeUserID) as any
      store.userInfo = {
        oauthKey,
        mid: params.DedeUserID,
        midmd5: params.DedeUserID__ckMd5,
        bili_jct: params.bili_jct,
        expires: params.Expires,
        sessdata: params.SESSDATA,
        sid: params.sid === '' ? rawHeaders['set-cookie'][0].split(';')[0].split('=')[1] : params.sid,
        mname: fullUserInfo.data.card.name,
        avatarUrl: fullUserInfo.data.card.face,
        lastLogin: new Date().getTime(),
      }
      store.storeUserInfo()
      // console.log(headers, rawHeaders)
    }

    // eslint-disable-next-line no-console
    console.log('待确认', loginResponse)
  }, 5000)
}

export {
  interval,
  createLoginLoop,
  clearLoop,
}
