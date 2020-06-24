import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Modal, Row, Form, DatePicker, Button, Input, Table } from 'antd'
import moment from 'moment'
import { getSampleId } from '@/utils/location'
import styles from '../../style.css'

// 体格检查
class PatientReport extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      record: {},
      visible: false
    }
  }

  static propTypes = {
    crf_first_diagnose: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleDelete = report_id => {
    Modal.confirm({
      title: '请问是否确认删除？',
      okText: '确定',
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch } = this.props
          const sample_id = getSampleId()

          dispatch({
            type: 'crf_first_diagnose/deletePatientReportTable',
            payload: { sample_id, report_id }
          }).then(() => {
            resolve()
            dispatch({
              type: 'crf_first_diagnose/fetchPatientReportTable',
              payload: { sample_id }
            })
          })
        })
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props
        const { record } = this.state
        const sample_id = getSampleId()

        if (values.time) values.time = values.time.format('YYYY-MM-DD')
        values.report_id = record.report_id

        dispatch({
          type: 'crf_first_diagnose/modifyPatientReportTable',
          payload: { sample_id, body: values }
        }).then(() => {
          this.setState({ visible: false })
          dispatch({
            type: 'crf_first_diagnose/fetchPatientReportTable',
            payload: { sample_id }
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
      title: '日期',
      dataIndex: 'time',
      align: 'center'
    },
    {
      title: '体温(℃)',
      dataIndex: 'temperature',
      align: 'center'
    },
    {
      title: '呼吸(次/分)',
      dataIndex: 'breath_frequency',
      align: 'center'
    },
    {
      title: '舒张压(mmHg)',
      dataIndex: 'maxpressure',
      align: 'center'
    },
    {
      title: '收缩压(mmHg)',
      dataIndex: 'minpressure',
      align: 'center'
    },
    {
      title: '心率(次/分)',
      dataIndex: 'heart_rate',
      align: 'center'
    },
    {
      title: '操作',
      align: 'center',
      render: (_, _record) => (
        <>
          <Button type="primary" size="small" onClick={() => this.handleEditModel(_record)}>
            编辑
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            type="danger"
            size="small"
            onClick={() => this.handleDelete(_record.report_id)}
          >
            删除
          </Button>
        </>
      )
    }
  ]

  render() {
    const { patient_report_table } = this.props.crf_first_diagnose
    const tableLoading = this.props.loading.effects['crf_first_diagnose/fetchPatientReportTable']
    const submitLoading = this.props.loading.effects['crf_first_diagnose/modifyPatientReportTable']
    const { getFieldDecorator } = this.props.form
    const { record, visible } = this.state

    return (
      <>
        <Button type="primary" onClick={() => this.handleEditModel({ report_id: null })}>
          添加
        </Button>
        <Table
          loading={tableLoading}
          className={styles.patient_report_table}
          rowKey="report_id"
          size="small"
          bordered
          pagination={false}
          scroll={{ x: true }}
          columns={this.columns}
          dataSource={patient_report_table}
        />
        <Modal
          title="编辑体格报告"
          visible={visible}
          okText="保存"
          destroyOnClose
          onCancel={this.handleCancel}
          centered
          footer={null}
        >
          <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onSubmit={this.handleSubmit}>
            <Form.Item label="入组日期">
              {getFieldDecorator('time', {
                initialValue: record.time ? moment(record.time, 'YYYY-MM-DD') : null
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
            <Form.Item label="体温(℃)">
              {getFieldDecorator('temperature', {
                initialValue: record.temperature
              })(<Input placeholder="请输入体温" style={{ width: '250px' }} type="number" />)}
            </Form.Item>
            <Form.Item label="呼吸(次/分)">
              {getFieldDecorator('breath_frequency', {
                initialValue: record.breath_frequency
              })(<Input placeholder="请输入呼吸" style={{ width: '250px' }} type="number" />)}
            </Form.Item>
            <Form.Item label="血压(mmHg)" style={{ marginBottom: 0 }}>
              <Form.Item placeholder="请输入血压" style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                {getFieldDecorator('minpressure', {
                  initialValue: record.minpressure
                })(<Input type="number" />)}
              </Form.Item>
              <span
                style={{
                  display: 'inline-block',
                  width: '24px',
                  textAlign: 'center'
                }}
              >
                /
              </span>
              <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                {getFieldDecorator('maxpressure', {
                  initialValue: record.maxpressure
                })(<Input type="number" />)}
              </Form.Item>
            </Form.Item>
            <Form.Item label="心率(次/分)">
              {getFieldDecorator('heart_rate', {
                initialValue: record.heart_rate
              })(<Input placeholder="请输入心率" style={{ width: '250px' }} type="number" />)}
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
    crf_first_diagnose: state.crf_first_diagnose,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(PatientReport))
