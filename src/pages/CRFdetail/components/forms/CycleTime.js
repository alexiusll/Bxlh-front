import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Col, Form, DatePicker, Button } from 'antd'
import moment from 'moment'

import { disabledDateAfterToday } from '@/utils/util'
import { getSampleId } from '@/utils/location'

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20, offset: 1 }
}

// 访视事件
class CycleTime extends React.Component {
  static propTypes = {
    crf_first_diagnose: PropTypes.object.isRequired,
    cycle_number: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { dispatch, cycle_number } = this.props
    const sample_id = getSampleId()

    dispatch({
      type: 'crf_first_diagnose/fetchCycleTime',
      payload: { sample_id, cycle_number }
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, { cycle_time }) => {
      if (!err) {
        const { dispatch, cycle_number } = this.props
        const sample_id = getSampleId()

        dispatch({
          type: 'crf_first_diagnose/modifyCycleTime',
          payload: {
            sample_id,
            cycle_number,
            body: { cycle_time: cycle_time.format('YYYY-MM-DD') }
          }
        }).then(() =>
          dispatch({
            type: 'crf_first_diagnose/fetchCycleTime',
            payload: { sample_id, cycle_number }
          })
        )
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { cycle_time } = this.props.crf_first_diagnose
    const submitLoading = this.props.loading.effects['crf_first_diagnose/modifyCycleTime']

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="访视时间">
          {getFieldDecorator('cycle_time', {
            rules: [{ required: true, message: '请选择访视时间!' }],
            initialValue: cycle_time ? moment(cycle_time, 'YYYY-MM-DD') : null
          })(<DatePicker disabledDate={disabledDateAfterToday} format="YYYY-MM-DD" />)}
        </Form.Item>
        <Col offset={4}>
          <Button htmlType="submit" type="primary" loading={submitLoading}>
            保存
          </Button>
        </Col>
      </Form>
    )
  }
}

function mapStateToProps(state) {
  return {
    crf_first_diagnose: state.crf_first_diagnose,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(CycleTime))
