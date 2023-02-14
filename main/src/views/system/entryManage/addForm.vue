<template>
  <t-dialog
    class="add_edit"
    :title="title"
    width="50%"
    :visible="formDemoDialog"
    @update:visible="cancel"
  >
    <t-form :ref-obj.sync="formOpts.ref" :formOpts="formOpts" :widthSize="2">
      <template #deptId>
        <treeselect
          v-model="formOpts.formData.deptId"
          :options="deptOptions"
          @select="deptIdChange"
          placeholder="请选择部门"
        />
      </template>
      <template #systemId>
        <el-select v-model="formOpts.formData.systemId" filterable clearable>
          <el-option v-for="item in systemList" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
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
          pdaBrand: null, // PDA品牌
          pdaModel: null, // PDA型号
          useRestriction: false, // 使用限制
          imei1: null, // imei1
          sn: null, // 序列号
          mac: null, // MAC地址
          occupiedBy: null, // 领取人
          systemId: null, // 业务系统
          deptId: null, // 关联部门
          status: 1,
          remark: null, // 备注
        },
        fieldList: [
          { label: 'PDA品牌', value: 'pdaBrand', type: 'input', comp: 'el-input' },
          { label: 'PDA型号', value: 'pdaModel', type: 'input', comp: 'el-input' },
          { label: '领取人', value: 'occupiedBy', type: 'input', comp: 'el-input' },
          { label: 'IMEI', value: 'imei1', type: 'input', comp: 'el-input' },
          { label: '序列号', value: 'sn', type: 'input', comp: 'el-input', widthSize: 1 },
          { label: 'MAC地址', value: 'mac', type: 'input', comp: 'el-input', widthSize: 1 },
          { label: '关联部门', value: 'deptId', slotName: 'deptId', widthSize: 1 },
          { label: '业务系统', value: 'systemId', slotName: 'systemId', widthSize: 1 },
          { label: '使用限制', value: 'useRestriction', type: 'radio', comp: 'el-radio-group', list: 'radioList', event: 'useRestriction' },
          { label: '备注', value: 'remark', type: 'input', comp: 'el-input', widthSize: 1 },
        ],
        rules: {
          systemId: [{ required: true, message: '请选择业务系统', trigger: 'change' }],
          deptId: [{ required: true, message: '请选择关联部门', trigger: 'change' }],
        },
        // 相关列表
        listTypeInfo: {
          radioList: [
            { label: '是', value: true },
            { label: '否', value: false }
          ]
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
    }
  },
  watch: {
  },
  // 方法
  methods: {
    // 新增
    toDoAdd() {
      this.formDemoDialog = true
      this.title = '新增'
    },
    // 编辑
    edit(data) {
      this.formDemoDialog = true
      this.title = '编辑'
      // console.log('编辑', data)
      this.formOpts.formData = data
      this.formOpts.formData.deptNum = data.deptNum
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
        pdaBrand: null, // PDA品牌
        pdaModel: null, // PDA型号
        useRestriction: false, // 使用限制
        imei1: null, // imei1
        sn: null, // 序列号
        mac: null, // MAC地址
        systemId: null, // 业务系统
        deptId: null, // 关联部门
        status: 1,
        remark: null, // 备注
      }
    },
    // 选择部门重新赋值
    deptIdChange(item) {
      // console.log(7891, item)
      this.$set(this.formOpts.formData, 'deptNum', item.code)
    },
    // 弹窗确定按钮
    submit() {
      // console.log('deptId', typeof this.formOpts.formData.deptId)
      // this.$set(this.formOpts.formData, 'deptNum', this.code)
      // console.log('弹窗确定按钮', this.formOpts.formData)
      const { imei1, sn, mac } = this.formOpts.formData
      if (!(imei1 || sn || mac)) {
        this.$message.warning('IMEI、序列号、MAC地址不能都为空！')
        return
      }
      this.formOpts.ref.validate(async (valid) => {
        if (!valid) return
        console.log('最终传参', this.formOpts.formData)
        if (this.title == '新增') {
          // const res = await Api.savePda(this.formOpts.formData)
          // if (res.success) {
          //   this.$message.success(`新增成功`)
          //   this.rest()
          //   this.$emit('submit')
          // }
        }
        if (this.title == '编辑') {
          // const res = await Api.editPda(this.formOpts.formData)
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