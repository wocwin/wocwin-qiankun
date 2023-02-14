<template>
  <t-layout-page class="general_sys_config">
    <t-layout-page-item>
      <h3>系统通用配置</h3>
      <t-form
        :ref-obj.sync="formOpts.ref"
        :formOpts="formOpts"
        :widthSize="4"
        @handleEvent="handleEvent"
      />
    </t-layout-page-item>
  </t-layout-page>
</template>
<script>
export default {
  name: 'GeneralSysConfig',
  data() {
    return {
      formOpts: {
        labelPosition: 'top',
        ref: null,
        formData: {
          pdaSnCheckEnabled: false, // 是否开启PDA序列号校验
          weekPassLimitEnabled: false, // 	是否开启弱密码登录限制
          accountFrozenEnabled: true, // 	启用账户冻结
          mismatchPassThreshold: 3, // 	密码输入错误上限
          accountFrozenDuration: 30, // 	账户冻结时长
          passEncryptEnabled: false, // 是否开启登录密码加密传输
          passEncryptPrivateKey: null, // 登录密码解密私钥
        },
        fieldList: [
          {
            labelRender: () => {
              return (
                <t-label-com label='启用PDA序列号校验' content='启用后，PDA登录系统会检查设备序列号，没有录入系统的PDA不允许登录系统。' />
              )
            },
            value: 'pdaSnCheckEnabled',
            type: 'radio',
            comp: 'el-radio-group',
            list: 'radioList'
          },
          {
            labelRender: () => {
              return (
                <t-label-com label='启用账户冻结' content='启用后，连续密码输入错误超过上限，账户将被冻结。' />
              )
            },
            value: 'accountFrozenEnabled',
            type: 'radio',
            comp: 'el-radio-group',
            list: 'radioList'
          },
          {
            labelRender: () => {
              return (
                <t-label-com label='密码输入错误上限' content='用户连续输入错误密码的上限，账户冻结功能未启用时，此设置无效。' />
              )
            },
            value: 'mismatchPassThreshold',
            comp: 'el-input',
            width: '80%',
            append: '次'
          },
          {
            labelRender: () => {
              return (
                <t-label-com label='账户冻结时长' content='冻结账户的时长，账户冻结功能未启用时，此设置无效。' />
              )
            },
            value: 'accountFrozenDuration',
            comp: 'el-input',
            width: '80%',
            append: '分钟'
          },
          {
            labelRender: () => {
              return (
                <t-label-com label='启用弱密码登录限制' content='启用后，不允许设置弱于约定规则的密码。目前强制校验密码，此功能尚不开放。' />
              )
            },
            value: 'weekPassLimitEnabled',
            type: 'radio',
            comp: 'el-radio-group',
            list: 'radioList'
          },
          {
            labelRender: () => {
              return (
                <t-label-com label='启用登录密码加密传输' content='启用后，登录密码将通过密文传输。此功能尚不开放。' />
              )
            },
            value: 'passEncryptEnabled',
            type: 'radio',
            comp: 'el-radio-group',
            list: 'radioList',
            event: 'enableMybatisCrud'
          },
        ],
        // 相关列表
        listTypeInfo: {
          radioList: [
            { label: '是', value: true },
            { label: '否', value: false }
          ]
        },
        operatorList: [
          {
            label: '保存',
            fun: this.save
          },
          {
            label: '重置',
            fun: this.rest
          },
        ]
      }
    }
  },
  created() {
    this.configLoad()
  },
  methods: {
    // 加载配置
    async configLoad() {
      // const res = await this.$api.configLoad()
      // if (res.success) {
      //   console.log('加载', res)
      //   this.formOpts.formData = res.data
      // }
    },
    // 重置
    async rest() {
      // const res = await this.$api.resetConfig()
      // if (res.success) {
      //   console.log('重置', res)
      //   this.configLoad()
      // }
    },
    // 触发事件
    handleEvent(type, val) {
      // console.log('触发事件', type, val)
      switch (type) {
        case 'enableMybatisCrud':
          let obj = {
            labelRender: () => {
              return (
                <t-label-com label='解密私钥' content='用于解密密码。' />
              )
            }, label: '解密私钥', value: 'passEncryptPrivateKey', type: 'textarea', comp: 'el-input', bind: { maxlength: 1000 }, widthSize: 1
          }
          let flag = this.formOpts.fieldList.some(item => item.value == 'passEncryptPrivateKey')
          let rules = { passEncryptPrivateKey: [{ required: true, message: '请输入登录解密私钥', trigger: 'blur' }], }
          if (val) {
            if (!flag) {
              this.formOpts.fieldList.push(obj)
              this.$set(this.formOpts, 'rules', rules)
            }
          } else {
            this.formOpts.fieldList.map((item, index) => {
              if (item.value === 'passEncryptPrivateKey') {
                this.formOpts.fieldList.splice(index, 1)
              }
            })
            this.$delete(this.formOpts, 'rules')
          }
          break
      }
    },
    save() {
      console.log('点击保存', this.formOpts.formData)
      this.formOpts.ref.validate(async (volid) => {
        if (!volid) return
        // const res = await this.$api.addSysConfig(this.formOpts.formData)
        // if (res.success) {
        //   this.$message.success('保存成功')
        //   this.configLoad()
        // }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.general_sys_config {
  h3 {
    margin-top: 0;
    padding-left: 25px;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
  }
}
</style>
