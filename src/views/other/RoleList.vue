<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色ID">
              <a-input placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary">查询</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="showApplyModal">新增角色</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-table row-key="role_id" :columns="columns" :data-source="data">
      <template slot="status" slot-scope="text">
        <span v-if="text==='1'">启用</span>
        <span v-else>停用</span>
      </template>
      <span slot="action" slot-scope="text, record">
        <a @click="showApplyModal(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
          :title="`确定${record.status==='1'?'停用':'启用'}该角色?`"
          @confirm="changeRoleStatus(record)"
          okText="确定"
          cancelText="取消"
        >
          <a v-if="record.status==='1'">停用</a>
          <a v-else>启用</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定删除该角色?"
          @confirm="toDelete(record.role_id)"
          okText="确定"
          cancelText="取消"
        >
          <a href="#">删除</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a @click="showEditModal(record)" class="ant-dropdown-link">设置权限</a>
      </span>
    </a-table>
    <!-- 维护角色 -->
    <a-modal v-model="addRoleModal" :title="modalTitle" @ok="handleOk">
      <a-form-model ref="addRoleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="角色名称" prop="role_name">
          <a-input v-model="form.role_name" />
        </a-form-model-item>
        <a-form-model-item label="角色描述" prop="mark">
          <a-input v-model="form.mark" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 绑定权限 -->
    <a-modal v-model="editFunctionModal" title="管理权限" @ok="manageRoleFunction">
      <a-form-model :label-col="{ span: 0 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item>
          <a-tree
            v-model="checkedKeys"
            checkable
            autoExpandParent
            :auto-expand-parent="false"
            :tree-data="menuData"
            :replace-fields="replaceFields"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getRoleList, updateRoleStatus, updateRole, deleteRole, getPermissionList, setRolePermission } from '@/api/manage'
import RoleModal from './modules/RoleModal'

export default {
  name: 'TableList',
  components: {
    STable,
    RoleModal
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      mdl: {},
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '角色id',
          dataIndex: 'role_id'
        },
        {
          title: '角色名称',
          dataIndex: 'role_name'
        },
        {
          title: '角色备注',
          dataIndex: 'mark'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'utime',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [],
      // formmodal
      modalTitle: '新增角色',
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      addRoleModal: false,
      rules: {
        role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        mark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      form: {
        role_name: '',
        mark: ''
      },
      // 权限
      editFunctionModal: false,
      checkedKeys: [],
      menuData: [],
      replaceFields: {
        title: 'aname',
        key: 'apicode'
      }
    }
  },
  created () {
    this.getRole()
  },
  methods: {
    showApplyModal (role = null) {
      if (role) {
        this.form = {
          role_name: role.role_name,
          mark: role.mark
        }
      }
      this.modalTitle = role ? '修改角色' : '新增角色'
      this.mdl = Object.assign({}, role)
      this.addRoleModal = true
    },
    handleOk () {
      this.$refs.addRoleForm.validate(valid => {
        if (valid) {
          const roleData = this.form
          const tips = this.mdl ? '修改成功' : '添加成功'
          if (this.mdl) roleData.role_id = this.mdl.role_id
          updateRole(roleData).then(res => {
            if (res) {
              this.getRole()
              this.$message.success(tips)
              this.addRoleModal = false
            }
          })
        }
      })
    },
    getRole () {
      getRoleList().then(res => {
        console.log(res)
        this.data = res.data.list
      })
    },
    toDelete (id) {
      deleteRole({ role_id: id }).then(res => {
        this.$message.success('删除成功')
        this.getRole()
      })
    },
    changeRoleStatus (role) {
      const { role_id: roleID, status } = role
      updateRoleStatus({ role_id: roleID, status: status === '1' ? '2' : '1' }).then(res => {
        if (res) {
          this.getRole()
          this.$message.success('修改成功')
        }
      })
    },
    // 授权
    manageRoleFunction () {
      const apicode = this.checkedKeys.filter(item => !item.includes('0-0')).join(',')
      const { role_id: roleID } = this.mdl
      setRolePermission({ role_id: roleID, apicode }).then(res => {
        if (res) {
          this.getRole()
          this.$message.success('提交成功')
          this.editFunctionModal = false
        }
      })
    },
    // 遍历获取树结构
    getTreeData (data, checkedTree) {
      if (data.apicode !== void 0) {
        if (parseInt(data.is_have) === 1) {
          checkedTree.push(data.apicode)
        }
        return [
          {
            aname: data.aname,
            apicode: data.apicode,
            cname: data.cname,
            is_have: data.is_have,
            disabled: parseInt(data.is_sys) === 1,
            sitename: data.sitename
          }
        ]
      } else {
        return Object.keys(data).map(key => {
          const item = data[key]
          const children = this.getTreeData(item, checkedTree)
          let disabled
          if (children instanceof Array) {
            disabled = !children.some(item => !item.disabled)
          } else {
            disabled = children.disabled
          }
          if (children.length === 1 && children[0].aname === key) {
            return children[0]
          } else {
            return {
              aname: key,
              disabled,
              children
            }
          }
        })
      }
    },
    getPermission (roleID) {
      getPermissionList({ role_id: roleID }).then(res => {
        console.log(res)
        this.menuData = this.getTreeData(res.data.list, this.checkedKeys)
        // this.menuData = res.data.list
      })
    },
    // 显示管理权限modal
    showEditModal (role) {
      this.mdl = Object.assign({}, role)
      this.editFunctionModal = true
      this.getPermission(role.role_id)
    }
  }
}
</script>
