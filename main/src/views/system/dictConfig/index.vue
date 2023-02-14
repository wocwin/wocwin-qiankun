<template>
  <t-layout-page class="dict_configuration">
    <t-layout-page-item>
      <t-query-condition :opts="opts" :loading="loading" @submit="conditionEnter" />
    </t-layout-page-item>
    <t-layout-page-item>
      <t-table
        title="字典配置列表"
        isCopy
        :table="table"
        :columns="table.columns"
        @selection-change="selectionChange"
        @size-change="handlesSizeChange"
        @page-change="handlesCurrentChange"
      >
        <!-- 表格外按钮toolbar插槽 -->
        <template #toolbar>
          <el-button size="small" type="primary" @click="dictAdd">新增</el-button>
          <el-button size="small" type="danger" @click="handleDelete" :disabled="ids.length<1">批量删除</el-button>
          <!-- <el-button size="small" @click="refresh">刷新缓存</el-button> -->
        </template>
      </t-table>
    </t-layout-page-item>
    <!-- 新增编辑 -->
    <t-dialog
      :title="title"
      class="ent-choose"
      width="30%"
      :visible="formDemoDialog"
      @update:visible="formDemoDialog = false"
    >
      <dict-add ref="dictAdd" :listTypeInfo="listTypeInfo" />
      <template #footer>
        <el-button size="small" @click="formDemoDialog = false">取消</el-button>
        <el-button type="primary" size="small" @click="submit">确定</el-button>
      </template>
    </t-dialog>
    <!-- 字典数据 -->
    <dict-data :dictType="dictType" :listTypeInfo="listTypeInfo" ref="dictData" />
  </t-layout-page>
