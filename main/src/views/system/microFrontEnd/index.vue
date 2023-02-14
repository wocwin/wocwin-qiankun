<template>
  <div class="app-container microFront_end">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入业务系统名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
          />
        </div>
        <div class="head-container-tree">
          <el-tree
            :data="systemOptions"
            :props="{children: 'children',label: 'label'}"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <div class="block_wrap">
          <t-query-condition :opts="opts" @submit="conditionEnter" />
        </div>
        <div class="block_wrap">
          <t-table
            title="微前端配置"
            :table="table"
            :columns="table.columns"
            @size-change="handlesSizeChange"
            @page-change="handlesCurrentChange"
          >
            <!-- 表格外按钮toolbar插槽 -->
            <template #toolbar>
              <el-button
                type="primary"
                size="mini"
                @click="handleAdd"
                v-hasPermi="'root:web:sys:microFrontEnd:add'"
              >新增</el-button>
            </template>
          </t-table>
        </div>
      </el-col>
    </el-row>
    <add-form ref="addForm" :systemList="systemList" @submit="submit" @cancel="cancel" />
  </div>
</template>
<script>
import AddForm from './addForm'
export default {
  name: 'MicroFrontEnd',
  components: { AddForm },
  data() {
    return {
      num: 0,
      deptName: '', // 系统筛选
      systemList: [], // 传值业务系统
      systemOptions: [], // 左侧数据业务系统
      // 查询参数
      queryData: {
        appName: null, // 应用名
        status: null, // 用户状态
        clientType: null, // 应用类型
        appGroup: null, // 左侧系统
        date: null, // 时间
      },
      clientTypeList: [
        {
          label: 'web端',
          key: 'B'
        },
        {
          label: 'app端',
          key: 'P'
        },
        {
          label: 'pad端',
          key: 'T'
        }
      ],
      statusList: [
        {
          label: '启用',
          key: true
        },
        {
          label: '停用',
          key: false
        }
      ],
      table: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        data: [],
        columns: [
          { prop: 'appName', label: '应用名称', minWidth: '120', align: 'left' },
          {
            prop: 'appType',
            label: '应用类型',
            minWidth: '80',
            align: 'left',
            customRender: {
              comps: [
                {
                  comp: 'div',
                  child: (scope) => [
                    {
                      comp: 'span',
                      text: scope.row.appType == 'M' ? '主应用' : scope.row.appType == 'C' ? '子应用' : '未知'
                    }
                  ]
                }
              ]
            }
          },
          { prop: 'packageName', label: '应用包名', minWidth: '100', align: 'left' },
          {
            prop: 'clientType',
            label: '客户端类型',
            minWidth: '80',
            align: 'left',
            render: (text) => {
              let val = ''
              switch (text) {
                case 'B':
                  val = 'web端'
                  break
                case 'P':
                  val = 'app端'
                  break
                case 'T':
                  val = 'pad端'
                  break
              }
              return (
                <div>{val}</div>
              )
            }
          },
          { prop: 'entry', label: '部署地址', minWidth: '160', align: 'left', isShowCol: true },
          { prop: 'entryInternet', label: '域名地址', minWidth: '160', align: 'left', isShowCol: true },
          { prop: 'activeRule', label: '激活路径', minWidth: '100', align: 'left' },
          // { prop: 'orderNum', label: '排序', minWidth: '40', align: 'left' },
          { prop: 'createBy', label: '创建人', minWidth: '60', align: 'left' },
          {
            prop: 'status', label: '状态', minWidth: '60', align: 'left',
            render: (text, record) => {
              return (
                <el-switch
                  active-value={true}
                  inactive-value={false}
                  v-model={record.status}
                  disabled={record.appType == 'M'}
                  onChange={() => this.handleStatusChange(record)}
                >
                  {text}
                </el-switch>
              )
            }
          },
          { prop: 'createTime', label: '创建时间', minWidth: '120', align: 'left' },
          { prop: 'remark', label: '备注', minWidth: '120', align: 'left' },
        ],
        // 表格内操作列
        operator: [
          {
            text: '新增',
            fun: this.handleAdd,
            show: { key: 'appType', val: ['M'] },
            hasPermi: 'root:web:sys:microFrontEnd:add'
          },
          {
            text: '编辑',
            fun: this.edit,
            hasPermi: 'root:web:sys:microFrontEnd:modify'
          },
          {
            text: '删除',
            fun: this.delHandle,
            show: { key: 'appType', val: ['C'] },
            hasPermi: 'root:web:sys:microFrontEnd:del'
          },
        ],
        // 操作列样式
        operatorConfig: {
          fixed: 'right', // 固定列表右边（left则固定在左边）
          width: '120px',
          label: '操作'
        }
      }
    }
  },
  computed: {
    opts() {
      return {
        appName: {
          label: '应用名称',
          comp: 'el-input'
        },
        status: {
          label: '应用状态',
          comp: 't-select',
          bind: {
            optionSource: this.statusList
          }
        },
        date: {
          label: '创建时间',
          comp: 'el-date-picker',
          span: 2,
          bind: {
            type: 'datetimerange',
            rangeSeparator: '-',
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            valueFormat: 'yyyy-MM-dd HH:mm:ss'
          }
        },
        clientType: {
          label: '应用类型',
          comp: 't-select',
          bind: {
            optionSource: this.clientTypeList
          }
        },
      }
    },
    getQueryData() {
      const { appName, status, appGroup, clientType, date } = this.queryData
      return {
        appName,
        status,
        sbeginTime: date && date[0] ? date[0] : null,
        endTime: date && date[1] ? date[1] : null,
        clientType,
        appGroup,
        domainOnly: this.checkdomain(),
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
      }
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.init()
  },
  mounted() {
    if (this.checkdomain()) {
      this.table.columns.map(item => {
        if (item.prop == 'entry') {
          this.$set(item, 'isShowCol', false)
        }
      })
    } else {
      this.table.columns.map(item => {
        if (item.prop == 'entryInternet') {
          this.$set(item, 'isShowCol', false)
        }
      })
    }
  },
  methods: {
    // 初始化调用接口
    init() {
      this.getSystemTree()
      this.getList()
    },
    // 获取业务系统树
    async getSystemTree() {
      // const res = await Api.listAppGroup()
      // if (res.success) {
      //   this.systemOptions = res.data
      //   this.systemList = []
      //   const list = { id: res.data[0]?.id, label: res.data[0]?.label }
      //   this.systemList = [list, ...res.data[0]?.children]
      // }
    },
    /** 查询列表 */
    async getList() {
      // const res = await Api.listMicro(this.getQueryData)
      // if (res.success) {
      //   this.num++
      //   if (this.checkdomain()) {
      //     if (this.num < 2) {
      //       this.$resetMessage.success('当前为外网访问，仅展示外网可用应用！')
      //     }
      //   }
      //   this.table.data = res.data.rows
      //   this.table.total = res.data.total
      // }
    },
    // 点击查询按钮
    conditionEnter(data) {
      this.queryData = data
      this.handlesCurrentChange(1)
    },
    // 选择当前展示的总页码
    handlesSizeChange(val) {
      this.table.pageSize = val
      this.getList()
    },
    // 选择当前页码
    handlesCurrentChange(val) {
      // console.log(111, val)
      this.table.currentPage = val
      this.getList()
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      if (data.id != 1) {
        this.$set(this.queryData, 'appGroup', data.label)
      } else {
        this.$set(this.queryData, 'appGroup', null)
      }
      this.getList()
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.status == true ? '启用' : '停用'
      this.$confirm(`确认要${text}${row.appName}应用吗?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).then(async () => {
        // const res = await Api.saveMicro(row)
        // if (res.success) {
        //   this.$message.success(`${text}成功`)
        //   this.getList()
        // }
      }).catch(() => {
        row.status = row.status == true ? false : true
      })
    },
    /** 新增按钮操作 */
    async handleAdd() {
      this.$refs.addForm.toDoAdd()
    },
    // 编辑
    async edit(data) {
      // console.log('编辑', data)
      this.$refs.addForm.edit(data)
      this.init()
    },
    /** 删除按钮操作 */
    delHandle({ appId, appName }) {
      this.$confirm(`是否确认删除${appName}应用?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const res = await Api.delMicro(appId)
        // if (res.success) {
        //   this.$message.success(`删除成功`)
        //   this.init()
        // }
      })
    },
    // 弹窗取消事件
    cancel() {
      this.$refs.addForm.reset()
      this.getList()
    },
    // 弹窗确认事件
    submit() {
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
.microFront_end {
  .block_wrap {
    ::v-deep .t-table {
      .el-table__body-wrapper {
        .el-table__body {
          .cell {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
  .head-container {
    background-color: #fff;
  }
  .head-container-tree {
    margin-top: 15px;
    padding: 10px 5px;
    max-height: 820px;
    overflow: auto;
    background-color: #fff;
    ::v-deep .el-tree-node__content {
      height: 34px;
    }
    ::v-deep .el-tree-node:focus > .el-tree-node__content {
      color: #355db4; //节点的字体颜色
    }
  }
}
</style>
