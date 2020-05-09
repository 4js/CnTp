// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: 'dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '工作台', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
          {
            path: 'workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },

      // list
      {
        path: '/activity',
        name: 'activity',
        component: PageView,
        redirect: '/activity/table-list',
        meta: { title: '活动管理', icon: 'table', permission: [ 'table' ] },
        children: [
          {
            path: '/activity/table-list',
            name: 'activityList',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/TableList'),
            meta: { title: '抽奖列表', keepAlive: true, permission: [ 'table' ] }
          }
        ]
      },

      // list
      {
        path: '/list',
        name: 'list',
        component: PageView,
        redirect: '/list/table-list',
        meta: { title: '用户管理', icon: 'form', permission: [ 'table' ] },
        children: [
          {
            path: '/list/table-list',
            name: 'QueryList',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/QueryList'),
            meta: { title: '领导列表', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/list/basic-list',
            name: 'BasicList',
            component: () => import('@/views/list/TableList'),
            meta: { title: '员工列表', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/list/card',
            name: 'CardList',
            component: () => import('@/views/list/CardList'),
            meta: { title: '用户列表', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/list/notice',
            name: 'NoticeList',
            component: () => import('@/views/list/NoticeList'),
            meta: { title: '区域公告', keepAlive: true, permission: [ 'table' ] }
          }
        ]
      },

      // other
      {
        path: '/other',
        name: 'otherPage',
        component: RouteView,
        meta: { title: '权限管理', icon: 'slack', permission: [ 'dashboard' ] },
        redirect: '/other/user-list',
        children: [
          {
            path: '/other/user-list',
            name: 'UserList',
            component: () => import('@/views/other/UserList'),
            meta: { title: '管理员列表', keepAlive: true }
          },
          {
            path: '/other/role-list',
            name: 'RoleList',
            component: () => import('@/views/other/RoleList'),
            meta: { title: '角色列表', keepAlive: true }
          }
          // {
          //   path: '/other/list/system-role',
          //   name: 'SystemRole',
          //   component: () => import('@/views/role/RoleList'),
          //   meta: { title: '角色列表2', keepAlive: true }
          // },
          // {
          //   path: '/other/permission-list',
          //   name: 'PermissionList',
          //   component: () => import('@/views/other/PermissionList'),
          //   meta: { title: '权限列表', keepAlive: true }
          // }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
