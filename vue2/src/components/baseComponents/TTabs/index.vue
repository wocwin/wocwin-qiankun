<template>
  <div class="t_tabs">
    <el-tabs v-model="activeName" @tab-click="(tab, event) => $emit('tabsChange', tab, event)">
      <el-tab-pane v-for="tab in tabs" :key="tab.key" :name="tab.key" :label="tab.title">
        <slot :name="tab.key"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'TTabs',
  components: {
  },
  props: {
    tabs: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      activeName: this.tabs && this.tabs[0].key,
    }
  },
  methods: {
    // 获取默认选中tab
    setSelectedTab (key) {
      this.activeName = key
    }
  }
}
</script>
<style lang="scss" scoped>
.t_tabs {
  .tabs {
    padding: 0;
    margin: 0;
    .el-tabs {
      .el-tabs__header {
        margin: 0;
        padding: 0 10px;
        background-color: #fff;
      }
      .el-tabs__nav-wrap {
        &::after {
          height: 1px;
        }
      }
    }
  }
}
</style>
