import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Form, DatePicker, Button, Radio, Input, Table } from 'antd'
import moment from 'moment'
import { getSampleId } from '@/utils/location'
import styles from '../../style.css'

// 治疗记录单下方的表格
class Treatment extends React.Component {
  state = {
    adjustment: ''
  }

  static propTypes = {
    crf_cycle_record: PropTypes.object.isRequired,
    cycle_number: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleSubmitAdjustment = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch, cycle_number } = this.props
        const sample_id = getSampleId()
        const adjustment_status = {}

        if (values.adjustment === '0') {
          adjustment_status.adjustment = '0'
        } else if (values.adjustment === '1') {
          adjustment_status.adjustment = '1'
          for (const type of ['adjust_percent', 'adjust_reason']) {
            if (values[type]) {
              adjustment_status[type] = values[type]
            }
          }
        }

        dispatch({
          type: 'crf_cycle_record/modifyTreatmentStatusRecord',
          payload: { sample_id, cycle_number, body: { adjustment_status } }
        }).then(() => {
          dispatch({
            type: 'crf_cycle_record/fetchTreatmentStatusRecord',
            payload: { sample_id, cycle_number }
          })
        })
      }
    })
  }

  handleStateChange = ({ target: { value } }) => {
    this.setState({ adjustment: value })
  }

  render() {
    const { treatment_record_adjustment_status } = this.props.crf_cycle_record
    const submitLoadingAdjustment = this.props.loading.effects['crf_cycle_record/modifyTreatmentStatusRecord']
    const { getFieldDecorator } = this.props.form
    const { adjustment } = this.state

    return (
      <Form
        className="page_body"
        style={{ marginTop: '20px' }}
        labelAlign="right"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 17, offset: 1 }}
        onSubmit={this.handleSubmitAdjustment}
      >
        <Form.Item label="治疗中用药剂量有无调整">
          {getFieldDecorator('adjustment', {
            rules: [{ required: true, message: '请选择剂量调整情况' }],
            initialValue: treatment_record_adjustment_status.adjustment
          })(
            <Radio.Group onChange={this.handleStateChange}>
              <Radio value="0">无</Radio>
              <Radio value="1">有</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        {adjustment === '1' || (adjustment === '' && treatment_record_adjustment_status.adjustment === '1') ? (
          <>
            <Form.Item label="调整为标准剂量的百分比">
              {getFieldDecorator('adjust_percent', {
                initialValue: treatment_record_adjustment_status.adjust_percent
              })(<Input style={{ width: '250px' }} placeholder="请输入百分比数值(%)" />)}
            </Form.Item>
            <Form.Item label="调整原因">
              {getFieldDecorator('adjust_reason', {
                initialValue: treatment_record_adjustment_status.adjust_reason
              })(<Input style={{ width: '250px' }} placeholder="请输入调整原因" />)}
            </Form.Item>
          </>
        ) : null}
        <Col offset={7}>
          <Button htmlType="submit" type="primary" loading={submitLoadingAdjustment}>
            保存
          </Button>
        </Col>
      </Form>
    )
  }
}

const TreatmentForm = connect(state => {
  return {
    crf_cycle_record: state.crf_cycle_record,
    loading: state.loading
  }
})(Form.create()(Treatment))

// 治疗记录单
class TreatmentRecord extends React.Component {
  state = {
    record: {},
    visible: false
  }

  static propTypes = {
    crf_cycle_record: PropTypes.object.isRequired,
    cycle_number: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleDelete = treatment_record_id => {
    Modal.confirm({
      title: '请问是否确认删除？',
      okText: '确定',
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch, cycle_number } = this.props
          const sample_id = getSampleId()

          dispatch({
            type: 'crf_cycle_record/deleteTreatmentRecord',
            payload: { sample_id, cycle_number, treatment_record_id }
          }).then(() => {
            resolve()
            dispatch({
              type: 'crf_cycle_record/fetchTreatmentRecord',
              payload: { sample_id, cycle_number }
            })
          })
        })
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch, cycle_number } = this.props
        const { record } = this.state
        const sample_id = getSampleId()
        const adjustment = {}

