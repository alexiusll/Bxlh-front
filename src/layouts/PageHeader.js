import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Button, Modal, ConfigProvider, Tooltip, Popover, Icon, message, Spin } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

import UploadFile from '@/components/UploadFile'
import CookieUtil from '@/utils/cookie'
import { post_prefix } from '@/utils/request'
import RayPlus from '@/assets/rayplus.png'
import styles from './index.css'

const sampleReg = /^\/sample\/?$/
const detailReg = /^\/sample\/\d+\/crf\/?$/

class PageHeader extends React.Component {
  state = {
    visible: false,
    file_status: 0
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  handleLogout = () => {
    Modal.confirm({
      title: '确认退出登录？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 清空cookie
        CookieUtil.unset('token')
        CookieUtil.unset('token_1')
        CookieUtil.unset('token_2')
        CookieUtil.unset('userInfo')
        CookieUtil.unset('user_signature')
        // 分离项目后跳转登陆 不能用umi自带的router 需要手动跳转
        window.location.href = window.location.origin + '/#/login'
      }
    })
    this.setState({ visible: false })
  }

  handleStatusChange = (status, name) => {
    if (status === 'uploading') {
      this.setState({ file_status: 1 })
    } else if (status === 'done') {
      message.success(`${name} 上传成功！`)
      this.setState({ file_status: 0, visible: false })
      const { dispatch } = this.props

      // forceUpdate强制刷新 更新至查看签名状态
      dispatch({
        type: 'global/fetchSignature'
      }).then(() => this.forceUpdate())
    } else if (status === 'error') {
      message.success(`${name} 上传失败！`)
      this.setState({ file_status: 0, visible: false })
    }
  }

  handleLookSignature = () => {
    this.setState({ visible: false })
    const user_signature = CookieUtil.get('user_signature')

    Modal.info({
      title: '签名图片',
      width: 'auto',
      centered: true,
      content: (
        <div>
          <img
            className={styles.user_sign}
            src={`${post_prefix}/static/tempFiles${user_signature.substring(1)}`}
            alt="用户签名"
          ></img>
        </div>
      ),
      icon: <Icon type="file-image" />,
      maskClosable: true,
      okText: '确定'
    })
  }

  handleOpenPopover = () => {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    const { location, children } = this.props
    const { pathname } = location
    const { visible, file_status } = this.state

    let title

    // 动态确定当前页面标题
    if (sampleReg.test(pathname)) {
      title = '临床试验样本'
      document.title = '临床试验样本'
    } else if (detailReg.test(pathname)) {
      title = 'CRF详情'
      document.title = 'CRF详情'
    }

    // 获取用户签名 和 用户信息
    const user_signature = CookieUtil.get('user_signature')
    const userInfo = JSON.parse(CookieUtil.get('userInfo'))
    const name = userInfo && userInfo.name

    const user_content = (
      <>
        <Spin spinning={file_status === 1} tip={'签名上传中...'}>
          <div className={styles.user_button}>
            {user_signature && user_signature != 'null' ? (
              <Button type="primary" size="small" icon="file-image" onClick={this.handleLookSignature}>
                查看签名
              </Button>
            ) : (
              <UploadFile
                accept="image/jpeg,image/png"
                action="/signature"
                handleStatusChange={this.handleStatusChange}
              >
                <Tooltip title="支持jpg/png格式的图片">
                  <Button type="primary" size="small" icon="cloud-upload">
                    上传签名
                  </Button>
                </Tooltip>
              </UploadFile>
            )}
          </div>
          <div className={styles.user_button}>
            <Button type="danger" size="small" icon="poweroff" onClick={this.handleLogout}>
              退出登录
            </Button>
          </div>
        </Spin>
      </>
    )

    return (
      <>
        <div className={styles.navigator_content}>
          <div className={styles.navigator_bar}>
            <div>
              <img className={styles.login_img} src={RayPlus} alt="RayPlus" />
              <span className={styles.title}>{title}</span>
            </div>
            <div>
              <span className={styles.user_title}>您好，{name}医生</span>
              <Popover placement="bottom" content={user_content} visible={visible}>
                <Button shape="circle" icon="user" onClick={this.handleOpenPopover} />
              </Popover>
            </div>
          </div>
        </div>
        <ConfigProvider locale={zhCN}>
          <div className="body_content">{children}</div>
        </ConfigProvider>
      </>
    )
  }
}

export default connect()(PageHeader)
