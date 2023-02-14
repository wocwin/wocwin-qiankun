<template>
  <div class="app-container user">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small" prefix-icon="el-icon-search" />
        </div>
        <div class="head-container-tree">
          <el-tree :data="deptOptions" :props="{children: 'children',label: 'label'}" :expand-on-click-node="false"
            :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <div class="block_wrap">
          <t-query-condition :opts="opts" :loading="loading" @submit="conditionEnter" />
        </div>
        <div class="block_wrap">
          <t-table title="用户管理列表" :table="table" isCopy :columns="table.columns" @selection-change="selectionChange"
            @size-change="handlesSizeChange" @page-change="handlesCurrentChange">
            <!-- 状态插槽 -->
            <template #status="{param}">
              <el-switch v-model="param.row.status" :active-value="true" :inactive-value="false"
                @change="handleStatusChange(param.row)"></el-switch>
            </template>
            <!-- 表格外按钮toolbar插槽 -->
            <template #toolbar>
              <el-button type="primary" size="mini" @click="handleAdd" v-hasPermi="'root:web:sys:user:add'">新增
              </el-button>
              <el-button type="danger" size="mini" :disabled="userIds.length < 1" @click="delHandle"
                v-hasPermi="'root:web:sys:user:del'">批量删除</el-button>
            </template>
          </t-table>
        </div>
      </el-col>
    </el-row>
    <add-form ref="addForm" :deptOptions="deptOptions" :postData="postData" @submit="submit" />
    <reset-password ref="resetUserForm" @pwdsubmit="submit" />
  </div>
</template>

<script>
import AddForm from './addForm'
import ResetPassword from './ResetPassword.vue'

