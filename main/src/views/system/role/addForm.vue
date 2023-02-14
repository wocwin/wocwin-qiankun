<template>
  <t-dialog
    class="add_edit"
    :title="title"
    width="40%"
    :visible="formDemoDialog"
    @update:visible="cancel"
  >
    <t-form :ref-obj.sync="formOpts.ref" :formOpts="formOpts" :widthSize="2">
      <template #deptIds>
        <treeselect
          v-model="formOpts.formData.deptIds"
          :options="deptOptions"
          :flat="true"
          :clearable="false"
          :multiple="multiple"
          @select="deptIdsChange"
          placeholder="请选择部门"
        />
      </template>
      <template #systemId>
        <el-select v-model="formOpts.formData.systemId" @change="systemIdChange">
          <el-option v-for="item in systemList" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </template>
      <template #menuIds>
        <el-tree
          :data="menuData"
          :props="{children: 'children',label: 'label'}"
          show-checkbox
          node-key="id"
          empty-text="加载中，请稍后"
          ref="tree"
        />
      </template>
    </t-form>
    <template #footer>
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确定</el-button>
    </template>
  </t-dialog>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'AddForm',
  components: {
    Treeselect
  },
  data() {
    return {
      multiple: false,
      formDemoDialog: false,
      title: '',
      allSystemList: [], // 业务系统
      menuData: [], // 菜单数据权限
      // form表单
      formOpts: {
        ref: null,
        formData: {
          roleName: null, // 角色名称
          roleKey: null, // 权限字符
          longLiveRole: false, // Token自动续期
          deptIds: null, // 关联部门
          dataScope: 1, // 数据范围
          remark: null, // 备注
          menuIds: null, // 菜单权限
          systemId: null, // 业务系统
          roleSort: 0,
          status: true,
        },
        fieldList: [
          { label: '角色名称', value: 'roleName', type: 'input', comp: 'el-input' },
          { label: '权限字符', value: 'roleKey', type: 'input', comp: 'el-input' },
          { label: 'Token自动续期', value: 'longLiveRole', type: 'radio', comp: 'el-radio-group', list: 'radioList', event: 'longLiveRole' },
          { label: '业务系统', value: 'systemId', slotName: 'systemId', widthSize: 1 },
          { label: '数据范围', value: 'dataScope', type: 'select-arr', list: 'dataScopeList', comp: 'el-select', arrLabel: 'label', arrKey: 'id' },
          // { label: '关联部门', value: 'deptIds', slotName: 'deptIds', widthSize: 1, event: 'deptIds' },
          { label: '备注', value: 'remark', type: 'input', comp: 'el-input', widthSize: 1 },
          { label: '菜单权限', value: 'menuIds', slotName: 'menuIds', widthSize: 1 },
        ],
        rules: {
          roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
          roleKey: [{ required: true, message: '请输入权限字符', trigger: 'blur' }],
          deptIds: [{ required: true, message: '请选择关联部门', trigger: 'change' }],
          systemId: [{ required: true, message: '请选择业务系统', trigger: 'change' }],
          dataScope: [{ required: true, message: '请选择数据范围', trigger: 'change' }],
          longLiveRole: [{ required: true, message: '请选择Token自动续期', trigger: 'change' }],
        },
        // 相关列表
        listTypeInfo: {
          radioList: [
            { label: '是', value: true },
            { label: '否', value: false }
          ],
          dataScopeList: []
        }
      },
    }
  },
  props: {
    // 部门数据
    deptOptions: {
      type: Array,
      default: () => ([])
    },
    // 系统数据
    systemList: {
      type: Array,
      default: () => ([])
    },
    // 数据范围
    dataScope: {
      type: Array,
      default: () => ([])
    }
  },
  watch: {
    dataScope(val) {
      this.formOpts.listTypeInfo.dataScopeList = val
    },
    'formOpts.formData.dataScope': {
      handler(val) {
        let obj = { label: '关联部门', value: 'deptIds', slotName: 'deptIds', widthSize: 1 }
        let flag = this.formOpts.fieldList.some(item => item.value == 'deptIds')
        switch (val) {
          case 1:
          case 5:
          case 3:
          case 4:
            this.formOpts.fieldList.map((item, index) => {
              if (item.value == 'deptIds') {
                this.formOpts.fieldList.splice(index, 1)
              }
            })
            this.multiple = false
            break;
          case 2:
            if (!flag) {
              this.formOpts.fieldList.splice(4, 0, obj)
            }
            this.multiple = true
            break;
        }
      },
      deep: true
    }
  },
  // 方法
  methods: {
    // 选择关联系统获取菜单权限
    async systemIdChange(systemId) {
      // console.log('systemId', systemId)
      // const res = await Api.menuTreeselect({ systemId })
      // if (res.success) {
      //   this.menuData = res.data
      // }
    },
    // 编辑进来获取菜单权限
    async roleMenuTreeselect(roleId, systemId) {
      // let params = {
      //   roleId,
      //   systemId,
      // }
      // const res = await Api.roleMenuTreeselect(params)
      // if (res.success) {
      //   this.menuData = res.data.menus
      //   // this.$refs.tree.setCheckedKeys(res.data.checkedKeys) 解决不了
      //   // 编辑回显tree
      //   res.data.checkedKeys.forEach(val => {
      //     this.$nextTick(() => {
      //       this.$refs.tree.setChecked(val, true, false)
      //     })
      //   })
      // }
    },
    // 获取最终选中的菜单
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.tree.getHalfCheckedKeys()
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.tree.getCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 选择部门重新赋值
    deptIdsChange(item) {
      this.formOpts.formData.deptIds = item.id
    },
    // 新增
    toDoAdd() {
      this.formDemoDialog = true
      this.formOpts.formData.longLiveRole = false
      this.title = '新增'
      this.systemIdChange()
    },
    // 编辑
    edit(data) {
      this.formDemoDialog = true
      this.title = '编辑'
      this.formOpts.formData = data
      // this.formOpts.formData.deptIds = data.deptIds.length > 1 ? data.deptIds : data.deptIds.length == 1 ? data.deptIds[0] : null
      this.formOpts.formData.deptIds = data.deptIds
      this.formOpts.formData.dataScope = data.dataScope - 0
      if (data.dataScope == 1 || data.dataScope == 5 || data.dataScope == 3 || data.dataScope == 4) {
        this.formOpts.formData.deptIds = null
      }
      // console.log('编辑回显', this.formOpts.formData)
      this.roleMenuTreeselect(data.roleId, data.systemId)
    },
    // 取消弹窗
    cancel() {
      this.rest()
      this.$emit('cancel')
    },
    rest() {
      this.formDemoDialog = false
      this.formOpts.ref.resetFields()
      this.formOpts.formData = {
        roleName: null, // 角色名称
        roleKey: null, // 权限字符
        deptIds: null, // 关联部门
        dataScope: 1, // 数据范围
        remark: null, // 备注
        menuIds: null, // 菜单权限
        systemId: null, // 业务系统
        roleSort: 0,
        status: true,
      }
      this.$refs.tree.setCheckedKeys([])
    },
    // 弹窗确定按钮
    submit() {
      // console.log('deptIds', typeof this.formOpts.formData.deptIds)
      // console.log('弹窗确定按钮', this.formOpts.formData)
      this.formOpts.ref.validate(async (valid) => {
        if (!valid) return
        this.formOpts.formData.menuIds = this.getMenuAllCheckedKeys()
        const formData = {
          ...this.formOpts.formData,
          deptIds: typeof this.formOpts.formData.deptIds == 'object' ? this.formOpts.formData.deptIds : typeof this.formOpts.formData.deptIds == 'number' ? [this.formOpts.formData.deptIds] : null,
          dataScope: this.formOpts.formData.dataScope + ''
        }
        console.log('最终传参', formData)
        if (this.title == '新增') {
          // const res = await Api.addRole(formData)
          // if (res.success) {
          //   this.$message.success(`新增成功`)
          //   this.rest()
          //   this.$emit('submit')
          // }
        }
        if (this.title == '编辑') {
          // const res = await Api.updateRole(formData)
          // if (res.success) {
          //   this.$message.success(`编辑成功`)
          //   this.rest()
          //   this.$emit('submit')
          // }
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.add_edit {
  ::v-deep .t-form .slot_label {
    .el-form-item__content label {
      min-width: 0px;
    }
    .vue-treeselect__label-container {
      display: block;
    }
  }
}
</style>