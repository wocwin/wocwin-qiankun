
import store from '@/store'

export default {
  inserted (el, binding, vnode) {
    const { value } = binding
    const all_permission = "*:*:*";
    const permissions = store.getters && store.getters.permissions

    // console.log('我看看是啥', store.getters, permissions)
    // console.log(111, value)
    // console.log(333, permissions)

    if (value) {
      const permissionFlag = value
      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permission.includes(permissionFlag)
      })
      console.log(44, hasPermissions)
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}
