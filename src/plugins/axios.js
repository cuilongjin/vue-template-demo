'use strict'

import Vue from 'vue'
import axios from 'axios'
// import qs from 'qs'
import { Loading } from 'element-ui'
import store from '@/store.js'
// import { promised } from 'q';
import Router from '@/plugins/axios.js'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
  headers: {
    // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" // form格式, POST请求时data需要序列化
    'Content-Type': 'application/json;charset=utf-8' // 默认， 传送json对象数据， POST请求时ndata不要序列化
  },

  // `onUploadProgress` 允许为上传处理进度事件
  onUploadProgress: function (progressEvent) {
    // 对原生进度事件的处理
  },

  // `onDownloadProgress` 允许为下载处理进度事件
  onDownloadProgress: function (progressEvent) {
    // 对原生进度事件的处理
  }
}

const _axios = axios.create(config)
let reqNum = 0
let loading
_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
    //   config.data = qs.stringify(config.data)
    // }
    reqNum++
    loading = Loading.service({
      lock: true
    })
    const token = store.state.token
    token && (config.headers.Authorization = token)
    return config
  },
  function (error) {
    // Do something with request error
    loading.close()
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    reqNum--
    if (response.statuss === 200) {
      return Promise.resolve(response)
    } else if (response.statuss !== 200) {
      return Promise.reject(response)
    }

    if (reqNum <= 0) {
      loading.close()
    }
  },
  function (error) {
    // Do something with response error
    loading.close()
    if (error.response.status) {
      switch (error.response.status) {
        case 401: // 未登录
          Router.replace({
            path: '/login',
            query: {
              redirect: Router.currentRoute.fullPath
            }
          })
          break
        case 403: // 登陆过期
          Loading({
            message: '登录过期',
            type: error,
            forbidClick: true
          })
          // 清除 token
          localStorage.removeItem('token')
          store.commit('')
          // 跳转登录页，保存当前页 fillPath
          setTimeout(() => {
            Router.replace({
              path: '/login',
              query: {
                redirect: Router.currentRoute.fullPath
              }
            })
          }, 1000)
          break
        case 404:
          Loading({
            message: '请求不存在',
            type: error,
            forbidClick: true
          })
          break
        default:
          Loading({
            message: error.response.data.message,
            type: error,
            forbidClick: true
          })
      }
    }
    return Promise.reject(error)
  }
)

Plugin.install = function (Vue, options) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
