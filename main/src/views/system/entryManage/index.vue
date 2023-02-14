<template>
  <div class="app-container entry_manage">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="systemName"
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
            title="pda录入管理列表"
            :table="table"
            isCopy
            :columns="table.columns"
            @selection-change="selectionChange"
            @size-change="handlesSizeChange"
            @page-change="handlesCurrentChange"
          >
            <!-- 表格外按钮toolbar插槽 -->
            <template #toolbar>
              <input
                ref="excel-upload-input"
                class="excel-upload-input"
                type="file"
                accept=".xlsx, .xls"
                @change="handleClick"
              />
              <el-button
                size="mini"
                @click="downloadTemplate"
                v-hasPermi="'root:web:sys:entryManage:download'"
              >下载录入模板</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="importExcel"
                v-hasPermi="'root:web:sys:entryManage:import'"
              >批量导入</el-button>
              <el-button
                size="mini"
                @click="exportExcel"
                v-hasPermi="'root:web:sys:entryManage:export'"
              >导出</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleAdd"
                v-hasPermi="'root:web:sys:entryManage:add'"
              >新增</el-button>
              <el-button
                type="danger"
                size="mini"
                :disabled="ids.length < 1"
                @click="delHandle"
                v-hasPermi="'root:web:sys:entryManage:del'"
              >批量删除</el-button>
            </template>
          </t-table>
        </div>
      </el-col>
    </el-row>
    <add-form
      ref="roleAddForm"
      :systemList="systemList"
      :deptOptions="deptOptions"
      @submit="submit"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import AddForm from './addForm'
