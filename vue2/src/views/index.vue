<template>
  <div class="home-box">
    <div class="Onionparody"></div>
    <div class="Thefigurebelow"></div>
    <div class="YouShangTu"></div>
    <div class="home-header">
      <img src="@/assets/logo/logo.png" style="width: 60px" />
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper" style="cursor: pointer;font-size: 16px">
          <i class="el-icon-user"></i>
          <span>{{ userInfo.username ? userInfo.username : '' }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="home-title-box">{{sysMenu[0].meta.title}}</div>
    <div class="home-body">
      <div class="body-child" v-for="(item,index) in sysMenu" :key="index">
        <SvgIcon :icon-class="item.meta.icon" class="svg_icon"></SvgIcon>
        <h1>{{ item.meta.title }}</h1>
        <ul>
          <li
            v-for="(it,ind) in item.children"
            :key="ind"
            @click="routerGoClick(item,it)"
          >{{ it.meta.title }}</li>
        </ul>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      title="修改密码"
      width="350px"
      :modal-append-to-body="false"
      :visible.sync="dialogTableVisible"
    >
      <ResetPwd :cancel="true" @updateUserPwd="updateUserPwd" @close="close"></ResetPwd>
    </el-dialog>
  </div>
</template>

<script>
import ResetPwd from '@/layout/components/ResetPwd.vue'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'index',
  data() {
    return {
      userInfo: {
        userName: 'error'
      }, //用户信息
      dialogTableVisible: false
    }
  },
  computed: {
    sysMenu() {
      return this.$store.getters.permission_sysMenu.filter(item => {
        return !item.hasOwnProperty('hidden') || (item.hasOwnProperty('hidden') && !item.hidden)
      })
    },
  },
  components: {
    ResetPwd,
    SvgIcon
  },
  watch: {
    '$store.getters.user_ssoControl'(nv) {
      this.userInfo = nv
    }
  },
  created() {
    this.userInfo = this.$store.getters.user_ssoControl
  },
  methods: {
    logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('FedLogOut').then(() => {
          if (!window.__POWERED_BY_QIANKUN__) {
            location.reload()
          } else {
            window.location.href = '/'
          }
        })
      })
    },
    updateUserPwd(type) {
      if (type) this.dialogTableVisible = false
    },
    close() {
      this.dialogTableVisible = false
    },
    //判断处理路由后跳转
    async routerGoClick(item, it) {
      this.$router.push({ path: this.getPath(it) })
    },
    getPath(menu) {
      if (menu.children) {
        return this.getPath(menu.children[0])
      } else {
        return menu.path
      }
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.home-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  background: #e6edf5;

  .Onionparody {
    position: absolute;
    top: 10%;
    height: 225px;
    width: 235px;
    background: url("../assets/home_images/Onionparody.svg");
  }

  .Thefigurebelow {
    position: absolute;
    bottom: 5%;
    left: 50%;
    height: 168px;
    width: 662px;
    background: url("../assets/home_images/Thefigurebelow.svg");
  }

  .YouShangTu {
    position: absolute;
    top: 20%;
    right: 0px;
    height: 225px;
    width: 235px;
    background: url("../assets/home_images/YouShangTu.svg");
  }

  .home-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 64px;
    padding: 0 20px;
  }

  .home-title-box {
    display: flex;
    justify-content: center;
    font-size: 48px;
    font-weight: bold;
    margin: 10px 0 20px;
    margin: 10px 0 56px;
  }

  .home-body {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;

    .body-child {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: center;
      width: 376px;
      height: 500px;
      margin: 0 40px;
      padding-top: 22px;
      background: #ffffff;

      .svg_icon {
        width: 60px;
        height: 60px;
      }

      h1 {
        margin-bottom: 40px;
      }

      li {
        display: block;
        text-align: center;
        line-height: 40px;
        width: 160px;
        height: 40px;
        margin-bottom: 16px;
        background: #e6edf5;
        font-size: 16px;

        &:hover {
          cursor: pointer;
          background: #355db4;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
