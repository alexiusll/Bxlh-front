import React from 'react'
import PropTypes from 'prop-types'
import { Upload, message } from 'antd'
import CookieUtil from '@/utils/cookie'
import { post_prefix } from '@/utils/request'
import { judgeIsSubmit } from '@/utils/util'

export default class UploadFile extends React.Component {
  static propTypes = {
    cycle_status: PropTypes.array,
    cycle_number: PropTypes.number,
    accept: PropTypes.string,
    action: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    handleStatusChange: PropTypes.func.isRequired,
    children: PropTypes.node
  }

  handleFileChange = info => {
    const { handleStatusChange } = this.props

    handleStatusChange(info.file.status, info.file.name)
  }

  beforeUpload = file => {
    const { cycle_status, cycle_number } = this.props

    if (judgeIsSubmit(cycle_status, cycle_number)) {
      message.error('该访视已提交，暂不能上传文件!')
      return
    }
    if (!CookieUtil.get('token_1')) {
      message.error('登陆状态过期，请重新登陆!')
      return false
    }

    const isLt20M = file.size / 1024 / 1024 < 10

    if (!isLt20M) {
      message.error(`文件大小须在10mb以内！${file.name}无法上传。`)
    }
    return isLt20M
  }

  render() {
    const { accept = '*', action, multiple = false, children } = this.props

    return (
      <Upload
        accept={accept}
        action={post_prefix + action}
        method="POST"
        beforeUpload={this.beforeUpload}
        headers={{ Authorization: `Bearer ${CookieUtil.get('token_1')}` }}
        listType="text"
        multiple={multiple}
        name="file"
        showUploadList={false}
        onChange={this.handleFileChange}
      >
        {children}
      </Upload>
    )
  }
}
