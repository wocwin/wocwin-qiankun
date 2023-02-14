<template>
  <t-dialog
    class="reset_form"
    title="重置密码"
    width="30%"
    :visible="formDemoDialog"
    @update:visible="cancel"
  >
    <t-form :ref-obj.sync="formOpts.ref" :formOpts="formOpts" :widthSize="1" />
    <template #footer>
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确定</el-button>
    </template>
  </t-dialog>
</template>
<script>
import { isStrongPassword } from '@/utils/validate.js'
export default {
  name: 'ResetPassword',
  data() {
    return {
      formDemoDialog: false,
      userId: '',
      // form表单
      formOpts: {
        ref: null,
        formData: {
          password: null // 密码
        },
        fieldList: [
          { label: '新密码', value: 'password', type: 'input', comp: 'el-input', bind: { 'show-password': true } },
        ],
        rules: {
          password: [{ required: true, message: '请输入重置密码', trigger: 'blur' }, { validator: isStrongPassword, trigger: 'blur' }],
        },
      },
    }
  },
  props: {
  },
  // 方法
  methods: {
    // 打开弹窗
    open(userId) {
      this.formOpts.formData.password = null
      this.userId = userId
      this.formDemoDialog = true
    },
    // 取消弹窗
    cancel() {
      this.formDemoDialog = false
      this.formOpts.ref.resetFields()
      this.userId = ''
    },
    // 弹窗确定按钮
    submit() {
      this.formOpts.ref.validate(async (valid) => {
        if (!valid) return
        const formData = {
          ...this.formOpts.formData,
          userId: this.userId
        }
        console.log('密码重置参数', formData)
        // const res = await Api.resetUserPwd(formData)
        // if (res.success) {
        //   this.$message.success(`密码重置成功`)
        //   this.cancel()
        //   this.$emit('pwdsubmit')
        // }
      })
    },
  }
}
</script>
