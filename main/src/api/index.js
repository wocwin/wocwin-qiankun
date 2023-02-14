
import * as user from './system/user' // 用户接口
import * as role from './system/role' // 角色接口
import * as dept from './system/dept' // 部门接口
import * as menu from './system/menu' // 菜单接口
import * as post from './system/post' // 岗位接口
import * as microFrontEnd from './system/microFrontEnd' // 微前端配置接口
import * as application from './system/application' // 子应用接口
import * as entryManage from './system/entryManage' // pda管理接口
import * as generalSysConfig from './system/generalSysConfig' // 系统同用配置
import * as userFreeze from './system/userFreeze' // 用户冻结接口


export default {
  ...user,
  ...dept,
  ...role,
  ...menu,
  ...post,
  ...microFrontEnd,
  ...application,
  ...entryManage,
  ...generalSysConfig,
  ...userFreeze,
}