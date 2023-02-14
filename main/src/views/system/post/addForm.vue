<template>
  <t-dialog
    class="add_edit"
    :title="title"
    width="40%"
    :visible="formDemoDialog"
    @update:visible="cancel"
  >
    <t-form :ref-obj.sync="formOpts.ref" :formOpts="formOpts" :widthSize="2" />
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
  data () {
    return {
      formDemoDialog: false,
      title: '',
      deptName: '',
      // form表单
      formOpts: {
        ref: null,
        formData: {
          postName: null, // 岗位名称
          postCode: null, // 岗位编码
          postSort: null, // 显示顺序
          remark: null, // 备注
          status: true
        },
        fieldList: [
          { label: '岗位名称', value: 'postName', type: 'input', comp: 'el-input' },
          { label: '岗位编码', value: 'postCode', type: 'input', comp: 'el-input' },
          { label: '显示顺序', value: 'postSort', type: 'inputNumber', comp: 'el-input-number', bind: { 'controls-position': 'right', min: 0 } },
          { label: '备注', value: 'remark', type: 'textarea', comp: 'el-input', widthSize: 1 },
        ],
        rules: {
          postName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
          postCode: [{ required: true, message: '请输入岗位编码', trigger: 'blur' }],
          postSort: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }]
        },
      },
    }
  },
  // 方法
  methods: {
    // 新增
    toDoAdd () {
      this.formDemoDialog = true
      this.title = '新增'
    },
    // 编辑
    async edit (data) {
      this.formDemoDialog = true
      this.title = '编辑'
      this.formOpts.formData = data
    },
    // 取消弹窗
    cancel () {
      this.formDemoDialog = false
      this.formOpts.formData = {
        postName: null, // 岗位名称
        postCode: null, // 岗位编码
        postSort: null, // 显示顺序
        remark: null, // 备注
        status: true
      }
    },
    // 弹窗确定按钮
    submit () {
      console.log('弹窗确定按钮', this.formOpts.formData)
      this.formOpts.ref.validate(async (valid) => {
        if (!valid) return
        const formData = {
          ...this.formOpts.formData,
        }
        if (this.title == '新增') {
          // const res = await Api.addPost(formData)
          // if (res.success) {
          //   this.$message.success(`新增成功`)
          //   this.cancel()
          //   this.$emit('submit')
          // }
        }
        if (this.title == '编辑') {
          formData.postId = this.formOpts.formData.postId
          // const res = await Api.updatePost(formData)
          // if (res.success) {
          //   this.$message.success(`编辑成功`)
          //   this.cancel()
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