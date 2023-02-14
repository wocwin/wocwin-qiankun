# wocwin-qiankun

> 在你决定 clone 项目的时候，希望你可以帮我点个 ⭐，这将对我是极大的鼓励。

## 最终效果

<img src="./public/qiankun_demo.gif">

## 介绍

> 基于 qiankun+vue2&vue3+Vite3+vite-plugin-qiankun 技术栈实现的前端微应用架构，实现了主子应用切换（因为没有调用接口，子应用的路由都是静态的，动态请求的路由代码只是注释，实际项目可以放开），若想实现主子应用之间通信[可以参考这一篇博客](https://blog.csdn.net/cwin8951/article/details/128498395)，并做了简单的自动化脚本命令，可用一行命令所有子应用的依赖安装、启动以及打包部署。

### 1、主应用介绍

> #### 技术栈 [Vue-cli4](https://cli.vuejs.org/zh/)+[Vue2](https://v2.cn.vuejs.org/)+[Element-Ui](http://element.eleme.io/#/zh-CN)+[qiankun](https://qiankun.umijs.org/zh)

### 2、vue2 子应用介绍

> #### 技术栈 [Vue-cli4](https://cli.vuejs.org/zh/)+[Vue2](https://v2.cn.vuejs.org/)+[Element-Ui](http://element.eleme.io/#/zh-CN)+[qiankun](https://qiankun.umijs.org/zh)

### 3、vue3+vite3 子应用介绍

> #### 技术栈 vite@latest+Vue3.2+Vite3+TypeScript+Pinia+Element-Plus+vite-plugin-qiankun

## 项目运行

1. 项目克隆

  ```js
  // Gitee
  git clone https://gitee.com/wocwin/wocwin-qiankun.git
  // GitHub
  git clone https://github.com/wocwin/wocwin-qiankun.git
  ```

2. 依赖安装

   ```bash
   npm run install
   ```

3. 项目启动

   ```bash
   npm run start
   ```

4. 本地运行
 ```js
 1、运行完 npm run start
 2、打开http://localhost:8100/ 进入主应用
 3、逐个进入子应用（点击子应用左侧菜单栏logo可以回到主应用）
 4、系统管理是所有应用的公共模板（用户、角色、菜单、部门、微前端、字典等）
 ```
5. 打包编译
   ```bash
   npm run build
   ```
6. 本地部署到服务器需要配置NG（可以参考：nginx.conf文件）

## 支持

如果觉得 wocwin-qiankun 这个 demo 为你提供了不错的思路，或者已经在使用了，希望你可以帮我点个 ⭐ ，这将对我是极大的鼓励。
