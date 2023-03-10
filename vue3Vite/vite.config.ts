import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import vueSetupExtend from 'vite-plugin-vue-setup-extend' // 设置neme属性
import AutoImport from 'unplugin-auto-import/vite' // 自动导入
import viteCompression from 'vite-plugin-compression' // 静态资源压缩
// 配置qiankun
import qiankun from 'vite-plugin-qiankun'
const packName = require('./package').name
// https://vitejs.dev/config/
export default defineConfig({
  // 配置NG——这个是与后台、运维约定好的，做NG转发；即主应用地址+子应用base就会直接NG转发
  base: '/app-vue3vite/',
  plugins: [
    vue(),
    vueJsx(),
    vueSetupExtend(),
    AutoImport({
      imports: ['vue', 'vue-router','pinia'], // 自动导入vue、vue-router、pinia相关API
      dts: 'src/auto-import.d.ts' // 生成 `auto-import.d.ts` 全局声明
    }),
    // 配置qiankun
    qiankun(`${packName}`, {
      useDevMode: true
    }),
    viteCompression({
      verbose: true,
      disable: false, // 不禁用压缩
      deleteOriginFile: false, // 压缩后是否删除原文件
      threshold: 10240, // 压缩前最小文件大小
      algorithm: 'gzip', // 压缩算法
      ext: '.gz' // 文件类型
    })
  ],
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    host: '0.0.0.0',
    port: 3300,
    // open: true,
    https: false
  },
  resolve: {
    // 配置别名
    alias: {
      '@': resolve(__dirname, 'src'),
      components: resolve(__dirname, 'src/components')
    },
    // 类型： string[] 导入时想要省略的扩展名列表。
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs']
  },
  build: {
    outDir: '../dist/vue3Vite' // 打包文件的输出目录
  }
})
