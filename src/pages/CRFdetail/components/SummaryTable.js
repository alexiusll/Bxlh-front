import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Form, Divider, Modal, Col, Input, Table, Menu, Button, Radio, DatePicker } from 'antd'

import SummarySign from './forms/SummarySign'
import moment from 'moment'
import { getSampleId } from '@/utils/location'
import styles from '../style.css'

class SummaryTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: '0'
    }
  }

  static propTypes = {
    summary: PropTypes.object.isRequired,
    adverse_event_table_all: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  componentDidMount() {
    const sample_id = getSampleId()
    const { dispatch } = this.props

    dispatch({
      type: 'crf_interview/fetchSummary',
      payload: { sample_id }
    })
    dispatch({
      type: 'crf_interview/fetchAdverseEventAll',
      payload: { sample_id }
    })
  }

  handleMenuClick = e => {
    this.setState({
      current: e.key
    })
  }

  render() {
    const sample_id = getSampleId()
    const { current } = this.state
    const { summary, adverse_event_table_all } = this.props
    const tableLoading = this.props.loading.effects['crf_interview/fetchAdverseEventAll']

    const menu_content = [
      <WappedSummary key={sample_id} summary={summary} />,
      <AdverseTable key={sample_id} adverse_event_table_all={adverse_event_table_all} tableLoading={tableLoading} />,
      <SummarySign key={sample_id} cycle_number={1} sign_type={'si'} />,
      <SummarySign key={sample_id} cycle_number={1} sign_type={'cra'} />
    ]

    return (
      <div className={styles.menu_div}>
        <Menu className={styles.menu_title} onClick={this.handleMenuClick} selectedKeys={[current]} mode="horizontal">
          <Menu.Item key="0">项目总结</Menu.Item>
          <Menu.Item key="1">不良事件总结</Menu.Item>
          <Menu.Item key="2">研究者签名</Menu.Item>
          <Menu.Item key="3">监察员签名</Menu.Item>
        </Menu>
        <div className={styles.menu_content}>{menu_content[parseInt(current, 10)]}</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    summary: state.crf_interview.summary,
    adverse_event_table_all: state.crf_interview.adverse_event_table_all,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(SummaryTable)

class Summary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      reason_stop_drug: -1
    }
  }

  static propTypes = {
    summary: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleStateChange = (type, { target: { value } }) => {
    this.setState({ [type]: value })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 重构time
        if (values.last_time_drug) {
          values.last_time_drug = values.last_time_drug.format('YYYY-MM-DD')
        }

        const { dispatch } = this.props
        const sample_id = getSampleId()

        dispatch({
          type: 'crf_interview/modifySummary',
          payload: { sample_id, body: values }
        }).then(() =>
          dispatch({
            type: 'crf_interview/fetchSummary',
            payload: { sample_id }
          })
        )
      }
    })
  }

  render() {
    const { summary } = this.props
    const submitLoading = this.props.loading.effects['crf_interview/modifySummary']
    const { getFieldDecorator } = this.props.form
    const { reason_stop_drug } = this.state

    return (
      <Form
        className="page_body"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 17, offset: 1 }}
        onSubmit={this.handleSubmit}
      >
        <Form.Item label="患者是否已终(中)止本临床研究治疗">
          {getFieldDecorator('is_stop', {
            initialValue: summary.is_stop
          })(
            <Radio.Group>
              <Radio value={0}>否</Radio>
              <Radio value={1}>是</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="药物治疗依从性及临床终点">
          {getFieldDecorator('relay', {
            initialValue: summary.relay
          })(<Input style={{ width: '250px' }} />)}
        </Form.Item>
        <Form.Item label="末次服用治疗药物日期">
          {getFieldDecorator('last_time_drug', {
            initialValue: summary.last_time_drug ? moment(summary.last_time_drug, 'YYYY-MM-DD') : null
          })(<DatePicker format={'YYYY-MM-DD'} />)}
        </Form.Item>
        <Form.Item label="共用药几个疗程">
          {getFieldDecorator('treatment_times', {
            initialValue: summary.treatment_times
          })(<Input type="number" style={{ width: '250px' }} />)}
        </Form.Item>
        <Form.Item label="患者终(中)止治疗的原因">
          {getFieldDecorator('reason_stop_drug', {
            initialValue: summary.reason_stop_drug
          })(
            <Radio.Group onChange={e => this.handleStateChange('reason_stop_drug', e)}>
              <Radio value={0}>病情进展（出现客观疗效评价的疾病进展或临床症状进展）</Radio>
              <Radio value={1}>不良事件（与试验药物可能存在相关性）</Radio>
              <Radio value={2}>不良事件（与试验药物不存在相关性）</Radio>
              <Radio value={3}>自愿退出（与不良事件无相关性）</Radio>
              <Radio value={4}>违背实验方案</Radio>
              <Radio value={5}>死亡</Radio>
              <Radio value={6}>失联</Radio>
              <Radio value={7}>
                其他
                {reason_stop_drug === 7 || (reason_stop_drug === -1 && summary.reason_stop_drug === 7) ? (
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('other_reasons', {
                      initialValue: summary.other_reasons
                    })(<Input style={{ width: 250, marginLeft: 15 }} placeholder="请输入其他原因" />)}
                  </div>
                ) : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="疗效总结">
          <Form.Item style={{ display: 'inline-block' }}>
            PFS：
            {getFieldDecorator('PFS', {
              initialValue: summary.PFS
            })(<Input style={{ width: '200px' }} placeholder="" />)}
          </Form.Item>
          <Form.Item style={{ display: 'inline-block', marginLeft: '15px' }}>
            OS：
            {getFieldDecorator('OS', {
              initialValue: summary.OS
            })(<Input style={{ width: '200px' }} placeholder="" />)}
          </Form.Item>
        </Form.Item>
        <Form.Item label="经确认后的最佳客观疗效(参考RECIST1.1)">
          {getFieldDecorator('best_effect', {
            initialValue: summary.best_effect
          })(
            <Radio.Group>
              <Radio value={0}>完全缓解（CR）</Radio>
              <Radio value={1}>部分缓解（PR）</Radio>
              <Radio value={2}>疾病稳定（SD）</Radio>
              <Radio value={3}>疾病进展（PD）</Radio>
              <Radio value={4}>不能评价（NE）</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Col offset={7}>
          <Button htmlType="submit" type="primary" loading={submitLoading}>
            保存
          </Button>
        </Col>
      </Form>
    )
  }
}

const WappedSummary = connect(state => ({ loading: state.loading }))(Form.create()(Summary))

class AdverseTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      record: {},
      visible: false
    }
  }

  static propTypes = {
    adverse_event_table_all: PropTypes.array.isRequired,
    tableLoading: PropTypes.bool
  }

  handleEditModel = record => {
    this.setState({ record, visible: true })
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
      title: '访视',
      dataIndex: 'cycle_number',
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
            查看
          </Button>
        </>
      )
    }
  ]

  render() {
    const { adverse_event_table_all, tableLoading } = this.props
    const { record, visible } = this.state

    return (
      <>
        <Table
          loading={tableLoading}
          className={styles.patient_report_table}
          rowKey={'adverse_event_id'}
          size="small"
          bordered={true}
          pagination={false}
          scroll={{ x: true }}
          columns={this.columns}
          dataSource={adverse_event_table_all}
        />
        <Modal
          title="查看不良事件"
          className={styles.diagnose_history_modal}
          visible={visible}
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
              <Input value={record.adverse_event_name} style={{ width: 250, marginRight: 30 }} placeholder="无" />
            </Form.Item>
            <Form.Item label="是否为严重不良事件">
              <Radio.Group
                value={record.is_server_event === '严重不良事件' ? 1 : record.is_server_event === '不良事件' ? 0 : null}
              >
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="毒性分级">
              <Radio.Group value={record.toxicity_classification}>
                <Radio value={0}>1级</Radio>
                <Radio value={1}>2级</Radio>
                <Radio value={2}>3级</Radio>
                <Radio value={3}>4级</Radio>
                <Radio value={4}>5级</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={'开始日期'}>
              <DatePicker
                open={false}
                value={record.start_time ? moment(record.start_time, 'YYYY-MM-DD') : null}
                format={'YYYY-MM-DD'}
                placeholder="无"
              />
            </Form.Item>
            <Form.Item label="与药物关系">
              <Radio.Group
                value={['肯定有关', '很可能有关', '可能有关', '可能无关', '肯定无关'].indexOf(record.medicine_relation)}
              >
                <Radio value={0}>肯定有关</Radio>
                <Radio value={1}>很可能有关</Radio>
                <Radio value={2}>可能有关</Radio>
                <Radio value={3}>可能无关</Radio>
                <Radio value={4}>肯定无关</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="采取措施">
              <Radio.Group
                value={['剂量不变', '减少剂量', '暂停用药', '停止用药', '实验用药已结束'].indexOf(record.measure)}
              >
                <Radio value={0}>剂量不变</Radio>
                <Radio value={1}>减少剂量</Radio>
                <Radio value={2}>暂停用药</Radio>
                <Radio value={3}>停止用药</Radio>
                <Radio value={4}>实验用药已结束</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="是否进行药物治疗">
              <Radio.Group value={record.is_using_medicine}>
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="转归">
              <Radio.Group value={['症状消失', '缓解', '持续', '加重', '恢复伴后遗症', '死亡'].indexOf(record.recover)}>
                <Radio value={0}>症状消失</Radio>
                <Radio value={1}>缓解</Radio>
                <Radio value={2}>持续</Radio>
                <Radio value={3}>加重</Radio>
                <Radio value={4}>恢复伴后遗症</Radio>
                <Radio value={5}>死亡</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={'转归日期'}>
              <DatePicker
                open={false}
                value={record.recover_time ? moment(record.recover_time, 'YYYY-MM-DD') : null}
                format={'YYYY-MM-DD'}
                placeholder="无"
              />
            </Form.Item>
            {record.is_server_event === '严重不良事件' ? (
              <>
                <h2>严重不良事件</h2>
                <Divider className={styles.lab_inspection_divider} />
                <Form.Item label={'报告日期'}>
                  <DatePicker
                    open={false}
                    value={record.report_time ? moment(record.report_time, 'YYYY-MM-DD') : null}
                    format={'YYYY-MM-DD'}
                    placeholder="无"
                  />
                </Form.Item>
                <Form.Item label="报告类型">
                  <Radio.Group value={record.report_type}>
                    <Radio value={0}>首次报告</Radio>
                    <Radio value={1}>随访报告</Radio>
                    <Radio value={2}>总结报告</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="SAE医学术语(诊断)">
                  <Input value={record.SAE_diagnose} style={{ width: 250, marginRight: 30 }} placeholder="无" />
                </Form.Item>
                <Form.Item label="SAE情况">
                  <Radio.Group value={record.SAE_state}>
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
                      {record.SAE_state === 8 ? (
                        <Input value={record.other_SAE_state} style={{ width: 200, marginLeft: 15 }} placeholder="无" />
                      ) : null}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label={'死亡日期'}>
                  <DatePicker
                    open={false}
                    value={record.die_time ? moment(record.die_time, 'YYYY-MM-DD') : null}
                    format={'YYYY-MM-DD'}
                    placeholder="无"
                  />
                </Form.Item>
                <Form.Item label={'SAE发生日期'}>
                  <DatePicker
                    open={false}
                    value={record.SAE_start_time ? moment(record.SAE_start_time, 'YYYY-MM-DD') : null}
                    format={'YYYY-MM-DD'}
                    placeholder="无"
                  />
                </Form.Item>
                <Form.Item label="对试验用药采取的措施">
                  <Radio.Group value={record.medicine_measure}>
                    <Radio value={0}>继续用药</Radio>
                    <Radio value={1}>减少剂量</Radio>
                    <Radio value={2}>药物暂停后又恢复</Radio>
                    <Radio value={3}>停止用药</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="SAE转归">
                  <Radio.Group value={record.SAE_recover}>
                    <Radio value={0}>症状消失无后遗症</Radio>
                    <Radio value={1}>症状消失有后遗症</Radio>
                    <Radio value={2}>症状持续</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="SAE与试验药的关系">
                  <Radio.Group value={record.SAE_relations}>
                    <Radio value={0}>肯定有关</Radio>
                    <Radio value={1}>很可能有关</Radio>
                    <Radio value={2}>可能有关</Radio>
                    <Radio value={3}>可能无关</Radio>
                    <Radio value={4}>肯定无关</Radio>
                  </Radio.Group>
                </Form.Item>
              </>
            ) : null}
          </Form>
        </Modal>
      </>
    )
  }
}
