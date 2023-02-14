<template>
  <t-dialog
    class="add_edit"
    :title="title"
    width="40%"
    :visible="formDemoDialog"
    @update:visible="cancel"
  >
    <t-form :ref-obj.sync="formOpts.ref" :formOpts="formOpts" :widthSize="2">
      <template #parentId>
        <treeselect
          v-model="formOpts.formData.parentId"
          :options="deptData"
          :normalizer="normalizer"
          :flat="true"
          placeholder="请选择上级部门"
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
      formDemoDialog: false,
      title: '',
      // form表单
      formOpts: {
        ref: null,
        formData: {
          parentId: null, // 上级部门
          deptName: null, // 部门名称
          orderNum: null, // 显示顺序
          phone: null, // 联系电话
          leader: null, // 负责人
          email: null, // 邮箱
          erpDeptNum: null, // ERP部门编码
          status: true,
          type: null // 部门类型
        },
        fieldList: [
          { label: '上级部门', value: 'parentId', slotName: 'parentId', widthSize: 1 },
          { label: '部门名称', value: 'deptName', type: 'input', comp: 'el-input' },
          { label: 'ERP部门编码', value: 'erpDeptNum', type: 'input', comp: 'el-input' },
          { label: '显示顺序', value: 'orderNum', type: 'inputNumber', comp: 'el-input-number', bind: { 'controls-position': 'right', min: 0 } },
          { label: '联系电话', value: 'phone', type: 'input', comp: 'el-input' },
          { label: '负责人', value: 'leader', type: 'input', comp: 'el-input' },
          { label: '邮箱', value: 'email', type: 'input', comp: 'el-input' },
          { label: '部门类型', value: 'type', type: 'select-arr', list: 'deptTypeList', comp: 'el-select', arrLabel: 'label', arrKey: 'id' },
        ],
        rules: {
          deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
          orderNum: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
          email: [
            {
              validator: this.validatorEmail,
              message: '邮箱格式错误',
              trigger: 'blur'
            }
          ]
        },
        // 相关列表
        listTypeInfo: {
          deptTypeList: [
            { label: '公司', id: 0 },
            { label: '部门', id: 1 },
            { label: '分厂', id: 2 },
            { label: '车间', id: 3 },
            { label: '工段/工序', id: 4 },
            { label: '工步', id: 5 },
          ],
        }
      },
    }
  },
  props: {
    // 部门数据
    deptData: {
      type: Array,
      default: () => ([])
    }
  },
  // 方法
  methods: {
    // 校验邮箱
    validatorEmail(rule, value, callback) {
      if (value && !/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value)) {
        callback(new Error(rule.message))
      }
      callback()
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      }
    },
    // 新增
    toDoAdd() {
      this.formDemoDialog = true
      this.formOpts?.ref?.resetFields()
      this.title = '新增'
      this.formOpts.formData.parentId = this.deptData.length ? this.deptData[0].deptId : null
    },
    // 编辑
    async edit(data) {
      this.formDemoDialog = true
      this.title = '编辑'
      this.formOpts.formData = data
      // const dd = await Api.getDept(data.deptId)
      // console.log('编辑', dd)
    },
    // 取消弹窗
    cancel() {
      this.$emit('cancel')
    },
    reset() {
      this.formDemoDialog = false
      this.formOpts?.ref.resetFields()
      this.formOpts.formData.systemIds = []
    },
    // 弹窗确定按钮
    submit() {
      console.log('弹窗确定按钮', this.formOpts.formData)
      this.formOpts.ref.validate(async (valid) => {
        if (!valid) return
        const formData = {
          ...this.formOpts.formData,
        }
        if (this.title == '新增') {
          // const res = await Api.addDept(formData)
          // if (res.success) {
          //   this.$message.success(`新增成功`)
          //   this.reset()
          //   this.$emit('submit')
          // }
        }
        if (this.title == '编辑') {
          formData.deptId = this.formOpts.formData.deptId
          // const res = await Api.updateDept(formData)
          // if (res.success) {
          //   this.$message.success(`编辑成功`)
          //   this.reset()
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
  ::v-deep .t-dialog-content .el-dialog__body {
    overflow-x: inherit;
  }
  ::v-deep .el-input-number.is-controls-right .el-input-number__decrease {
    bottom: 2px;
  }
}
</style>