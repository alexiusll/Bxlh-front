import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Col, Form, DatePicker, Button, Radio, Input, Checkbox, Switch, Select } from 'antd'
import moment from 'moment'
import { getSampleId } from '@/utils/location'
import styles from '../../style.css'

const { Option } = Select

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20, offset: 1 }
}

// 既往史
class PatientHistory extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      surgery: '',
      tumor_ill: '',
      drug_allergy: '',
      drug_use: '',
      smoke: null,
      smoke_isquit: null,
      drinking: null,
      drinking_is_quit: null
    }
  }

  static propTypes = {
    crf_first_diagnose: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleStateChange = (type, e) => {
    if (type === 'drug_use' || type === 'drug_allergy' || type === 'tumor_ill' || type === 'surgery') {
      this.setState({ [type]: e.target.value })
    } else {
      this.setState({ [type]: e })
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props
        // 过滤checkbox的值
        // 过滤base_ill
        const boolean_cloumn = [
          'smoke',
          'smoke_isquit',
          'smoke_chemotherapy',
          'drinking_chemotherapy',
          'drinking',
          'drinking_is_quit'
        ]
        const base_ill = {}

        for (const type in values.base_ill) {
          if (values.base_ill[type]) {
            values.base_ill[type] = 'on'
            base_ill[`base_ill[${type}]`] = 'on'
          }
          delete values.base_ill[type]
        }
        if (values.base_ill_other) {
          base_ill.base_ill_other = values.base_ill_other
          delete values.base_ill_other
        }
        values.base_ill = base_ill
        for (const type of boolean_cloumn) {
          if (values[type]) {
            values[type] = 'on'
          } else {
            delete values[type]
          }
        }
        // 过滤日期传值
        if (values.drinking_quit_time) {
          values.drinking_quit_time = values.drinking_quit_time.format('YYYY-MM-DD')
        }

        if (values.smoke_quit_time) {
          values.smoke_quit_time = values.smoke_quit_time.format('YYYY-MM-DD')
        }
        // 重构烟酒史传值
        const smoke = {}
        const drinking = {}

        for (const type of ['smoke', 'smoke_isquit', 'smoke_quit_time', 'smoke_size', 'smoke_year']) {
          smoke[type] = values[type]
          delete values[type]
        }
        for (const type of [
          'drinking',
          'drinking_frequence',
          'drinking_is_quit',
          'drinking_quit_time',
          'drinking_size'
        ]) {
          drinking[type] = values[type]
          delete values[type]
        }
        values.smoke = smoke
        values.drinking = drinking

        const sample_id = getSampleId()

        dispatch({
          type: 'crf_first_diagnose/modifyPatientHistory',
          payload: { sample_id, body: values }
        }).then(() =>
          dispatch({
            type: 'crf_first_diagnose/fetchPatientHistory',
            payload: { sample_id }
          })
        )
      }
    })
  }

  clearConflictCheckbox = type => {
    const { setFieldsValue } = this.props.form

    switch (type) {
      case 0:
        setFieldsValue({
          'base_ill[不详]': false,
          'base_ill[高血压]': false,
          'base_ill[冠心病]': false,
          'base_ill[糖尿病]': false,
          'base_ill[慢性阻塞性肺疾病]': false,
          'base_ill[支气管哮喘]': false,
          'base_ill[肺结核]': false,
          'base_ill[间质性肺疾病]': false,
          'base_ill[高脂血症]': false,
          'base_ill[病毒性肝炎]': false,
          'base_ill[风湿免疫性疾病]': false,
          'base_ill[肾脏病]': false,
          'base_ill[其他]': false,
          base_ill_other: null
        })
        break
      case 1:
        setFieldsValue({
          'base_ill[无]': false,
          'base_ill[高血压]': false,
          'base_ill[冠心病]': false,
          'base_ill[糖尿病]': false,
          'base_ill[慢性阻塞性肺疾病]': false,
          'base_ill[支气管哮喘]': false,
          'base_ill[肺结核]': false,
          'base_ill[间质性肺疾病]': false,
          'base_ill[高脂血症]': false,
          'base_ill[病毒性肝炎]': false,
          'base_ill[风湿免疫性疾病]': false,
          'base_ill[肾脏病]': false,
          'base_ill[其他]': false,
          base_ill_other: null
        })
        break
      default:
        setFieldsValue({
          'base_ill[无]': false,
          'base_ill[不详]': false
        })
        break
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { patient_history } = this.props.crf_first_diagnose
    const submitLoading = this.props.loading.effects['crf_first_diagnose/modifyPatientHistory']
    const { surgery, tumor_ill, drug_allergy, drug_use, smoke, smoke_isquit, drinking, drinking_is_quit } = this.state

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="外伤及手术史：">
          {getFieldDecorator('surgery', {
            initialValue: patient_history.surgery
          })(
            <Radio.Group onChange={e => this.handleStateChange('surgery', e)}>
              <Radio value="无">无</Radio>
              <Radio value="不详">不详</Radio>
              <Radio value="其他">
                其他
                {surgery === '其他' || (surgery === '' && patient_history.surgery === '其他') ? (
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('surgery_other', {
                      initialValue: patient_history.surgery_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他外伤及手术史" />)}
                  </div>
                ) : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="基础疾病史：">
          <Form.Item style={{ display: 'inline-block' }}>
            {getFieldDecorator('base_ill[无]', {
              initialValue: patient_history['base_ill[无]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox onClick={() => this.clearConflictCheckbox(0)}>无</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[不详]', {
              initialValue: patient_history['base_ill[不详]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox onClick={() => this.clearConflictCheckbox(1)}>不详</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[高血压]', {
              initialValue: patient_history['base_ill[高血压]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox onClick={this.clearConflictCheckbox}>高血压</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[冠心病]', {
              initialValue: patient_history['base_ill[冠心病]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox onClick={this.clearConflictCheckbox}>冠心病</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[糖尿病]', {
              initialValue: patient_history['base_ill[糖尿病]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox onClick={this.clearConflictCheckbox}>糖尿病</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[慢性阻塞性肺疾病]', {
              initialValue: patient_history['base_ill[慢性阻塞性肺疾病]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox onClick={this.clearConflictCheckbox}>慢性阻塞性肺疾病</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[支气管哮喘]', {
              initialValue: patient_history['base_ill[支气管哮喘]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox onClick={this.clearConflictCheckbox}>支气管哮喘</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[肺结核]', {
              initialValue: patient_history['base_ill[肺结核]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox onClick={this.clearConflictCheckbox}>肺结核</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[间质性肺疾病]', {
              initialValue: patient_history['base_ill[间质性肺疾病]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox onClick={this.clearConflictCheckbox}>间质性肺疾病</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[高脂血症]', {
              initialValue: patient_history['base_ill[高脂血症]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox onClick={this.clearConflictCheckbox}>高脂血症</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[病毒性肝炎]', {
              initialValue: patient_history['base_ill[病毒性肝炎]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox onClick={this.clearConflictCheckbox}>病毒性肝炎</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[风湿免疫性疾病]', {
              initialValue: patient_history['base_ill[风湿免疫性疾病]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox onClick={this.clearConflictCheckbox}>风湿免疫性疾病</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[肾脏病]', {
              initialValue: patient_history['base_ill[肾脏病]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox onClick={this.clearConflictCheckbox}>肾脏病</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[其他]', {
              initialValue: patient_history['base_ill[其他]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox onClick={this.clearConflictCheckbox}>其他</Checkbox>)}
            <div style={{ display: 'inline-block' }}>
              {getFieldDecorator('base_ill_other', {
                initialValue: patient_history.base_ill_other
              })(<Input style={{ width: 200 }} placeholder="其他基础疾病" />)}
            </div>
          </Form.Item>
        </Form.Item>
        <Form.Item label="肿瘤病史：">
          {getFieldDecorator('tumor_ill', {
            initialValue: patient_history.tumor_ill
          })(
            <Radio.Group onChange={e => this.handleStateChange('tumor_ill', e)}>
              <Radio value="无">无</Radio>
              <Radio value="不详">不详</Radio>
              <Radio value="其他">
                其他
                {tumor_ill === '其他' || (tumor_ill === '' && patient_history.tumor_ill === '其他') ? (
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('tumor_ill_other', {
                      initialValue: patient_history.tumor_ill_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他肿瘤病史" />)}
                  </div>
                ) : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="药物过敏史：">
          {getFieldDecorator('drug_allergy', {
            initialValue: patient_history.drug_allergy
          })(
            <Radio.Group onChange={e => this.handleStateChange('drug_allergy', e)}>
              <Radio value="无">无</Radio>
              <Radio value="不详">不详</Radio>
              <Radio value="其他">
                其他
                {drug_allergy === '其他' || (drug_allergy === '' && patient_history.drug_allergy === '其他') ? (
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('drug_allergy_other', {
                      initialValue: patient_history.drug_allergy_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他药物过敏史" />)}
                  </div>
                ) : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="药物使用史：">
          {getFieldDecorator('drug_use', {
            initialValue: patient_history.drug_use
          })(
            <Radio.Group onChange={e => this.handleStateChange('drug_use', e)}>
              <Radio value="无">无</Radio>
              <Radio value="不详">不详</Radio>
              <Radio value="其他">
                其他
                {drug_use === '其他' || (drug_use === '' && patient_history.drug_use === '其他') ? (
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('drug_use_other', {
                      initialValue: patient_history.drug_use_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他药物使用史" />)}
                  </div>
                ) : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="吸烟史：">
          <Form.Item style={{ display: 'inline-block' }}>
            {getFieldDecorator('smoke', {
              initialValue: patient_history.smoke === 'on',
              valuePropName: 'checked'
            })(
              <Switch onChange={e => this.handleStateChange('smoke', e)} checkedChildren="有" unCheckedChildren="无" />
            )}
          </Form.Item>
          {smoke || (smoke === null && patient_history.smoke === 'on') ? (
            <>
              <Form.Item className={styles.smock_item}>
                平均吸烟(支/天):{' '}
                {getFieldDecorator('smoke_size', {
                  initialValue: patient_history.smoke_size
                })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="" />)}
              </Form.Item>
              <Form.Item className={styles.smock_item}>
                吸烟年数：
                {getFieldDecorator('smoke_year', {
                  initialValue: patient_history.smoke_year
                })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="" />)}
              </Form.Item>
              <br />
              <Form.Item className={styles.smock_item}>
                化疗期间是否吸烟：
                {getFieldDecorator('smoke_chemotherapy', {
                  initialValue: patient_history.smoke_chemotherapy === 'on',
                  valuePropName: 'checked'
                })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
              </Form.Item>
              <Form.Item className={styles.smock_item}>
                是否戒烟：
                {getFieldDecorator('smoke_isquit', {
                  initialValue: patient_history.smoke_isquit === 'on',
                  valuePropName: 'checked'
                })(
                  <Switch
                    onChange={e => this.handleStateChange('smoke_isquit', e)}
                    checkedChildren="是"
                    unCheckedChildren="否"
                  />
                )}
              </Form.Item>
              {smoke_isquit || (smoke_isquit === null && patient_history.smoke_isquit === 'on') ? (
                <Form.Item className={styles.smock_item}>
                  戒烟时间：
                  {getFieldDecorator('smoke_quit_time', {
                    initialValue: patient_history.smoke_quit_time
                      ? moment(patient_history.smoke_quit_time, 'YYYY-MM-DD')
                      : null
                  })(<DatePicker format="YYYY-MM-DD" />)}
                </Form.Item>
              ) : null}
            </>
          ) : null}
        </Form.Item>
        <Form.Item label="饮酒史：">
          <Form.Item style={{ display: 'inline-block' }}>
            {getFieldDecorator('drinking', {
              initialValue: patient_history.drinking === 'on',
              valuePropName: 'checked'
            })(
              <Switch
                onChange={e => this.handleStateChange('drinking', e)}
                checkedChildren="有"
                unCheckedChildren="无"
              />
            )}
          </Form.Item>
          {drinking || (drinking === null && patient_history.drinking === 'on') ? (
            <>
              <Form.Item className={styles.drinking_item}>
                <span>饮酒频率：</span>
                {getFieldDecorator('drinking_frequence', {
                  initialValue: patient_history.drinking_frequence
                })(
                  <Select style={{ width: '150px' }}>
                    <Option value="0">几乎不</Option>
                    <Option value="1">每周1-2次</Option>
                    <Option value="2">每周3-4次</Option>
                    <Option value="3">每周5-7次</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item className={styles.drinking_item}>
                <span>每次饮酒量：</span>
                {getFieldDecorator('drinking_size', {
                  initialValue: patient_history.drinking_size
                })(
                  <Select style={{ width: '150px' }}>
                    <Option value="0">每次少量</Option>
                    <Option value="1">每次微醺</Option>
                    <Option value="2">偶尔大醉</Option>
                    <Option value="3">每次大醉</Option>
                  </Select>
                )}
              </Form.Item>
              <br />
              <Form.Item className={styles.drinking_item}>
                化疗期间是否饮酒：
                {getFieldDecorator('drinking_chemotherapy', {
                  initialValue: patient_history.drinking_chemotherapy === 'on',
                  valuePropName: 'checked'
                })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
              </Form.Item>
              <Form.Item className={styles.drinking_item}>
                是否戒酒：
                {getFieldDecorator('drinking_is_quit', {
                  initialValue: patient_history.drinking_is_quit === 'on',
                  valuePropName: 'checked'
                })(
                  <Switch
                    onChange={e => this.handleStateChange('drinking_is_quit', e)}
                    checkedChildren="是"
                    unCheckedChildren="否"
                  />
                )}
              </Form.Item>
              {drinking_is_quit || (drinking_is_quit === null && patient_history.drinking_is_quit === 'on') ? (
                <Form.Item className={styles.drinking_item}>
                  戒酒时间：
                  {getFieldDecorator('drinking_quit_time', {
                    initialValue: patient_history.drinking_quit_time
                      ? moment(patient_history.drinking_quit_time, 'YYYY-MM-DD')
                      : null
                  })(<DatePicker format="YYYY-MM-DD" />)}
                </Form.Item>
              ) : null}
            </>
          ) : null}
        </Form.Item>
        <Form.Item label="身高(cm)">
          {getFieldDecorator('height', {
            initialValue: patient_history.height
          })(<Input style={{ width: 250 }} placeholder="请输入身高(cm)" />)}
        </Form.Item>
        <Form.Item label="体重(kg)">
          {getFieldDecorator('weight', {
            initialValue: patient_history.weight
          })(<Input style={{ width: 250 }} placeholder="请输入体重(kg)" />)}
        </Form.Item>
        <Form.Item label="体表面积(m²)">
          {getFieldDecorator('surface_area', {
            initialValue: patient_history.surface_area
          })(<Input style={{ width: 250 }} placeholder="请输入体表面积(m²)" />)}
        </Form.Item>
        <Form.Item label="ECOG评分">
          {getFieldDecorator('ECOG', {
            initialValue: patient_history.ECOG
          })(<Input style={{ width: 250 }} placeholder="请输入ECOG评分" />)}
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

export default connect(mapStateToProps)(Form.create()(PatientHistory))
