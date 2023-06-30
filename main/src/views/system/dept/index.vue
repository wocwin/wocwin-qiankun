<template>
  <div class="app-container dept">
    <div class="block_wrap">
      <t-query-condition :opts="opts" :loading="loading" @submit="conditionEnter" />
    </div>
    <div class="block_wrap">
      <t-table
        title="部门管理列表"
        :table="table"
        is-copy
        row-key="deptId"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :columns="table.columns"
        :is-show-pagination="false"
      >
        <!-- 状态插槽 -->
        <template #status="{param}">
          <el-switch
            v-model="param.row.status"
            :active-value="true"
            :inactive-value="false"
            @change="handleStatusChange(param.row)"
          />
        </template>
        <!-- 表格外按钮toolbar插槽 -->
        <template #toolbar>
          <input
            ref="excel-upload-input"
            style=" display: none;z-index: -9999;"
            type="file"
            accept=".xlsx, .xls"
            @change="handleClick"
          />
          <el-button
            v-hasPermi="'root:web:sys:dept:download'"
            size="mini"
            @click="downloadTemplate"
          >下载模板</el-button>
          <el-button
            v-hasPermi="'root:web:sys:dept:import'"
            type="primary"
            size="mini"
            @click="importExcel"
          >批量导入</el-button>
          <el-button v-hasPermi="'root:web:sys:dept:export'" size="mini" @click="exportExcel">导出</el-button>
          <el-button
            v-hasPermi="'root:web:sys:dept:add'"
            type="primary"
            size="mini"
            @click="handleAdd"
          >新增</el-button>
        </template>
      </t-table>
    </div>
    <add-form ref="addForm" :dept-data="deptOptions" @submit="submit" @cancel="cancel" />
  </div>
</template>
<script>
import AddForm from './addForm'
import dataList from './dataList.json'
export default {
  name: 'Dept',
  components: { AddForm },
  data() {
    return {
      loading: false,
      // 查询参数
      queryData: {
        deptName: undefined, // 部门名称
        deptNum: undefined, // 部门编码
        status: undefined // 状态
      },
      table: {
        data: [],
        columns: [
          { prop: 'deptName', label: '部门名称', minWidth: 180, align: 'left' },
          { prop: 'deptNum', label: '部门编码', minWidth: 180, align: 'left' },
          { prop: 'erpDeptNum', label: 'ERP部门编码', minWidth: 180, align: 'left' },
          { prop: 'orderNum', label: '排序', width: '60px', align: 'left' },
          { prop: 'createTime', label: '创建时间', width: '100px', align: 'left' },
          { prop: 'status', label: '状态', slotName: 'status', width: '80px', align: 'left' }
        ],
        // 表格内操作列
        operator: [
          {
            text: '编辑',
            fun: this.edit,
            hasPermi: 'root:web:sys:dept:alter'
          },
          {
            text: '删除',
            fun: this.delHandle,
            hasPermi: 'root:web:sys:dept:del'
          }
        ],
        // 操作列样式
        operatorConfig: {
          // fixed: 'right', // 固定列表右边（left则固定在左边）
          align: 'left',
          width: '80px',
          label: '操作'
        }
      },
      // 部门树选项
      deptOptions: []
    }
  },
  computed: {
    opts() {
      return {
        deptName: {
          label: '部门名称',
          comp: 'el-input'
        },
        deptNum: {
          label: '部门编码',
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
        }
      }
    },
    getQueryData() {
      const { deptName, status, deptNum } = this.queryData
      return {
        deptName,
        deptNum,
        status
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询岗位列表 */
    async getList() {
      this.loading = true
      // const res = await Api.listDept(this.getQueryData)
      const res = await dataList
      if (res.success) {
        this.table.data = this.handleTree(res.data, 'deptId')
      }
      this.loading = false
    },
    // 查询按钮
    conditionEnter(data) {
      this.queryData = data
      this.getList()
    },
    // 部门状态修改
    handleStatusChange(row) {
      const text = row.status === true ? '启用' : '停用'
      this.$confirm(`确认要${text}${row.deptName}部门吗?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).then(() => {
        // const res = await Api.updateDept(row)
        // if (res.success) {
        //   this.$message.success(`${text}成功`)
        //   this.getList()
        // }
      }).catch(() => {
        row.status = row.status !== true
      })
    },
    /** 查询部门下拉树结构 */
    async getTreeselect() {
      // const res = await Api.listDept()
      // if (res.success) {
      //   this.deptOptions = this.handleTree(res.data, 'deptId')
      // }
    },
    /** 新增按钮操作 */
    async handleAdd() {
      await this.getTreeselect()
      this.$refs.addForm.toDoAdd()
    },
    // 编辑
    async edit(data) {
      // console.log('编辑', data)
      await this.getTreeselect()
      this.$refs.addForm.edit(data)
    },
    /** 删除按钮操作 */
    delHandle({ deptId, deptName }) {
      this.$confirm(`是否确认删除${deptName}部门?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // const res = await Api.delDept(deptId)
        // if (res.success) {
        //   this.$message.success(`删除成功`)
        //   this.getList()
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
      this.getList()
    },
    // 下载录入模板
    downloadTemplate() {
      this.$download.excel('/portal-user/system/dept/download/template', '部门录入模板')
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
      const formData = new FormData()
      formData.append('file', rawFile)
      this.checkFile(formData)
    },
    // 解析excel
    checkFile(formData) {
      // this.$api.importDeptExcel(formData).then(res => {
      //   console.log(111, res)
      //   if (res.success) {
      //     this.$message({
      //       dangerouslyUseHTMLString: true,
      //       message: `总共${res.data.item}条数据<br />成功导入了${res.data.handled}条数，<br />${res.data.unrecognised == 0 ? '' : `<p style="color:red">失败了${res.data.unrecognised}条数据，其序列号分别是${res.data.unrecognisedSet.length > 0 && res.data.unrecognisedSet.join(', ')}</p>`}`,
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
