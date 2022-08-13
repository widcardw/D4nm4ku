import { appDir, join } from '@tauri-apps/api/path'
import { invoke } from '@tauri-apps/api/tauri'
import { readBinaryFile } from '@tauri-apps/api/fs'

const store = useStore()

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
    // console.log('load image from store', fileName)
    return { name: fileName, blob: found.blob }
  }

  // // eslint-disable-next-line no-console
  // console.log('fetch through backend', fileName)

  // 调用后端，获取头像绝对路径
  const absolutePath = await getAbsolutePathFromUrl(imgUrl, fileName)

  // 读取头像并转为 blob 链接
  const imgContent = await readBinaryFile(absolutePath)
  const blob = URL.createObjectURL(new Blob([imgContent.buffer]))

  // const blob = convertFileSrc(absolutePath)

  // 存入 cache
  if (!store.mediaList.find(it => it.fileName === fileName))
    store.mediaList.push({ fileName, blob })

  return { name: fileName, blob }
}

export {
  processImgUrl2,
}
