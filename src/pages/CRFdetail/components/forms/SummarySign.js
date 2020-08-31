import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Button, Result, Spin } from 'antd'

import { getSampleId } from '@/utils/location'
import { post_prefix } from '@/utils/request'
import styles from '../../style.css'
import CookieUtil from '@/utils/cookie'

// 项目总结签名
class SummarySign extends React.Component {
  static propTypes = {
    summary_sign: PropTypes.object.isRequired,
    research_center_info: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired,
    sign_type: PropTypes.string.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props
    const sample_id = getSampleId()

    // 清除签名保证切换访视之后显示正确
    dispatch({
      type: 'crfBase/clearSignature'
    })
    dispatch({
      type: 'global/fetchResearchCenters'
    })
    dispatch({
      type: 'crfBase/fetchSummarySignature',
      payload: { sample_id }
    })

    // console.log("componentDidMount")
    // console.log(summary_sign)
  }

  handleSign = () => {
    const { dispatch, sign_type } = this.props
    const sample_id = getSampleId()

    const userInfo = JSON.parse(CookieUtil.get('userInfo'))
    const { id } = userInfo
    if (sign_type === 'si') {
      // 清除签名保证切换访视之后显示正确
      dispatch({
        type: 'crfBase/clearSignature'
      })
      dispatch({
        type: 'crfBase/postSummarySignature',
        payload: { sample_id, user_id: id }
      }).then(() =>
        dispatch({
          type: 'crfBase/fetchSummarySignature',
          payload: { sample_id }
        })
      )
    } else {
      // 清除签名保证切换访视之后显示正确
      dispatch({
        type: 'crfBase/clearSignature'
      })
      dispatch({
        type: 'crfBase/postSummaryCraSignature',
        payload: { sample_id, user_id: id }
      }).then(() =>
        dispatch({
          type: 'crfBase/fetchSummarySignature',
          payload: { sample_id }
        })
      )
    }
  }

  render() {
    const { summary_sign, research_center_info, sign_type } = this.props

    const user_signature = CookieUtil.get('user_signature_2')
    const userInfo = JSON.parse(CookieUtil.get('userInfo'))
    const { name, research_center_name } = userInfo || {}

    const submitLoading = this.props.loading.effects['crfBase/postSummarySignature']

    const spinning = this.props.loading.effects['crfBase/fetchSummarySignature']

    // console.log("render")
    // console.log(summary_sign)

    let other_research_center_name = ''
    let research_center_id = 0
    let user_name = ''
    let file_path = ''

    const si_is_signed = summary_sign.si.file_path ? true : false
    const cra_is_signed = summary_sign.inspector.file_path ? true : false

    if (sign_type === 'si') {
      research_center_id = summary_sign.si.research_center_id
      if (si_is_signed) {
        user_name = summary_sign.si.user_name
        file_path = summary_sign.si.file_path
      }
    } else {
      research_center_id = summary_sign.inspector.research_center_id
      if (cra_is_signed) {
        user_name = summary_sign.inspector.user_name
        file_path = summary_sign.inspector.file_path
      }
    }

    for (const item of research_center_info) {
      if (item.id === research_center_id) {
        other_research_center_name = item.name
        break
      }
    }
    return (
      <Spin spinning={spinning}>
        {(si_is_signed && sign_type === 'si') || (cra_is_signed && sign_type === 'cra') ? (
          <Result
            status="success"
            title={sign_type === 'si' ? '研究者已对项目总结签名！' : '监察员已对项目总结签名！'}
            subTitle={`签名账户名：${user_name}，所属中心：${other_research_center_name}。`}
            extra={
              <img
                className={styles.sign_img}
                src={`${post_prefix}/static/tempFiles${file_path.substring(1)}`}
                alt="用户签名"
              ></img>
            }
          />
        ) : (
          <Result
            status="info"
            title={sign_type === 'si' ? '使用当前研究员账户进行项目总结签名' : '使用当前监察员账户进行项目总结签名'}
            subTitle={`当前账户：${name}，所属中心：${research_center_name}。查看签名请点击右上角用户按钮。`}
            extra={
              user_signature ? (
                <Button loading={submitLoading} type="primary" onClick={this.handleSign}>
                  确认签名
                </Button>
              ) : (
                <span style={{ color: '#faad14' }}>该账户未上传签名，请先点击右上角用户按钮上传签名</span>
              )
            }
          />
        )}
      </Spin>
    )
  }
}

function mapStateToProps(state) {
  return {
    summary_sign: state.crfBase.summary_sign,
    research_center_info: state.global.research_center_info,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(SummarySign)
