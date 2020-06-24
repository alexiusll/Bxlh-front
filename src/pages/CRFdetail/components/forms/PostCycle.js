import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Form, Button, Result } from 'antd'
import { getSampleId } from '@/utils/location'
import { judgeIsSubmit } from '@/utils/util'

// 访视提交
class PostCycle extends React.Component {
  static propTypes = {
    cycle_status: PropTypes.array.isRequired,
    cycle_number: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handlePostCycle = () => {
    const { dispatch, cycle_number } = this.props
    const sample_id = getSampleId()

    dispatch({
      type: 'crfBase/postCycle',
      payload: { sample_id, cycle_number }
    }).then(() =>
      dispatch({
        type: 'crfBase/fetchCycleStatus',
        payload: { sample_id }
      })
    )
  }

  render() {
    const { cycle_number, cycle_status } = this.props
    const submitLoading = this.props.loading.effects['crfBase/postCycle']
    const infoText = cycle_number === 1 ? '基线资料' : `访视${cycle_number}`

    const is_submit = judgeIsSubmit(cycle_status, cycle_number)

    return is_submit ? (
      <Result
        status="success"
        title={`${infoText}已提交！`}
        subTitle="已提交的访视处于锁定状态，如需修改请联系总中心"
      />
    ) : (
      <Result
        status="info"
        title={`提交${infoText}到总中心`}
        subTitle={
          <span style={{ color: '#faad14' }}>提交后将会锁定该访视至不可编辑状态，请确认访视数据完善后提交。</span>
        }
        extra={
          <Button type="primary" loading={submitLoading} onClick={this.handlePostCycle}>
            确认提交
          </Button>
        }
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    cycle_status: state.crfBase.cycle_status,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(PostCycle))
