import { appDir, join } from '@tauri-apps/api/path'
import { invoke } from '@tauri-apps/api/tauri'

const store = useStore()

async function getAppDir() {
  return await appDir()
}

async function processImgUrl(imgUrl: string) {
  // 从 url 截取图片名和路径
  const splits = imgUrl.split('/')
  const fileName = splits.at(splits.length - 1) || `${Date.now()}.jpg`
  const dir = await getAppDir()
  const filePath = await join(dir, 'imgs', fileName)

  // 检查 store 中是否存在该图片，如果存在则直接返回
  if (store.existMedia.has(fileName))
    return filePath

  // 如果不存在，则调用后端，下载图片
  const realPath = await invoke('fetch_image', {
    imgUrl,
    filePath,
  }) as string

  // 将图片信息添加到 store 中
  store.existMedia.add(fileName)

  return realPath
}

export {
  processImgUrl,
}
