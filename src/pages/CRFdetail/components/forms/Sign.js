import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Button, Result, Spin } from 'antd'

import { getSampleId } from '@/utils/location'
import { post_prefix } from '@/utils/request'
import styles from '../../style.css'
import CookieUtil from '@/utils/cookie'

// 研究者签名
class Sign extends React.Component {
  static propTypes = {
    crfbase_sign: PropTypes.object.isRequired,
    crf_cycle_sign: PropTypes.object.isRequired,
    cycle_number: PropTypes.number.isRequired,
    research_center_info: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { dispatch, cycle_number } = this.props
    const sample_id = getSampleId()

    // 清除签名保证切换访视之后显示正确
    dispatch({
      type: 'crfBase/clearSignature'
    })
    dispatch({
      type: 'crf_cycle_record/clearSignature'
    })
    dispatch({
      type: 'global/fetchResearchCenters'
    })
    if (cycle_number === 1) {
      dispatch({
        type: 'crfBase/fetchBaseSignature',
        payload: { sample_id }
      })
    } else {
      dispatch({
        type: 'crf_cycle_record/fetchCycleSignature',
        payload: { sample_id, cycle_number }
      })
    }
  }

  handleSign = () => {
    const { dispatch, cycle_number } = this.props
    const sample_id = getSampleId()

    const userInfo = JSON.parse(CookieUtil.get('userInfo'))
    const { id } = userInfo

    if (cycle_number === 1) {
      dispatch({
        type: 'crfBase/postBaseSignature',
        payload: { sample_id, user_id: id }
      }).then(() =>
        dispatch({
          type: 'crfBase/fetchBaseSignature',
          payload: { sample_id }
        })
      )
    } else {
      dispatch({
        type: 'crf_cycle_record/postCycleSignature',
        payload: { sample_id, cycle_number, user_id: id }
      }).then(() =>
        dispatch({
          type: 'crf_cycle_record/fetchCycleSignature',
          payload: { sample_id, cycle_number }
        })
      )
    }
  }

  render() {
    const { crfbase_sign, crf_cycle_sign, cycle_number, research_center_info } = this.props
    const user_signature = CookieUtil.get('user_signature')
    const userInfo = JSON.parse(CookieUtil.get('userInfo'))
    const { name, research_center_name } = userInfo || {}

    const sign_info = cycle_number === 1 ? crfbase_sign : crf_cycle_sign

    const submitLoading = this.props.loading.effects['crfBase/postBaseSignature']
    const base_loading = this.props.loading.effects['crfBase/fetchBaseSignature']
    const cycle_loading = this.props.loading.effects['crf_cycle_record/fetchCycleSignature']

    let infoText = ''
    if (cycle_number === 1) {
      infoText = '基线资料'
    } else if (cycle_number === 0) {
      infoText = '治疗期终止随访'
    } else {
      infoText = `访视${cycle_number}`
    }

    let other_research_center_name = ''

    for (const item of research_center_info) {
      if (item.id === sign_info.research_center_id) {
        other_research_center_name = item.name
        break
      }
    }

    return (
      <Spin spinning={cycle_number === 1 ? base_loading : cycle_loading}>
        {sign_info.file_path ? (
          <Result
            status="success"
            title={`${infoText}已签名！`}
            subTitle={`签名账户名：${sign_info.user_name}，所属中心：${other_research_center_name}。`}
            extra={
              <img
                className={styles.sign_img}
                src={`${post_prefix}/static/tempFiles${sign_info.file_path.substring(1)}`}
                alt="用户签名"
              ></img>
            }
          />
        ) : (
          <Result
            status="info"
            title={`使用当前账户对${infoText}进行签名`}
            subTitle={`当前账户：${name}，所属中心：${research_center_name}。查看签名请点击右上角用户按钮。`}
            extra={
              user_signature && user_signature !== 'null' ? (
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
    crfbase_sign: state.crfBase.crfbase_sign,
    crf_cycle_sign: state.crf_cycle_record.crf_cycle_sign,
    research_center_info: state.global.research_center_info,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Sign)
