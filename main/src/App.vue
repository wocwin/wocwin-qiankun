<template>
  <div id="app">
    <!-- <div class="env_tag" v-if="ENV!='production'">{{ ENV }}</div> -->
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isRouterAlive: true
    }
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  computed: {
    ENV() {
      return process.env.VUE_APP_ENV
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
html,
body,
#app {
  height: 100%;
  margin: 0px;
  padding: 0px;

  .env_tag {
    position: absolute;
    z-index: 901;
    top: 0;
    right: 0;
    padding: 5px;
    background-color: red;
    border-radius: 0 0 0 4px;
    color: #fff;
    font-size: 14px;
    height: 24px;
  }
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>