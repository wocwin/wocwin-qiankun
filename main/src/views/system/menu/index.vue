<template>
  <div class="app-container menu_management">
    <div class="block_wrap">
      <t-query-condition :opts="opts" :loading="loading" @submit="conditionEnter" />
    </div>
    <div class="block_wrap">
      <!-- default-expand-all -->
      <t-table
        title="菜单管理列表"
        :table="table"
        row-key="menuId"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @selection-change="selectionChange"
        :columns="table.columns"
        :isShowPagination="false"
      >
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
            type="primary"
            size="mini"
            v-hasPermi="'root:web:sys:menu:import'"
            @click="importExcel"
          >同步</el-button>
          <el-tooltip class="item" effect="dark" content="请选择父级menuId导出" placement="top">
            <el-button
              type="danger"
              v-hasPermi="'root:web:sys:menu:export'"
              :disabled="ids.length!=1"
              size="mini"
              @click="exportExcel"
            >导出</el-button>
          </el-tooltip>
          <el-button
            type="primary"
            size="mini"
            @click="createHandle"
            v-hasPermi="'root:web:sys:menu:add'"
          >新增</el-button>
        </template>
      </t-table>
    </div>
    <!-- 添加或修改菜单对话框 -->
    <t-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                @select="treeChange"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M" v-if="!parentIsC">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="菜单状态">
              <el-radio-group v-model="form.visible" :disabled="parentIsC">
                <el-radio :label="'0'">显示</el-radio>
                <el-radio :label="'1'">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="映射微前端">
              <el-radio-group v-model="form.isBizSystem">
                <el-radio :label="false">否</el-radio>
                <el-radio :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属微前端" prop="appId" v-if="form.isBizSystem">
              <el-cascader
                v-model="form.appId"
                @change="appchange"
                ref="cascaderHandle"
                :options="appList"
                :show-all-levels="false"
                :props="{ value: 'id', checkStrictly: true }"
                popper-class="appId_cascader"
                placeholder="请选择所属微前端"
                filterable
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标">
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType == 'C'" label="是否外链">
              <el-radio-group v-model="form.isFrame">
                <el-radio :label="1">否</el-radio>
                <el-radio :label="0">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否二级路由" v-if="form.menuType != 'F'">
              <el-radio-group v-model="form.hidden">
                <el-radio :label="false">否</el-radio>
                <el-radio :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType == 'F'" label="权限标识" prop="perms">
              <el-input v-model="form.perms" placeholder="请输入权限标识" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'F'" label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType == 'C'">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="copyMenuId" v-if="title=='修改菜单'">复制MenuId</el-button>
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import IconSelect from '@/components/IconSelect';
export default {
  name: 'Menu',
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 查询参数
      queryData: {
        menuName: undefined,
        visiable: undefined
      },
      optionProps: { value: 'id', label: 'label', children: 'children' },
      loading: false,
      table: {
        firstColumn: { type: 'selection' },
        data: [],
        columns: [
          { prop: 'menuName', label: '菜单名称', minWidth: 180, align: 'left' },
          { prop: 'orderNum', label: '排序', width: '60px', align: 'left' },
          {
            prop: 'menuType',
            label: '菜单类型',
            minWidth: 100,
            align: 'left',
            customRender: {
              comps: [
                {
                  comp: 'div',
                  child: (scope) => [
                    {
                      comp: 'span',
                      text: scope.row.menuType == 'M' ? '目录' : scope.row.menuType == 'C' ? '菜单' : scope.row.menuType == 'F' ? '按钮' : '未知'
                    }
                  ]
                }
              ]
            }
          },
          { prop: 'perms', label: '权限标识', minWidth: '100px', align: 'left', noShowTip: true, },
          { prop: 'createBy', label: '创建人', minWidth: '60px', align: 'left' },
          { prop: 'createTime', label: '创建时间', width: '100px', align: 'left' },
          { prop: 'remark', label: '备注', width: '100px', align: 'left' },
        ],
        // 表格内操作列
        operator: [
          {
            text: '新增',
            fun: this.handleAdd,
            show: { key: 'visible', val: ['0'] },
            hasPermi: 'root:web:sys:menu:add'
          },
          {
            text: '编辑',
            fun: this.edit,
            hasPermi: 'root:web:sys:menu:alter'
          },
          {
            text: '删除',
            fun: this.handleDelete,
            hasPermi: 'root:web:sys:menu:del'
          },
        ],
        // 操作列样式
        operatorConfig: {
          // fixed: 'right', // 固定列表右边（left则固定在左边）
          align: 'left',
          width: '160',
          label: '操作'
        }
      },
      ids: [], // 复选框
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      appList: [], // 所属微前端
      sourceMenuData: [], // 所有原数据
    }
  },
  watch: {
    'queryData.visiable'() {
      this.menuVisible()
    },
    'form.parentId'() {
      this.menuVisible()
    }
  },
  computed: {
    parentIsC() {
      // 返回父节点是否为菜单类型
      const { parentId } = this.form
      if (parentId && this.menuById[parentId].menuType === 'C') {
        return true
      }
      return false
    },
    menuById() {
      // 根据id获取菜单实体
      return this.buildMenuDataList(this.menuOptions, {})
    },
    rules() {
      return {
        // 表单校验规则
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        appId: [{ required: true, message: '请选择所属微前端', trigger: 'change' }],
        orderNum: [
          { required: true, message: '请输入显示顺序', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入组件路径', trigger: 'blur' }
        ],
        path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
        perms: [
          { required: true, message: '请输入权限代码', trigger: 'blur' },
          {
            trigger: 'blur',
            required: true,
            validator: (rule, value, callback) =>
              this.validateInt(
                rule,
                value,
                callback,
                this.form.permsCopy
              )
          }
        ]
      }
    },
    opts() {
      return {
        menuName: {
          label: '菜单名称',
          comp: 'el-input'
        },
        visiable: {
          label: '状态',
          comp: 'el-select',
          changeEvent: 'change',
          child: [
            {
              comp: 'el-option',
              value: '0',
              bind: {
                label: '启用',
                key: '0'
              }
            },
            {
              comp: 'el-option',
              value: '1',
              bind: {
                label: '禁用',
                key: '1'
              }
            }
          ]
        },
      }
    },
    getQueryData() {
      const { menuName, visiable } = this.queryData
      return {
        menuName,
        visiable,
      }
    },
  },
  created() {
    this.getList()
    this.getAllAppList()
  },
  methods: {
    // 复选框选中
    selectionChange(data) {
      console.log('复选框选中', data)
      this.ids = data.map(item => item.menuId)
      // console.log(77, this.ids)
    },
    menuVisible() {
      if (this.parentIsC && this.form.menuId === null) {
        // 父级为菜单时本节点默认为菜单且隐藏
        this.form.visible = '1'
        this.form.menuType = 'C'
      } else {
        this.form.visible = this.form.visible
      }
    },
    // 获取子微前端数据
    async getAllAppList() {
      // let appList = await Api.listAppGrouped()
      // if (appList.success) {
      //   this.appList = appList.data
      // }
    },
    // 获取平级菜单数据
    buildMenuDataList(treeMenu, menuById) {
      treeMenu.forEach((menu) => {
        menuById[menu.menuId.toString()] = {
          menuId: menu.menuId,
          menuType: menu.menuType
        }
        if (menu.children && menu.children.length > 0) {
          this.buildMenuDataList(menu.children, menuById)
        }
      })
      return menuById
    },
    // 权限代码校验
    validateInt(rule, value, callback, reg) {
      let regExp = eval(`/^(${reg})+./`)
      if (!regExp.test(value)) {
        callback(`输入格式错误,格式必须为 ${reg}** `)
      } else {
        callback()
      }
    },
    /** 查询岗位列表 */
    async getList() {
      // this.loading = true
      // const res = await Api.listMenu(this.getQueryData)
      // if (res.success) {
      //   this.sourceMenuData = res.data
      //   this.table.data = this.handleTree(res.data, 'menuId')
      // }
      // this.loading = false
    },
    // 查询按钮
    conditionEnter(data) {
      this.queryData = data
      this.getList()
    },
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    async getTreeselect() {
      // const response = await Api.listMenu()
      // if (response.success) {
      //   this.menuOptions = []
      //   const menu = { menuId: 0, menuName: '主类目', visible: '0', children: [] }
      //   menu.children = this.handleTree(response.data, 'menuId')
      //   this.menuOptions.push(menu)
      // }
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    // 选择菜单
    treeChange(row) {
      // console.log('treeChange', row)
      this.sourceMenuData.map((val) => {
        if (val.menuName == row.menuName) {
          // console.log(7788, val)
          this.form.perms = `${val.perms}:`
          this.form.permsCopy = `${val.perms}:`
          if (val.menuType == 'C') {
            this.form.visible = '1'
          }
        }
      })
    },
    // 外面新增按钮
    async createHandle() {
      await this.getTreeselect()
      this.open = true
      this.title = '添加菜单'
      this.form = {
        icon: '',
        appId: null,
        menuId: null,
        menuType: 'M',
        orderNum: 0,
        visible: '0',
        isFrame: 1,
        isBizSystem: false,
        hidden: false,
        parentId: 0,
        perms: ':',
      }
    },
    /** table新增按钮操作 */
    async handleAdd(row) {
      console.log('table新增按钮', row)
      await this.getTreeselect()
      let parentId = row.menuId
      for (let i = 0; i < this.sourceMenuData.length; i++) {
        if (parentId == this.sourceMenuData[i].menuId) {
          this.form = {
            appId: null,
            menuId: null,
            menuType: 'M',
            orderNum: 0,
            visible: '0',
            isFrame: 1,
            parentId,
            hidden: this.sourceMenuData[i].hidden,
            isBizSystem: this.sourceMenuData[i].isBizSystem,
            perms: this.sourceMenuData[i].perms + ':',
            permsCopy: this.sourceMenuData[i].perms + ':'
          }
          this.open = true
          this.title = '添加菜单'
          break
        }
      }
    },
    /** table修改按钮操作 */
    async edit(row) {
      let data = { ...row, permsCopy: row.parentPerms + ':' }
      await this.getTreeselect()
      this.form = data
      console.log('编辑', data)
      this.open = true
      this.title = '修改菜单'
    },
    // 联级选择事件
    appchange() {
      this.$refs.cascaderHandle.dropDownVisible = false
    },
    // 复制menuId
    copyMenuId() {
      this.$copyText(String(this.form.menuId)).then(() => {
        this.$message.success(`MenuId:${this.form.menuId}已复制`)
      }, () => {
        this.$message.error('复制失败')
      })
    },
    /** 提交按钮 */
    submitForm() {
      console.log('提交按钮', this.form)
      if (this.form.menuType != 'F' && typeof this.form.appId == 'object') {
        this.form.appId = this.form.appId ? this.form.appId[this.form.appId?.length - 1] : null
      }
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return
        if (this.form.menuId != undefined) {
          // const res = await Api.updateMenu(this.form)
          // if (res.success) {
          //   this.$message.success('修改成功')
          //   this.open = false
          //   this.getList()
          // } else {
          //   this.$message.error(res.msg)
          // }
        } else {
          // const response = await Api.addMenu(this.form)
          // if (response.success) {
          //   this.$message.success('新增成功')
          //   this.open = false
          //   this.getList()
          // } else {
          //   this.$message.error(response.msg)
          // }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为' + row.menuName + '的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const res = await Api.delMenu(row.menuId)
        // if (res.success) {
        //   this.$message.success(`删除成功`)
        //   this.getList()
        // }
      })
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
      // this.$api.importMenu(formData).then(res => {
      //   console.log(111, res)
      //   if (res.success) {
      //     // if (res.data) {
      //     //   this.$message({
      //     //     dangerouslyUseHTMLString: true,
      //     //     message: `总共${res.data.item}条数据<br />成功导入了${res.data.handled}条数，<br />${res.data.unrecognised == 0 ? '' : `<p style="color:red">失败了${res.data.unrecognised}条数据，其序列号分别是${res.data.unrecognisedSet.length > 0 && res.data.unrecognisedSet.join(', ')}</p>`}`,
      //     //     type: 'success',
      //     //     duration: 5000,
      //     //   })
      //     // }
      //     this.$message.success('菜单导入成功')
      //     this.getList()
      //   }
      // })
    },
    // 批量导出
    exportExcel() {
      const menuId = this.ids.join(',')
      console.log('批量导出', menuId)
      // this.$download.excel(`/portal-user/data/export/Menu/${menuId}`, '菜单管理列表')
    }
  }
}
</script>
<style lang="scss" scoped>
.menu_management {
  .block_wrap {
    ::v-deep .t-table {
      .el-table__body-wrapper {
        .el-table__body {
          .cell {
            display: flex;
          }
        }
      }
      .el-table__cell > .cell {
        padding-left: 14px;
        padding-right: 20px;
      }
    }
  }
  ::v-deep .el-input-number--medium {
    line-height: 32px;
  }
}
</style>