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

    <a-table row-key="user_id" :columns="columns" :data-source="data">
      <template slot="status" slot-scope="text">
        <span v-if="text==='1'">启用</span>
        <span v-else>停用</span>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { getUserList } from '@/api/list'

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
          title: '用户id',
          dataIndex: 'user_id'
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
          title: '打卡数',
          dataIndex: 'clock_in_count'
        },
        {
          title: '抽奖数',
          dataIndex: 'raffle_count'
        },
        {
          title: '新增时间',
          dataIndex: 'itime',
          sorter: true
        },
        {
          title: '用户层级',
          dataIndex: 'level'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      getUserList({}).then(res => {
        this.data = res.data.list
      })
    }
  }
}
</script>
