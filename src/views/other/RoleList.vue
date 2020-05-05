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
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="record.status==='1'">停用</a>
        <a v-else>启用</a>
        <a-divider type="vertical" />
        <a class="ant-dropdown-link">设置权限</a>
      </span>
    </a-table>

    <a-modal v-model="visible" title="编辑角色" @ok="handleOk">
      <a-form-model :model="ruleform" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="Activity name">
          <a-input v-model="ruleform.name" />
        </a-form-model-item>
        <a-form-model-item label="Activity zone">
          <a-select v-model="ruleform.region" placeholder="please select your zone">
            <a-select-option value="shanghai">
              Zone one
            </a-select-option>
            <a-select-option value="beijing">
              Zone two
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Activity time">
          <a-date-picker
            v-model="ruleform.date1"
            show-time
            type="date"
            placeholder="Pick a date"
            style="width: 100%;"
          />
        </a-form-model-item>
        <a-form-model-item label="Instant delivery">
          <a-switch v-model="ruleform.delivery" />
        </a-form-model-item>
        <a-form-model-item label="Activity type">
          <a-checkbox-group v-model="ruleform.type">
            <a-checkbox value="1" name="type">
              Online
            </a-checkbox>
            <a-checkbox value="2" name="type">
              Promotion
            </a-checkbox>
            <a-checkbox value="3" name="type">
              Offline
            </a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
        <a-form-model-item label="Resources">
          <a-radio-group v-model="ruleform.resource">
            <a-radio value="1">
              Sponsor
            </a-radio>
            <a-radio value="2">
              Venue
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="Activity form">
          <a-input v-model="ruleform.desc" type="textarea" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getRoleList } from '@/api/manage'
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

      visible: false,

      form: null,
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
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      ruleform: {
        name: '',
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  created () {
    getRoleList().then(res => {
      console.log(res)
      this.data = res.data.list
    })
  },
  methods: {
    handleEdit (record) {
      this.mdl = Object.assign({}, record)
      this.mdl.permissions = []

      // this.mdl.permissions.forEach(permission => {
      //   permission.actionsOptions = permission.actionEntitySet.map(action => {
      //     return { label: action.describe, value: action.action, defaultCheck: action.defaultCheck }
      //   })
      // })

      console.log(this.mdl)
      this.visible = true
    },
    handleOk () {
      getRoleList().then(res => {
        console.log(res)
        this.data = res.data.list
      })
    }
  }
}
</script>
