import { ResponseType, fetch } from '@tauri-apps/api/http'
import { BaseDirectory, writeBinaryFile } from '@tauri-apps/api/fs'
import { appDir } from '@tauri-apps/api/path'

async function imgToUint8Array(img: string) {
  return fetch(img, {
    method: 'GET',
    responseType: ResponseType.Binary,
  })
    .then((res) => {
      return res.data as Array<number>
    })
    .then((array) => {
      const buffer = new Uint8Array(array)
      return buffer
    })
}

function arrayBuffer2DataUrl(buffer: Uint8Array) {
  const blob = new Blob([buffer.buffer], { type: 'image/jpg' })
  const url = URL.createObjectURL(blob)
  return url
}

async function imgToDataUrl(img: string) {
  const arraybuffer = await imgToUint8Array(img)
  const url = arrayBuffer2DataUrl(arraybuffer)
  return url
}

async function writeImg(arraybuffer: Uint8Array, img: string) {
  const splits = img.split('/')
  const fileName = splits.at(splits.length - 1) || `${Date.now()}.jpg`
  await writeBinaryFile(fileName, arraybuffer, { dir: BaseDirectory.App })
}

async function getAppDir() {
  return await appDir()
}

export {
  imgToUint8Array,
  writeImg,
  getAppDir,
  arrayBuffer2DataUrl,
  imgToDataUrl,
}
