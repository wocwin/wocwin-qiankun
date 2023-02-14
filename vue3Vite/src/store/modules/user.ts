import piniaPersistConfig from '../piniaPersist'
import { removeToken, setToken, getToken } from '@/utils/cookies'
// import { login, logout, getInfo, getPermBtm } from '@/api/login'
import UserInfoData from './getData/userInfo.json'
import PermBtmData from './getData/permBtmData.json'
import GetTokenData from './getData/token.json'
import { ElMessage } from 'element-plus'
const useUserStore = defineStore('user',{
  state: () => {
    return {
      token: getToken(),
      name: '',
      avatar: '',
      roles: [] as any,
      nickName: '',
      userId: null,
      dept: {},
      permissions: [],
      permBtn: [],
      permCode: [],
    }
  },
  actions: {
    // 登录
    Login(userInfo: any) {
      return new Promise((resolve: any, reject: any) => {
        const res:any = GetTokenData
        // login(userInfo)
        //   .then((res: any) => {
            if (res.success) {
              setToken(res.data)
              this.token = res.data
            } else {
              ElMessage.error(res?.msg)
            }
            resolve()
          })
          // .catch((error: any) => {
          //   reject(error)
          // })
      // })
    },
    // 获取用户信息
    GetInfo() {
      // if (this.token === '') {
      //   throw Error('token is undefined!')
      // }
      // getInfo().then(async (res: any) => {
        const res:any = UserInfoData
        if (res?.success) {
          const user = res.data
          if (user.roles && user.roles.length > 0) {
            // 验证返回的roles是否是一个非空数组
            this.roles = user.roles
          } else {
            this.roles = ['ROLE_DEFAULT']
          }
          this.name = user.userName
          this.nickName = user.nickName
          this.userId = user.userId
          this.dept = user.dept
          return res
        } else {
          throw Error('Verification failed, please Login again.')
        }
      // })
    },
    // // 退出系统
    // LogOut() {
    //   return new Promise((resolve: any, reject: any) => {
    //     logout()
    //       .then(() => {
    //         this.token = ''
    //         this.roles = []
    //         this.permissions = []
    //         removeToken()
    //         resolve()
    //       })
    //       .catch((error: any) => {
    //         reject(error)
    //       })
    //   })
    // },
    // 前端退出
    FedLogOut() {
      removeToken()
      this.token = ''
      this.roles = []
      this.permissions = []
    }
  },
  persist: piniaPersistConfig('user')
})

export default useUserStore
