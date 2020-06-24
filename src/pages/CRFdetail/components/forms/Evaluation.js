import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Form, Button, Radio } from 'antd'
import { getSampleId } from '@/utils/location'

// 疗效评价
class Evaluation extends React.Component {
  static propTypes = {
    crf_cycle_record: PropTypes.object.isRequired,
    cycle_number: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch, cycle_number } = this.props
        const sample_id = getSampleId()

        dispatch({
          type: 'crf_cycle_record/modifyEvaluation',
          payload: { sample_id, cycle_number, body: values }
        }).then(() =>
          dispatch({
            type: 'crf_cycle_record/fetchEvaluation',
            payload: { sample_id, cycle_number }
          })
        )
      }
    })
  }

  render() {
    const { evaluation } = this.props.crf_cycle_record
    const submitLoading = this.props.loading.effects['crf_cycle_record/modifyEvaluation']
    const { getFieldDecorator } = this.props.form

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item label="疗效评价">
          {getFieldDecorator('evaluation', {
            initialValue: `${evaluation}`
          })(
            <Radio.Group style={{ marginLeft: '20px' }}>
              <Radio value="0">完全缓解(CR)</Radio>
              <Radio value="1">部分缓解(PR)</Radio>
              <Radio value="2">疾病稳定(SD)</Radio>
              <Radio value="3">疾病进展(PD)</Radio>
              <Radio value="4">疗效不详(UK)</Radio>
            </Radio.Group>
          )}
          <div>
            <Button
              style={{ marginLeft: '20px', marginTop: '20px' }}
              htmlType="submit"
              type="primary"
              loading={submitLoading}
            >
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    )
  }
}

function mapStateToProps(state) {
  return {
    crf_cycle_record: state.crf_cycle_record,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(Evaluation))
