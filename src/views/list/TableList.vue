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
              <a-button style="margin-left: 8px" type="primary" @click="showApplyModal">新增员工</a-button>
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
    </a-table>

    <a-modal v-model="addRoleModal" title="导入员工" @ok="handleOk">
      <a-form-model ref="addRoleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="员工列表" prop="job_numbers">
          <a-textarea v-model="form.job_numbers" placeholder="233,23,323" :rows="4" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import { getMemberList, addJobNumber } from '@/api/list'

export default {
  name: 'TableList',
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '员工id',
          dataIndex: 'id'
        },
        {
          title: '工号',
          dataIndex: 'job_number'
        },
        {
          title: '用户名',
          dataIndex: 'member_name'
        },
        {
          title: '手机号',
          dataIndex: 'tel'
        },
        {
          title: '区域名',
          dataIndex: 'area_name'
        },
        {
          title: '一级用户人数',
          dataIndex: 'first_user_count'
        },
        {
          title: '二级用户人数',
          dataIndex: 'second_user_count'
        },
        {
          title: '绑定工号时间',
          dataIndex: 'bind_time',
          sorter: true
        },
        {
          title: '新增工号时间',
          dataIndex: 'itime',
          sorter: true
        }
      ],
      data: [],
      // formmodal
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      addRoleModal: false,
      rules: {
        job_numbers: [{ required: true, message: '请输入员工列表', trigger: 'blur' }]
      },
      form: {
        job_numbers: ''
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    showApplyModal () {
      this.form = {
        job_numbers: ''
      }
      this.addRoleModal = true
    },
    handleOk () {
      this.$refs.addRoleForm.validate(valid => {
        if (valid) {
          addJobNumber(this.form).then(res => {
            if (res) {
              this.getList()
              this.$message.success('添加成功')
              this.addRoleModal = false
            }
          })
        }
      })
    },
    getList () {
      getMemberList({}).then(res => {
        this.data = res.data.list
      })
    }
  }
}
</script>
