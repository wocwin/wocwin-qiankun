<template>
  <div class="app-container dept">
    <div class="block_wrap">
      <t-query-condition :opts="opts" :loading="loading" @submit="conditionEnter" />
    </div>
    <div class="block_wrap">
      <t-table
        title="业务系统管理列表"
        :table="table"
        isCopy
        row-key="systemId"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :columns="table.columns"
        :isShowPagination="false"
      >
        <!-- 状态插槽 -->
        <template #status="{param}">
          <el-switch
            v-model="param.row.status"
            :active-value="true"
            :inactive-value="false"
            :disabled="param.row.systemType=='M'"
            @change="handleStatusChange(param.row)"
          ></el-switch>
        </template>
        <!-- 表格外按钮toolbar插槽 -->
        <template #toolbar>
          <el-button
            type="primary"
            size="mini"
            @click="handleAdd"
            v-hasPermi="'root:web:sys:dept:add'"
          >新增</el-button>
        </template>
      </t-table>
    </div>
    <add-form ref="addForm" :allSystemList="allSystemList" @submit="submit" @cancel="cancel" />
  </div>
</template>
<script>
import AddForm from './addForm'
export default {
  name: 'Application',
  components: { AddForm },
  data () {
    return {
      loading: false,
      // 查询参数
      queryData: {
        systemName: undefined, // 系统名称
        createBy: undefined, // 创建人
        status: undefined, // 状态
      },
      table: {
        data: [],
        columns: [
          { prop: 'systemName', label: '系统名称', minWidth: 180, align: 'left' },
          { prop: 'systemCode', label: '系统编码', minWidth: 120, align: 'left' },
          {
            prop: 'menus',
            label: '包含应用',
            minWidth: 120,
            noShowTip: true,
            align: 'left',
            customRender: {
              comps: [
                {
                  comp: 'div',
                  child: (scope) => [
                    {
                      comp: 'span',
                      text: (scope.row.menus?.map(item => { return item.menuName }))?.join(',')
                    }
                  ]
                }
              ]
            }
          },
          { prop: 'createTime', label: '创建时间', width: '100px', align: 'left' },
          { prop: 'createBy', label: '创建人', width: '100px', align: 'left' },
          { prop: 'status', label: '状态', slotName: 'status', width: '80px', align: 'left' },
        ],
        // 表格内操作列
        operator: [
          {
            text: '编辑',
            fun: this.edit,
            show: { key: 'systemType', val: ['C'] },
            hasPermi: 'root:web:sys:dept:alter'
          },
          {
            text: '删除',
            fun: this.delHandle,
            show: { key: 'systemType', val: ['C'] },
            hasPermi: 'root:web:sys:dept:del'
          },
        ],
        // 操作列样式
        operatorConfig: {
          // fixed: 'right', // 固定列表右边（left则固定在左边）
          align: 'left',
          width: '80px',
          label: '操作'
        }
      },
      // 应用树选项
      allSystemList: []
    }
  },
  computed: {
    opts () {
      return {
        systemName: {
          label: '系统名称',
          comp: 'el-input'
        },
        createBy: {
          label: '创建人',
          comp: 'el-input'
        },
        status: {
          label: '状态',
          comp: 'el-select',
          changeEvent: 'change',
          child: [
            {
              comp: 'el-option',
              value: true,
              bind: {
                label: '启用',
                key: true
              }
            },
            {
              comp: 'el-option',
              value: false,
              bind: {
                label: '禁用',
                key: false
              }
            }
          ]
        },
      }
    },
    getQueryData () {
      const { systemName, status, createBy } = this.queryData
      return {
        systemName,
        createBy,
        status,
      }
    },
  },
  created () {
    this.getList()
    this.getAllSystemList()
  },
  methods: {
    /** 查询应用列表 */
    async getList () {
      // this.loading = true
      // const res = await Api.listSystem(this.getQueryData)
      // if (res.success) {
      //   this.table.data = this.buildTree(res.data)
      // }
      // this.loading = false
    },
    buildTree (menus) {
      let childMenus = []
      childMenus = menus.filter(menu => {
        return menu.systemType == 'M'
      })
      menus.forEach(menu => {
        if (menu.systemType == 'C') {
          if (!childMenus[0].children) childMenus[0].children = []
          childMenus[0].children.push(menu)
        }
      })
      return childMenus
    },
    // 查询按钮
    conditionEnter (data) {
      this.queryData = data
      this.getList()
    },
    // 应用状态修改
    handleStatusChange (row) {
      let text = row.status === true ? '启用' : '停用'
      this.$confirm(`确认要${text}${row.systemName}应用吗?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).then(async () => {
        // const res = await Api.saveSystem(row)
        // if (res.success) {
        //   this.$message.success(`${text}成功`)
        //   this.getList()
        // }
      }).catch(() => {
        row.status = row.status === true ? false : true
      })
    },
    // 获取所有菜单
    async getAllSystemList () {
      // const res = await Api.getAllSystemList()
      // if (res.success) {
      //   this.allSystemList = res.data
      // }
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.$refs.addForm.toDoAdd()
    },
    // 编辑
    edit (data) {
      // console.log('编辑', data)
      this.$refs.addForm.edit(data)
    },
    /** 删除按钮操作 */
    delHandle ({ systemId, systemName }) {
      this.$confirm(`是否确认删除${systemName}应用?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const res = await Api.delSystem(systemId)
        // if (res.success) {
        //   this.$message.success(`删除成功`)
        //   this.getList()
        // }
      })
    },
    // 弹窗取消事件
    cancel () {
      this.$refs.addForm.reset()
      this.getList()
    },
    // 弹窗确认事件
    submit () {
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.dept {
  .block_wrap {
    ::v-deep .t-table {
      .el-table__body-wrapper {
        .el-table__body {
          .cell {
            display: flex;
          }
        }
      }
    }
  }
}
</style>
