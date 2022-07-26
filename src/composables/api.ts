const spaceInfo = 'https://api.bilibili.com/x/space/app/index?mid='
const cardInfo = 'http://api.bilibili.com/x/web-interface/card?mid='
const giftInfo = 'https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftConfig?platform=pc&room_id='
const roomInfo = 'https://api.live.bilibili.com/room/v1/Room/get_info?id='
const qrcodeGet = 'http://passport.bilibili.com/qrcode/getLoginUrl'
const qrcodeLogin = 'http://passport.bilibili.com/qrcode/getLoginInfo'
const danmakuSend = 'https://api.live.bilibili.com/msg/send'
const logOutApi = 'http://passport.bilibili.com/login/exit/v2'
const liveAreaInfoListApi = 'http://api.live.bilibili.com/room/v1/Area/getList'
const startLiveApi = 'http://api.live.bilibili.com/room/v1/Room/startLive'
const stopLiveApi = 'http://api.live.bilibili.com/room/v1/Room/stopLive'
const updateLiveTitleApi = 'http://api.live.bilibili.com/room/v1/Room/update'
const shortIdToLongApi = 'https://api.live.bilibili.com/room/v1/Room/mobileRoomInit?id='
const getRoomInfoOldApi = 'https://api.live.bilibili.com/room/v1/Room/getRoomInfoOld?mid='

export {
  spaceInfo,
  giftInfo,
  roomInfo,
  qrcodeGet,
  qrcodeLogin,
  cardInfo,
  danmakuSend,
  logOutApi,
  liveAreaInfoListApi,
  stopLiveApi,
  startLiveApi,
  updateLiveTitleApi,
  shortIdToLongApi,
  getRoomInfoOldApi,
}