</template>
<script>
import DictAdd from './dictAdd.vue'
import DictData from './dictData.vue'
export default {
  name: 'DictConfiguration',
  components: {
    DictAdd,
    DictData
  },
  data() {
    return {
      loading: false,
      // 查询条件
      queryData: {
        dictName: null, // 字典名称
        dictType: null, // 字典类型
        status: null, // 字典状态
        createDate: null, // 创建时间
      },
      table: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        data: [],
        firstColumn: { type: 'selection' },
        // 表格内操作列 stocktakeJobStatus
        operator: [
          {
            text: '编辑',
            fun: this.edit,
          },
          {
            text: '删除',
            fun: this.handleDelete,
          },
        ],
        // 操作列样式
        operatorConfig: {
          // fixed: 'right', // 固定列表右边（left则固定在左边）
          width: 120,
          label: '操作'
        },
        columns: [
          { prop: 'dictId', label: '字典编号', minWidth: '140' },
          { prop: 'dictName', label: '字典名称', minWidth: '200' },
          {
            prop: 'dictType', label: '字典类型', minWidth: '120',
            render: (text, row) => {
              return (
                <el-button
                  type="text"
                  onclick={() => this.dictData(row)}
                >
                  {text}
                </el-button>
              )
            }
          },
          {
            prop: 'status', label: '状态', minWidth: '120',
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
      listTypeInfo: {
        statusList: [
          {
            label: '正常',
            key: true
          },
          {
            label: '停用',
            key: false
          },
        ]
      },
      ids: [], // 选中的复选框
      /**
       * 弹窗
       */
      formDemoDialog: false,
      title: '新增字典配置',
      dictType: '', // 字典数据
      flag: '',
    }
  },
  computed: {
    opts() {
      return {
        dictName: {
          label: '字典名称',
          comp: 'el-input'
        },
        dictType: {
          label: '字典类型',
          comp: 'el-input'
        },
        createDate: {
          label: '创建时间',
          comp: 'el-date-picker',
          span: 2,
          bind: {
            type: 'datetimerange',
            rangeSeparator: '-',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
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
    // 查询条件所需参数
    getQueryData() {
      const { dictName, dictType, status, createDate } = this.queryData
      return {
        dictName, // 字典名称
        dictType, // 字典类型
        status, // 字典状态
        beginTime: createDate && createDate[0] ? createDate[0] : null,
        endTime: createDate && createDate[1] ? createDate[1] : null,
      }
    },
  },
  created() {
    this.getDicts()
    this.listType()
  },
  // 方法
  methods: {
    // 字典状态
    async getDicts() {
      // const res = await this.$api.getDicts('ce_shi')
      // if (res.success) {
      //   this.listTypeInfo.dictStatusList = res.data
      // }
    },
    // 获取列表数据
    async listType() {
      // this.loading = true
      // const params = {
      //   ...this.getQueryData,
      //   pageNum: this.table.currentPage,
      //   pageSize: this.table.pageSize,
      // }
      // const res = await this.$api.listType(params)
      // // console.log('获取列表数据', res.rows)
      // if (res.code == 200) {
      //   this.table.data = res.data.rows
      //   this.table.total = res.data.total
      // }
      // // console.log(3333, this.table)
      // this.loading = false
    },
    // 点击查询按钮
    conditionEnter(data) {
      this.queryData = data
      this.handlesCurrentChange(1)
    },
    // 选择当前展示的总页码
    handlesSizeChange(val) {
      this.table.pageSize = val
      this.listType()
    },
    // 选择当前页码
    handlesCurrentChange(val) {
      // console.log(111, val)
      this.table.currentPage = val
      this.listType()
    },
    // 刷新缓存
    async refresh() {
      // const res = await this.$api.refreshCache()
      // if (res.code == 200) {
      //   this.$message.success('刷新缓存成功')
      //   this.listType()
      // }
    },
    // 复选框选中
    selectionChange(selection) {
      this.ids = selection.map(item => item.dictId)
    },
    //判断数据是否可以满一页
    isFillList() {
      const totalPage = Math.ceil((this.table.total - this.ids.length) / this.table.pageSize) // 总页数
      this.table.currentPage = this.table.currentPage > totalPage ? totalPage : this.table.currentPage
      this.table.currentPage = this.table.currentPage < 1 ? 1 : this.table.currentPage
      this.listType()
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.dictId || this.ids
      this.$confirm(`是否确认删除字典编号为${dictIds}的数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const res = await this.$api.delType(dictIds)
        // console.log('删除', res)
        // if (res.success) {
        //   this.$message.success(`删除成功`)
        //   this.isFillList()
        // }
      })
    },
    // 新增
    dictAdd() {
      this.title = '新增字典配置'
      this.formDemoDialog = true
      this.flag = 'add'
      this.$refs.dictAdd !== undefined && this.$refs.dictAdd.resetForm()
    },
    // table编辑
    async edit(row) {
      this.title = '编辑字典配置'
      this.flag = 'edit'
      this.formDemoDialog = true
      this.$refs.dictAdd !== undefined && this.$refs.dictAdd.clearValidate()
      this.$nextTick(() => {
        this.$refs.dictAdd.formOpts.formData = row
      })
    },
    // 新增编辑弹窗确定按钮
    async submit() {
      try {
        const { valid, formData } = await this.$refs.dictAdd.validate()
        if (!valid) return
        if (this.flag == 'add') {
          // const res = await this.$api.addType(formData)
          // if (res.code == 200) {
          //   this.$message.success(`新增成功`)
          //   this.listType()
          //   this.formDemoDialog = false
          // }
        }
        if (this.flag == 'edit') {
          // const res = await this.$api.updateType(formData)
          // if (res.code == 200) {
          //   this.$message.success(`编辑成功`)
          //   this.listType()
          //   this.formDemoDialog = false
          // }
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 字典数据
    dictData({ dictType }) {
      // console.log('字典数据', dictType)
      this.dictType = dictType
      setTimeout(() => {
        this.$refs.dictData.dictDataDialog = true
        this.$refs.dictData.listData()
      }, 200)
    }
  }
}
</script>
