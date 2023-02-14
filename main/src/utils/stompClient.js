
import SockJS from "sockjs-client"
import Stomp from "stompjs"
import moment from 'moment'
import store from '@/store'
import { getToken } from "@/utils/auth"
import { Notification } from 'element-ui'

const BASE_URL = process.env.VUE_APP_BASE_API
const { v4: uuidv4 } = require('uuid')

function stompCodeFilter (code) {
  switch (code) {
    case 'NOTICE':
      return '通知'
    case 'ANNOUNCE':
      return '公告'
    case 'PROFILE_CHANGED_LOGOUT':
      return '用户信息被修改，请重新登录。'
    case 'EXCLUDED_LOGOUT':
      return '账号在其他设备登录'
    default:
      return '通知'
  }
}

export default ({
  url = '',
  timeout = 10000,
  ws = false,
  subscribe = {},
  onConnect = () => { },
  onReconect = () => { },
  onDisconnect = () => { }
}) => {
  const fullUrl = url.indexOf('://') === -1 ? BASE_URL + url : url // 完整ws链接
  let reconectTimer = 0
  let reconnectTime = 5000 // 重连的时间
  let reconnectNum = 0 // 记录重连次数
  let stompClient = null
  let lastUpdateTime = moment() // 记录最后获取消息时间，配置重连
  let listenerUpdateTimer = 0
  let sendMessageTimer = 0

  function getConnecTarget () { // 获取socket
    if (ws) {
      return new WebSocket(BASE_URL.replace('http://', 'ws://') + url)
    } else {
      return new SockJS(fullUrl, null, { timeout })
    }
  }
  function connection (isreconect = false) { // 建立连接
    const socket = getConnecTarget()
    stompClient = Stomp.over(socket)
    if (stompClient !== null && !stompClient.connected) {
      let sessionId = uuidv4()
      store.dispatch('setSessionId', sessionId)
      stompClient.connect(
        {
          Authorization: getToken(),
          SessionId: sessionId
        },
        () => {
          // 重连配置恢复默认值
          reconnectTime = 5000
          reconnectNum = 0
          // 订阅服务
          Object.keys(subscribe).map(subUrl => {
            stompClient.subscribe(subUrl, (msg) => {
              const res = msg.body && JSON.parse(msg.body)
              console.log('msg.body', res)
              if (res.type === 1) {
                subscribe[subUrl](res)
              } else {
                Notification.warning({
                  message: stompCodeFilter(res.code),
                  description: res.message
                })
              }
              // 监听所有订阅，设置超时重连
              if (timeout > 0) {
                lastUpdateTime = moment()
                clearTimeout(reconectTimer)
                clearTimeout(listenerUpdateTimer)
                listenerUpdateTimer = setTimeout(() => {
                  if (moment().valueOf() - lastUpdateTime.valueOf() > timeout) {
                    reconnect({
                      message: '订阅消息超时！'
                    })
                  }
                }, timeout)
              }
            })
          })
          // 连接成功回调
          onConnect()
          if (isreconect) {
            console.log('重连成功！')
            onReconect()
          } else {
            console.log('连接成功！')
          }
        },
        (err) => { // 错误处理
          if (!err.command) {
            reconnect({
              message: '无法连接服务！'
            })
          }
        }
      )
    }
    stompClient.debug = (str) => {
      // console.log(str + "\n")
    }
    stompClient.closeConect = () => { // 手动关闭连接
      console.log('断开连接')
      clearTimeout(listenerUpdateTimer) // 清除超时重连监听
      clearTimeout(sendMessageTimer) // 清除定时器
      clearTimeout(reconectTimer) // 清除重连失败定时重启
      stompClient && stompClient.disconnect()
      onDisconnect()
    }
  }
  function reconnect (err) {
    if (reconnectNum < 15) { // 限制重连次数
      stompClient && stompClient.connected && stompClient.closeConect && stompClient.closeConect()
      stompClient = null
      reconnectNum++
      console.log(`连接失败，${reconnectTime / 1000}秒后尝试第${reconnectNum}次重连`, err)
      clearTimeout(reconectTimer)
      reconectTimer = setTimeout(() => {
        console.log(`尝试第${reconnectNum}次重新连接...`)
        connection(true)
      }, reconnectTime)
      reconnectTime += reconnectTime
    } else {
      console.log(`${reconnectNum}次尝试连接失败，放弃重连！`)
    }
  }
  connection()

  stompClient.sendMessage = (url, params = {}) => {
    if (stompClient !== null && stompClient.connected) { // 连接成功
      let sessionId = uuidv4()
      store.dispatch('setSessionId', sessionId)
      stompClient.send(url, {
        Authorization: getToken(),
        SessionId: sessionId
      }, typeof params === 'string' ? params : JSON.stringify(params))
    } else {
      sendMessageTimer = setTimeout(() => {
        stompClient.sendMessage(url, params)
      }, 1000)
    }
  }

  return stompClient
}
