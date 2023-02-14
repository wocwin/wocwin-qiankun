<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permissionRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo
    },
    variables () {
      return variables
    },
    isCollapse () {
      return !this.sidebar.opened
    },
    //处理菜单展示路由
    permissionRoutes () {
      // let activeList = this.$route.path.split('/')
      // if (activeList.length >= 3) {
      //   for (let i = 0; i < this.$store.getters.permission_sysMenu.length; i++) {
      //     if (this.$store.getters.permission_sysMenu[i].path.indexOf(activeList[1]) > -1) {
      //       for (let j = 0; j < this.$store.getters.permission_sysMenu[i].children.length; j++) {
      //         if (this.$store.getters.permission_sysMenu[i].children[j].path.indexOf(activeList[2]) > -1) {
      //           return this.$store.getters.permission_sysMenu[i].children[j].children
      //         }
      //       }
      //       break;
      //     }
      //   }
      // }
      let menuList = []
      this.$store.getters.permission_routes.map(item => {
        if (item.path === '/pms') {
          menuList = item.children[0].children
        }
      })
      return menuList
      // return this.$store.getters.permission_routes[this.$store.getters.permission_routes.length - 1].children[0].children
    }
  }
}
</script>
