import Vue from 'vue'
import axios from 'axios'
import router from '../router'
import store from '@/store'
import qs from 'qs'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN, ADMIN_ID } from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  const adminId = Vue.ls.get(ADMIN_ID)
  if (token) {
    config.data = Object.assign({ key_token: token, admin_id: adminId }, config.data) // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  config.data = qs.stringify(config.data)
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  if (response.data.code === 1) {
    return response.data
  } else if (response.data.code === '-1003') {
    notification.error({
      message: '登录失效',
      description: '请重新登录'
    })
    router.redirect('/user/login')
  } else {
    notification.error({
      message: 'Forbidden',
      description: response.data.message
    })
  }
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
