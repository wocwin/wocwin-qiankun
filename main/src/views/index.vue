<template>
  <div class="home" @scroll="onScroll">
    <header class="header">
      <div class="header_logo">
        <img src="@/assets/logo/logo.png" />
        <span class="logo_name">vue2主应用</span>
      </div>
      <h2>管理平台</h2>
      <div class="handle_wrap">
        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper" style="cursor: pointer;font-size: 16px">
            <i class="el-icon-user" />
            <span>{{ nickName }}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="dialogVisible=true">
              <span>修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <main class="main_content">
      <div class="sys_list">
        <section v-for="(item, i) in menu" :key="i" class="sys_wrap">
          <div :class="['sys_title',{'sys':item.path=='/pms'}]">
            <SvgIcon :icon-class="item.meta.icon" class="icon" />
            <div class="title">{{ item.meta.title }}</div>
          </div>
          <div class="module_wrap">
            <template v-for="(cItem, cI) in item.children">
              <div :key="`${i}-${cI}`" class="module" @click="routeHandle(cItem,item)">
                <SvgIcon :icon-class="cItem.meta.icon" class="font_family" />
                <div class="module_name">{{ cItem.meta.title }}</div>
              </div>
            </template>
          </div>
        </section>
      </div>
    </main>
    <t-dialog
      :title="title"
      append-to-body
      width="30%"
      :visible="dialogVisible"
      :show-close="isShowPassword"
      @update:visible="cancel"
    >
      <t-form :ref-obj.sync="formOpts.ref" :form-opts="formOpts" :width-size="1" />
      <template #footer>
        <el-button v-if="isShowPassword" size="small" @click="cancel">取消</el-button>
        <el-button type="primary" size="small" @click="submit">保存</el-button>
      </template>
    </t-dialog>
  </div>
