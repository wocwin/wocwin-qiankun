<template>
  <div class="t_node_wrap">
    <div class="dingflow_design">
      <div class="zoom flex">
        <i
          class="el-icon-zoom-out"
          :class="'zoom-out'+ (nowVal==50?' disabled':'')"
          @click="zoomSize(1)"
        ></i>
        <span>{{nowVal}}%</span>
        <i
          class="el-icon-zoom-in"
          :class="'zoom-in'+ (nowVal==300?' disabled':'')"
          @click="zoomSize(2)"
        ></i>
      </div>
      <div
        class="box-scale"
        :style="'transform: scale('+nowVal/100+'); transform-origin: 50% 0px 0px;'"
      >
        <div class="box-content">
          <div class="reject_long" v-if="nodeConfigList.length>0"></div>
          <div class="start end-node">开始</div>
          <div class="line"></div>
          <div class="founder">
            <span class="editable-title">创建人</span>
            <div v-if="nodeConfigList.length>0">
              <div class="reject_arrow">
                <div class="reject_line"></div>
              </div>
            </div>
          </div>
          <div class="add-node-btn-box">
            <div class="add-node-btn start-node">
              <button class="btn" type="button" @click="addNode(0)">
                <i style="color:#fff" class="el-icon-plus"></i>
              </button>
            </div>
          </div>
          <div class="line"></div>
          <div class="node-wrap" v-for="(item,index) in nodeConfigList" :key="index">
            <div class="node-wrap-box">
              <div @click="setPerson(index)">
                <div class="title">
                  <span class="editable-title">{{ item.nodeName }}</span>
                  <i class="el-icon-close close" @click.stop="delNode(item)"></i>
                </div>
                <div class="content">
                  <div class="text">
                    {{ item.config==2?'审批人：':'审批角色：' }}
                    {{setApproverStr(item)}}
                    <i
                      class="el-icon-arrow-right arrow"
                    ></i>
                  </div>
                </div>
              </div>
              <div class="reject_arrow">
                <el-button class="reject_btn" size="mini">审批驳回</el-button>
                <div
                  class="reject_line"
                  :class="{'reject_line_last':index==(nodeConfigList.length-1)}"
                ></div>
              </div>
              <div class="againConfirm" :style="{display:item.againConfirmDrawer?'flex':'none'}">
                <el-button size="mini" @click.stop="delNodeCancel(item)">取消</el-button>
                <el-button size="mini" style="color: #FF4D4F;" @click.stop="againDelNode(index)">删除</el-button>
              </div>
            </div>
            <div class="add-node-btn-box">
              <div class="add-node-btn">
                <button class="btn" type="button" @click="addNode(index+1)">
                  <i style="color:#fff" class="el-icon-plus"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="end-node">结束</div>
        </div>
      </div>
    </div>
    <t-dialog
      width="40%"
      title="审批配置"
      :visible="approverDrawer"
      @update:visible="approverDrawer = false"
    >
      <div class="panel_body">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="节点名称" prop="nodeName">
            <el-input v-model="ruleForm.nodeName"></el-input>
          </el-form-item>
          <el-form-item label="审批人配置" prop="config">
            <el-radio-group v-model="ruleForm.config" @change="configChange">
              <el-radio :label="1">角色</el-radio>
              <el-radio :label="2">指定用户</el-radio>
            </el-radio-group>
            <div class="check_info">
              <el-tooltip class="item" effect="dark" :content="tipContent" placement="right">
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addUserRole"></el-button>
              </el-tooltip>
              <template v-for="(item,index) in ruleForm.configList">
                <div class="check_content" :key="index" v-if="isShowPanel">
                  <span class="el-tag el-tag--info el-tag--small el-tag--light">
                    <span class="el-select__tags-text">{{item.label}}</span>
                    <i class="el-tag__close el-icon-close" @click="delUserRole(index)"></i>
                  </span>
                </div>
              </template>
            </div>
          </el-form-item>
          <el-form-item label="审批驳回节点" prop="rejectNode">
            <el-select v-model="ruleForm.rejectNode" filterable placeholder="请选择审批驳回节点">
              <el-option
                v-for="item in rejectList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <t-dialog
        :title="title"
        width="30%"
        :visible="formDemoDialog"
        @update:visible="formDemoDialog = false"
      >
        <div class="content_dialog">
          <div class="sign_list_left">
            <div class="head-container">
              <el-input
                v-model="name"
                :placeholder="placeholder"
                clearable
                size="small"
                prefix-icon="el-icon-search"
              />
            </div>
            <div class="head-container-tree">
              <el-tree
                :data="optionList"
                show-checkbox
                :props="{children: 'children',label: 'label'}"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="tree"
                node-key="id"
                default-expand-all
                @check="check"
              />
            </div>
          </div>
          <div class="sign_list_right" style="width: calc(40% - 10px);">
            <div class="totle">
              已选择：
              <span class="selected_totle">{{ selectedData && selectedData.length }}</span>
            </div>
            <div class="selected_list">
              <div class="selected_content" v-for="(item,index) in selectedData" :key="index">
                <div class="selected_name">{{item.label}}</div>
                <i class="el-icon-delete" @click="delUserRole(index)"></i>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <el-button size="small" @click="formDemoDialog = false">取消</el-button>
          <el-button type="primary" size="small" @click="submit">确定</el-button>
        </template>
      </t-dialog>
      <template #footer>
        <el-button size="small" @click="approverDrawer = false">取消</el-button>
        <el-button type="primary" size="small" @click="outerSubmit">确定</el-button>
      </template>
    </t-dialog>
  </div>
