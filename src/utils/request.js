import { extend } from 'umi-request'
import { notification, message } from 'antd'

import CookieUtil from './cookie'
import { removeNull } from './util'

const codeMessage = {
  999: '服务器出错',
  1000: '用户无效',
  1001: '无效参数',
  1002: '资源未找到',
  10021: '该资源已删除',

  1003: '用户授权失败',
  10031: 'token无效',
  10032: 'token过期',
  10033: '该用户名不存在',
  10034: '用户名或密码错误',

  1004: '权限不足',
  1005: '文件查找失败',
  1006: '用户已存在，创建失败',
  2001: '样本非该用户所创建',
  1007: '样本已提交，暂时无法修改',
  1008: '已经存在签名',
  1009: '项目名重复，编辑失败',
  1010: '删除失败，需要将用户',
  1011: '当前用户还没有签名'
}

// 处理服务器异常
const request = extend({
  errorHandler: error => {
    const { response } = error

    if (response && response.status) {
      const { status, url } = response

      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: response.statusText
      })
    }
  }
})

const config = {
  //本地
  local: 'http://localhost:82',
  local_auth: 'http://localhost:81',
  //预生产预览环境  阿里云的测试服务器
  pre: 'http://39.106.111.52/p2/api',
  pre_auth: 'http://39.106.111.52/api',
  // 预生产预览环境  阿里云的测试服务器2
  // pre1: 'http://39.96.191.139:82',
  // pre1_auth: 'http://39.96.191.139:81',
  // 生产环境地址
  prod: 'http://www.rayplus.top:82',
  prod_auth: 'http://www.rayplus.top:81'
}

const { NODE_ENV } = process.env
const ENV = 'pre'

export const post_prefix = config[ENV]

let COOKIE_CONFIRM = true

function auth_request(url, { method = 'GET', params = {}, data = {} }) {
  let prefix

  if (/v1/.test(url)) {
    // 权限管理请求，prefix是权限的81端口
    prefix = NODE_ENV === 'development' ? '/api' : config[`${ENV}_auth`]
  } else {
    // rwe请求，prefix是rwe的8080端口
    prefix = NODE_ENV === 'development' ? '/api' : config[ENV]
  }

  // 判断cookie是否失效
  if (CookieUtil.get('token_2') === null) {
    // 防止同时多次请求
    if (!COOKIE_CONFIRM) {
      return
    }
    COOKIE_CONFIRM = false
    message.warning('登陆状态失效，请重新登陆！')
    window.location.href = window.location.origin + '/#/login'
    return
  }

  if (!COOKIE_CONFIRM) COOKIE_CONFIRM = true

  return new Promise(resolve => {
    request(prefix + url, {
      method,
      params: removeNull(params),
      data: removeNull(data),
      credentials: 'omit',
      // 这里的request的header不能加在extend创建实例里
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CookieUtil.get('token_2')}`
      }
    }).then(res => {
      if (res && res.code === 200) {
        // 如果post请求没有data，就返回true，以便判断generator下一步执行
        if (res.total !== undefined) {
          resolve({ data: res.data, total: res.total })
        } else {
          resolve(res.data !== undefined ? res.data : true)
        }
      } else if (res) {
        notification.error({
          message: codeMessage[res.code]
        })
      }
      // 错误不能reject 会导致generator call函数出错
      resolve()
    })
  })
}

export default auth_request
