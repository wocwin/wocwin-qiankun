<template>
  <div class="login">
    <div class="square" v-for="index in 10" :key="index" :style="`--i: ${index - 1}`"></div>
    <div class="content">
      <div :class="`star${index}`" v-for="index in 6" :key="index"></div>
      <div class="login-left">
        <img class="login-left-img" src="@/assets/logo/login.png" alt="login" />
      </div>
      <div class="input-format">
        <div class="form_content">
          <img src="@/assets/logo/logo.png" class="logon" />
          <div class="title_box">
            <h2 class="title">vue2主应用</h2>
          </div>
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
            <el-form-item style="width: 100%;">
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
        username: 'wocwin',
        password: '123456',
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
      handler: function (route) {
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
      const username = Cookies.get('username_qiankun')
      const password = Cookies.get('password_qiankun')
      const rememberMe = Cookies.get('rememberMe_qiankun')
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
            Cookies.set('username_qiankun', this.loginForm.username, { expires: 30 })
            Cookies.set('password_qiankun', encrypt(this.loginForm.password), { expires: 30 })
            Cookies.set('rememberMe_qiankun', this.loginForm.rememberMe, { expires: 30 })
          } else {
            Cookies.remove('username_qiankun')
            Cookies.remove('password_qiankun')
            Cookies.remove('rememberMe_qiankun')
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then((res) => {
              // console.log(789, res)
              if (res.success) {
                this.loading = false
                this.$router.push({ path: '/' })
                // this.$router.push({ path: '/pms/systemConfig/user' })
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
@keyframes loginline {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes animate {
  0% {
    transform: translateY(-40px);
    -webkit-transform: translateY(-40px);
  }
  25% {
    transform: translateY(-20px);
    -webkit-transform: translateY(-20px);
  }
  50% {
    transform: translateY(0px);
    -webkit-transform: translateY(0px);
  }
  75% {
    transform: translateY(20px);
    -webkit-transform: translateY(20px);
  }
  100% {
    transform: translateY(40px);
    -webkit-transform: translateY(40px);
  }
}
@function getShadows($n) {
  $shadows: "#{random(100)}vw #{random(100)}vh #fff";
  @for $i from 2 through $n {
    $shadows: "#{$shadows},#{random(100)}vw #{random(100)}vh #fff";
  }
  @return unquote($shadows);
}
@keyframes moveUp {
  100% {
    transform: translateY(-100vh);
  }
}
@keyframes expand {
  from {
    letter-spacing: -20px;
    filter: blur(2px);
  }
  to {
    letter-spacing: 0px;
    filter: blur(0px);
  }
}
$duration: 600s;
$count: 1400;
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  background-image: linear-gradient(
    #4d3af9,
    #255fff,
    #3f89fb,
    #5088ff,
    #1a68ff
  );
  background-size: cover;
  position: relative;
  .square {
    position: absolute;
    width: 100px;
    height: 100px;
    background: #4d86ff;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-right: 1px solid #3f89fb;
    border-bottom: 1px solid #3f89fb;
    border-radius: 10px;
    animation: animate 12s linear infinite;
    animation-delay: calc(-1s * var(--i));
    &:nth-child(1) {
      top: -10px;
      right: 50%;
    }
    &:nth-child(2) {
      top: 10%;
      right: 20%;
    }
    &:nth-child(3) {
      top: 10%;
      right: 10px;
    }
    &:nth-child(4) {
      bottom: 10%;
      right: 15%;
      width: 80px;
      height: 80px;
    }
    &:nth-child(5) {
      top: 180px;
      left: 20px;
    }
    &:nth-child(6) {
      bottom: 80px;
      left: 20px;
      width: 70px;
      height: 70px;
    }
    &:nth-child(7) {
      bottom: 40%;
      right: 50px;
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.2);
    }
    &:nth-child(8) {
      top: 120px;
      left: 220px;
      width: 70px;
      height: 70px;
    }
    &:nth-child(9) {
      bottom: 10%;
      right: 40%;
    }
    &:nth-child(10) {
      bottom: 40%;
      right: 45%;
    }
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    height: 92%;
    padding: 0 30px;
    background-color: rgba(0, 0, 0, 0.6);
    box-shadow: 2px 3px 20px 4px #10184b;
    border-radius: 15px;
    position: relative;
    .dark {
      position: absolute;
      top: 13px;
      right: 18px;
    }
    .watermark {
      position: absolute;
      top: 13px;
      right: 128px;
    }
    .login-left {
      width: 660px;
      margin-right: 10px;
      box-shadow: 2px 3px 20px 4px #b2b6fe;
      border-radius: 15px;
      .login-left-img {
        width: 100%;
        height: 100%;
      }
    }
    .input-format {
      width: 354px;
      box-shadow: rgba(255, 255, 255, 0.12) 0 2px 10px 2px;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      border-radius: 10px;
      padding: 2px;
      &::before,
      &::after {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        z-index: 0;
        width: 350px;
        height: 440px;
        background: linear-gradient(
          0deg,
          transparent,
          transparent,
          #4b3bf9,
          #4b3bf9,
          #4b3bf9
        );
        transform-origin: bottom right;
        animation: loginline 5s linear infinite;
      }
      &::after {
        background: linear-gradient(
          0deg,
          transparent,
          transparent,
          #ff2771,
          #ff2771,
          #ff2771
        );
        animation-delay: -3s;
      }
      .form_content {
        width: 350px;
        max-height: 440px;
        padding: 20px;
        text-align: center;
        background-color: #141414;
        border-radius: 10px;
        box-sizing: border-box;
        overflow: hidden;
        z-index: 1;
        position: relative;
        .logon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
        .title_box {
          filter: contrast(10);
          .title {
            margin-top: 8px;
            margin-bottom: 40px;
            font-family: PingFangSC-Medium, "PingFang SC";
            font-weight: 600;
            color: #e5eaf3;
            animation: expand 5s forwards infinite;
          }
        }

        .login-form {
          box-sizing: border-box;
          padding: 0;
          margin: 0;
          font-size: 14px;
          font-feature-settings: "tnum";
          font-variant: tabular-nums;
          line-height: 1.5;
          color: #e5eaf3;
          list-style: none;
          text-align: left;
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
    @for $i from 1 through 6 {
      $duration: floor($duration / 2);
      $count: floor($count / 2);
      .star#{$i} {
        $size: #{$i}px;
        position: fixed;
        top: 0;
        left: 0;
        width: $size;
        height: $size;
        border-radius: 50%;
        box-shadow: getShadows($count);
        animation: moveUp $duration linear infinite;
        &::after {
          position: fixed;
          top: 100vh;
          left: 0;
          width: $size;
          height: $size;
          content: "";
          border-radius: inherit;
          box-shadow: inherit;
        }
      }
    }
  }
  @media screen and (max-width: 1150px) {
    .content {
      justify-content: center;
      .login-left {
        display: none;
      }
    }
  }
}
</style>
