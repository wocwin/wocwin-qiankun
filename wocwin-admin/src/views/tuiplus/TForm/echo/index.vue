<template>
  <t-layout-page>
    <t-layout-page-item>
      <t-form ref="TFormDemo" v-model="formOpts.ref" :formOpts="formOpts" :widthSize="1" />
    </t-layout-page-item>
  </t-layout-page>
</template>

<script setup lang="ts">
const hobbyList = ref([
  { label: "吉他", value: "0" },
  { label: "看书", value: "1" },
  { label: "美剧", value: "2" },
  { label: "旅游", value: "3" },
  { label: "音乐", value: "4" }
]);
const sexList = ref([
  { label: "女", value: 1 },
  { label: "男", value: 0 }
]);
const statusList = ref([
  { label: "启用", value: 1 },
  { label: "停用", value: 0 }
]);
// 获取ref
const TFormDemo: any = ref<HTMLElement | null>(null);
// 提交formOpts.ref 方式form表单
const submitForm = () => {
  formOpts.ref.validate((valid: any) => {
    console.log(88, valid);
    console.log(77, formOpts.formData);
    if (!valid) return;
    console.log("最终数据", formOpts.formData);
  });
};
// 提交form表单
// const submitForm = async () => {
//   const { valid, formData } = await TFormDemo.value.validate()
//   console.log('formOpts.ref', formOpts.ref)
//   console.log('formOpts.formData', formData)
//   if (!valid) return
//   console.log('最终数据', formData)
// }
// 重置form表单
const resetForm = () => {
  formOpts.formData = {};
  // 清空校验
  TFormDemo.value.clearValidate();
};
const formOpts: any = reactive({
  ref: null,
  formData: {
    account: null, // *用户账号
    password: null, // *用户密码
    name: null, // *用户昵称
    sex: null, // *性别: 0:男 1:女
    hobby: null, // *爱好: 0:男 1:女
    status: null, // *状态: 0：停用，1：启用(默认为1)',
    desc: null // 描述
  },
  fieldList: [
    {
      label: "账号",
      value: "account",
      type: "input",
      comp: "el-input",
      event: "account"
    },
    {
      label: "密码",
      value: "password",
      type: "password",
      comp: "el-input",
      bind: { "show-password": true }
    },
    { label: "昵称", value: "name", type: "input", comp: "el-input" },
    {
      label: "性别",
      value: "sex",
      placeholder: "TSelect单选",
      type: "select-arr",
      comp: "t-select",
      bind: { optionSource: sexList.value, valueKey: "value" }
    },
    {
      label: "状态",
      value: "status",
      placeholder: "TSelect单选",
      type: "select-arr",
      comp: "t-select",
      bind: { optionSource: statusList, valueKey: "value" }
    },
    {
      label: "爱好",
      value: "hobby",
      placeholder: "TSelect多选",
      type: "select-arr",
      comp: "t-select",
      list: "hobbyList",
      bind: { multiple: true, optionSource: hobbyList, valueKey: "value" }
    },
    {
      label: "描述",
      value: "desc",
      type: "textarea",
      comp: "el-input",
      widthSize: 1
    }
  ],
  operatorList: [
    { label: "提交", type: "danger", fun: submitForm },
    { label: "重置", type: "primary", fun: resetForm }
  ]
});
onMounted(() => {
  getData();
});
// 回显赋值
const getData = () => {
  const objShow = {
    sex: 0, // *性别: 0:男 1:女
    hobby: ["0", "2"], // *爱好
    account: "张三",
    password: "123456",
    name: "三丫子",
    desc: "8888", // 描述
    status: 1 // *状态: 0：停用，1：启用(默认为1)',
  };
  formOpts.formData = objShow;
};
</script>
