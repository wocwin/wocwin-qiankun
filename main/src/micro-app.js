
const microApps = [
  {
    name: 'portal-fe',
    entry: process.env.VUE_APP_SUB_VUE2,
    activeRule: '/wocwin-qiankun/app-vue2'
  },
  {
    name: 'vue3-vite-fe',
    entry: process.env.VUE_APP_SUB_VUE3,
    // entry: '//localhost:3300/app-vue3vite/',
    activeRule: '/app-vue3vite'
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
