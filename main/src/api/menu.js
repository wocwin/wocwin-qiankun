import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/portal-user/getRouters',
    method: 'get',
    params: {
      menuId: 1
    }
  })
}