</template>
<script>
export default {
  name: 'TNodeWrap',
  components: {},
  props: {
    nodeConfig: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      nowVal: 100,
      approverDrawer: false,
      nodeConfigList: this.nodeConfig,
      rejectNodeList: [
        {
          id: 0,
          label: '创建人'
        }
      ], // 审批驳回节点数据
      ruleForm: {
        nodeName: '',
        config: 2,
        rejectNode: 0,
        againConfirmDrawer: false, // 再次确认删除
        configListIds: [],
        configList: []
      },
      rules: {
        nodeName: [
          { required: true, message: '请输入节点名称', trigger: 'blur' }
        ],
        config: [
          { required: true, message: '请选择审批人配置', trigger: 'change' }
        ],
        rejectNode: [
          { required: true, message: '请填写审批驳回节点', trigger: 'change' }
        ]
      },
      /**
       * 弹窗
       */
      editRejectNodeList: [], // 点击面板返回的下拉驳回数据
      editIndex: 0, // 点击面板修改后变更nodeConfigList中某一项
      flag: 'add', // 区分是修改还是新增
      tipContent: '请添加审批用户',
      title: '', // 弹窗标题
      name: '', // 弹窗筛选
      placeholder: '',
      formDemoDialog: false,
      isShowPanel: false, // 是否显示在面板中
      configNum: 0, // 面板
      userList: [],
      roleList: [],
      optionList: [],
      selectedIds: [], // 选中的ids
      selectedData: [], // 选中的数据
    }
  },
  computed: {
    rejectList () {
      if (this.flag == 'add') {
        return this.rejectNodeList
      } else {
        return this.editRejectNodeList
      }
    }
  },
  watch: {
    // 根据名称筛选部门树
    name (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.getUserList()
    this.getRoleList()
  },
  methods: {
    // 获取用户
    async getUserList () {
      const res = await this.$api.getUserList()
      // console.log('获取用户', res)
      if (res.success) {
        res.data.map(item => {
          item.id = item.userId
          item.label = item.nickName
        })
        this.userList = res.data
      }
    },
    // 获取角色
    async getRoleList () {
      const res = await this.$api.getRoleList()
      // console.log('获取角色', res)
      if (res.success) {
        res.data.map(item => {
          item.id = item.roleId
          item.label = item.roleName
        })
        this.roleList = res.data
      }
    },
    // 缩小放大
    zoomSize (type) {
      if (type == 1) {
        if (this.nowVal == 50) {
          return
        }
        this.nowVal -= 10
      } else {
        if (this.nowVal == 300) {
          return
        }
        this.nowVal += 10
      }
    },
    //审批人抄送人显示和校验
    setApproverStr (nodeConfig) {
      return (nodeConfig.configList?.map(item => { return item.label }))?.join(',')
    },
    // 点击删除按钮
    delNode (item) {
      item.againConfirmDrawer = true
    },
    // 确认删除节点
    againDelNode (index) {
      this.nodeConfigList.splice(index, 1)
      console.log('确认删除节点', this.nodeConfigList)
    },
    // 确认取消删除
    delNodeCancel (item) {
      item.againConfirmDrawer = false
    },
    // 新增节点
    addNode (index) {
      // if (this.nodeConfigList.length > 0) {
      this.flag = 'add'
      this.configNum = index
      this.$refs?.ruleForm?.resetFields()
      this.ruleForm.configListIds = []
      this.ruleForm.configList = []
      this.selectedIds = []
      this.selectedData = []
      this.$refs?.tree?.setCheckedKeys([])
      // }
      if (this.flag == 'edit') {
        this.ruleForm.rejectNode = this.editRejectNodeList[index]?.id
      } else {
        this.ruleForm.rejectNode = this.rejectNodeList[index]?.id
      }
      console.log('添加节点')
      this.approverDrawer = true
      this.$emit('addNode')
    },
    // 面板审批人配置
    configChange (val) {
      // console.log(444, val)
      if (val == 1) {
        this.tipContent = '请添加审批角色'
      } else {
        this.tipContent = '请添加审批用户'
      }
      this.ruleForm.configListIds = []
      this.ruleForm.configList = []
      this.selectedIds = []
      this.selectedData = []
    },
    //打开面板
    setPerson (index) {
      console.log('打开面板');
      this.approverDrawer = true
      this.isShowPanel = true
      this.flag = 'edit'
      this.editIndex = index
      // 回显面板数据
      const obj = JSON.parse(JSON.stringify(this.nodeConfigList[index]))
      this.ruleForm = obj
      console.log('回显的数据', this.ruleForm);
      this.$set(this.ruleForm, 'configList', obj.configList)
      // 回显用户/角色勾选的数据
      this.$refs.tree?.setCheckedKeys(this.ruleForm.configListIds)
      // 获取点击面板返回的下拉驳回数据（驳回数据只能往上查找）
      const arr = []
      // console.log(666, this.rejectNodeList)
      this.rejectNodeList.map((item, key) => {
        if (key <= index) {
          arr.push(item)
        }
      })
      this.editRejectNodeList = arr

      // console.log(777, this.editRejectNodeList)
    },
    // 关闭面板
    panelClose () {
      this.approverDrawer = false
    },
    /**
     * 弹窗
     */
    // 选择用户/角色弹窗
    addUserRole () {
      if (!this.ruleForm.nodeName) {
        this.$message.warning('请先输入节点名称！')
        return
      }
      if (this.ruleForm.config == 2) {
        this.title = '审批用户选择'
        this.optionList = this.userList
        this.placeholder = '请输入用户名称'
      } else {
        this.title = '审批角色选择'
        this.optionList = this.roleList
        this.placeholder = '请输入角色名称'
      }
      this.selectedIds = this.ruleForm.configListIds
      this.selectedData = this.ruleForm.configList
      this.formDemoDialog = true
      if (this.flag == 'edit') {
        setTimeout(() => {
          this.$refs.tree?.setCheckedKeys(this.selectedIds)
        }, 300)
      }
    },
    // 筛选节点
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 选中
    check (checkedNodes, checkedKeys) {
      // console.log(222, checkedNodes, checkedKeys)
      this.selectedIds = checkedKeys.checkedKeys
      this.selectedData = checkedKeys.checkedNodes
    },
    // 删除选中
    delUserRole (index) {
      // this.nodeConfigList[index].configList.splice(index, 1)
      this.ruleForm.configList.splice(index, 1)
      this.selectedData.splice(index, 1)
      this.selectedIds.splice(index, 1)
      this.$refs.tree.setCheckedKeys(this.selectedIds)
    },
    // 选择用户角色保存
    submit () {
      this.formDemoDialog = false
      this.approverDrawer = true
      this.isShowPanel = true
      this.ruleForm.configList = this.selectedData
      // this.selectedData.map(({ id, label }) => {
      //   this.ruleForm.configList.push({
      //     id,
      //     label
      //   })
      // })
      this.ruleForm.configListIds = this.selectedIds
    },
    // 审批配置弹窗确认
    outerSubmit () {
      if (this.selectedData.length < 1) {
        this.$message.warning('请先添加审批用户或者角色！')
        return
      }
      // console.log('最终选中的数据', this.selectedData)
      // console.log('最终选中的ids', this.selectedIds)
      // console.log('最终面板form', this.ruleForm)
      console.log('新增index', this.configNum)
      console.log('修改index', this.editIndex)

      if (this.flag === 'add') {
        const formObj = JSON.parse(JSON.stringify(this.ruleForm))
        // this.nodeConfigList[this.configNum] = formObj
        this.nodeConfigList.splice(this.configNum, 0, formObj)
        // 储存拼接ID
        this.setJoinId(this.nodeConfigList)
        // 获取驳回下拉数据
        if (this.configNum < this.nodeConfigList.length) {
          this.rejectNodeList.splice(this.configNum + 1, 0, { id: this.nodeConfigList.length, label: formObj.nodeName })
        } else {
          this.rejectNodeList.splice(this.configNum + 1, 0, { id: this.configNum + 1, label: formObj.nodeName })
        }
        console.log('驳回下拉选择', this.rejectNodeList)
      }
      if (this.flag === 'edit') {
        const formObj = JSON.parse(JSON.stringify(this.ruleForm))
        this.nodeConfigList[this.editIndex] = formObj
        this.setJoinId(this.nodeConfigList)
      }
      console.log('最终选中的nodeConfigList', this.nodeConfigList, this.nodeConfigList.length)
      this.approverDrawer = false

    },
    // 储存拼接ID
    setJoinId (arr) {
      let addId = 6
      arr.map((item, index) => {
        switch (index) {
          case 0:
            item.id = addId + index
            item.nodeId = 4
            item.passId = addId + index + ((index + 1) * 5) + 1
            break
          case 1:
            item.id = addId + index + (index * 5)
            item.nodeId = addId + index + ((index - 1) * 5) - 1
            item.passId = addId + index + ((index + 1) * 5) + 1
            break
          case 2:
            item.id = addId + index + (index * 5)
            item.nodeId = addId + index + ((index - 1) * 5) - 1
            item.passId = addId + index + ((index + 1) * 5) + 1
            break
          case 3:
            item.id = addId + index + (index * 5)
            item.nodeId = addId + index + ((index - 1) * 5) - 1
            item.passId = addId + index + ((index + 1) * 5) + 1
            break
          case 4:
            item.id = addId + index + (index * 5)
            item.nodeId = addId + index + ((index - 1) * 5) - 1
            item.passId = addId + index + ((index + 1) * 5) + 1
            break
          case 5:
            item.id = addId + index + (index * 5)
            item.nodeId = addId + index + ((index - 1) * 5) - 1
            item.passId = addId + index + ((index + 1) * 5) + 1
            break
          case 6:
            item.id = addId + index + (index * 5)
            item.nodeId = addId + index + ((index - 1) * 5) - 1
            item.passId = addId + index + ((index + 1) * 5) + 1
            break
          case 7:
            item.id = addId + index + (index * 5)
            item.nodeId = addId + index + ((index - 1) * 5) - 1
            item.passId = addId + index + ((index + 1) * 5) + 1
            break
          case 8:
            item.id = addId + index + (index * 5)
            item.nodeId = addId + index + ((index - 1) * 5) - 1
            item.passId = addId + index + ((index + 1) * 5) + 1
            break
          case 9:
            item.id = addId + index + (index * 5)
            item.nodeId = addId + index + ((index - 1) * 5) - 1
            item.passId = addId + index + ((index + 1) * 5) + 1
            break
          case 10:
            item.id = addId + index + (index * 5)
            item.nodeId = addId + index + ((index - 1) * 5) - 1
            item.passId = addId + index + ((index + 1) * 5) + 1
            break
          case 11:
            item.id = addId + index + (index * 5)
            item.nodeId = addId + index + ((index - 1) * 5) - 1
            item.passId = addId + index + ((index + 1) * 5) + 1
            break
        }
      })
      // 拼接驳回节点id
      arr.map((val) => {
        switch (val.rejectNode) {
          case 0:
            val.nodeId = 4
            break
          case 1:
            val.nodeId = addId + val.rejectNode + ((val.rejectNode - 1) * 5) - 1
            break
          case 2:
            val.nodeId = addId + val.rejectNode + ((val.rejectNode - 1) * 5) - 1
            break
          case 3:
            val.nodeId = addId + val.rejectNode + ((val.rejectNode - 1) * 5) - 1
            break
          case 4:
            val.nodeId = addId + val.rejectNode + ((val.rejectNode - 1) * 5) - 1
            break
          case 5:
            val.nodeId = addId + val.rejectNode + ((val.rejectNode - 1) * 5) - 1
            break
          case 6:
            val.nodeId = addId + val.rejectNode + ((val.rejectNode - 1) * 5) - 1
            break
          case 7:
            val.nodeId = addId + val.rejectNode + ((val.rejectNode - 1) * 5) - 1
            break
          case 8:
            val.nodeId = addId + val.rejectNode + ((val.rejectNode - 1) * 5) - 1
            break
          case 9:
            val.nodeId = addId + val.rejectNode + ((val.rejectNode - 1) * 5) - 1
            break
          case 10:
            val.nodeId = addId + val.rejectNode + ((val.rejectNode - 1) * 5) - 1
            break
          case 11:
            val.nodeId = addId + val.rejectNode + ((val.rejectNode - 1) * 5) - 1
            break
        }
      })
      arr[arr.length - 1].passId = 3
    },
    // 返回最终配置结构数据
    getNodeConfig () {
      return {
        rejectNodeList: this.rejectNodeList,
        nodeConfigList: this.nodeConfigList
      }
    },
  }
}
</script>
<style lang="scss">
@import './style.scss';
</style>
