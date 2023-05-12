<template>
  <div class="login">
    <div class="content">
      <div class="input-format">
        <img src="@/assets/image/logo.png" alt class="logon" />
        <h3 class="title">{{packageTitle}}</h3>
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
          <el-form-item class="password_item" prop="password">
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
          <el-form-item style="width: 100%;text-align: left;">
            <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
          </el-form-item>
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
import Cookies from "js-cookie"
import { encrypt, decrypt } from '@/utils'
const packageTitle = require('../../package.json').description
export default {
  name: "Login",
  data() {
    return {
      packageTitle,
      loginForm: {
        username: 'admin',
        password: 'a123456',
        rememberMe: false
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ],
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCookie()
  },
  methods: {
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      if (Boolean(rememberMe)) {
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
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 });
            Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove('username');
            Cookies.remove('password');
            Cookies.remove('rememberMe');
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then((res) => {
              this.loading = false
              this.$router.push({ path: '/' })
            })
            .catch(() => {
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
  background: url("../assets/image/guitar.jpg") no-repeat 0;
  height: 100vh;
  background-size: cover;
  padding: 50px 0;
  .content {
    width: 100%;
    height: 100%;
    background-size: 70%;
    display: flex;
    justify-content: flex-end;
    padding-right: 12%;
    align-items: center;
    .input-format {
      width: 340px;
      height: 440px;
      padding: 40px;
      text-align: center;
      background: #ffffff;
      border-radius: 4px;
      box-shadow: 0 2px 24px 0 rgb(0 0 0 / 20%);
      .logon {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      .title {
        margin-top: 8px;
        margin-bottom: 40px;
        // font-size: 29px;
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
        .password_item {
          margin-bottom: 0;
        }
        .input-icon {
          height: 39px;
          width: 14px;
          margin-left: 2px;
        }
      }
    }
  }
}
</style>
