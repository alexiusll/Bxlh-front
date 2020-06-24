import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Modal, Row, Form, DatePicker, Button, Radio, Input, Table, Checkbox, Select, Divider } from 'antd'
import moment from 'moment'
import { getSampleId } from '@/utils/location'
import styles from '../../style.css'

const { Option } = Select

// 治疗史
class DiagnoseHistory extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      record: {},
      visible: false,
      diagnose_number: 1,
      diagnose_existence: 0,
      biopsy_method: '',
      biopsy_type: '',
      genetic_specimen: '',
      tmb: ''
    }
  }

  static propTypes = {
    crf_first_diagnose: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleDelete = diagnose_number => {
    Modal.confirm({
      title: '请问是否确认删除？',
      okText: '确定',
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch } = this.props
          const sample_id = getSampleId()

          dispatch({
            type: 'crf_first_diagnose/deleteDiagnoseHistory',
            payload: { sample_id, diagnose_number }
          }).then(() => {
            resolve()
            dispatch({
              type: 'crf_first_diagnose/fetchDiagnoseHistory',
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
        // 重构时间
        if (values.last_front_time) {
          values.last_front_time = values.last_front_time.format('YYYY-MM-DD')
        }
        if (values.start_time) {
          values.start_time = values.start_time.format('YYYY-MM-DD')
        }
        // 重构diagnose_method
        const diagnose_method = {}

        if (values.diagnose_method) {
          for (const type of [
            'chemotherapy',
            'immunotherapy',
            'operation',
            'othertherapy',
            'radiotherapy',
            'targetedtherapy'
          ]) {
            if (values.diagnose_method[type]._check) {
              diagnose_method[`diagnose_method[${type}]`] = 'on'
            }
            diagnose_method[`diagnose_method[${type}]_other`] = values.diagnose_method[type]._other
          }
          values.diagnose_method = diagnose_method
        }

        // 重构genetic_mutation_type
        const genetic_mutation_type = {}

        if (values.genetic_mutation_type) {
          for (const type in values.genetic_mutation_type) {
            if (values.genetic_mutation_type[type] === true) {
              genetic_mutation_type[`genetic_mutation_type[${type}]`] = 'on'
            }
          }
          genetic_mutation_type['genetic_mutation_type[ALK]_other'] = values.genetic_mutation_type.ALK._other
          genetic_mutation_type['genetic_mutation_type[EGFR]_other'] = values.genetic_mutation_type.EGFR._other
          if (values.genetic_mutation_type.ALK._ALK) {
            genetic_mutation_type['genetic_mutation_type[ALK]'] = 'on'
          }
          if (values.genetic_mutation_type.EGFR._EGFR) {
            genetic_mutation_type['genetic_mutation_type[EGFR]'] = 'on'
          }
          values.genetic_mutation_type = genetic_mutation_type
        }

        // 重构last_front_part
        const last_front_part = {}

        if (values.last_front_part) {
          for (const type in values.last_front_part) {
            if (values.last_front_part[type] === true) {
              last_front_part[`last_front_part[${type}]`] = 'on'
            }
          }
          if (values.last_front_part['其他']._check) {
            last_front_part['last_front_part[其他]'] = 'on'
          }
          last_front_part['last_front_part[其他]_other'] = values.last_front_part['其他']._other
          values.last_front_part = last_front_part
        }
        // 删除undefined 和 null
        for (const type in values) {
          if (values[type] === undefined || values[type] === null) {
            delete values[type]
          }
        }

        const { dispatch } = this.props
        const sample_id = getSampleId()

        dispatch({
          type: 'crf_first_diagnose/modifyDiagnoseHistory',
          payload: { sample_id, body: values }
        }).then(() => {
          this.setState({ visible: false })
          dispatch({
            type: 'crf_first_diagnose/fetchDiagnoseHistory',
            payload: { sample_id }
          })
        })
      }
    })
  }

  handleEditModel = record => {
    this.setState(
      {
        diagnose_number: record.diagnose_number,
        diagnose_existence: record.diagnose_existence
      },
      () => this.setState({ record, visible: true })
    )
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleStateChange = (type, { target: { value } }) => {
    this.setState({ [type]: value })
  }

  clearPartConflictCheckbox = type => {
    const { setFieldsValue } = this.props.form

    switch (type) {
      case 0:
        setFieldsValue({
          'last_front_part[对侧肺门淋巴结]': false,
          'last_front_part[锁骨上淋巴结肺内]': false,
          'last_front_part[肺内]': false,
          'last_front_part[脑]': false,
          'last_front_part[脊柱骨]': false,
          'last_front_part[四肢骨]': false,
          'last_front_part[肝]': false,
          'last_front_part[肾上腺]': false,
          'last_front_part[其他]_check': false,
          'last_front_part[其他]_other': null
        })
        break
      default:
        setFieldsValue({
          'last_front_part[primary_focus]': false
        })
        break
    }
  }

  clearGeneticConflictCheckbox = type => {
    const { setFieldsValue } = this.props.form

    const commonBox = {
      'genetic_mutation_type[ROS-1]': false,
      'genetic_mutation_type[cMET]': false,
      'genetic_mutation_type[BRAF]': false,
      'genetic_mutation_type[KRAS]': false,
      'genetic_mutation_type[Her-2]': false,
      'genetic_mutation_type[RET]': false,
      'genetic_mutation_type[ERBB2]': false,
      'genetic_mutation_type[TP53]': false,
      'genetic_mutation_type[EGFR]_EGFR': false,
      'genetic_mutation_type[ALK]_ALK': false,
      'genetic_mutation_type[EGFR]_other': null,
      'genetic_mutation_type[ALK]_other': null
    }

    switch (type) {
      case 0:
        setFieldsValue({
          'genetic_mutation_type[不详]': false,
          'genetic_mutation_type[无突变]': false,
          ...commonBox
        })
        break
      case 1:
        setFieldsValue({
          'genetic_mutation_type[未测]': false,
          'genetic_mutation_type[无突变]': false,
          ...commonBox
        })
        break
      case 2:
        setFieldsValue({
          'genetic_mutation_type[未测]': false,
          'genetic_mutation_type[不详]': false,
          ...commonBox
        })
        break
      default:
        setFieldsValue({
          'genetic_mutation_type[未测]': false,
          'genetic_mutation_type[不详]': false,
          'genetic_mutation_type[无突变]': false
        })
        break
    }
  }

  columns = [
    {
      title: '几线治疗',
      dataIndex: 'diagnose_number',
      align: 'center'
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      align: 'center'
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
            onClick={() => this.handleDelete(record.diagnose_number)}
          >
            删除
          </Button>
        </>
      )
    }
  ]

  render() {
    const { diagnose_history } = this.props.crf_first_diagnose
    const tableLoading = this.props.loading.effects['crf_first_diagnose/fetchDiagnoseHistory']
    const submitLoading = this.props.loading.effects['crf_first_diagnose/modifyDiagnoseHistory']
    const { getFieldDecorator } = this.props.form
    const {
      record,
      visible,
      diagnose_number,
      diagnose_existence,
      biopsy_method,
      biopsy_type,
      genetic_specimen,
      tmb
    } = this.state

    let labelBefore = ''

    let labelAfter = ''

    if (diagnose_number === 1) {
      labelAfter = '一线治疗'
    } else if (diagnose_number === 2) {
      labelBefore = '一线治疗'
      labelAfter = '二线治疗'
    } else if (diagnose_number === 3) {
      labelBefore = '二线治疗'
      labelAfter = '三线治疗'
    } else if (diagnose_number === 4) {
      labelBefore = '三线治疗'
      labelAfter = '四线治疗'
    } else if (diagnose_number === 5) {
      labelBefore = '四线治疗'
      labelAfter = '五线治疗'
    }

    return (
      <>
        <Button type="primary" onClick={() => this.handleEditModel({ diagnose_number: 1, diagnose_existence: 0 })}>
          添加
        </Button>
        <Table
          loading={tableLoading}
          className={styles.patient_report_table}
          rowKey="diagnose_number"
          size="small"
          bordered
          pagination={false}
          scroll={{ x: true }}
          columns={this.columns}
          dataSource={diagnose_history}
        />
        <Modal
          title="编辑治疗史"
          className={styles.diagnose_history_modal}
          visible={visible}
          okText="保存"
          destroyOnClose
          maskClosable={false}
          onCancel={this.handleCancel}
          centered
          footer={null}
        >
          <Form
            className="page_body"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 18, offset: 1 }}
            onSubmit={this.handleSubmit}
          >
            <Form.Item label="几线治疗">
              {getFieldDecorator('diagnose_number', {
                initialValue: record.diagnose_number
              })(
                <Select
                  style={{ width: '200px' }}
                  onChange={value =>
                    this.handleStateChange('diagnose_number', {
                      target: { value }
                    })
                  }
                >
                  <Option value={1}>一线治疗</Option>
                  <Option value={2}>二线治疗</Option>
                  <Option value={3}>三线治疗</Option>
                  <Option value={4}>四线治疗</Option>
                  <Option value={5}>五线治疗</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label={labelAfter}>
              {getFieldDecorator('diagnose_existence', {
                initialValue: record.diagnose_existence
              })(
                <Radio.Group onChange={e => this.handleStateChange('diagnose_existence', e)}>
                  <Radio value={0}>无</Radio>
                  <Radio value={1}>不详</Radio>
                  <Radio value={2}>有，请填下表</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            {diagnose_existence === 2 ? (
              <>
                {diagnose_number !== 1 ? (
                  <>
                    <Divider className={styles.modal_divider} />
                    <Form.Item label={`${labelBefore}最佳疗效`}>
                      {getFieldDecorator('last_front_best_efficacy', {
                        initialValue: record.last_front_best_efficacy
                      })(
                        <Radio.Group>
                          <Radio value={0}>完求缓解(CR)</Radio>
                          <Radio value={1}>部分缓解(PR)</Radio>
                          <Radio value={2}>疾病稳定(SD)</Radio>
                          <Radio value={3}>疾病进展(PD)</Radio>
                          <Radio value={4}>疗效不详(UK)</Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item label={`${labelBefore}进展时间`}>
                      {getFieldDecorator('last_front_time', {
                        initialValue: record.last_front_time ? moment(record.last_front_time, 'YYYY-MM-DD') : null
                      })(<DatePicker format="YYYY-MM-DD" />)}
                    </Form.Item>
                    <Form.Item label={`${labelBefore}进展部位`}>
                      <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('last_front_part[primary_focus]', {
                          initialValue: record['last_front_part[primary_focus]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={() => this.clearPartConflictCheckbox(0)}>无</Checkbox>)}
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('last_front_part[对侧肺门淋巴结]', {
                          initialValue: record['last_front_part[对侧肺门淋巴结]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearPartConflictCheckbox}>对侧肺门淋巴结</Checkbox>)}
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('last_front_part[锁骨上淋巴结肺内]', {
                          initialValue: record['last_front_part[锁骨上淋巴结肺内]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearPartConflictCheckbox}>锁骨上淋巴结肺内</Checkbox>)}
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('last_front_part[肺内]', {
                          initialValue: record['last_front_part[肺内]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearPartConflictCheckbox}>肺内</Checkbox>)}
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('last_front_part[脑]', {
                          initialValue: record['last_front_part[脑]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearPartConflictCheckbox}>脑</Checkbox>)}
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('last_front_part[脊柱骨]', {
                          initialValue: record['last_front_part[脊柱骨]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearPartConflictCheckbox}>脊柱骨</Checkbox>)}
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('last_front_part[四肢骨]', {
                          initialValue: record['last_front_part[四肢骨]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearPartConflictCheckbox}>四肢骨</Checkbox>)}
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('last_front_part[肝]', {
                          initialValue: record['last_front_part[肝]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearPartConflictCheckbox}>肝</Checkbox>)}
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('last_front_part[肾上腺]', {
                          initialValue: record['last_front_part[肾上腺]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearPartConflictCheckbox}>肾上腺</Checkbox>)}
                      </Form.Item>
                      <Form.Item className={styles.from_item}>
                        {getFieldDecorator('last_front_part[其他]_check', {
                          initialValue: record['last_front_part[其他]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearPartConflictCheckbox}>其他</Checkbox>)}
                        <div style={{ display: 'inline-block' }}>
                          {getFieldDecorator('last_front_part[其他]_other', {
                            initialValue: record['last_front_part[其他]_other']
                          })(<Input style={{ width: 200 }} placeholder="其他部位" />)}
                        </div>
                      </Form.Item>
                    </Form.Item>
                    <Form.Item label="再次活检">
                      {getFieldDecorator('is_biopsy_again', {
                        initialValue: record.is_biopsy_again
                      })(
                        <Radio.Group>
                          <Radio value={0}>是</Radio>
                          <Radio value={1}>否</Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item label="活检方式">
                      {getFieldDecorator('biopsy_method', {
                        initialValue: record.biopsy_method
                      })(
                        <Radio.Group onChange={e => this.handleStateChange('biopsy_method', e)}>
                          <Radio value="无">无</Radio>
                          <Radio value="手术">手术</Radio>
                          <Radio value="胸腔镜">胸腔镜</Radio>
                          <Radio value="纵隔镜">纵隔镜</Radio>
                          <Radio value="经皮肺穿刺">经皮肺穿刺</Radio>
                          <Radio value="纤支镜">纤支镜</Radio>
                          <Radio value="E-BUS">E-BUS</Radio>
                          <Radio value="EUS-FNA">EUS-FNA</Radio>
                          <Radio value="淋巴结活检">淋巴结活检</Radio>
                          <Radio value="其他">
                            其他
                            {biopsy_method === '其他' || (biopsy_method === '' && record.biopsy_method === '其他') ? (
                              <div style={{ display: 'inline-block' }}>
                                {getFieldDecorator('biopsy_method_other', {
                                  initialValue: record.biopsy_method_other
                                })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他方式" />)}
                              </div>
                            ) : null}
                          </Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item label="活检病理类型">
                      {getFieldDecorator('biopsy_type', {
                        initialValue: record.biopsy_type
                      })(
                        <Radio.Group onChange={e => this.handleStateChange('biopsy_type', e)}>
                          <Radio value="0">无</Radio>
                          <Radio value="1">与第1次活检病理类型一致</Radio>
                          <Radio value="与第1次活检病理类型不一致">
                            与第1次活检病理类型不一致
                            {biopsy_type === '与第1次活检病理类型不一致' ||
                            (biopsy_type === '' && record.biopsy_type === '与第1次活检病理类型不一致') ? (
                              <div style={{ display: 'inline-block' }}>
                                {getFieldDecorator('biopsy_type_other', {
                                  initialValue: record.biopsy_type_other
                                })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="" />)}
                              </div>
                            ) : null}
                          </Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item label="基因检测标本">
                      {getFieldDecorator('genetic_specimen', {
                        initialValue: record.genetic_specimen
                      })(
                        <Radio.Group onChange={e => this.handleStateChange('genetic_specimen', e)}>
                          <Radio value="无">无</Radio>
                          <Radio value="外周血">外周血</Radio>
                          <Radio value="原发灶组织">原发灶组织</Radio>
                          <Radio value="转移灶组织">
                            转移灶组织
                            {genetic_specimen === '转移灶组织' ||
                            (genetic_specimen === '' && record.genetic_specimen === '转移灶组织') ? (
                              <div style={{ display: 'inline-block' }}>
                                {getFieldDecorator('genetic_specimen_other', {
                                  initialValue: record.genetic_specimen_other
                                })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他标本" />)}
                              </div>
                            ) : null}
                          </Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item label="基因检测方法">
                      {getFieldDecorator('genetic_method', {
                        initialValue: record.genetic_method
                      })(
                        <Radio.Group>
                          <Radio value={0}>无</Radio>
                          <Radio value={1}>ARMS</Radio>
                          <Radio value={2}>FISH</Radio>
                          <Radio value={3}>二代测序</Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item label="基因突变类型">
                      <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('genetic_mutation_type[未测]', {
                          initialValue: record['genetic_mutation_type[未测]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={() => this.clearGeneticConflictCheckbox(0)}>未测</Checkbox>)}
                      </Form.Item>
                      <Form.Item className={styles.from_item}>
                        {getFieldDecorator('genetic_mutation_type[不详]', {
                          initialValue: record['genetic_mutation_type[不详]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={() => this.clearGeneticConflictCheckbox(1)}>不详</Checkbox>)}
                      </Form.Item>
                      <Form.Item className={styles.from_item}>
                        {getFieldDecorator('genetic_mutation_type[无突变]', {
                          initialValue: record['genetic_mutation_type[无突变]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={() => this.clearGeneticConflictCheckbox(2)}>无突变</Checkbox>)}
                      </Form.Item>
                      <Form.Item className={styles.from_item}>
                        {getFieldDecorator('genetic_mutation_type[ROS-1]', {
                          initialValue: record['genetic_mutation_type[ROS-1]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearGeneticConflictCheckbox}>ROS-1</Checkbox>)}
                      </Form.Item>
                      <Form.Item className={styles.from_item}>
                        {getFieldDecorator('genetic_mutation_type[cMET]', {
                          initialValue: record['genetic_mutation_type[cMET]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearGeneticConflictCheckbox}>cMET</Checkbox>)}
                      </Form.Item>
                      <Form.Item className={styles.from_item}>
                        {getFieldDecorator('genetic_mutation_type[BRAF]', {
                          initialValue: record['genetic_mutation_type[BRAF]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearGeneticConflictCheckbox}>BRAF</Checkbox>)}
                      </Form.Item>
                      <Form.Item className={styles.from_item}>
                        {getFieldDecorator('genetic_mutation_type[KRAS]', {
                          initialValue: record['genetic_mutation_type[KRAS]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearGeneticConflictCheckbox}>KRAS</Checkbox>)}
                      </Form.Item>
                      <Form.Item className={styles.from_item}>
                        {getFieldDecorator('genetic_mutation_type[Her-2]', {
                          initialValue: record['genetic_mutation_type[Her-2]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearGeneticConflictCheckbox}>Her-2</Checkbox>)}
                      </Form.Item>
                      <Form.Item className={styles.from_item}>
                        {getFieldDecorator('genetic_mutation_type[RET]', {
                          initialValue: record['genetic_mutation_type[RET]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearGeneticConflictCheckbox}>RET</Checkbox>)}
                      </Form.Item>
                      <Form.Item className={styles.from_item}>
                        {getFieldDecorator('genetic_mutation_type[ERBB2]', {
                          initialValue: record['genetic_mutation_type[ERBB2]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearGeneticConflictCheckbox}>ERBB2</Checkbox>)}
                      </Form.Item>
                      <Form.Item className={styles.from_item}>
                        {getFieldDecorator('genetic_mutation_type[TP53]', {
                          initialValue: record['genetic_mutation_type[TP53]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearGeneticConflictCheckbox}>TP53</Checkbox>)}
                      </Form.Item>
                      <Form.Item className={styles.from_item}>
                        {getFieldDecorator('genetic_mutation_type[EGFR]_EGFR', {
                          initialValue: record['genetic_mutation_type[EGFR]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearGeneticConflictCheckbox}>EGFR</Checkbox>)}
                        <div style={{ display: 'inline-block' }}>
                          {getFieldDecorator('genetic_mutation_type[EGFR]_other', {
                            initialValue: record['genetic_mutation_type[EGFR]_other']
                          })(<Input style={{ width: 200 }} placeholder="EGFR描述" />)}
                        </div>
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block', marginLeft: '20px' }}>
                        {getFieldDecorator('genetic_mutation_type[ALK]_ALK', {
                          initialValue: record['genetic_mutation_type[ALK]'] === 'on',
                          valuePropName: 'checked'
                        })(<Checkbox onClick={this.clearGeneticConflictCheckbox}>ALK</Checkbox>)}
                        <div style={{ display: 'inline-block' }}>
                          {getFieldDecorator('genetic_mutation_type[ALK]_other', {
                            initialValue: record['genetic_mutation_type[ALK]_other']
                          })(<Input style={{ width: 200 }} placeholder="ALK描述" />)}
                        </div>
                      </Form.Item>
                    </Form.Item>
                    <Form.Item label="PD-L1表达">
                      {getFieldDecorator('PDL1', {
                        initialValue: record.PDL1
                      })(
                        <Radio.Group>
                          <Radio value={0}>未测</Radio>
                          <Radio value={1}>不详</Radio>
                          <Radio value={2}>&gt;50%</Radio>
                          <Radio value={3}>1%-50%</Radio>
                          <Radio value={4}>&lt;1%</Radio>
                          <Radio value={5}>阴性</Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item label="肿瘤突变负荷(TMB)">
                      {getFieldDecorator('tmb', {
                        initialValue: record.tmb
                      })(
                        <Radio.Group onChange={e => this.handleStateChange('tmb', e)}>
                          <Radio value="未测">未测</Radio>
                          <Radio value="不详">不详</Radio>
                          <Radio value="其他">
                            数量(个突变/Mb)
                            {tmb === '其他' || (tmb === '' && record.tmb === '其他') ? (
                              <div style={{ display: 'inline-block' }}>
                                {getFieldDecorator('tmb_other', {
                                  initialValue: record.tmb_other
                                })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="tmb数量" />)}
                              </div>
                            ) : null}
                          </Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item label="微卫星不稳定性(MSI)">
                      {getFieldDecorator('msi', {
                        initialValue: record.msi
                      })(
                        <Radio.Group>
                          <Radio value={0}>未测</Radio>
                          <Radio value={1}>不详</Radio>
                          <Radio value={2}>微卫星稳定型</Radio>
                          <Radio value={3}>微卫星不稳定型</Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                  </>
                ) : null}
                <Divider className={styles.modal_divider} />
                <Form.Item label={`${labelAfter}开始时间`}>
                  {getFieldDecorator('start_time', {
                    initialValue: record.start_time ? moment(record.start_time, 'YYYY-MM-DD') : null
                  })(<DatePicker format="YYYY-MM-DD" />)}
                </Form.Item>
                <Form.Item label="治疗方式">
                  {getFieldDecorator('diagnose_method[operation]_check', {
                    initialValue: record['diagnose_method[operation]'] === 'on',
                    valuePropName: 'checked'
                  })(<Checkbox>手术(手术部位及方式)</Checkbox>)}
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('diagnose_method[operation]_other', {
                      initialValue: record['diagnose_method[operation]_other']
                    })(<Input style={{ width: 200 }} placeholder="" />)}
                  </div>
                  <br />
                  {getFieldDecorator('diagnose_method[radiotherapy]_check', {
                    initialValue: record['diagnose_method[radiotherapy]'] === 'on',
                    valuePropName: 'checked'
                  })(<Checkbox>放疗(放疗部位及剂量)</Checkbox>)}
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('diagnose_method[radiotherapy]_other', {
                      initialValue: record['diagnose_method[radiotherapy]_other']
                    })(<Input style={{ width: 200 }} placeholder="" />)}
                  </div>
                  <br />
                  {getFieldDecorator('diagnose_method[chemotherapy]_check', {
                    initialValue: record['diagnose_method[chemotherapy]'] === 'on',
                    valuePropName: 'checked'
                  })(<Checkbox>化疗(药名，使用剂量、频率及副作用)</Checkbox>)}
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('diagnose_method[chemotherapy]_other', {
                      initialValue: record['diagnose_method[chemotherapy]_other']
                    })(<Input style={{ width: 200 }} placeholder="" />)}
                  </div>
                  <br />
                  {getFieldDecorator('diagnose_method[targetedtherapy]_check', {
                    initialValue: record['diagnose_method[targetedtherapy]'] === 'on',
                    valuePropName: 'checked'
                  })(<Checkbox>靶向治疗(药名，使用剂量、频率及副作用)</Checkbox>)}
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('diagnose_method[targetedtherapy]_other', {
                      initialValue: record['diagnose_method[targetedtherapy]_other']
                    })(<Input style={{ width: 200 }} placeholder="" />)}
                  </div>
                  <br />
                  {getFieldDecorator('diagnose_method[immunotherapy]_check', {
                    initialValue: record['diagnose_method[immunotherapy]'] === 'on',
                    valuePropName: 'checked'
                  })(<Checkbox>免疫治疗(药名，使用剂量、频率及副作用)</Checkbox>)}
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('diagnose_method[immunotherapy]_other', {
                      initialValue: record['diagnose_method[immunotherapy]_other']
                    })(<Input style={{ width: 200 }} placeholder="" />)}
                  </div>
                  <br />
                  {getFieldDecorator('diagnose_method[othertherapy]_check', {
                    initialValue: record['diagnose_method[othertherapy]'] === 'on',
                    valuePropName: 'checked'
                  })(<Checkbox>其他(药名，使用剂量、频率及副作用)</Checkbox>)}
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('diagnose_method[othertherapy]_other', {
                      initialValue: record['diagnose_method[othertherapy]_other']
                    })(<Input style={{ width: 200 }} placeholder="" />)}
                  </div>
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
    crf_first_diagnose: state.crf_first_diagnose,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(DiagnoseHistory))
