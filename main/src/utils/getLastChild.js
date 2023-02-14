export function getVisibleRouteIndex (routes) { // 若当前菜单隐藏则往下寻找，所有路由隐藏则返回-1
  let visibleRouteIndex = -1
  routes.some((route, index) => {
    if (route.meta.visible === '0') {
      visibleRouteIndex = index
      return true
    }
  })
  return visibleRouteIndex
}
export function getLastChild (route) {
  const visibleRouteIndex = route.children && route.children.length > 0 ? getVisibleRouteIndex(route.children) : -1
  if (route.children && visibleRouteIndex >= 0) {
    return getLastChild(route.children[visibleRouteIndex])
  } else {
    return route
  }
}