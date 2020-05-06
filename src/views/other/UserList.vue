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
          :title="`确定${record.status==='1'?'停用':'启用'}该管理员?`"
          @confirm="changeAdminStatus(record)"
          okText="确定"
          cancelText="取消"
        >
          <a v-if="record.status==='1'">停用</a>
          <a v-else>启用</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定删除该管理员?"
          @confirm="toDelete(record.admin_id)"
          okText="确定"
          cancelText="取消"
        >
          <a href="#">删除</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a class="ant-dropdown-link">绑定角色</a>
      </span>
    </a-table>

    <a-modal v-model="addRoleModal" :title="modalTitle" @ok="handleOk">
      <a-form-model ref="addRoleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="管理员名称" prop="role_name">
          <a-input v-model="form.role_name" />
        </a-form-model-item>
        <a-form-model-item label="唯一key" prop="mark">
          <a-input v-model="form.mark" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getAdminList, updateAdminStatus, updateAdmin, deleteAdmin } from '@/api/manage'
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
          title: '管理员id',
          dataIndex: 'admin_id'
        },
        {
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '真实名',
          dataIndex: 'truename'
        },
        {
          title: '手机号',
          dataIndex: 'tel'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '备注',
          dataIndex: 'mark'
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
      modalTitle: '新增管理员',
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      addAdminModal: false,
      rules: {
        role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        mark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      form: {
        role_name: '',
        mark: ''
      }
    }
  },
  created () {
    this.getAdmin()
  },
  methods: {
    showApplyModal (admin = null) {
      if (admin) {
        this.form = {
          roleName: admin.username,
          notes: admin.notes
        }
      }
      this.modalTitle = admin ? '修改管理员' : '新增管理员'
      this.mdl = Object.assign({}, admin)
      this.addAdminModal = true
    },
    handleOk () {
      this.$refs.addRoleForm.validate(valid => {
        if (valid) {
          const adminData = this.form
          const tips = this.mdl ? '修改成功' : '添加成功'
          if (this.mdl) adminData.admin_id = this.mdl.admin_id
          updateAdmin(adminData).then(res => {
            if (res) {
              this.getAdmin()
              this.$message.success(tips)
              this.addAdminModal = false
            }
          })
        }
      })
    },
    getAdmin () {
      getAdminList().then(res => {
        console.log(res)
        this.data = res.data.list
      })
    },
    toDelete (id) {
      deleteAdmin({ targetadmin_id: id }).then(res => {
        this.$message.success('删除成功')
        this.getRole()
      })
    },
    changeAdminStatus (admin) {
      const { admin_id: adminID, status } = admin
      updateAdminStatus({ targetadmin_id: adminID, status: status === '1' ? '2' : '1' }).then(res => {
        if (res) {
          this.getAdmin()
          this.$message.success('修改成功')
        }
      })
    }
  }
}
</script>
