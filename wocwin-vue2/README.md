# wocwin-v2 项目

> 是基于 Vue2、javaScript、webpack、vuex、Element-ui 开源的一套后台管理模板
>
> 此项目集成了微前端 qiankun（即可以当做一个子应用）


## 在线预览

- Link：<https://wocwin.github.io/wocwin-v2/>
> 账号：wocwin ; user  密码都是：123456

## 代码仓库

- GitHub：<https://github.com/wocwin/wocwin-v2>
- Gitee：<https://gitee.com/wocwin/wocwin-v2>

## 项目功能

- 使用了基于 [Element-ui 二次封装 t-ui 组件](https://github.com/wocwin/t-ui) ，里面有常用的 table、条件查询、form 表单、下拉选择组件等
- 使用 vue-router 进行路由权限拦截、路由懒加载
- 使用 KeepAlive 对页面进行缓存，支持多级嵌套页面缓存
- 使用 Prettier 统一格式化代码，集成 Eslint 代码校验规范
- 项目支持菜单按钮权限（wocwin:可以看见所有，user:无法看见大屏、高德地图菜单及部分系统管理的操作按钮）。

### 安装使用


```shell script
# Gitee
git clone https://gitee.com/wocwin/wocwin-v2.git
# GitHub
git clone https://github.com/wocwin/wocwin-v2.git

# 安装依赖
npm install

# 启动服务
npm run serve

# build
npm run prod

# prettier 格式化代码
npm run lint:prettier

```

## [Git 提交规范](https://npmmirror.com/package/dh-scm/v/0.1.26)

**格式示例：**

```
<type>: <subject>
```

### type

用于说明本次提交的类别，必须是以下可选类别中的一个:

- `ci`: ci 配置文件和脚本的变动;
- `chore`: 构建系统或辅助工具的变动;
- `polish`: 代码或者功能模块的改进和完善;
- `fix`: 代码 BUG 修复;
- `feat`: 新功能;
- `perf`: 性能优化和提升;
- `refactor`: 仅仅是代码变动，既不是修复 BUG 也不是引入新功能;
- `style`: 代码格式调整，可能是空格、分号、缩进等等;
- `docs`: 文档变动;
- `test`: 补充缺失的测试用例或者修正现有的测试用例;
- `revert`: 回滚操作;