export default {
  name: 'EntryManage',
  components: { AddForm },
  data() {
    return {
      systemName: '', // 系统筛选
      systemOptions: [], // 左侧数据业务系统

      loading: false,
      systemList: [], // 系统数据
      deptOptions: [], // 部门数据
      // 查询参数
      queryData: {
        pdaBrand: null, // pda品牌
        pdaModel: null, // pda型号
        status: null, // 用户状态
        occupiedBy: null, // 领取人
        systemId: null, // 左侧系统
        date: null, // 创建时间
        deptName: null, // 部门名称
      },
      statusList: [
        {
          label: '启用',
          key: 1
        },
        {
          label: '停用',
          key: 2
        }
      ],
      ids: [], // 复选框
      table: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        firstColumn: { type: 'selection' },
        data: [],
        columns: [
          { prop: 'pdaBrand', label: 'PDA品牌', minWidth: 120 },
          { prop: 'pdaModel', label: 'PDA型号', minWidth: 120 },
          { prop: 'sn', label: '序列号', minWidth: 160 },
          { prop: 'imei1', label: 'IMEI', minWidth: 160 },
          { prop: 'occupiedBy', label: '领取人', minWidth: 110 },
          { prop: 'deptName', label: '部门名称', minWidth: 110 },
          {
            prop: 'status', label: '状态',
            render: (text, record) => {
              return (
                <el-switch
                  active-value={1}
                  inactive-value={2}
                  v-model={record.status}
                  onChange={() => this.handleStatusChange(record)}
                >
                  {text}
                </el-switch>
              )
            }
          },
          { prop: 'createTime', label: '创建时间', minWidth: 160 },
          { prop: 'createBy', label: '创建人', minWidth: 100 },
          { prop: 'remark', label: '备注', minWidth: 160 },

        ],
        // 表格内操作列
        operator: [
          {
            text: '编辑',
            hasPermi: 'root:web:sys:entryManage:edit',
            fun: this.edit
          },
          {
            text: '删除',
            hasPermi: 'root:web:sys:entryManage:del',
            fun: this.delHandle
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
    opts() {
      return {
        pdaBrand: {
          label: 'PDA品牌',
          comp: 'el-input'
        },
        pdaModel: {
          label: 'PDA型号',
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
          comp: 't-select',
          bind: {
            optionSource: this.statusList
          }
        },
        occupiedBy: {
          label: '领取人',
          comp: 'el-input'
        },
        deptName: {
          label: '部门名称',
          comp: 'el-input'
        },
      }
    },
    getQueryData() {
      const { pdaBrand, pdaModel, status, systemId, date, occupiedBy, deptName } = this.queryData
      return {
        pdaBrand,
        pdaModel,
        status,
        occupiedBy,
        deptName,
        beginTime: date && date[0] ? date[0] : null,
        endTime: date && date[1] ? date[1] : null,
        systemId,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
      }
    }
  },
  watch: {
    // 根据名称筛选系统树
    systemName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getSystemDrawDown()
    this.getSystemTree()
    this.getSelectData()
    this.getList()
  },
  methods: {
    // 获取系统数据
    async getSystemDrawDown() {
      // const res = await Api.systemDrawDown()
      // if (res.code === 200) {
      //   this.systemList = res.data
      // }
    },
    /** 查询用户列表 */
    async getList() {
      // this.loading = true
      // const res = await Api.listPda(this.getQueryData)
      // if (res.success) {
      //   this.table.data = res.data.rows
      //   this.table.total = res.data.total
      // }
      // this.loading = false
    },
    /** 查询部门下拉树结构 */
    async getSelectData() {
      // const res = await Api.treeselect()
      // if (res.success) {
      //   this.deptOptions = res.data
      // }
    },
    // 查询按钮
    conditionEnter(data) {
      // console.log(77, data)
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
      this.table.currentPage = val
      this.getList()
    },
    // 用户状态修改
    handleStatusChange(row) {
      // console.log(11122, row)
      let text = row.status === 1 ? '启用' : '停用'
      this.$confirm(`确认要${text}${row.pdaBrand}设备吗?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).then(async () => {
        // const res = await Api.changeStatusPda({
        //   id: row.id,
        //   status: row.status
        // })
        // if (res.success) {
        //   this.$message.success(`${text}成功`)
        //   this.getList()
        // }
      }).catch(() => {
        row.status = row.status === 1 ? 2 : 1
      })
    },
    // 获取业务系统树
    async getSystemTree() {
      // const res = await Api.systemTree()
      // if (res.success) {
      //   this.systemOptions = res.data
      // }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      if (data.id != 1) {
        this.$set(this.queryData, 'systemId', data.id)
      } else {
        this.$set(this.queryData, 'systemId', null)
      }
      this.table.currentPage = 1
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.roleAddForm.toDoAdd()
    },
    // 编辑
    edit(data) {
      console.log('编辑', data)
      this.$refs.roleAddForm.edit(data)
    },
    //判断数据是否可以满一页
    isFillList() {
      const totalPage = Math.ceil((this.table.total - this.ids.length) / this.table.pageSize) // 总页数
      this.table.currentPage = this.table.currentPage > totalPage ? totalPage : this.table.currentPage
      this.table.currentPage = this.table.currentPage < 1 ? 1 : this.table.currentPage
      this.getList() // 查询列表的数据
    },
    // 复选框选中
    selectionChange(data) {
      this.ids = data.map(item => item.id)
      console.log(77, this.ids.length)
    },
    /** 删除按钮操作 */
    delHandle(row) {
      const ids = row.id || this.ids.join(',')
      this.$confirm(`是否确认删除设备?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const res = await Api.delPda(ids)
        // // console.log('删除', res, ids)
        // if (res.success) {
        //   this.$message.success(`删除成功`)
        //   this.isFillList()
        // }
      })
    },
    // 取消弹窗事件
    cancel() {
      this.table.currentPage = 1
      this.getList()
    },
    // 弹窗确认事件
    submit() {
      console.log('弹窗确认事件')
      this.table.currentPage = 1
      this.getList()
    },
    // 下载录入模板
    downloadTemplate() {
      this.$download.excel('/portal-user/system/pda/template/download', 'PDA录入模板')
    },
    // 批量导入
    importExcel() {
      this.$refs['excel-upload-input'].click()
    },
    // 获取上传的文件
    handleClick(event) {
      const rawFile = event.target.files[0]
      this.filesName = rawFile.name && rawFile.name.split('.')[0]
      // console.log('获取上传的文件', rawFile, this.filesName)
      if (!rawFile) return
      let formData = new FormData()
      formData.append('file', rawFile)
      this.checkFile(formData)
    },
    // 解析excel
    checkFile(formData) {
      console.log('解析excel')
      // this.$api.importExcel(formData).then(res => {
      //   console.log(111, res)
      //   if (res.success) {
      //     this.$message({
      //       dangerouslyUseHTMLString: true,
      //       message: `总共${res.data.item}条数据<br />成功导入了${res.data.handled}条数，<br />${res.data.unrecognised == 0 ? '' : `<p style="color:red">失败了${res.data.unrecognised}条数据其序列号分别是${res.data.unrecognisedSet.length > 0 && res.data.unrecognisedSet.join(', ')}</p>`}`,
      //       type: 'success',
      //       duration: 5000,
      //     })
      //     this.getList()
      //   }
      // })
    },
    // 批量导出
    exportExcel() {
      console.log('批量导出')
    }
  }
}
</script>

<style lang="scss" scoped>
.entry_manage {
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
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
}
</style>