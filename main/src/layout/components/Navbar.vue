<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          {{ nickName }}
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="setting = true">布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <a href="https://wocwin.github.io/t-ui/" target="_blank">vue2基础组件文档</a>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <a href="https://wocwin.github.io/t-ui-plus/" target="_blank">vue3基础组件文档</a>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="changePassword">
            <span>修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <t-dialog
      title="修改密码"
      append-to-body
      width="30%"
      :visible="dialogVisible"
      @update:visible="cancel"
    >
      <t-form :ref-obj.sync="formOpts.ref" :form-opts="formOpts" :width-size="1" />
      <template #footer>
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button type="primary" size="small" @click="submit">保存</el-button>
      </template>
    </t-dialog>
  </div>
</template>

<script>
import Api from '@/api'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import { isStrongPassword } from '@/utils/validate.js'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search
  },
  data() {
    return {
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
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'nickName'
    ]),

    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    }
  },
  methods: {
    cancel() {
      this.dialogVisible = false
      this.formOpts.ref?.resetFields()
    },
    equalToPassword(rule, value, callback) {
      if (this.formOpts.formData.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    changePassword() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
      this.$refs.resetPwd.initData()
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('FedLogOut').then(() => {
          if (!window.__POWERED_BY_QIANKUN__) {
            location.reload()
          } else {
            window.location.href = '/wocwin-qiankun/'
          }
        })
      })
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
              window.location.href = '/wocwin-qiankun/'
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 2005;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    font-size: 14px;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        //margin-top: 5px;
        position: relative;
        font-size: 16px;

        //.user-avatar {
        //  cursor: pointer;
        //  width: 40px;
        //  height: 40px;
        //  border-radius: 10px;
        //}
        //
        //.el-icon-caret-bottom {
        //  cursor: pointer;
        //  position: absolute;
        //  right: -20px;
        //  top: 25px;
        //  font-size: 12px;
        //}
      }
    }
  }
}
</style>
