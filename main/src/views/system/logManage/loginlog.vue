<template>
  <t-layout-page class="loginlog">
    <t-layout-page-item>
      <t-query-condition :opts="opts" :loading="loading" @submit="conditionEnter" />
    </t-layout-page-item>
    <t-layout-page-item>
      <t-table
        title="登录日志列表"
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
  </t-layout-page>
</template>

<script>
export default {
  name: 'Loginlog',
  data() {
    return {
      loading: false,
      // 查询参数
      queryData: {
        ipaddr: null, // 登录IP地址
        userName: null, // 用户账号
        status: null, // 状态
        date: null, // 操作时间
      },
      listTypeInfo: {
        statusList: [
          {
            label: '成功',
            key: 1
          },
          {
            label: '失败',
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
          { prop: 'userName', label: '用户账号', minWidth: 120 },
          { prop: 'ipaddr', label: '登录IP地址', minWidth: 120 },
          { prop: 'loginLocation', label: '登录地点', minWidth: 120 },
          { prop: 'browser', label: '	浏览器', minWidth: 120 },
          { prop: 'os', label: '	操作系统', minWidth: 120 },
          {
            prop: 'status', label: '	操作状态', minWidth: 120,
            render: (text) => {
              // （1正常 0异常）
              let type = ''
              let val = ''
              switch (text) {
                case true:
                  type = 'success'
                  val = '成功'
                  break
                case false:
                  type = 'danger'
                  val = '失败'
                  break
              }
              return (
                <el-tag type={type}>
                  {val}
                </el-tag>
              )
            }
          },
          { prop: 'loginTime', label: '	登录日期', minWidth: 120 }
        ]
      }
    }
  },
  computed: {
    opts() {
      return {
        ipaddr: {
          label: '登录IP地址',
          comp: 'el-input'
        },
        userName: {
          label: '用户账号',
          comp: 'el-input'
        },
        date: {
          label: '登录时间',
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
        status: {
          label: '状态',
          comp: 't-select',
          bind: {
            optionSource: this.listTypeInfo.statusList
          }
        },
      }
    },
    getQueryData() {
      const { ipaddr, userName, status, date } = this.queryData
      return {
        ipaddr,
        userName,
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
      // const res = await this.$api.loginInfoList(this.getQueryData)
      // if (res.success) {
      //   // console.log(111, res.data)
      //   this.table.data = res.data.rows
      //   this.table.total = res.data.total
      // }
      // this.loading = false
    },
    // 复选框选中
    selectionChange(data) {
      // console.log('复选框选中', data)
      this.ids = data.map(item => item.infoId)
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
        // const res = await this.$api.deleteLoginInfo(this.ids)
        // if (res.success) {
        //   this.$message.success(`删除成功`)
        //   this.isFillList()
        // }
      })
    },
    // 清空
    cleanAll() {
      this.$confirm(`确认要清空所有登录日志?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const res = await this.$api.cleanLoginInfo()
        // if (res.success) {
        //   this.$message.success(`登录日志已清空`)
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
    }
  }
}
</script>
