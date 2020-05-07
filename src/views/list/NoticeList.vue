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

    <a-table row-key="id" :columns="columns" :data-source="data">
      <span slot="action" slot-scope="text, record">
        <a @click="showApplyModal(record)">编辑</a>
      </span>
    </a-table>

    <a-modal v-model="addRoleModal" title="编辑" @ok="handleOk">
      <a-form-model ref="addRoleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="区域" prop="area_name">
          <a-input v-model="form.area_name" disabled/>
        </a-form-model-item>
        <a-form-model-item label="公告" prop="notice_content">
          <a-textarea v-model="form.notice_content" placeholder="233,23,323" :rows="4" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import { getNoticeList, updateNotice } from '@/api/list'

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
          title: '区域id',
          dataIndex: 'id'
        },
        {
          title: '区域名',
          dataIndex: 'area_name'
        },
        {
          title: '公告内容',
          dataIndex: 'notice_content'
        },
        {
          title: '新增时间',
          dataIndex: 'itime',
          sorter: true
        },
        {
          title: '更新时间',
          dataIndex: 'utime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [],
      // model
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      addRoleModal: false,
      rules: {
        notice_content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
      },
      form: {
        notice_content: '',
        area_name: '',
        area_id: ''
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      getNoticeList({}).then(res => {
        this.data = res.data.list
      })
    },
    showApplyModal (notice) {
      if (notice) {
        this.form = {
          notice_content: notice.notice_content,
          area_id: notice.id,
          area_name: notice.area_name
        }
      }
      this.addRoleModal = true
    },
    handleOk () {
      this.$refs.addRoleForm.validate(valid => {
        if (valid) {
          const noticeData = Object.assign({}, this.form)
          delete noticeData.area_name
          updateNotice(noticeData).then(res => {
            if (res) {
              this.getList()
              this.$message.success('更新成功')
              this.addRoleModal = false
            }
          })
        }
      })
    }
  }
}
</script>
