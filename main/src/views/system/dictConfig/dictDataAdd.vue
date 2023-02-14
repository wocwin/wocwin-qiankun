<template>
  <t-form :ref-obj.sync="formOpts.ref" :formOpts="formOpts" :widthSize="2"></t-form>
</template>
<script>
export default {
  name: 'DictDataAdd',
  data() {
    return {
      // form表单
      formOpts: {
        ref: null,
        formData: {
          dictType: '', // 字典类型
          dictLabel: null, // 数据标签
          dictValue: null, // 数据键值
          dictSort: null, // 显示排序
          status: null, // 状态
          remark: null, // 备注
        },
        fieldList: [
          { label: '字典类型', value: 'dictType', type: 'input', comp: 'el-input', bind: { disabled: true }, widthSize: 1, width: '40%' },
          { label: '数据标签', value: 'dictLabel', type: 'input', comp: 'el-input', bind: { maxlength: 100 } },
          { label: '数据键值', value: 'dictValue', type: 'input', comp: 'el-input', bind: { maxlength: 100 } },
          { label: '显示排序', value: 'dictSort', type: 'input', comp: 'el-input-number', bind: { controlsPosition: 'right', min: 0, max: 9999 } },
          { label: '状态', value: 'status', type: 'select-arr', list: 'statusList', comp: 'el-select', arrLabel: 'label', arrKey: 'key' },
          { label: '备注', value: 'remark', type: 'textarea', comp: 'el-input', bind: { maxlength: 250 }, widthSize: 1 },
        ],
        rules: {
          dictLabel: [{ required: true, message: '请输入数据标签', trigger: 'blur' }],
          dictValue: [{ required: true, message: '请输入数据键值', trigger: 'blur' }],
          dictSort: [{ required: true, message: '请输入显示排序', trigger: 'blur' }],
          status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        },
        // 相关列表
        listTypeInfo: {}
      },
    }
  },
  props: {
    listTypeInfo: {
      type: Object,
      default: () => ({})
    },
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
