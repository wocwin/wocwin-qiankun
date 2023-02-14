<template>
  <t-layout-page class="operlog">
    <t-layout-page-item>
      <t-query-condition :opts="opts" :loading="loading" @submit="conditionEnter" />
    </t-layout-page-item>
    <t-layout-page-item>
      <t-table
        title="操作日志列表"
        :table="table"
        :columns="table.columns"
        @size-change="handlesSizeChange"
        @page-change="handlesCurrentChange"
        @selection-change="selectionChange"
      >
        <template #toolbar>
          <el-button type="primary" size="mini" @click="cleanAll">清空</el-button>
          <el-button type="danger" :disabled="ids.length < 1" size="mini" @click="delHandle">删除</el-button>
        </template>
      </t-table>
    </t-layout-page-item>
    <t-dialog
      title="操作日志详情"
      width="50%"
      class="detail_log"
      :visible="formDemoDialog"
      @update:visible="formDemoDialog=false"
    >
      <t-detail :listTypeInfo="listTypeInfo" :dataList="dataList" :descData="descData" />
    </t-dialog>
  </t-layout-page>
</template>

<script>
export default {
  name: 'Operlog',
  data() {
    return {
      loading: false,
      // 查询参数
      queryData: {
        systemName: null, // 业务系统
        title: null, // 业务模块
        operName: null, // 操作人员
        businessType: null, // 操作类型
        status: null, // 状态
        date: null, // 操作时间
      },
      listTypeInfo: {
        businessTypeList: [
          {
            label: '其他',
            key: 0
          },
          {
            label: '新增',
            key: 1
          },
          {
            label: '修改',
            key: 2
          },
          {
            label: '删除',
            key: 3
          }
        ],
        statusList: [
          {
            label: '正常',
            key: 1
          },
          {
            label: '异常',
            key: 0
          }
        ],
      },
      ids: [], // 复选框选中
      table: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        firstColumn: { type: 'selection' },
        data: [],
        columns: [
          { prop: 'systemName', label: '业务系统', minWidth: 120 },
          { prop: 'title', label: '业务模块', minWidth: 120 },
          { prop: 'methodDesc', label: '方法描述', minWidth: 120 },
          {
            prop: 'businessType', label: '操作类型', minWidth: 80,
            render: (text) => {
              // 0其它 1新增 2修改 3删除
              let type = ''
              let val = ''
              switch (text) {
                case 0:
                  type = 'info'
                  val = '其它'
                  break
                case 1:
                  type = 'success'
                  val = '新增'
                  break
                case 2:
                  type = 'warning'
                  val = '修改'
                  break
                case 3:
                  type = 'danger'
                  val = '删除'
                  break
              }
              return (
                <el-tag type={type}>
                  {val}
                </el-tag>
              )
            }
          },
          { prop: 'requestMethod', label: '请求方式', minWidth: 80, },
          { prop: 'operName', label: '操作人员', minWidth: 120 },
          { prop: 'deptName', label: '	部门名称', minWidth: 120 },
          { prop: 'operIp', label: '	主机地址', minWidth: 120 },
          {
            prop: 'status', label: '	操作状态', minWidth: 120,
            render: (text) => {
              // （1正常 0异常）
              let type = ''
              let val = ''
              switch (text) {
                case true:
                  type = 'success'
                  val = '正常'
                  break
                case false:
                  type = 'danger'
                  val = '异常'
                  break
              }
              return (
                <el-tag type={type}>
                  {val}
                </el-tag>
              )
            }
          },
          { prop: 'operTime', label: '	操作时间', minWidth: 120 },

          {
            prop: 'operatorType', label: '操作类别', minWidth: 140,
            render: (text) => {
              // （0其它 1后台用户 2手机端用户）
              let val = ''
              switch (text) {
                case 0:
                  val = '其它'
                  break
                case 1:
                  val = '后台用户'
                  break
                case 2:
                  val = '手机端用户'
                  break
              }
              return (
                <el-tag>
                  {val}
                </el-tag>
              )
            }
          },
        ],
        // 表格内操作列
        operator: [
          {
            text: '详情',
            fun: this.detail,
          }
        ],
        // 操作列样式
        operatorConfig: {
          fixed: 'right', // 固定列表右边（left则固定在左边）
          width: 80,
          label: '操作'
        }
      },
      formDemoDialog: false,
      dataList: {},
      descData: [
        {
          label: '业务系统',
          fieldName: 'systemName',
          span: 2,
          value: ''
        },
        {
          label: '业务模块',
          fieldName: 'title',
          span: 2,
          value: ''
        },
        {
          label: '方法描述',
          span: 2,
          fieldName: 'methodDesc',
          value: ''
        },
        {
          label: '请求URL',
          span: 2,
          fieldName: 'operUrl',
          value: ''
        },
        {
          label: '登录信息',
          span: 2,
          fieldName: 'logininfo',
          value: ''
        },
        {
          label: '请求方式',
          span: 2,
          fieldName: 'requestMethod',
          value: ''
        },
        {
          label: '操作方法',
          fieldName: 'method',
          span: 4,
          value: ''
        },
        {
          label: '请求参数',
          fieldName: 'operParam',
          span: 4,
          value: ''
        },
        {
          label: '返回参数',
          fieldName: 'jsonResult',
          span: 4,
          value: ''
        },
        {
          label: '操作类型',
          fieldName: 'businessType',
          value: '',
          filters: {
            list: 'businessTypeList',
            key: 'key',
            label: 'label'
          },
        },
        {
          label: '操作状态',
          fieldName: 'status',
          value: '',
          // filters: {
          //   list: 'statusList',
          //   key: 'key',
          //   label: 'label'
          // },
        },
        {
          label: '操作时间',
          fieldName: 'operTime',
          value: ''
        }
      ]
    }
  },
  computed: {
    opts() {
      return {
        systemName: {
          label: '业务系统',
          comp: 'el-input'
        },
        title: {
          label: '业务模块',
          comp: 'el-input'
        },
        operName: {
          label: '操作人员',
          comp: 'el-input'
        },
        businessType: {
          label: '操作类型',
          comp: 't-select',
          bind: {
            optionSource: this.listTypeInfo.businessTypeList
          }
        },
        status: {
          label: '状态',
          comp: 't-select',
          bind: {
            optionSource: this.listTypeInfo.statusList
          }
        },
        date: {
          label: '操作时间',
          comp: 'el-date-picker',
          span: 2,
          bind: {
            rangeSeparator: '-',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            type: "datetimerange"
          }
        },
      }
    },
    getQueryData() {
      const { title, systemName, operName, businessType, status, date } = this.queryData
      return {
        title,
        systemName,
        operName,
        businessType,
        status,
        beginTime: date && date[0] ? date[0] : null,
        endTime: date && date[1] ? date[1] : null,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    async getList() {
      // this.loading = true
      // const res = await this.$api.listOplog(this.getQueryData)
      // if (res.success) {
      //   console.log(111, res.data)
      //   this.table.data = res.data.rows
      //   this.table.total = res.data.total
      // }
      // this.loading = false
    },
    // 复选框选中
    selectionChange(data) {
      console.log('复选框选中', data)
      this.ids = data.map(item => item.operId)
    },
    //判断数据是否可以满一页
    isFillList() {
      const totalPage = Math.ceil((this.table.total - this.ids.length) / this.table.pageSize) // 总页数
      this.table.currentPage = this.table.currentPage > totalPage ? totalPage : this.table.currentPage
      this.table.currentPage = this.table.currentPage < 1 ? 1 : this.table.currentPage
      this.getList() // 查询列表的数据
    },
    /** 删除按钮操作 */
    delHandle() {
      this.$confirm(`是否确认删除日志?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const res = await this.$api.deleteOplog(this.ids)
        // if (res.success) {
        //   this.$message.success(`删除成功`)
        //   this.isFillList()
        // }
      })
    },
    // 清空
    cleanAll() {
      this.$confirm(`确认要清空所有操作日志?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const res = await this.$api.cleanOplog()
        // if (res.success) {
        //   this.$message.success(`操作日志已清空`)
        //   this.getList()
        // }
      })
    },
    // 查询按钮
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
    async detail({ operId }) {
      this.formDemoDialog = true
      // const res = await this.$api.oplogDetail(operId)
      // if (res.success) {
      //   this.dataList = res.data
      //   // 回显基础信息
      //   this.descData.map(item => {
      //     item.value = res.data[item.fieldName]
      //     if (item.fieldName == 'status') {
      //       item.value = res.data[item.fieldName] === true ? '正常' : '异常'
      //     }
      //     if (item.fieldName == 'logininfo') {
      //       item.value = `${res.data['operName']}/${res.data['deptName']}/${res.data['operIp']}`
      //     }
      //   })
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
.detail_log {
  ::v-deep .el-descriptions-item__content {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>