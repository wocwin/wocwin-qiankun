import stompClient from './stompClient'
import bus from './bus'

const Notification = () => {
  const callback = (data) => {
    bus.$emit('onNotice', data)
  }

  const onLogout = (data) => {
    bus.$emit('onLogout', data)
  }

  stompClient({
    url: '/portal-user/ws',
    timeout: -1,
    subscribe: {
      '/user/queue/notice': callback,
      '/topic/notice': callback,
      '/user/queue/logout': onLogout
    }
  })
}

export default Notification
