<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <div v-if="collapse" key="collapse" class="sidebar-logo-link" @click="goIndex">
        <img v-if="logo" :src="logo" :class="['sidebar-logo']" />
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </div>
      <div v-else key="expand" class="sidebar-logo-link" @click="goIndex">
        <img v-if="logo" :src="logo" :class="['sidebar-logo']" />
        <h1 class="sidebar-title">{{ title }}</h1>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    logo() {
      return require('@/assets/logo/logo.png')
    },
    title() {
      return process.env.VUE_APP_SYS_TITLE
    }
  },
  methods: {
    goIndex() {
      window.location.href = '/wocwin-qiankun/'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #304156;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 8px;
    }

    & .sidebar_logo_kb {
      width: 56px;
      height: 28px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
