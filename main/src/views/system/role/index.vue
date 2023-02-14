<template>
  <div class="app-container role">
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
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <div class="block_wrap">
          <t-query-condition
            labelWidth="120px"
            :opts="opts"
            :loading="loading"
            @submit="conditionEnter"
          />
        </div>
        <div class="block_wrap">
          <t-table
            title="角色管理列表"
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
                :disabled="param.row.admin"
                @change="handleStatusChange(param.row)"
              ></el-switch>
            </template>
            <!-- 表格外按钮toolbar插槽 -->
            <template #toolbar>
              <el-button
                type="primary"
                size="mini"
                @click="handleAdd"
                v-hasPermi="'root:web:sys:role:add'"
              >新增</el-button>
              <el-button
                type="danger"
                size="mini"
                :disabled="roleIds.length < 1"
                @click="delHandle"
                v-hasPermi="'root:web:sys:role:del'"
              >批量删除</el-button>
            </template>
          </t-table>
        </div>
      </el-col>
    </el-row>
    <add-form
      ref="roleAddForm"
      :deptOptions="deptOptions"
      :systemList="systemList"
      :dataScope="dataScopeList"
      @submit="submit"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import AddForm from './addForm'
import moment from 'moment'
export default {
  name: 'Role',
  components: { AddForm },
  data () {
    return {
      deptName: '', // 部门筛选
      deptOptions: [], // 左侧数据
      systemOptions: [], // 左侧数据业务系统

      loading: false,
      postData: [], // 岗位数据
      roleData: [], // 角色数据
      systemList: [], // 系统数据
      dataScopeList: [], // 数据范围
      // 查询参数
      queryData: {
        roleName: undefined, // 角色名称
        roleKey: undefined, // 权限字符
        status: undefined, // 用户状态
        beginTime: null, // 创建开始日期
        endTime: moment().format('yyyy-MM-DD 23:59:59'), // 创建结束日期
        systemId: null, // 左侧系统
      },
      roleIds: [], // 复选框
      table: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        firstColumn: { type: 'selection' },
        data: [],
        columns: [
          { prop: 'roleName', label: '角色名称', minWidth: 120 },
          { prop: 'roleKey', label: '权限字符', minWidth: 120 },
          { prop: 'createTime', label: '创建时间', minWidth: 140 },
          { prop: 'status', label: '状态', slotName: 'status' },
        ],
        // 表格内操作列
        operator: [
          {
            text: '编辑',
            fun: this.edit,
            show: { key: 'admin', val: [false] },
            hasPermi: 'root:web:sys:role:alter'
          },
          {
            text: '删除',
            fun: this.delHandle,
            show: { key: 'admin', val: [false] },
            hasPermi: 'root:web:sys:role:del'
          }
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
        roleName: {
          label: '角色名称',
          comp: 'el-input'
        },
        roleKey: {
          label: '权限字符',
          comp: 'el-input'
        },
        date: {
          label: '创建时间',
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
        longLiveRole: {
          label: 'Token自动续期',
          comp: 'el-select',
          changeEvent: 'change',
          child: [
            {
              comp: 'el-option',
              value: true,
              bind: {
                label: '是',
                key: true
              }
            },
            {
              comp: 'el-option',
              value: false,
              bind: {
                label: '否',
                key: false
              }
            }
          ]
        },
      }
    },
    getQueryData () {
      const { roleName, roleKey, status, systemId, date, longLiveRole } = this.queryData
      return {
        roleName,
        roleKey,
        status,
        longLiveRole,
        beginTime: date && date[0] ? date[0] : null,
        endTime: date && date[1] ? date[1] : null,
        systemId,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
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
    this.dataScope()
    this.getSystemDrawDown()
    this.getSystemTree()
    this.getRoleData()
    this.getDeptTreeSelectData()
    this.getList()
  },
  methods: {
    // 获取系统数据
    async getSystemDrawDown () {
      // const res = await Api.systemDrawDown()
      // if (res.code === 200) {
      //   this.systemList = res.data
      // }
    },
    // 获取数据范围
    async dataScope () {
      // const res = await Api.dataScope()
      // if (res.code === 200) {
      //   this.dataScopeList = res.data
      // }
    },
    /** 查询用户列表 */
    async getList () {
      // this.loading = true
      // const res = await Api.listRole(this.getQueryData)
      // if (res.success) {
      //   this.table.data = res.data.rows
      //   this.table.total = res.data.total
      // }
      // this.loading = false
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
      // console.log(77, data)
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
      this.$confirm(`确认要${text}${row.roleName}角色吗?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).then(async () => {
        // const res = await Api.changeRoleStatus({
        //   roleId: row.roleId,
        //   status: row.status
        // })
        // if (res.success) {
        //   this.$message.success(`${text}成功`)
        //   this.getList()
        // }
      }).catch(() => {
        row.status = row.status === true ? false : true
      })
    },
    // 获取业务系统树
    async getSystemTree () {
      // const res = await Api.systemTree()
      // if (res.success) {
      //   this.systemOptions = res.data
      // }
    },
    /** 查询部门下拉树结构 */
    async getDeptTreeSelectData () {
      // const res = await Api.treeselect()
      // if (res.success) {
      //   this.deptOptions = res.data
      // }
    },
    // 筛选节点
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick (data) {
      if (data.id != 1) {
        this.$set(this.queryData, 'systemId', data.id)
      } else {
        this.$set(this.queryData, 'systemId', null)
      }
      this.table.currentPage = 1
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.$refs.roleAddForm.toDoAdd()
    },
    // 编辑
    edit (data) {
      console.log('编辑', data)
      this.$refs.roleAddForm.edit(data)
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
      this.roleIds = data.map(item => item.roleId)
      // console.log(77, this.roleIds)
    },
    /** 删除按钮操作 */
    delHandle (row) {
      const roleIds = row.roleId || this.roleIds.join(',')
      this.$confirm(`是否确认删除角色?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const res = await Api.delRole(roleIds)
        // // console.log('删除', res, roleIds)
        // if (res.success) {
        //   this.roleIds = []
        //   this.$message.success(`删除成功`)
        //   this.isFillList()
        // }
      })
    },
    // 取消弹窗事件
    cancel () {
      this.table.currentPage = 1
      this.getList()
    },
    // 弹窗确认事件
    submit () {
      console.log('弹窗确认事件')
      this.table.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.role {
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