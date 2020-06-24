import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Form, Divider, Modal, Row, Input, Table, Menu, Button, Radio, DatePicker } from 'antd'
import moment from 'moment'
import { getSampleId } from '@/utils/location'
import styles from '../style.css'

class InterviewTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      record: {},
      visible: false,
      survival_status: null,
      die_reason: null,
      OS_method: null
    }
  }

  static propTypes = {
    interview_table: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props
    const sample_id = getSampleId()

    dispatch({
      type: 'crf_interview/fetchInterviewTable',
      payload: { sample_id }
    })
  }

  handleStateChange = (type, { target: { value } }) => {
    this.setState({ [type]: value })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { record } = this.state

        // 重构time
        for (const type of ['die_time', 'interview_time', 'last_time_survival', 'status_confirm_time']) {
          if (values[type]) {
            values[type] = values[type].format('YYYY-MM-DD')
          }
        }

        const { dispatch } = this.props
        const sample_id = getSampleId()

        values.interview_id = record.interview_id
        dispatch({
          type: 'crf_interview/modifyInterview',
          payload: { sample_id, body: values }
        }).then(() => {
          this.handleCancel()
          dispatch({
            type: 'crf_interview/fetchInterviewTable',
            payload: { sample_id }
          })
        })
      }
    })
  }

  handleDelete = interview_id => {
    Modal.confirm({
      title: '请问是否确认删除？',
      okText: '确定',
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch } = this.props
          const sample_id = getSampleId()

          dispatch({
            type: 'crf_interview/deleteInterview',
            payload: { sample_id, interview_id }
          }).then(() => {
            resolve()
            dispatch({
              type: 'crf_interview/fetchInterviewTable',
              payload: { sample_id }
            })
          })
        })
    })
  }

  handleEditModel = record => {
    this.setState({
      record,
      visible: true,
      die_reason: record.die_reason,
      OS_method: record.OS_method
    })
  }

  handlePostInterview = interview_id => {
    Modal.confirm({
      title: '请问是否确认提交？',
      content: '提交后将会锁定该条随访至不可编辑状态，请确认数据完善后提交。',
      okText: '确定',
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch } = this.props
          const sample_id = getSampleId()

          dispatch({
            type: 'crf_interview/postInterview',
            payload: { interview_id }
          }).then(() => {
            resolve()
            dispatch({
              type: 'crf_interview/fetchInterviewTable',
              payload: { sample_id }
            })
          })
        })
    })
  }

  handleChangeSurvival = e => {
    const survival_status = e.target.value

    this.setState({ survival_status })
  }

  handleCancel = () => {
    this.setState({ visible: false, survival_status: null })
  }

  columns = [
    {
      title: '随访日期',
      dataIndex: 'interview_time',
      align: 'center'
    },
    {
      title: '生存状态',
      dataIndex: 'survival_status',
      align: 'center',
      render: status => {
        if (status === 0) {
          return '死亡'
        }
        if (status === 1) {
          return '存活'
        }
        if (status === 2) {
          return '失联'
        }
      }
    },
    {
      title: '死亡日期',
      dataIndex: 'die_time',
      align: 'center'
    },
    {
      title: '最后一次联系日期',
      dataIndex: 'last_time_survival',
      align: 'center'
    },
    {
      title: '访视状态',
      dataIndex: 'is_submit',
      align: 'center',
      render: is_submit =>
        is_submit === 1 ? (
          <span style={{ color: '#52c41a' }}>已提交</span>
        ) : (
          <span style={{ color: '#faad14' }}>未提交</span>
        )
    },
    {
      title: '操作',
      align: 'center',
      render: (_, _record) => (
        <>
          <Button
            disabled={_record.is_submit === 1}
            type={_record.is_submit === 1 ? 'danger' : 'primary'}
            size="small"
            onClick={() => this.handleEditModel(_record)}
          >
            编辑
          </Button>
          <Button
            disabled={_record.is_submit === 1}
            style={{ marginLeft: '10px' }}
            type={_record.is_submit === 1 ? 'danger' : 'primary'}
            size="small"
            onClick={() => this.handlePostInterview(_record.interview_id)}
          >
            提交
          </Button>
          <Button
            disabled={_record.is_submit === 1}
            style={{ marginLeft: '10px' }}
            type="danger"
            size="small"
            onClick={() => this.handleDelete(_record.interview_id)}
          >
            删除
          </Button>
        </>
      )
    }
  ]

  render() {
    const { interview_table } = this.props
    const tableLoading = this.props.loading.effects['crf_interview/fetchInterviewTable']
    const submitLoading = this.props.loading.effects['crf_interview/modifyInterview']
    const { getFieldDecorator } = this.props.form
    const { record, visible, survival_status, OS_method, die_reason } = this.state

    return (
      <div className={styles.menu_div}>
        <Menu className={styles.menu_title} selectedKeys={['0']} mode="horizontal">
          <Menu.Item key="0">生存期随访</Menu.Item>
        </Menu>
        <div className={styles.menu_content}>
          <Button type="primary" onClick={() => this.handleEditModel({ interview_id: null })}>
            添加
          </Button>
          <Table
            loading={tableLoading}
            className={styles.patient_report_table}
            rowKey="interview_id"
            size="small"
            bordered
            pagination={false}
            scroll={{ x: true }}
            columns={this.columns}
            dataSource={interview_table}
          />
          <Modal
            title="编辑生存期随访"
            className={styles.diagnose_history_modal}
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
              <Form.Item label="随访日期">
                {getFieldDecorator('interview_time', {
                  initialValue: record.interview_time ? moment(record.interview_time, 'YYYY-MM-DD') : null
                })(<DatePicker format="YYYY-MM-DD" />)}
              </Form.Item>
              <Form.Item label="随访方式">
                {getFieldDecorator('interview_way', {
                  initialValue: record.interview_way
                })(
                  <Radio.Group>
                    <Radio value={0}>电话</Radio>
                    <Radio value={1}>门诊</Radio>
                    <Radio value={2}>住院</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="是否进行其他抗肿瘤治疗">
                {getFieldDecorator('has_other_treatment', {
                  initialValue: record.has_other_treatment
                })(
                  <Radio.Group>
                    <Radio value={0}>否</Radio>
                    <Radio value={1}>是</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="生存状态">
                {getFieldDecorator('survival_status', {
                  initialValue: record.survival_status
                })(
                  <Radio.Group onChange={this.handleChangeSurvival}>
                    <Radio value={0}>死亡</Radio>
                    <Radio value={1}>存活</Radio>
                    <Radio value={2}>失联</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              {survival_status === 0 || (survival_status === null && record.survival_status === 0) ? (
                <>
                  <Form.Item label="死亡日期">
                    {getFieldDecorator('die_time', {
                      initialValue: record.die_time ? moment(record.die_time, 'YYYY-MM-DD') : null
                    })(<DatePicker format="YYYY-MM-DD" />)}
                  </Form.Item>
                  <Form.Item label="死亡原因">
                    {getFieldDecorator('die_reason', {
                      initialValue: record.die_reason
                    })(
                      <Radio.Group onChange={e => this.handleStateChange('die_reason', e)}>
                        <Radio value={0}>疾病进展</Radio>
                        <Radio value={1}>
                          其他
                          {die_reason === 1 ? (
                            <div style={{ display: 'inline-block' }}>
                              {getFieldDecorator('other_reason', {
                                initialValue: record.other_reason
                              })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="请输入死亡原因" />)}
                            </div>
                          ) : null}
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                  <Form.Item label="OS随访证明文件收集形式">
                    {getFieldDecorator('OS_method', {
                      initialValue: OS_method
                    })(
                      <Radio.Group onChange={e => this.handleStateChange('OS_method', e)}>
                        <Radio value={0}>1.街道办开具死亡证明</Radio>
                        <Radio value={1}>2.民政局系统出具死亡证明</Radio>
                        <Radio value={2}>3.公安局及派出所出具死亡证明</Radio>
                        <Radio value={3}>4.火化证明或公墓数据</Radio>
                        <Radio value={4}>5.本院死亡的医疗文件</Radio>
                        <Radio value={5}>6.其他医院死亡的医疗文件</Radio>
                        <Radio value={6}>7.家属手写证明文件</Radio>
                        <Radio value={7}>8.电话随访获知</Radio>
                        <Radio value={8}>
                          9.其他
                          {OS_method === 8 ? (
                            <div style={{ display: 'inline-block' }}>
                              {getFieldDecorator('other_method', {
                                initialValue: record.other_method
                              })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="请输入其他收集形式" />)}
                            </div>
                          ) : null}
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </>
              ) : null}
              <Form.Item label="生存状态确认日期">
                {getFieldDecorator('status_confirm_time', {
                  initialValue: record.status_confirm_time ? moment(record.status_confirm_time, 'YYYY-MM-DD') : null
                })(<DatePicker format="YYYY-MM-DD" />)}
              </Form.Item>
              <Form.Item label="最后一次联系上并确认患者仍存活的日期">
                {getFieldDecorator('last_time_survival', {
                  initialValue: record.last_time_survival ? moment(record.last_time_survival, 'YYYY-MM-DD') : null
                })(<DatePicker format="YYYY-MM-DD" />)}
              </Form.Item>
              <Divider className={styles.modal_divider} />
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
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    interview_table: state.crf_interview.interview_table,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(InterviewTable))
