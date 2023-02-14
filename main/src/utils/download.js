import axios from 'axios'
import { Message } from 'element-ui'
import { saveAs } from 'file-saver'
import { getToken } from '@/utils/auth'

const baseURL = process.env.VUE_APP_BASE_API

export default {
  name (name, isDelete = true) {
    var url = baseURL + "/common/download?fileName=" + encodeURI(name) + "&delete=" + isDelete
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { 'Authorization': getToken() }
    }).then(async (res) => {
      const isLogin = await this.blobValidate(res.data);
      if (isLogin) {
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURI(res.headers['content-disposition']))
      } else {
        this.printErrMsg(res.data)
      }
    })
  },
  excel (url, name, params) {
    var url = baseURL + url
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { 'Authorization': getToken() },
      params
    }).then(async (res) => {
      // console.log('excel', res)
      const isLogin = await this.blobValidate(res.data)
      if (isLogin) {
        // const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        this.saveAs(blob, name)
      } else {
        this.printErrMsg(res.data);
      }
    })
  },
  zip (url, name) {
    var url = baseURL + url
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { 'Authorization': getToken() }
    }).then(async (res) => {
      const isLogin = await this.blobValidate(res.data);
      if (isLogin) {
        const blob = new Blob([res.data], { type: 'application/zip' })
        this.saveAs(blob, name)
      } else {
        this.printErrMsg(res.data)
      }
    })
  },
  saveAs (text, name, opts) {
    saveAs(text, name, opts)
  },
  // 验证是否为blob格式
  async blobValidate (data) {
    try {
      const text = await data.text()
      JSON.parse(text)
      return false
    } catch (error) {
      return true
    }
  },
  async printErrMsg (data) {
    const resText = await data.text();
    const rspObj = JSON.parse(resText);
    const errorCode = {
      '401': '认证失败，无法访问系统资源',
      '403': '当前操作没有权限',
      '404': '访问资源不存在',
      'default': '系统未知错误，请反馈给管理员'
    }
    const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
    Message.error(errMsg);
  }
}

