/*
 * @Author: your name
 * @Date: 2020-05-06 09:46:34
 * @LastEditTime: 2020-05-09 17:46:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \CnTp\src\api\manage.js
 */
import { axios } from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api

export function getUserList (parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getAdminList (data) {
  return axios({
    url: '?c=admin&a=selectlist&v=manager&site=gateway',
    method: 'post',
    data
  })
}

export function updateAdminStatus (data) {
  return axios({
    url: '?c=admin&a=updatestatus&v=manager&site=gateway',
    method: 'post',
    data
  })
}

export function deleteAdmin (data) {
  return axios({
    url: '?c=admin&a=deleteadmin&v=manager&site=gateway',
    method: 'post',
    data
  })
}

export function updateAdmin (data) {
  const affix = data.admin_id ? 'updateinfo' : 'add'
  return axios({
    url: `?c=admin&a=${affix}&v=manager&site=gateway`,
    method: 'post',
    data
  })
}

export function adminRole (data) {
  return axios({
    url: '?c=admin&a=bindrole&v=manager&site=gateway',
    method: 'post',
    data
  })
}

export function getRoleList (data) {
  return axios({
    url: '?c=adminrole&a=selectrole&v=manager&site=gateway',
    method: 'post',
    data
  })
}

export function deleteRole (data) {
  return axios({
    url: '?c=adminrole&a=deleterole&v=manager&site=gateway',
    method: 'post',
    data
  })
}

export function updateRole (data) {
  const affix = data.role_id ? 'updaterole' : 'addrole'
  return axios({
    url: `?c=adminrole&a=${affix}&v=manager&site=gateway`,
    method: 'post',
    data
  })
}

export function updateRoleStatus (data) {
  return axios({
    url: '?c=adminrole&a=updatestatus&v=manager&site=gateway',
    method: 'post',
    data
  })
}

export function getPermissionList (data) {
  return axios({
    url: '?c=adminrole&a=selectroleapi&v=manager&site=gateway',
    method: 'post',
    data
  })
}

export function setRolePermission (data) {
  return axios({
    url: '?c=adminrole&a=setpoint&v=manager&site=gateway',
    method: 'post',
    data
  })
}

export function getServiceList (parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}
