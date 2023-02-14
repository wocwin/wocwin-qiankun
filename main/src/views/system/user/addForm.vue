<template>
  <t-dialog
    class="add_edit"
    :title="title"
    width="50%"
    :visible="formDemoDialog"
    @update:visible="cancel"
  >
    <t-form :ref-obj.sync="formOpts.ref" :formOpts="formOpts" :widthSize="2">
      <template #userName>
        <el-input v-model.trim="formOpts.formData.userName" placeholder="请输入登录账号" />
      </template>
      <template #deptId>
        <treeselect
          v-model="formOpts.formData.deptId"
          :options="deptOptions"
          :flat="true"
          placeholder="请选择部门"
        />
      </template>
      <template #postId>
        <el-select v-model="formOpts.formData.postId" placeholder="请选择岗位" clearable filterable>
          <el-option
            v-for="item in postData"
            :key="item.postId"
            :label="item.postName"
            :value="item.postId"
          ></el-option>
        </el-select>
      </template>
      <template #roleIds>
        <treeselect
          v-model="formOpts.formData.roleIds"
          :options="roleTreeData"
          :multiple="true"
          :normalizer="normalizer"
          value-consists-of="LEAF_PRIORITY"
          placeholder="请选择角色"
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
import { isStrongPassword } from '@/utils/validate.js'
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
      deptName: '',
      // form表单
      formOpts: {
        ref: null,
        formData: {
          userName: null, // 登录账号
          password: null, // 登录密码
          nickName: null, // 姓名
          sex: null, // 性别
          deptId: null, // 部门
          postId: null, // 岗位
          email: null, // 邮箱
          phonenumber: null, // 手机
          roleIds: null, // 角色
          remark: null, // 备注
          status: true, // 状态
        },
        fieldList: [
          { label: '登录账号', value: 'userName', slotName: 'userName' },
          { label: '登录密码', value: 'password', type: 'input', comp: 'el-input', bind: { 'show-password': true } },
          { label: '姓名', value: 'nickName', type: 'input', comp: 'el-input' },
          { label: '性别', value: 'sex', type: 'select-arr', list: 'sexList', comp: 'el-select', arrLabel: 'label', arrKey: 'key' },
          { label: '部门', value: 'deptId', slotName: 'deptId', widthSize: 1 },
          { label: '岗位', value: 'postId', slotName: 'postId' },
          { label: '邮箱', value: 'email', type: 'input', comp: 'el-input' },
          { label: '手机', value: 'phonenumber', type: 'input', comp: 'el-input', bind: { maxLength: 11 } },
          { label: '角色', value: 'roleIds', widthSize: 1, slotName: 'roleIds' },
          { label: '备注', value: 'remark', type: 'input', comp: 'el-input', widthSize: 1 },
        ],
        rules: {
          userName: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
          password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }, { validator: isStrongPassword, trigger: 'blur' }],
          nickName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
          power: [{ required: true, message: '请选择功率', trigger: 'change' }],
          roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }],
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
          sexList: [
            {
              label: '男',
              key: '0'
            },
            {
              label: '女',
              key: '1'
            },
            {
              label: '未知',
              key: '2'
            }
          ]
        }
      },
      roleTreeData: []
    }
  },
  props: {
    // 部门数据
    deptOptions: {
      type: Array,
      default: () => ([])
    },
    // 岗位数据
    postData: {
      type: Array,
      default: () => ([])
    }
  },
  // 方法
  methods: {
    // 去掉children=null的属性
    normalizer(node) {
      if (node.children == null || node.children == 'null') {
        delete node.children
      }
    },
    // 邮箱校验
    validatorEmail(rule, value, callback) {
      if (value && !/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value)) {
        callback(new Error(rule.message))
      }
      callback()
    },
    // 递归角色
    setRoleTreeData(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]?.roles) {
          arr[i].children = this.setDeptRoleTreeData(arr[i].roles)
        }
      }
      // console.log(555, arr)
      return arr
    },
    // 部门一下递归角色
    setDeptRoleTreeData(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].hasOwnProperty('children') && arr[i].hasOwnProperty('roles')) {
          if (arr[i].roles.length) {
            arr[i].children.push(...arr[i].roles)
          }
        } else if (arr[i].hasOwnProperty('children') && !arr[i].hasOwnProperty('roles')) {
          arr[i].children = []
        } else {
          arr[i].children = arr[i].roles
        }
        arr[i].hasOwnProperty('children') && arr[i].children && arr[i].children.length && this.setDeptRoleTreeData(arr[i].children)
      }
      return arr
    },
    // 选择部门联动角色
    // async deptIdChange (item) {
    //   console.log('选择部门', item)
    //   const res = await Api.getRoleData({ deptId: item.id })
    //   if (res.success) {
    //     const copyData = JSON.parse(JSON.stringify(res.data.roles))
    //     this.roleTreeData = this.setRoleTreeData(copyData)
    //   }
    // },
    // 新增
    toDoAdd(roleData) {
      this.formDemoDialog = true
      let flag = this.formOpts.fieldList.some(item => item.value == 'password')
      let obj = { label: '登录密码', value: 'password', type: 'input', comp: 'el-input', bind: { 'show-password': true } }
      let rulesPassword = [{ required: true, message: '请输入登录密码', trigger: 'blur' }, { validator: isStrongPassword, trigger: 'blur' }]
      if (!flag) {
        this.formOpts.fieldList.splice(1, 0, obj)
      }
      console.log('add', this.formOpts.rules)
      if (!this.formOpts.rules.password) {
        this.$set(this.formOpts.rules, 'password', rulesPassword)
      }
      this.$nextTick(() => {
        this.formOpts?.ref?.clearValidate()
      })
      const copyData = JSON.parse(JSON.stringify(roleData))
      this.roleTreeData = this.setRoleTreeData(copyData)
      this.formOpts.formData.roleIds = null

      this.title = '新增'
    },
    // 编辑
    async edit(id, roleData) {
      this.formDemoDialog = true
      const copyData = JSON.parse(JSON.stringify(roleData))
      this.roleTreeData = this.setRoleTreeData(copyData)
      this.formOpts.fieldList.map((item, index) => {
        if (item.value === 'password') {
          this.formOpts.fieldList.splice(index, 1)
        }
      })
      this.$delete(this.formOpts.rules, 'password')
      this.$nextTick(() => {
        this.formOpts?.ref?.clearValidate()
      })
      this.title = '编辑'
      this.formOpts.formData.id = id
      // const res = await Api.getUserInfo(id)
      // // console.log('编辑获取信息', res)
      // if (res.success) {
      //   let formData = res.data
      //   this.formOpts.formData = formData
      //   this.formOpts.formData.deptId = formData?.deptIds[0]
      //   // await this.deptIdChange({ id: this.formOpts.formData.deptId })
      // }
    },
    // 取消弹窗
    cancel() {
      this.formDemoDialog = false
      this.formOpts.ref.resetFields()
      this.roleTreeData = []
    },
    // 清除校验
    clearValidate() {
      this.formOpts.ref.clearValidate()
    },
    // 弹窗确定按钮
    submit() {
      console.log('弹窗确定按钮', this.formOpts.formData)
      this.formOpts.ref.validate(async (valid) => {
        if (!valid) return
        const formData = {
          ...this.formOpts.formData,
          deptIds: this.formOpts.formData.deptId !== null ? [this.formOpts.formData.deptId] : [],
        }
        if (this.title == '新增') {
          // const res = await Api.addUser(formData)
          // if (res.success) {
          //   this.$message.success(`新增成功`)
          //   this.cancel()
          //   this.$emit('submit')
          // }
        }
        if (this.title == '编辑') {
          formData.id = this.formOpts.formData.id
          // const res = await Api.updateUser(formData)
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
    .vue-treeselect__multi-value {
      max-height: 220px;
      overflow: auto;
    }
  }
  ::v-deep .t-dialog-content .el-dialog__body {
    overflow-x: inherit;
  }
}
</style>