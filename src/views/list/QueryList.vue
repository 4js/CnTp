<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="领导ID">
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
              <a-button style="margin-left: 8px" type="primary" @click="showApplyModal">新增领导</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-table row-key="id" :columns="columns" :data-source="data">
      <template slot="status" slot-scope="text">
        <span v-if="text==='1'">启用</span>
        <span v-else>停用</span>
      </template>
      <span slot="action" slot-scope="text, record">
        <a @click="showApplyModal(record)">编辑</a>
      </span>
    </a-table>

    <a-modal v-model="addRoleModal" :title="modalTitle" @ok="handleOk">
      <a-form-model ref="addRoleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="领导名" prop="leader_name">
          <a-input v-model="form.leader_name" />
        </a-form-model-item>
        <a-form-model-item label="电话号码" prop="tel">
          <a-input v-model="form.tel" />
        </a-form-model-item>
        <a-form-model-item label="区域" prop="area_id">
          <a-cascader v-model="form.area_id" :options="areaList" :field-names="{ label: 'area_name', value: 'id', children: 'child' }" placeholder="请选择区域"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import { updateRoleStatus, deleteRole } from '@/api/manage'
import { getLeaderList, getAreaList, updateLeader } from '@/api/list'

export default {
  name: 'TableList',
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      mdl: {},
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '领导id',
          dataIndex: 'id'
        },
        {
          title: '领导名',
          dataIndex: 'leader_name'
        },
        {
          title: '手机号',
          dataIndex: 'tel'
        },
        {
          title: '区域id',
          dataIndex: 'area_id'
        },
        {
          title: '区域名',
          dataIndex: 'area_name'
        },
        {
          title: '新增时间',
          dataIndex: 'itime',
          sorter: true
        },
        {
          title: '更新时间',
          dataIndex: 'utime',
          sorter: true
        },
        {
          title: '成员数',
          dataIndex: 'member_count'
        },
        {
          title: '用户数',
          dataIndex: 'user_count'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [],
      // formmodal
      modalTitle: '新增领导',
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      addRoleModal: false,
      rules: {
        leader_name: [{ required: true, message: '请输入领导名称', trigger: 'blur' }],
        tel: [{ required: true, message: '请填写电话号码', trigger: 'blur' }],
        area_id: [{ required: true, message: '请选择区域', trigger: 'blur' }]
      },
      form: {
        tel: '',
        leader_name: '',
        area_id: ''
      },
      areaList: []
    }
  },
  created () {
    this.getList()
    getAreaList().then(res => {
      console.log(res.data[0].child)
      this.areaList = res.data
    })
  },
  methods: {
    showApplyModal (leader = null) {
      if (leader) {
        this.form = {
          leader_name: leader.leader_name,
          tel: leader.tel,
          area_id: [leader.area_id]
        }
      }
      this.modalTitle = leader ? '编辑领导' : '新增领导'
      this.mdl = Object.assign({}, leader)
      this.addRoleModal = true
    },
    handleOk () {
      this.$refs.addRoleForm.validate(valid => {
        if (valid) {
          const leaderData = Object.assign({}, this.form)
          const tips = this.mdl ? '修改成功' : '添加成功'
          if (this.mdl) leaderData.leader_id = this.mdl.id
          leaderData.area_id = leaderData.area_id[leaderData.area_id.length - 1]
          updateLeader(leaderData).then(res => {
            if (res) {
              this.getList()
              this.$message.success(tips)
              this.addRoleModal = false
            }
          })
        }
      })
    },
    getList () {
      getLeaderList({}).then(res => {
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
    }
  }
}
</script>
