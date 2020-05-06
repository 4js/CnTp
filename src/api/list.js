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

// 用户列表
export function getUserList (data) {
  return axios({
    url: '?c=user&a=index&v=manager&site=useractivity',
    method: 'post',
    data
  })
}