        // 重构时间和其他空项
        if (values.start_time) {
          adjustment.start_time = values.start_time.format('YYYY-MM-DD')
        }
        if (values.end_time) {
          adjustment.end_time = values.end_time.format('YYYY-MM-DD')
        }
        for (const type of ['description', 'medicine_name', 'treatment_name']) {
          if (values[type]) {
            adjustment[type] = values[type]
          }
        }
        adjustment.treatment_record_id = record.treatment_record_id

        dispatch({
          type: 'crf_cycle_record/modifyTreatmentRecord',
          payload: { sample_id, cycle_number, body: adjustment }
        }).then(() => {
          this.setState({ visible: false })
          dispatch({
            type: 'crf_cycle_record/fetchTreatmentRecord',
            payload: { sample_id, cycle_number }
          })
        })
      }
    })
  }

  handleEditModel = record => {
    this.setState({ record, visible: true })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  columns = [
    {
      title: '治疗名称',
      dataIndex: 'treatment_name',
      align: 'center'
    },
    {
      title: '药物名称',
      dataIndex: 'medicine_name',
      align: 'center'
    },
    {
      title: '给药/治疗开始日期',
      dataIndex: 'start_time',
      align: 'center'
    },
    {
      title: '给药/治疗结束日期',
      dataIndex: 'end_time',
      align: 'center'
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        <>
          <Button
            style={{ marginLeft: '10px' }}
            type="primary"
            size="small"
            onClick={() => this.handleEditModel(record)}
          >
            编辑
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            type="danger"
            size="small"
            onClick={() => this.handleDelete(record.treatment_record_id)}
          >
            删除
          </Button>
        </>
      )
    }
  ]

  render() {
    const { treatment_record_table } = this.props.crf_cycle_record
    const tableLoading = this.props.loading.effects['crf_cycle_record/fetchTreatmentRecord']
    const submitLoading = this.props.loading.effects['crf_cycle_record/modifyTreatmentRecord']
    const { getFieldDecorator } = this.props.form
    const { record, visible } = this.state

    return (
      <>
        <Button type="primary" onClick={() => this.handleEditModel({ treatment_record_id: '' })}>
          添加
        </Button>
        <Table
          loading={tableLoading}
          className={styles.patient_report_table}
          rowKey="treatment_record_id"
          size="small"
          bordered
          pagination={false}
          scroll={{ x: true }}
          columns={this.columns}
          dataSource={treatment_record_table}
        />
        <TreatmentForm cycle_number={this.props.cycle_number} />
        <Modal
          title="编辑治疗记录单"
          visible={visible}
          okText="保存"
          destroyOnClose
          onCancel={this.handleCancel}
          centered
          footer={null}
        >
          <Form
            className="page_body"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16, offset: 1 }}
            onSubmit={this.handleSubmit}
          >
            <Form.Item label="治疗名称">
              {getFieldDecorator('treatment_name', {
                initialValue: record.treatment_name
              })(<Input style={{ width: 250 }} placeholder="请输入治疗名称" />)}
            </Form.Item>
            <Form.Item label="药物名称">
              {getFieldDecorator('medicine_name', {
                initialValue: record.medicine_name
              })(<Input style={{ width: 250 }} placeholder="请输入药物名称" />)}
            </Form.Item>
            <Form.Item label="给药/治疗开始日期">
              {getFieldDecorator('start_time', {
                initialValue: record.start_time ? moment(record.start_time, 'YYYY-MM-DD') : null
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
            <Form.Item label="给药/治疗结束日期">
              {getFieldDecorator('end_time', {
                initialValue: record.end_time ? moment(record.end_time, 'YYYY-MM-DD') : null
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
            <Form.Item label="剂量及用法">
              {getFieldDecorator('description', {
                initialValue: record.description
              })(<Input style={{ width: 250 }} placeholder="请输入剂量及用法" />)}
            </Form.Item>
            <Row type="flex" justify="center">
              <Button htmlType="submit" type="primary" loading={submitLoading}>
                保存
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.handleCancel}>
                取消
              </Button>
            </Row>
          </Form>
        </Modal>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    crf_cycle_record: state.crf_cycle_record,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(TreatmentRecord))
