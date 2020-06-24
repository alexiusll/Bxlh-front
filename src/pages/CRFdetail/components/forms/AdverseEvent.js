import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Modal, Row, Form, DatePicker, Button, Radio, Input, Table, Divider } from 'antd'
import moment from 'moment'

import { getSampleId } from '@/utils/location'
import styles from '../../style.css'

// 不良事件
class AdverseEvent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      record: {},
      visible: false,
      is_server_event: 0,
      SAE_state: 0
    }
  }

  static propTypes = {
    crf_cycle_record: PropTypes.object.isRequired,
    cycle_number: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { dispatch, cycle_number } = this.props
    const sample_id = getSampleId()

    dispatch({
      type: 'crf_cycle_record/fetchAdverseEvent',
      payload: { sample_id, cycle_number }
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

        for (const type of ['SAE_start_time', 'die_time', 'recover_time', 'report_time', 'start_time']) {
          if (values[type]) {
            values[type] = values[type].format('YYYY-MM-DD')
          }
        }

        // 去掉由indexOf产生的默认项
        for (const type of ['medicine_relation', 'measure', 'recover']) {
          if (values[type] === -1) {
            delete values[type]
          }
        }
        values.adverse_event_id = record.adverse_event_id

        const { dispatch, cycle_number } = this.props
        const sample_id = getSampleId()

        dispatch({
          type: 'crf_cycle_record/modifyAdverseEvent',
          payload: { sample_id, cycle_number, body: values }
        }).then(() => {
          this.handleCancel()
          dispatch({
            type: 'crf_cycle_record/fetchAdverseEvent',
            payload: { sample_id, cycle_number }
          })
        })
      }
    })
  }

  handleDelete = adverse_event_id => {
    Modal.confirm({
      title: '请问是否确认删除？',
      okText: '确定',
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch, cycle_number } = this.props
          const sample_id = getSampleId()

          dispatch({
            type: 'crf_cycle_record/deleteAdverseEvent',
            payload: { sample_id, cycle_number, adverse_event_id }
          }).then(() => {
            resolve()
            dispatch({
              type: 'crf_cycle_record/fetchAdverseEvent',
              payload: { sample_id, cycle_number }
            })
          })
        })
    })
  }

  handleEditModel = record => {
    this.setState({
      record,
      visible: true,
      is_server_event: record.is_server_event === '严重不良事件' ? 1 : record.is_server_event === '不良事件' ? 0 : null,
      SAE_state: record.SAE_state ? record.SAE_state : null
    })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  columns = [
    {
      title: '不良事件名称',
      dataIndex: 'adverse_event_name',
      align: 'center'
    },
    {
      title: '不良事件等级',
      dataIndex: 'is_server_event',
      align: 'center'
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      align: 'center'
    },
    {
      title: '与药物关系',
      dataIndex: 'medicine_relation',
      align: 'center'
    },
    {
      title: '采取措施',
      dataIndex: 'measure',
      align: 'center'
    },
    {
      title: '转归',
      dataIndex: 'recover',
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
            onClick={() => this.handleDelete(record.adverse_event_id)}
          >
            删除
          </Button>
        </>
      )
    }
  ]

  render() {
    const { adverse_event_table } = this.props.crf_cycle_record
    const tableLoading = this.props.loading.effects['crf_cycle_record/fetchAdverseEvent']
    const submitLoading = this.props.loading.effects['crf_cycle_record/modifyAdverseEvent']
    const { getFieldDecorator } = this.props.form
    const { record, visible, is_server_event, SAE_state } = this.state

    return (
      <>
        <Button type="primary" onClick={() => this.handleEditModel({ adverse_event_id: null })}>
          添加
        </Button>
        <Table
          loading={tableLoading}
          className={styles.patient_report_table}
          rowKey="adverse_event_id"
          size="small"
          bordered
          pagination={false}
          scroll={{ x: true }}
          columns={this.columns}
          dataSource={adverse_event_table}
        />
        <Modal
          title="编辑不良事件"
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
            <Form.Item label="不良事件名称">
              {getFieldDecorator('adverse_event_name', {
                initialValue: record.adverse_event_name
              })(<Input style={{ width: 250, marginRight: 30 }} placeholder="请输入不良事件名称" />)}
            </Form.Item>
            <Form.Item label="是否为严重不良事件">
              {getFieldDecorator('is_server_event', {
                initialValue:
                  record.is_server_event === '不良事件' ? 0 : record.is_server_event === '严重不良事件' ? 1 : null
              })(
                <Radio.Group onChange={e => this.handleStateChange('is_server_event', e)}>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="毒性分级">
              {getFieldDecorator('toxicity_classification', {
                initialValue: record.toxicity_classification
              })(
                <Radio.Group>
                  <Radio value={0}>1级</Radio>
                  <Radio value={1}>2级</Radio>
                  <Radio value={2}>3级</Radio>
                  <Radio value={3}>4级</Radio>
                  <Radio value={4}>5级</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="开始日期">
              {getFieldDecorator('start_time', {
                initialValue: record.start_time ? moment(record.start_time, 'YYYY-MM-DD') : null
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
            <Form.Item label="与药物关系">
              {getFieldDecorator('medicine_relation', {
                initialValue: ['肯定有关', '很可能有关', '可能有关', '可能无关', '肯定无关'].indexOf(
                  record.medicine_relation
                )
              })(
                <Radio.Group>
                  <Radio value={0}>肯定有关</Radio>
                  <Radio value={1}>很可能有关</Radio>
                  <Radio value={2}>可能有关</Radio>
                  <Radio value={3}>可能无关</Radio>
                  <Radio value={4}>肯定无关</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="采取措施">
              {getFieldDecorator('measure', {
                initialValue: ['剂量不变', '减少剂量', '暂停用药', '停止用药', '实验用药已结束'].indexOf(record.measure)
              })(
                <Radio.Group>
                  <Radio value={0}>剂量不变</Radio>
                  <Radio value={1}>减少剂量</Radio>
                  <Radio value={2}>暂停用药</Radio>
                  <Radio value={3}>停止用药</Radio>
                  <Radio value={4}>实验用药已结束</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="是否进行药物治疗">
              {getFieldDecorator('is_using_medicine', {
                initialValue: record.is_using_medicine
              })(
                <Radio.Group>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="转归">
              {getFieldDecorator('recover', {
                initialValue: ['症状消失', '缓解', '持续', '加重', '恢复伴后遗症', '死亡'].indexOf(record.recover)
              })(
                <Radio.Group>
                  <Radio value={0}>症状消失</Radio>
                  <Radio value={1}>缓解</Radio>
                  <Radio value={2}>持续</Radio>
                  <Radio value={3}>加重</Radio>
                  <Radio value={4}>恢复伴后遗症</Radio>
                  <Radio value={5}>死亡</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="转归日期">
              {getFieldDecorator('recover_time', {
                initialValue: record.recover_time ? moment(record.recover_time, 'YYYY-MM-DD') : null
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
            {is_server_event === 1 ? (
              <>
                <h2>严重不良事件</h2>
                <Divider className={styles.lab_inspection_divider} />
                <Form.Item label="报告日期">
                  {getFieldDecorator('report_time', {
                    initialValue: record.report_time ? moment(record.report_time, 'YYYY-MM-DD') : null
                  })(<DatePicker format="YYYY-MM-DD" />)}
                </Form.Item>
                <Form.Item label="报告类型">
                  {getFieldDecorator('report_type', {
                    initialValue: record.report_type
                  })(
                    <Radio.Group>
                      <Radio value={0}>首次报告</Radio>
                      <Radio value={1}>随访报告</Radio>
                      <Radio value={2}>总结报告</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="SAE医学术语(诊断)">
                  {getFieldDecorator('SAE_diagnose', {
                    initialValue: record.SAE_diagnose
                  })(<Input style={{ width: 250, marginRight: 30 }} placeholder="请输入诊断" />)}
                </Form.Item>
                <Form.Item label="SAE情况">
                  {getFieldDecorator('SAE_state', {
                    initialValue: record.SAE_state
                  })(
                    <Radio.Group onChange={e => this.handleStateChange('SAE_state', e)}>
                      <Radio value={0}>死亡</Radio>
                      <Radio value={1}>导致住院</Radio>
                      <Radio value={2}>延长住院时间</Radio>
                      <Radio value={3}>伤残</Radio>
                      <Radio value={4}>功能障碍</Radio>
                      <Radio value={5}>导致先天畸形</Radio>
                      <Radio value={6}>危及生命</Radio>
                      <Radio value={7}>怀孕</Radio>
                      <Radio value={8}>
                        其他情况
                        {SAE_state === 8 ? (
                          <div style={{ display: 'inline-block' }}>
                            {getFieldDecorator('other_SAE_state', {
                              initialValue: record.other_SAE_state
                            })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="请输入其他SAE情况" />)}
                          </div>
                        ) : null}
                      </Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="死亡日期">
                  {getFieldDecorator('die_time', {
                    initialValue: record.die_time ? moment(record.die_time, 'YYYY-MM-DD') : null
                  })(<DatePicker format="YYYY-MM-DD" />)}
                </Form.Item>
                <Form.Item label="SAE发生日期">
                  {getFieldDecorator('SAE_start_time', {
                    initialValue: record.SAE_start_time ? moment(record.SAE_start_time, 'YYYY-MM-DD') : null
                  })(<DatePicker format="YYYY-MM-DD" />)}
                </Form.Item>
                <Form.Item label="对试验用药采取的措施">
                  {getFieldDecorator('medicine_measure', {
                    initialValue: record.medicine_measure
                  })(
                    <Radio.Group>
                      <Radio value={0}>继续用药</Radio>
                      <Radio value={1}>减少剂量</Radio>
                      <Radio value={2}>药物暂停后又恢复</Radio>
                      <Radio value={3}>停止用药</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="SAE转归">
                  {getFieldDecorator('SAE_recover', {
                    initialValue: record.SAE_recover
                  })(
                    <Radio.Group>
                      <Radio value={0}>症状消失后无后遗症</Radio>
                      <Radio value={1}>症状消失后有后遗症</Radio>
                      <Radio value={2}>症状持续</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="SAE与试验药的关系">
                  {getFieldDecorator('SAE_relations', {
                    initialValue: record.SAE_relations
                  })(
                    <Radio.Group>
                      <Radio value={0}>肯定有关</Radio>
                      <Radio value={1}>很可能有关</Radio>
                      <Radio value={2}>可能有关</Radio>
                      <Radio value={3}>可能无关</Radio>
                      <Radio value={4}>肯定无关</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </>
            ) : null}
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

export default connect(mapStateToProps)(Form.create()(AdverseEvent))
