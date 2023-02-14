<template>
  <t-form :ref-obj.sync="formOpts.ref" :formOpts="formOpts" :widthSize="1"></t-form>
</template>
<script>
export default {
  name: 'DictAdd',
  data() {
    return {
      // form表单
      formOpts: {
        ref: null,
        formData: {
          dictName: null, // 字典名称
          dictType: null, // 字典类型
          status: null, // 状态
          remark: null, // 备注
        },
        fieldList: [
          { label: '字典名称', value: 'dictName', type: 'input', comp: 'el-input', bind: { maxlength: 100 } },
          { label: '字典类型', value: 'dictType', type: 'input', comp: 'el-input', bind: { maxlength: 100 } },
          { label: '状态', value: 'status', type: 'select-arr', list: 'statusList', comp: 'el-select', arrLabel: 'label', arrKey: 'key' },
          { label: '备注', value: 'remark', type: 'textarea', comp: 'el-input', bind: { maxlength: 250 } },
        ],
        rules: {
          dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
          dictType: [{ required: true, message: '请输入字典类型', trigger: 'blur' }],
          status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        },
        // 相关列表
        listTypeInfo: {}
      }
    }
  },
  props: {
    listTypeInfo: {
      type: Object,
      default: () => ({})
    }
  },
  mounted() {
    this.formOpts.listTypeInfo = this.listTypeInfo
  },
  // 方法
  methods: {
    // 校验及返回最终数据
    validate() {
      return new Promise((resolve, reject) => {
        this.formOpts.ref.validate(valid => {
          if (valid) {
            resolve({
              valid,
              formData: this.formOpts.formData
            })
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              valid,
              formData: null,
            })
          }
        })
      })
    },
    // 重置form表单和table
    resetForm() {
      this.formOpts.ref !== undefined && this.formOpts.ref.resetFields()
    },
    // 清除校验
    clearValidate() {
      this.formOpts.ref.clearValidate()
    }
  }
}
</script>