export default {
  name: 'User',
  components: { ResetPassword, AddForm },
  data () {
    return {
      deptName: '', // 部门筛选
      deptOptions: [], // 左侧数据
      systemList: [], // 系统数据
      loading: false,
      postData: [], // 岗位数据
      roleData: [], // 角色数据
      // 查询参数
      queryData: {
        userName: undefined, // 登录名
        phonenumber: undefined, // 手机号码
        status: undefined, // 用户状态
        nickName: undefined, // 用户状态
        postName: null, // 岗位
        systemId: null, // 系统
        deptId: null, // 左侧部门
      },
      userIds: [], // 复选框
      table: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        firstColumn: { type: 'selection' },
        data: [],
        columns: [
          { prop: 'userName', label: '登录名', minWidth: 120 },
          { prop: 'nickName', label: '姓名', minWidth: 120 },
          { prop: 'phonenumber', label: '手机', minWidth: 120 },
          {
            prop: 'deptName',
            label: '部门',
            minWidth: 120,
            customRender: {
              comps: [
                {
                  comp: 'div',
                  child: (scope) => [
                    {
                      comp: 'span',
                      text: scope.row.depts && scope.row.depts[0].deptName
                    }
                  ]
                }
              ]
            }
          },
          {
            prop: 'postName',
            label: '岗位',
            minWidth: 120,
            customRender: {
              comps: [
                {
                  comp: 'div',
                  child: (scope) => [
                    {
                      comp: 'span',
                      text: scope.row.post?.postName
                    }
                  ]
                }
              ]
            }
          },
          {
            prop: 'roles',
            label: '角色',
            minWidth: 120,
            noShowTip: true,
            customRender: {
              comps: [
                {
                  comp: 'div',
                  child: (scope) => [
                    {
                      comp: 'span',
                      text: (scope.row.roles?.map(item => { return item.roleName }))?.join(',')
                    }
                  ]
                }
              ]
            }
          },
          { prop: 'createTime', label: '创建时间', minWidth: 140 },
          { prop: 'status', label: '状态', slotName: 'status' },
        ],
        // 表格内操作列
        operator: [
          {
            text: '编辑',
            fun: this.edit,
            hasPermi: 'root:web:sys:user:alter'
          },
          {
            text: '删除',
            fun: this.delHandle,
            show: { key: 'admin', val: [false] },
            hasPermi: 'root:web:sys:user:del'
          },
          {
            text: '重置密码',
            fun: this.resetHandle,
            hasPermi: 'root:web:sys:user:resetpass'
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
        userName: {
          label: '登录名称',
          comp: 'el-input'
        },
        phonenumber: {
          label: '手机号码',
          comp: 'el-input'
        },
        postName: {
          label: '岗位',
          comp: 'el-select',
          changeEvent: 'change',
          child: this.postData.reduce((acc, cur) => {
            acc.push({
              comp: 'el-option',
              value: cur.postName,
              bind: {
                label: cur.postName,
                key: cur.postName
              }
            })
            return acc
          }, [])
        },
        status: {
          label: '用户状态',
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
        nickName: {
          label: '姓名',
          comp: 'el-input'
        },
        systemId: {
          label: '系统',
          comp: 'el-select',
          changeEvent: 'change',
          child: this.systemList.reduce((acc, cur) => {
            acc.push({
              comp: 'el-option',
              value: cur.id,
              bind: {
                label: cur.label,
                key: cur.id
              }
            })
            return acc
          }, [])
        },
      }
    },
    getQueryData () {
      const { userName, phonenumber, status, postName, deptId, systemId, nickName } = this.queryData
      return {
        userName,
        phonenumber,
        status,
        postName,
        nickName,
        systemId,
        deptId
      }
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.getRoleData()
    this.getSystemDrawDown()
    this.getDeptTreeSelectData()
  },
  methods: {
    /** 查询用户列表 */
    async getList () {
      // this.loading = true
      // const params = {
      //   ...this.getQueryData,
      //   pageNum: this.table.currentPage,
      //   pageSize: this.table.pageSize,
      // }
      // const res = await Api.listUser(params)
      // if (res?.success) {
      //   this.table.data = res.data.rows
      //   this.table.total = res.data.total
      // }
      // this.loading = false
    },
    // 获取系统数据
    async getSystemDrawDown () {
      // const res = await Api.systemDrawDown()
      // if (res.code === 200) {
      //   this.systemList = res.data
      // }
    },
    // 获取岗位角色数据
    async getRoleData () {
      // const res = await Api.getRoleData()
      // if (res.code === 200) {
      //   // console.log('debugger:我看看', res.data)
      //   this.roleData = res.data.roles || []
      //   this.postData = res.data.posts || []
      // }
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
    // 用户状态修改
    handleStatusChange (row) {
      let text = row.status === true ? '启用' : '停用'
      this.$confirm(`确认要${text}${row.userName}用户吗?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).then(async () => {
        // const res = await Api.changeUserStatus(row)
        // if (res.success) {
        //   this.$message.success(`${text}成功`)
        //   this.getList()
        // }
      }).catch(() => {
        row.status = row.status === true ? false : true
      })
    },
    /** 查询部门下拉树结构 */
    async getDeptTreeSelectData () {
      // const res = await Api.treeselect()
      // if (res.success) {
      //   this.deptOptions = res.data
      //   if (this.deptOptions.length > 0) { // 默认选中根节点
      //     this.queryData.deptId = this.deptOptions[0].id
      //     this.table.currentPage = 1
      //     this.getList() // 初始化渲染，需在部门树默认节点后请求列表数据
      //   }
      // }
    },
    // 筛选节点
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick (data) {
      console.log('节点单击事件部门', data.id)
      // this.queryData.deptId = data.id
      this.$set(this.queryData, 'deptId', data.id)
      this.table.currentPage = 1
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.$refs.addForm.toDoAdd(this.roleData)
    },
    // 编辑
    edit (data) {
      console.log('编辑', data)
      this.$refs.addForm.edit(data.userId, this.roleData)
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
      this.userIds = data.map(item => item.userId)
      // console.log(77, this.userIds)
    },
    /** 删除按钮操作 */
    delHandle (row) {
      const userIds = row.userId || this.userIds.join(',')
      this.$confirm(`是否确认删除用户?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const res = await Api.delUser(userIds)
        // // console.log('删除', res, userIds)
        // if (res.success) {
        //   this.userIds = []
        //   this.$message.success(`删除成功`)
        //   this.isFillList()
        // }
      })
    },
    // 重置密码
    resetHandle (row) {
      // console.log('reset', row)
      this.$refs.resetUserForm.open(row.userId)
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
    max-height: 820px;
    overflow: auto;
    background-color: #fff;

    ::v-deep .el-tree-node__content {
      height: 34px;
    }

    ::v-deep .el-tree-node:focus>.el-tree-node__content {
      color: #355db4; //节点的字体颜色
    }
  }
}
</style>