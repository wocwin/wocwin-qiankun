<template>
  <t-dialog
    class="add_edit"
    :title="title"
    width="40%"
    :visible="formDemoDialog"
    @update:visible="cancel"
  >
    <t-form :ref-obj.sync="formOpts.ref" :formOpts="formOpts" :widthSize="2">
      <template #status>
        <el-switch v-model="formOpts.formData.status" :disabled="formOpts.formData.appType=='M'" />
      </template>
      <template #appGroup>
        <!-- <el-select v-model="formOpts.formData.appGroup" clearable filterable>
          <el-option
            v-for="item in systemList"
            :key="item.id"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>-->
        <el-autocomplete
          v-model="formOpts.formData.appGroup"
          :fetch-suggestions="appGroupSearch"
          value-key="label"
          placeholder="请输入应用组"
          style="width:100%;"
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
  data () {
    return {
      formDemoDialog: false,
      title: '',
      // form表单
      formOpts: {
        ref: null,
        formData: {
          appName: null, // 应用名称
          packageName: null, // 应用包名
          activeRule: null, // 激活路径
          entry: null, // 部署地址
          orderNum: null, // 排序序号
          clientType: null, // 客户端类型
          appGroup: null, // 应用组
          entryInternet: null, // 域名地址
          status: true, // 状态
          appType: 'C',
          remark: null
        },
        fieldList: [
          { label: '应用名称', value: 'appName', type: 'input', comp: 'el-input' },
          { label: '应用包名', value: 'packageName', type: 'input', comp: 'el-input' },
          { label: '激活路径', value: 'activeRule', type: 'input', comp: 'el-input' },
          { label: '部署地址', value: 'entry', type: 'input', comp: 'el-input' },
          { label: '应用组', value: 'appGroup', slotName: 'appGroup' },
          { label: '域名地址', value: 'entryInternet', type: 'input', comp: 'el-input' },
          { label: '排序序号', value: 'orderNum', type: 'inputNumber', comp: 'el-input-number' },
          { label: '客户端类型', value: 'clientType', type: 'select-arr', list: 'clientTypeList', comp: 'el-select', arrLabel: 'name', arrKey: 'value' },
          { label: '状态', value: 'status', slotName: 'status' },
          { label: '备注', value: 'remark', type: 'textarea', comp: 'el-input', widthSize: 1 },
        ],
        rules: {
          appName: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
          packageName: [{ required: true, message: '请输入应用包名', trigger: 'blur' }],
          activeRule: [{ required: true, message: '请输入激活路径', trigger: 'blur' }],
          entry: [{ required: true, message: '请输入部署地址', trigger: 'blur' }],
          orderNum: [{ required: true, message: '请输入排序序号', trigger: 'blur' }],
          clientType: [{ required: true, message: '请选择客户端类型', trigger: 'change' }],
          appGroup: [{ required: true, message: '请选择应用组', trigger: 'change' }],
          entryInternet: [{ message: '请输入有效域名地址', validator: this.validatorDomain, trigger: 'blur' }],
        },
        // 相关列表
        listTypeInfo: {
          clientTypeList: [
            {
              name: 'web端',
              value: 'B'
            },
            {
              name: 'app端',
              value: 'P'
            },
            {
              name: 'pad端',
              value: 'T'
            }
          ]
        }
      },
    }
  },
  props: {
    // 应用组
    systemList: {
      type: Array,
      default: () => ([])
    },
  },
  // 方法
  methods: {
    // 校验有效域名地址
    validatorDomain (rule, value, callback) {
      let reg = /^(?=^.{3,255}$)(http(s)?:\/\/)(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z][-a-zA-Z]{0,62})+(:\d+)*([\/]|(\/\w+))*$/
      if (value && !reg.test(value)) {
        callback(new Error(rule.message))
      }
      callback()
    },
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
      // console.log('编辑', data)
    },
    // 取消弹窗
    cancel () {
      this.reset()
      this.$emit('cancel')
    },
    reset () {
      this.formDemoDialog = false
      this.formOpts.ref.resetFields()
    },
    // 弹窗确定按钮
    submit () {
      // console.log('弹窗确定按钮', this.formOpts.formData)
      this.formOpts.ref.validate(async (valid) => {
        if (!valid) return
        const formData = {
          ...this.formOpts.formData
        }
        if (this.title == '编辑') {
          formData.appId = this.formOpts.formData.appId
        }
        // const res = await Api.saveMicro(formData)
        // if (res.success) {
        //   this.$message.success(`${this.title}成功`)
        //   this.reset()
        //   this.$emit('submit')
        // }
      })
    },
    // autocomplete过滤
    appGroupSearch (queryString, cb) {
      let systemListHistory = this.systemList
      let results = queryString
        ? systemListHistory.filter(item => item.label.includes(queryString))
        : systemListHistory
      cb(results)
    }
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