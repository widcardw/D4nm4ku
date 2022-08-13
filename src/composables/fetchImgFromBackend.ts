import { appDir, join } from '@tauri-apps/api/path'
import { invoke } from '@tauri-apps/api/tauri'
import { readBinaryFile } from '@tauri-apps/api/fs'

const store = useStore()

async function getAppDir() {
  return await appDir()
}

/**
 * @deprecated
 */
async function processImgUrl(imgUrl: string, uid?: number) {
  let fileName: string

  // 如果是头像，那么就将头像作为文件名存储下来
  if (uid) {
    fileName = `avatar_${uid}`
  }
  // 从 url 截取图片名和路径
  else {
    const splits = imgUrl.split('/')
    fileName = splits.at(splits.length - 1) || `${Date.now()}.jpg`
  }

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

async function getAbsolutePathFromUrl(url: string, fileName: string) {
  const dir = await appDir()
  const absolutePath = await join(dir, 'imgs', fileName)
  const realPath = await invoke('fetch_image', {
    imgUrl: url,
    filePath: absolutePath,
  }) as string
  return realPath
}

async function processImgUrl2(imgUrl: string, uid?: number) {
  let fileName: string
  // 如果是头像
  if (uid) {
    // 文件名
    fileName = `avatar_${uid}`
  }
  else {
    // 从 url 截取图片名和路径
    const splits = imgUrl.split('/')
    fileName = splits[splits.length - 1]
  }

  // 在 store 中查找是否存在该图片
  const found = store.mediaList.find(it => it.fileName === fileName)

  // 找到了直接返回 blob 链接
  if (found) {
    // // eslint-disable-next-line no-console
    // console.log('load image from store')
    return { name: fileName, blob: found.blob }
  }

  // // eslint-disable-next-line no-console
  // console.log('fetch through backend')

  // 调用后端，获取头像绝对路径
  const absolutePath = await getAbsolutePathFromUrl(imgUrl, fileName)

  // 读取头像并转为 blob 链接
  const imgContent = await readBinaryFile(absolutePath)
  const blob = URL.createObjectURL(new Blob([imgContent]))

  // 存入 cache
  store.mediaList.push({ fileName, blob })
  return { name: fileName, blob }
}

export {
  processImgUrl,
  processImgUrl2,
}
