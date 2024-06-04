import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getInfo, logout, getPermBtm } from "@/api/modules/login";
import { registerMicroApps, start } from "qiankun"
import microApps from './micro-app'
const user = {
  state: {
    token: getToken(),
    name: '',
    nickName: '',
    userId: '',
    avatar: '',
    roles: [],
    permissions: [],
    dept: {},
    ssoControl: {},
    permBtn: [],
    permCode: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_NICK_NAME: (state, nickName) => {
      state.nickName = nickName
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_DEPT: (state, dept) => {
      state.dept = dept
    },
    SET_PERM_BTN: (state, permBtn) => {
      state.permBtn = permBtn
    },
    SET_PERM_CODE: (state, permCode) => {
      state.permCode = permCode
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((res) => {
            if (res.success) {
              setToken(res.data)
              commit('SET_TOKEN', res.data)
            }
            resolve(res)
          })
          .catch((error) => {
            reject(error);
          });
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(async (res) => {
            if (res?.success) {
              const user = res.data
              // console.log('获取到的用户信息',user.roles,user.permissions)
              if (user.roles && user.roles.length > 0) {
                // 验证返回的roles是否是一个非空数组
                commit('SET_ROLES', user.roles)
                // commit('SET_PERMISSIONS', user.permissions)
              } else {
                commit('SET_ROLES', ['ROLE_DEFAULT'])
              }
              commit('SET_NAME', user.userName)
              commit('SET_NICK_NAME', user.nickName)
              commit('SET_USER_ID', user.userId)
              commit('SET_DEPT', user.dept)
              // 获取按钮权限
              const btmRes = await getPermBtm()
              // console.log('获取的按钮权限', btmRes)
              if (btmRes.success && btmRes.data.length > 0) {
                const permBtn = btmRes.data.map((item) => item.menuId)
                const permCode = btmRes.data.map((item) => item.perms || null)
                commit('SET_PERM_BTN', permBtn)
                commit('SET_PERM_CODE', permCode)
                commit('SET_PERMISSIONS', permCode)
              }
              resolve(res.data)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取所有子应用微前端配置
    GetMicroApp({ commit }) {
      return new Promise((resolve, reject) => {
        if (window.__POWERED_BY_QIANKUN__) {
          __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
        }
        const apps = microApps.map(item => {
          console.log('app---子应用', item)
          return {
            ...item
          }
        })
        registerMicroApps(apps, {
          beforeLoad: (app) => {
            console.log('before load', app)
            switch (app.name) {
              case 'wocwin-vue2':
                document.title = 'wocwin-vue2'
                break
              case 'wocwin-admin':
                document.title = 'wocwin-admin'
                break
            }
          },
          beforeMount: [(app) => {
            console.log('before mount', app.name)
          }]
        })
        // 启动 qiankun
        start({
          prefetch: false // 取消预加载
        })
        resolve(apps)

      })
    },
    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