</template>
<script>
import Api from '@/api'
import { mapState } from 'vuex'
import { getLastChild } from '@/utils/getLastChild'
import { decrypt } from '@/utils/jsencrypt'
import { isStrongPassword } from '@/utils/validate.js'
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'Home',
  components: {
    SvgIcon
  },
  data() {
    return {
      title: '修改密码',
      isShowPassword: false, // 弱密码关闭弹窗取消按钮
      dialogVisible: false,
      // form表单
      formOpts: {
        ref: null,
        formData: {
          oldPassword: undefined, // 旧密码
          newPassword: undefined, // 新密码
          confirmPassword: undefined // 确认密码
        },
        fieldList: [
          { label: '旧密码', value: 'oldPassword', type: 'password', comp: 'el-input', bind: { 'show-password': true } },
          { label: '新密码', value: 'newPassword', type: 'password', comp: 'el-input', bind: { 'show-password': true } },
          { label: '确认密码', value: 'confirmPassword', type: 'password', comp: 'el-input', bind: { 'show-password': true } }
        ],
        rules: {
          oldPassword: [
            { required: true, message: '旧密码不能为空', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '新密码不能为空', trigger: 'blur' },
            { validator: isStrongPassword, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: isStrongPassword, trigger: 'blur' },
            { validator: this.equalToPassword, trigger: 'blur' }
          ]
        }
      },
      scrollTop: 0
    }
  },
  computed: {
    ...mapState({
      menu: (state) => state.permission.addRoutes,
      nickName: (state) => state.user.nickName
    }),
    // 判断当前是否是域名
    isDomain() {
      return this.checkdomain()
    }
  },
  activated() {
    this.$el.scrollTop = this.scrollTop
  },
  created() {
    // console.log('created', this.isPassword(decrypt(localStorage.getItem('loginPassword'))))
    // this.isShowPassword = this.isPassword(decrypt(localStorage.getItem('loginPassword')))
    // if (!this.isShowPassword) {
    //   this.$resetMessage.warning({ message: '当前登录密码安全系数太低，请修改密码！', duration: 0, showClose: true })
    //   // this.title = '登录密码是弱密码，请修改密码'
    //   // this.$resetMessage.warning('登录密码是弱密码，建议修改密码！')
    //   // this.dialogVisible = true
    // }
    // console.log('333', process.env.BASE_URL)
    // console.log('222', this.menu)
  },
  methods: {
    // 检测是否满足强密码
    isPassword(password) {
      const reg = /^(?=.*?\d+.*?)(?=.*[A-z].*?)[\da-zA-Z\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]{6,20}$/
      return reg.test(password)
    },
    equalToPassword(rule, value, callback) {
      if (this.formOpts.formData.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    cancel() {
      this.dialogVisible = false
      this.formOpts.ref?.resetFields()
    },
    // 修改密码弹窗确定
    submit() {
      this.formOpts.ref.validate(async (valid) => {
        if (!valid) return
        // console.log('点击确认', this.formOpts.formData)
        const formData = {
          ...this.formOpts.formData,
          userId: this.$store.state.user.userId
        }
        const res = await Api.changePassword(formData)
        if (res.success) {
          this.$message.success(`修改密码成功`)
          this.$store.dispatch('FedLogOut').then(() => {
            console.log('修改密码FedLogOut')
            if (!window.__POWERED_BY_QIANKUN__) {
              // 为了重新实例化vue-router对象 避免bug
              location.reload()
            } else {
              window.location.href = process.env.NODE_ENV === 'production' ? '/wocwin-qiankun/':'/'
            }
          })
        }
      })
    },
    routeHandle(curRoute) {
      console.log('2222', curRoute.path.split('/'))
      if (curRoute.meta.disabled) return
      const route = getLastChild(curRoute)
      // 点击前清除缓存
      this.$store.dispatch('tagsView/delAllViews')
      if (curRoute.path.split('/')[1] === 'pms') {
        window.history.pushState({}, '', route.path)
      } else {
        console.log('route.path-----', route.path, `/${curRoute.path.split('/')[2]}/`)
        // return
        window.history.pushState({}, '', `/${curRoute.path.split('/')[2]}/`)
      }
    },
    onScroll(e) {
      if (e.target) {
        this.scrollTop = e.target.scrollTop
      }
    },
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
            window.location.href = process.env.NODE_ENV === 'production' ? '/wocwin-qiankun/':'/'
          }
        })
      })
    }
  }
}
</script>
<style lang="scss">
.home {
  height: 100%;
  background: #f5f7f9;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;

  .header {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    padding: 0 20px 0 19px;
    // margin: 10px 0;
    height: 64px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .header_logo {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex: 20%;

      img {
        width: 36px;
        margin-right: 12px;
      }

      .logo_name {
        font-size: 20px;
        font-weight: bold;
      }
    }

    h2 {
      font-size: 42px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(4, 8, 28, 1);
      text-align: center;
      flex: 60%;
    }

    .handle_wrap {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex: 20%;
    }
    .layout-header {
      // height: 50px;
      width: 100%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      // line-height: 50px;
      position: relative;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      padding: 0 20px 0 19px;
      margin: 10px 0;
      height: 64px;
      .logo {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex: 5%;

        img {
          width: 36px;
          margin-right: 12px;
        }

        .logo_name {
          font-size: 20px;
          font-weight: bold;
        }
      }
      .sub-apps {
        list-style: none;
        margin: 0;
        flex: 50%;
        li {
          list-style: none;
          display: inline-block;
          padding: 0 20px;
          cursor: pointer;
          &.active {
            color: #42b983;
            text-decoration: underline;
          }
        }
      }
      .userinfo {
        position: absolute;
        right: 100px;
        top: 0;
      }
      .handle_wrap {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 20%;
      }
    }
  }

  .main_content {
    .sys_list {
      margin: 25px;

      .sys_wrap {
        position: relative;
        background-color: #fff;
        border-radius: 8px;
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        height: 100%;

        .sys_title {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          width: 250px;
          border-radius: 8px;
          background-image: url("../assets/logo/nav_system-bg.png"),
            linear-gradient(
              138.83deg,
              #b5d7ff 5.54%,
              rgba(162, 197, 238, 0.38) 98.12%
            );

          .icon {
            font-size: 60px;
          }

          .title {
            font-weight: 500;
            font-size: 30px;
            line-height: 42px;
            color: #04081c;
          }
        }

        .sys {
          background-image: url("../assets/logo/nav_system-bg.png"),
            linear-gradient(
              138.83deg,
              #ffcbb5 5.54%,
              rgba(238, 180, 162, 0.38) 98.12%
            );
        }

        .module_wrap {
          display: flex;
          flex-wrap: wrap;
          padding-left: 280px;

          .module {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 194px;
            height: 154px;
            font-size: 16px;
            border-radius: 4px;
            margin: 15px;
            cursor: pointer;

            &:hover {
              background: #fcfdfe;
              box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.08);
              border-radius: 26px;
            }

            .module_name {
              margin-top: 10px;
              color: #000;
            }

            .font_family {
              font-size: 78px;
              color: #355db4;
              line-height: 1;
            }
          }
        }
      }
    }
  }
}
</style>
