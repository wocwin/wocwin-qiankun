<template>
  <t-dialog
    title="字典数据列表"
    width="60%"
    :footer="null"
    :visible="dictDataDialog"
    @update:visible="dictDataDialog = false"
  >
    <div class="block_wrap quality_overflow">
      <t-table
        :table="table"
        :columns="table.columns"
        @size-change="handlesSizeChange"
        @page-change="handlesCurrentChange"
      >
        <!-- 表格外按钮toolbar插槽 -->
        <template #toolbar>
          <el-button size="small" type="primary" @click="dictAdd">新增</el-button>
          <!-- <el-button size="small" type="danger" :disabled="ids.length<1" @click="handleDelete">批量删除</el-button> -->
        </template>
      </t-table>
    </div>
    <!-- 新增编辑 -->
    <t-dialog
      :title="title"
      width="35%"
      append-to-body
      :visible="dictDataAddDialog"
      @update:visible="dictDataAddDialog = false"
    >
      <dict-data-add ref="dictDataAdd" :listTypeInfo="listTypeInfo" />
      <template #footer>
        <el-button size="small" @click="dictDataAddDialog = false">取消</el-button>
        <el-button type="primary" size="small" @click="submit">确定</el-button>
      </template>
    </t-dialog>
  </t-dialog>
</template>
<script>
import DictDataAdd from './dictDataAdd.vue'
export default {
  name: 'DictData',
  components: {
    DictDataAdd
  },
  data() {
    return {
      table: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        data: [],
        // firstColumn: { type: 'selection' },
        // 表格内操作列 stocktakeJobStatus
        operator: [
          {
            text: '编辑',
            fun: this.edit,
          },
          {
            text: '删除',
            fun: this.handleDelete,
          }
        ],
        // 操作列样式
        operatorConfig: {
          fixed: 'right', // 固定列表右边（left则固定在左边）
          width: 160,
          label: '操作'
        },
        columns: [
          { prop: 'dictCode', label: '字典编码', minWidth: '140' },
          { prop: 'dictLabel', label: '字典标签', minWidth: '200' },
          { prop: 'dictValue', label: '字典键值', minWidth: '120' },
          { prop: 'dictSort', label: '字典排序', minWidth: '120' },
          {
            prop: 'status', label: '状态', minWidth: '100',
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
                  val = '停用'
                  break
              }
              return (
                <el-tag type={type}>
                  {val}
                </el-tag>
              )
            }
          },
          { prop: 'createTime', label: '创建时间', minWidth: '160' },
          { prop: 'remark', label: '备注', minWidth: '200' },
        ]
      },
      // ids: [], // 选中的复选框
      /**
       * 弹窗
       */
      dictDataDialog: false, // 外层
      dictDataAddDialog: false, // 内
      title: '新增字典数据',
      flag: '',
      dictTypeData: this.dictType,
    }
  },
  props: {
    dictType: {
      type: String,
    },
    listTypeInfo: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    dictType(val) {
      this.dictTypeData = val
    }
  },
  // 方法
  methods: {
    // 获取列表数据
    async listData() {
      // const params = {
      //   pageNum: this.table.currentPage,
      //   pageSize: this.table.pageSize,
      // }
      // const res = await this.$api.listData(params, this.dictTypeData)
      // // console.log('获取列表数据', res.data.rows)
      // if (res.code == 200) {
      //   this.table.data = res.data.rows
      //   this.table.total = res.data.total
      // }
    },
    // 选择当前展示的总页码
    handlesSizeChange(val) {
      this.table.pageSize = val
      this.listData()
    },
    // 选择当前页码
    handlesCurrentChange(val) {
      // console.log(111, val)
      this.table.currentPage = val
      this.listData()
    },
    // // 复选框选中
    // selectionChange(selection) {
    //   this.ids = selection.map(item => item.dictCode)
    // },
    //判断数据是否可以满一页
    isFillList() {
      if (this.table.data.length == 1 && this.table.currentPage > 1) {
        this.table.currentPage -= 1
      }
      this.listData()
    },
    /** 删除按钮操作 */
    handleDelete({ dictCode }) {
      this.$confirm(`是否确认删除字典编号为${dictCode}的数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const res = await this.$api.delData(dictCode)
        // // console.log('删除', res)
        // if (res.code == 200) {
        //   this.$message.success(`删除成功`)
        //   this.isFillList()
        // }
      })
    },
    // 新增
    dictAdd() {
      this.title = '新增字典数据'
      this.dictDataAddDialog = true
      this.flag = 'add'
      this.$refs.dictDataAdd !== undefined && this.$refs.dictDataAdd.resetForm()
      this.$nextTick(() => {
        this.$refs.dictDataAdd.formOpts.formData.dictType = this.dictTypeData
      })
    },
    // table编辑
    edit(row) {
      this.title = '编辑字典数据'
      this.flag = 'edit'
      this.dictDataAddDialog = true
      this.$refs.dictDataAdd !== undefined && this.$refs.dictDataAdd.clearValidate()
      this.$nextTick(() => {
        this.$refs.dictDataAdd.formOpts.formData = row
      })
    },
    // 新增编辑弹窗确定按钮
    async submit() {
      try {
        const { valid, formData } = await this.$refs.dictDataAdd.validate()
        if (!valid) return
        if (this.flag == 'add') {
          // const res = await this.$api.addData(formData)
          // if (res.code == 200) {
          //   this.$message.success(`新增成功`)
          //   this.listData()
          //   this.dictDataAddDialog = false
          // }
        }
        if (this.flag == 'edit') {
          // const res = await this.$api.updateData(formData)
          // if (res.code == 200) {
          //   this.$message.success(`编辑成功`)
          //   this.listData()
          //   this.dictDataAddDialog = false
          // }
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
