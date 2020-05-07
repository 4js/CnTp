import { axios } from '@/utils/request'

// 员工列表
export function getMemberList (data) {
  return axios({
    url: '?c=member&a=index&v=manager&site=useractivity',
    method: 'post',
    data
  })
}

// 领导列表
export function getLeaderList (data) {
  return axios({
    url: '?c=leader&a=index&v=manager&site=useractivity',
    method: 'post',
    data
  })
}

// 新增或修改领导
export function updateLeader (data) {
  const affix = data.leader_id ? 'update' : 'add'
  return axios({
    url: `?c=leader&a=${affix}&v=manager&site=useractivity`,
    method: 'post',
    data
  })
}

// 导入员工
export function addJobNumber (data) {
  return axios({
    url: '?c=member&a=importjobnumber&v=manager&site=useractivity',
    method: 'post',
    data
  })
}

// 区域列表
export function getAreaList (data) {
  return axios({
    url: '?c=member&a=arealist&v=manager&site=useractivity',
    method: 'post',
    data
  })
}

// 用户列表
export function getUserList (data) {
  return axios({
    url: '?c=user&a=index&v=manager&site=useractivity',
    method: 'post',
    data
  })
}

// 区域公告列表
export function getNoticeList (data) {
  return axios({
    url: '?c=areanotice&a=index&v=manager&site=useractivity',
    method: 'post',
    data
  })
}

// 更新公告
export function updateNotice (data) {
  return axios({
    url: '?c=areanotice&a=update&v=manager&site=useractivity',
    method: 'post',
    data
  })
}
