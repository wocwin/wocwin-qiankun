<template>
  <div class="app-container user">
    <div class="block_wrap">
      <t-query-condition :opts="opts" :loading="loading" @submit="conditionEnter" />
    </div>
    <div class="block_wrap">
      <t-table
        title="岗位管理列表"
        :table="table"
        isCopy
        :columns="table.columns"
        @selection-change="selectionChange"
        @size-change="handlesSizeChange"
        @page-change="handlesCurrentChange"
      >
        <!-- 状态插槽 -->
        <template #status="{param}">
          <el-switch
            v-model="param.row.status"
            :active-value="true"
            :inactive-value="false"
            @change="handleStatusChange(param.row)"
          ></el-switch>
        </template>
        <!-- 表格外按钮toolbar插槽 -->
        <template #toolbar>
          <el-button
            type="primary"
            size="mini"
            @click="handleAdd"
            v-hasPermi="'root:web:sys:user:add'"
          >新增</el-button>
          <el-button
            type="danger"
            size="mini"
            :disabled="postIds.length < 1"
            @click="delHandle"
            v-hasPermi="'root:web:sys:user:del'"
          >批量删除</el-button>
        </template>
      </t-table>
    </div>
    <add-form ref="addForm" @submit="submit" />
  </div>
</template>

<script>
import AddForm from './addForm'

export default {
  name: 'Post',
  components: { AddForm },
  data () {
    return {
      loading: false,
      // 查询参数
      queryData: {
        postName: undefined, // 岗位名称
        postCode: undefined, // 岗位编码
        status: undefined, // 状态
        deptId: null, // 左侧部门
      },
      postIds: [], // 复选框
      table: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        firstColumn: { type: 'selection' },
        data: [],
        columns: [
          { prop: 'postName', label: '岗位名称', minWidth: 120 },
          { prop: 'postCode', label: '岗位编码', minWidth: 120 },
          { prop: 'postSort', label: '排序', minWidth: 120 },
          { prop: 'createTime', label: '创建时间', minWidth: 140 },
          { prop: 'status', label: '状态', slotName: 'status' },
        ],
        // 表格内操作列
        operator: [
          {
            text: '编辑',
            fun: this.edit,
            hasPermi: 'root:web:sys:post:alter'
          },
          {
            text: '删除',
            fun: this.delHandle,
            hasPermi: 'root:web:sys:post:del'
          },
        ],
        // 操作列样式
        operatorConfig: {
          fixed: 'right', // 固定列表右边（left则固定在左边）
          width: 140,
          label: '操作'
        }
      },
    }
  },
  computed: {
    opts () {
      return {
        postName: {
          label: '岗位名称',
          comp: 'el-input'
        },
        postCode: {
          label: '岗位编码',
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
      const { postName, postCode, status } = this.queryData
      return {
        postName,
        postCode,
        status
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    /** 查询岗位列表 */
    async getList () {
      // this.loading = true
      // const params = {
      //   ...this.getQueryData,
      //   pageNum: this.table.currentPage,
      //   pageSize: this.table.pageSize,
      // }
      // const res = await Api.listPost(params)
      // if (res.success) {
      //   this.table.data = res.data.rows
      //   this.table.total = res.data.total
      // }
      // this.loading = false
    },
    // 查询按钮
    conditionEnter (data) {
      this.queryData = data
      this.handlesCurrentChange(1)
    },
    // 选择当前展示的总页码
    handlesSizeChange (val) {
      this.table.pageSize = val
      this.getList()
    },
    // 选择当前页码
    handlesCurrentChange (val) {
      this.table.currentPage = val
      this.getList()
    },
    // 岗位状态修改
    handleStatusChange (row) {
      let text = row.status === true ? '启用' : '停用'
      this.$confirm(`确认要${text}${row.postName}岗位吗?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).then(async () => {
        // const res = await Api.updatePost(row)
        // if (res.success) {
        //   this.$message.success(`${text}成功`)
        //   this.handlesCurrentChange(1)
        // }
      }).catch(() => {
        row.status = row.status === true ? false : true
      })
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
    //判断数据是否可以满一页
    isFillList () {
      if (this.table.data.length == 1 && this.table.currentPage > 1) {
        this.table.currentPage -= 1
      }
      this.getList()
    },
    // 复选框选中
    selectionChange (data) {
      this.postIds = data.map(item => item.postId)
      // console.log(77, this.postIds)
    },
    /** 删除按钮操作 */
    delHandle (row) {
      const postIds = row.postId || this.postIds.join(',')
      this.$confirm(`是否确认删除岗位?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const res = await Api.delPost(postIds)
        // // console.log('删除', res, postIds)
        // if (res.success) {
        //   this.postIds = []
        //   this.$message.success(`删除成功`)
        //   this.isFillList()
        // }
      })
    },
    // 弹窗确认事件
    submit () {
      this.table.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  .head-container {
    background-color: #fff;
  }
  .head-container-tree {
    margin-top: 15px;
    padding: 10px 5px;
    max-height: 790px;
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