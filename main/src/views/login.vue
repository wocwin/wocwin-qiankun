<template>
  <div class="login">
    <div class="content">
      <div class="input-format">
        <img src="@/assets/logo/logo.png" class="logon">
        <h3 class="title">vue2主应用</h3>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              name="username"
              autocomplete="new-password"
              placeholder="账号"
            >
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password" :error="errorMsg">
            <el-input
              v-model="loginForm.password"
              type="password"
              autocomplete="new-password"
              placeholder="密码"
              show-password
              @keyup.enter.native="handleLogin"
            >
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width: 100%"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
export default {
  name: 'Login',
  data() {
    return {
      errorMsg: '',
      loginForm: {
        username: 'admin',
        password: 'a123456',
        rememberMe: true
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCookie()
  },
  mounted() {
  },
  methods: {
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      if (rememberMe) {
        this.loginForm = {
          username: username === undefined ? this.loginForm.username : username,
          password: password === undefined ? this.loginForm.password : decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        }
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          localStorage.setItem('loginPassword', encrypt(this.loginForm.password))
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 })
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then((res) => {
              // console.log(789, res)
              if (res.success) {
                this.loading = false
                this.$router.push({ path: '/' })
              } else {
                // console.log(111, res?.msg)
                if (res?.msg.split(':')[1] >= 1) {
                  this.errorMsg = `一分钟内还可尝试${res?.msg.split(':')[1]}次`
                }
                // this.errorMsg = msg
                this.loading = false
              }
            })
            .catch(() => {
              // console.log(999, err)
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
  .content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
    padding-right: 8%;
    background: url("../assets/image/guitar.jpg") no-repeat 0;
    background-size: cover;
    .input-format {
      width: 340px;
      height: 420px;
      background: #fff;
      box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      padding: 40px 37px;
      text-align: left;
      .logon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
      .title {
        margin-top: 8px;
        margin-bottom: 20px;
        font-size: 25px;
        font-family: PingFangSC-Medium, "PingFang SC";
        font-weight: 600;
        color: #142969;
      }
      .login-form {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-size: 14px;
        font-feature-settings: "tnum";
        font-variant: tabular-nums;
        line-height: 1.5;
        color: rgb(0 0 0 / 65%);
        list-style: none;
        .el-input {
          height: 38px;
          input {
            height: 38px;
          }
        }
        .input-icon {
          width: 14px;
          height: 39px;
          margin-left: 2px;
        }
      }
    }
  }
}
</style>
