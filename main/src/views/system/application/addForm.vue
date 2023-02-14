<template>
  <t-dialog
    class="add_edit"
    :title="title"
    width="40%"
    :visible="formDemoDialog"
    @update:visible="()=>$emit('cancel')"
  >
    <t-form :ref-obj.sync="formOpts.ref" :formOpts="formOpts" :widthSize="2">
      <template #menuIds>
        <el-select v-model="formOpts.formData.menuIds" filterable multiple>
          <el-option
            v-for="item in allSystemList"
            :key="item.menuId"
            :label="item.menuName"
            :value="item.menuId"
          ></el-option>
        </el-select>
      </template>
    </t-form>
    <template #footer>
      <el-button size="small" @click="()=>$emit('cancel')">取消</el-button>
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
      formDemoDialog: false,
      title: '',
      // form表单
      formOpts: {
        ref: null,
        formData: {
          systemName: null, // 系统名称
          menuIds: [], // 绑定菜单
          status: true
        },
        fieldList: [
          { label: '系统名称', value: 'systemName', type: 'input', comp: 'el-input' },
          { label: '绑定菜单', value: 'menuIds', slotName: 'menuIds' },
        ],
        rules: {
          systemName: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
          menuIds: [{ required: true, message: '请选择绑定菜单', trigger: 'change' }]
        },
      },
    }
  },
  props: {
    // 所有绑定菜单数据
    allSystemList: {
      type: Array,
      default: () => ([])
    }
  },
  // 方法
  methods: {
    // 新增
    toDoAdd() {
      this.formDemoDialog = true
      this.title = '新增'
    },
    // 编辑
    async edit(data) {
      this.formDemoDialog = true
      this.title = '编辑'
      this.formOpts.formData = data
    },
    reset() {
      this.formDemoDialog = false
      this.formOpts.ref.resetFields()
      this.formOpts.formData.systemName = null
      this.formOpts.formData.menuIds = []
    },
    // 弹窗确定按钮
    submit() {
      console.log('弹窗确定按钮', this.formOpts.formData)
      this.formOpts.ref.validate(async (valid) => {
        if (!valid) return
        const formData = {
          ...this.formOpts.formData,
        }
        formData.systemId = this.formOpts?.formData?.systemId || ''
        // const res = await Api.saveSystem(formData)
        // if (res.success) {
        //   this.$message.success(`${this.title}成功`)
        //   this.reset()
        //   this.$emit('submit')
        // }
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
  ::v-deep .t-dialog-content .el-dialog__body {
    overflow-x: inherit;
  }
}
</style>
