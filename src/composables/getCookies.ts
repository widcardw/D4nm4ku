const store = useStore()

export default function getCookies() {
  if (!store.getUserInfo.mid)
    throw new Error('尚未登录！')
  let cookies = ''
  cookies += `sid=${store.getUserInfo.sid}; `
  cookies += `DedeUserID=${store.getUserInfo.mid}; `
  cookies += `DedeUserID__ckMd5=${store.getUserInfo.midmd5}; `
  cookies += `SESSDATA=${store.getUserInfo.sessdata}; `
  cookies += `bili_jct=${store.getUserInfo.bili_jct}`
  return cookies
}
