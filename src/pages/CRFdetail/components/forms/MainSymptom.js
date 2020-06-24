import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Modal, Row, Form, DatePicker, Button, Radio, Input, Table } from 'antd'
import moment from 'moment'
import { getSampleId } from '@/utils/location'
import styles from '../../style.css'

// 主要症状体征
class MainSymptom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      record: {},
      visible: false,
      symptom_description: '',
      existence: ''
    }
  }

  static propTypes = {
    crf_cycle_record: PropTypes.object.isRequired,
    cycle_number: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleDelete = main_symptom_id => {
    Modal.confirm({
      title: '请问是否确认删除？',
      okText: '确定',
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch, cycle_number } = this.props
          const sample_id = getSampleId()

          dispatch({
            type: 'crf_cycle_record/deleteMainSymptom',
            payload: { sample_id, cycle_number, main_symptom_id }
          }).then(() => {
            resolve()
            dispatch({
              type: 'crf_cycle_record/fetchMainSymptom',
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

        if (values.start_time) {
          values.start_time = values.start_time.format('YYYY-MM-DD')
        }
        if (values.end_time) {
          values.end_time = values.end_time.format('YYYY-MM-DD')
        }
        values.main_symptom_id = record.main_symptom_id
        // ant组件同一个form的values会包含所有加了form表单项的数据。手动去除另外一个表单的数据
        delete values.ECOG

        dispatch({
          type: 'crf_cycle_record/modifyMainSymptom',
          payload: { sample_id, cycle_number, body: values }
        }).then(() => {
          this.setState({ visible: false })
          dispatch({
            type: 'crf_cycle_record/fetchMainSymptom',
            payload: { sample_id, cycle_number }
          })
        })
      }
    })
  }

  handleSubmitECOG = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch, cycle_number } = this.props
        const sample_id = getSampleId()

        dispatch({
          type: 'crf_cycle_record/modifyECOG',
          payload: { sample_id, cycle_number, body: values }
        }).then(() =>
          dispatch({
            type: 'crf_cycle_record/fetchECOG',
            payload: { sample_id, cycle_number }
          })
        )
      }
    })
  }

  handleEditModel = record => {
    this.setState({
      record,
      visible: true,
      symptom_description: record.symptom_description,
      existence: record.existence
    })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleStateChange = (type, { target: { value } }) => {
    this.setState({ [type]: value })
  }

  render() {
    const { main_symptom_table, ECOG } = this.props.crf_cycle_record
    const tableLoading = this.props.loading.effects['crf_cycle_record/fetchMainSymptom']
    const submitLoading = this.props.loading.effects['crf_cycle_record/modifyMainSymptom']
    const submitLoadingECOG = this.props.loading.effects['crf_cycle_record/modifyECOG']
    const { getFieldDecorator } = this.props.form
    const { record, visible, symptom_description, existence } = this.state

    const columns = [
      {
        title: '病状体征和描述',
        dataIndex: 'symptom_description',
        align: 'center'
      },
      {
        title: '开始时间',
        dataIndex: 'start_time',
        align: 'center'
      },
      {
        title: '消失时间',
        dataIndex: 'end_time',
        align: 'center'
      },
      {
        title: '存在状态',
        dataIndex: 'existence',
        align: 'center',
        render: text => (text === '0' ? '存在' : text === '1' ? '消失' : null)
      },
      {
        title: '操作',
        align: 'center',
        render: (_, record) => (
          <>
            <Button type="primary" size="small" onClick={() => this.handleEditModel(record)}>
              编辑
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              type="danger"
              size="small"
              onClick={() => this.handleDelete(record.main_symptom_id)}
            >
              删除
            </Button>
          </>
        )
      }
    ]

    return (
      <>
        <Button type="primary" onClick={() => this.handleEditModel({ main_symptom_id: null })}>
          添加
        </Button>
        <Table
          loading={tableLoading}
          className={styles.patient_report_table}
          rowKey="main_symptom_id"
          size="small"
          bordered
          pagination={false}
          scroll={{ x: true }}
          columns={columns}
          dataSource={main_symptom_table}
        />
        <Form layout="inline" style={{ marginTop: '20px' }} onSubmit={this.handleSubmitECOG}>
          <Form.Item label="ECOG评分">
            {getFieldDecorator('ECOG', {
              initialValue: ECOG
            })(<Input className={styles.ECOG_input} placeholder="请输入ECOG评分" />)}
            <div>
              <Button
                style={{ marginLeft: '20px', marginTop: '20px' }}
                htmlType="submit"
                type="primary"
                loading={submitLoadingECOG}
              >
                保存
              </Button>
            </div>
          </Form.Item>
        </Form>
        <Modal
          title="编辑主要症状体征"
          visible={visible}
          okText="保存"
          destroyOnClose
          onCancel={this.handleCancel}
          centered
          footer={null}
        >
          <Form
            className="page_body"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 17, offset: 1 }}
            onSubmit={this.handleSubmit}
          >
            <Form.Item label="症状体征和描述">
              {getFieldDecorator('symptom_description', {
                initialValue: record.symptom_description
              })(
                <Radio.Group onChange={e => this.handleStateChange('symptom_description', e)}>
                  <Radio value="高血压">高血压</Radio>
                  <Radio value="腹泻">腹泻</Radio>
                  <Radio value="皮疹">皮疹</Radio>
                  <Radio value="蛋白尿">蛋白尿</Radio>
                  <Radio value="出血">出血</Radio>
                  <Radio value="其他">
                    其他
                    {symptom_description === '其他' ? (
                      <div style={{ display: 'inline-block' }}>
                        {getFieldDecorator('symptom_description_other', {
                          initialValue: record.symptom_description_other
                        })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他症状体征和描述" />)}
                      </div>
                    ) : null}
                  </Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="开始时间">
              {getFieldDecorator('start_time', {
                initialValue: record.start_time ? moment(record.start_time, 'YYYY-MM-DD') : null
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
            <Form.Item label="存在状态">
              {getFieldDecorator('existence', {
                initialValue: record.existence
              })(
                <Radio.Group onChange={e => this.handleStateChange('existence', e)}>
                  <Radio value="0">存在</Radio>
                  <Radio value="1">消失</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            {existence === '1' ? (
              <Form.Item label="结束时间">
                {getFieldDecorator('end_time', {
                  initialValue: record.end_time ? moment(record.end_time, 'YYYY-MM-DD') : null
                })(<DatePicker format="YYYY-MM-DD" />)}
              </Form.Item>
            ) : null}
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

export default connect(mapStateToProps)(Form.create()(MainSymptom))
