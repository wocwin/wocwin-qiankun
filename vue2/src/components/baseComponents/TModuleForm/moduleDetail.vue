<template>
  <div class="t_detail">
    <el-collapse v-model="defaultActiveKey">
      <el-collapse-item
        v-for="(val, index) in descData"
        :class="[val.className,{ noTitle: !val.title,disabledStyle:val.disabled }]"
        :key="index"
        :name="val.name"
        :disabled="val.disabled"
      >
        <template #title>
          {{val.title}}
          <div class="t_btn" v-if="val.btn">
            <slot :name="val.btn"></slot>
          </div>
        </template>
        <template v-if="val.slotName">
          <slot :name="val.slotName"></slot>
        </template>
        <el-descriptions v-else size="middle" :column="descColumn">
          <el-descriptions-item
            v-for="(item, key) in val.data"
            :key="key"
            :label="item.label"
            :span="item.span || 1"
          >
            <template v-if="item.slotName">
              <slot :name="item.slotName"></slot>
            </template>
            <div v-else>
              <el-tooltip v-bind="$attrs" v-if="item.tooltip">
                <span>
                  {{ item.value }}
                  <i
                    :class="item.iconClass||'el-icon-warning-outline'"
                    style="cursor: pointer;"
                  />
                </span>
                <template #content v-if="item.tooltip">
                  <span v-if="typeof item.tooltip === 'string'">{{item.tooltip}}</span>
                  <template v-else-if="typeof item.tooltip === 'function'">
                    <render-tooltip :createElementFunc="item.tooltip" />
                  </template>
                </template>
              </el-tooltip>
              <span v-else>{{ item.value }}</span>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
// import { Descriptions, DescriptionsItem } from 'element-ui'
import RenderTooltip from './renderTooltip'
export default {
  name: 'ModuleDetail',
  components: {
    RenderTooltip
    // 'el-descriptions': Descriptions,
    // 'el-descriptions-item': DescriptionsItem
  },
  props: {
    descColumn: {
      type: Number,
      default: 4
    },
    descData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // ??????????????????
    defaultActiveKey: {
      get () {
        // console.log(333, Object.keys(this.descData))
        return Object.keys(this.descData)
      },
      set (val) {
        return val
      }
    }
  }
}
</script>
<style lang="scss">
.t_detail {
  .el-collapse {
    border: none;
    background-color: #f0f2f5;
    .el-collapse-item {
      background-color: #fff;
      margin-top: 10px;
      border: none;
      .el-collapse-item__header {
        border-bottom: 1px solid #ebeef5;
        position: relative;
        padding-left: 20px;
        font-size: 16px;
        .el-collapse-item__arrow {
          // color: inherit;
          // font-style: normal;
          // line-height: 0;
          // text-align: center;
          // text-transform: none;
          // vertical-align: -0.125em;
          // text-rendering: optimizeLegibility;
          // -webkit-font-smoothing: antialiased;
          // -moz-osx-font-smoothing: grayscale;
          // position: absolute;
          // top: 50%;
          // left: 16px;
          // display: inline-block;
          font-size: 18px;
          margin-right: 10px;
        }
      }
      .el-collapse-item__wrap {
        padding: 16px;
        border: none;
        .el-collapse-item__content {
          padding-bottom: 0;
        }
      }
    }
    // ???????????????title
    .noTitle {
      margin-top: 0;
      > div {
        &:first-child {
          display: none;
        }
      }
    }
    // ????????????????????????????????????icon
    .disabledStyle {
      .el-collapse-item__header {
        color: #000;
        cursor: default;
        padding-left: 20px;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .el-collapse-item__arrow {
          display: none;
        }
        .t_btn {
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
