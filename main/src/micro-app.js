
const microApps = [
  {
    name: 'wocwin-vue2',
    entry: process.env.VUE_APP_SUB_VUE2,
    activeRule: '/wocwin-vue2/'
  },
  {
    name: 'wocwin-admin',
    entry: process.env.VUE_APP_SUB_VUE3,
    // entry: '//localhost:3300/wocwin-admin/',
    activeRule: '/wocwin-admin/'
  }
]

const apps = microApps.map(item => {
  return {
    ...item,
    container: '#app', // 子应用挂载的div
    props: {
      routerBase: item.activeRule // 下发基础路由
    }
  }
})

export default apps
