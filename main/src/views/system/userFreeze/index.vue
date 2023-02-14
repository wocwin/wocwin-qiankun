<template>
  <t-layout-page class="user_freeze">
    <t-layout-page-item>
      <t-query-condition :opts="opts" :loading="loading" @submit="conditionEnter" />
    </t-layout-page-item>
    <t-layout-page-item>
      <t-table
        title="已冻结用户列表"
        size
        :table="table"
        :tableList="list"
        :columns="table.columns"
        @page-change="handlesCurrentChange"
      />
    </t-layout-page-item>
  </t-layout-page>
</template>

<script>
export default {
  name: 'UserFreeze',
  data () {
    return {
      loading: false,
      // 查询参数
      queryData: {
        pattern: null, // 用户名称
      },
      tableList: [], // 总数据源
      list: [], // 当前展示的数据
      table: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        // data: [],
        columns: [
          { prop: 'userName', label: '登录名称', minWidth: 120 },
          { prop: 'nickName', label: '姓名', minWidth: 120 },
          {
            prop: 'gender', label: '性别', minWidth: 80,
            render: (text) => {
              let name = ''
              switch (text) {
                case '0':
                  name = '男'
                  break
                case '1':
                  name = '女'
                  break
                case '2':
                  name = '未知'
                  break
              }
              return (
                <div>{name}</div>
              )
            }
          },
          { prop: 'dept', label: '部门', minWidth: 120 },
          { prop: 'post', label: '岗位', minWidth: 120 },
          { prop: 'ttl', label: '剩余冻结（分钟）', minWidth: 140 },
        ],
        // 表格内操作列
        operator: [
          {
            text: '解冻',
            fun: this.unFreezeUser,
          }
        ],
        // 操作列样式
        operatorConfig: {
          fixed: 'right', // 固定列表右边（left则固定在左边）
          width: 80,
          label: '操作'
        }
      },
    }
  },
  computed: {
    opts () {
      return {
        pattern: {
          label: '用户名称',
          comp: 'el-input'
        }
      }
    },
    getQueryData () {
      const { pattern } = this.queryData
      return {
        pattern
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    /** 查询解冻列表 */
    async getList () {
      // this.loading = true
      // const res = await this.$api.getFrozenUsers(this.getQueryData)
      // if (res.success) {
      //   console.log(111, res)
      //   this.tableData = res.data
      //   this.table.total = res.data?.length
      //   this.list = this.tableData ? this.tableData.slice(
      //     (this.table.currentPage - 1) * this.table.pageSize,
      //     this.table.currentPage * this.table.pageSize
      //   ) : []
      // }
      // this.loading = false
    },
    // 解冻
    async unFreezeUser ({ userName }) {
      // const res = await this.$api.unFreezeUser(userName)
      // // console.log(777, res)
      // if (res.success) {
      //   this.$message.success('解冻成功！')
      //   this.getList()
      // }
    },
    // 查询按钮
    conditionEnter (data) {
      this.queryData = data
      this.handlesCurrentChange(1)
    },
    // 选择当前页码
    handlesCurrentChange (val) {
      this.table.currentPage = val
      this.getList()
    }
  }
}
</script>
