import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Col, Form, DatePicker, Button, Radio, Input, Divider } from 'antd'
import moment from 'moment'
import { getSampleId } from '@/utils/location'
import styles from '../../style.css'

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20, offset: 1 }
}

// 实验室检查
class LabInspection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      biopsy_method: '',
      tumor_pathological_type: '',
      genetic_testing_specimen: '',
      tmb: ''
    }
  }

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
      type: 'crf_first_diagnose/fetchLabInspection',
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
        // 重构time
        if (values.time) values.time = values.time.format('YYYY-MM-DD')

        const { dispatch, cycle_number } = this.props
        const sample_id = getSampleId()

        dispatch({
          type: 'crf_first_diagnose/modifyLabInspection',
          payload: { sample_id, cycle_number, body: values }
        }).then(() =>
          dispatch({
            type: 'crf_first_diagnose/fetchLabInspection',
            payload: { sample_id, cycle_number }
          })
        )
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { lab_inspection } = this.props.crf_first_diagnose
    const submitLoading = this.props.loading.effects['crf_first_diagnose/modifyLabInspection']

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="开始时间">
          {getFieldDecorator('time', {
            initialValue: lab_inspection.time ? moment(lab_inspection.time, 'YYYY-MM-DD') : null
          })(<DatePicker format="YYYY-MM-DD" />)}
        </Form.Item>
        <h2>血常规及凝血功能</h2>
        <Divider className={styles.lab_inspection_divider} />
        <Form.Item label="Hb(g/L)">
          {getFieldDecorator('Hb_val', {
            initialValue: lab_inspection.Hb_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(g/L)" />)}
          临床意义判定：
          {getFieldDecorator('Hb_rank', {
            initialValue: lab_inspection.Hb_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="RBC_B(×10¹²/L)">
          {getFieldDecorator('RBC_B_val', {
            initialValue: lab_inspection.RBC_B_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(×10¹²/L)" />)}
          临床意义判定：
          {getFieldDecorator('RBC_B_rank', {
            initialValue: lab_inspection.RBC_B_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="WBC(×10⁹/L)">
          {getFieldDecorator('WBC_B_val', {
            initialValue: lab_inspection.WBC_B_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入监测值(×10⁹/L)" />)}
          临床意义判定：
          {getFieldDecorator('WBC_B_rank', {
            initialValue: lab_inspection.WBC_B_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="Plt(×10⁹L)">
          {getFieldDecorator('Plt_val', {
            initialValue: lab_inspection.Plt_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(×10⁹L)" />)}
          临床意义判定：
          {getFieldDecorator('Plt_rank', {
            initialValue: lab_inspection.Plt_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="PT(S)">
          {getFieldDecorator('PT_val', {
            initialValue: lab_inspection.PT_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(S)" />)}
          临床意义判定：
          {getFieldDecorator('PT_rank', {
            initialValue: lab_inspection.PT_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <h2>尿常规</h2>
        <Divider className={styles.lab_inspection_divider} />
        <Form.Item label="白细胞(个/HP)">
          {getFieldDecorator('RBC_P_val', {
            initialValue: lab_inspection.RBC_P_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(个/HP)" />)}
          临床意义判定：
          {getFieldDecorator('RBC_P_rank', {
            initialValue: lab_inspection.RBC_P_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="红细胞(个/HP)">
          {getFieldDecorator('WBC_P_val', {
            initialValue: lab_inspection.WBC_P_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(个/HP)" />)}
          临床意义判定：
          {getFieldDecorator('WBC_P_rank', {
            initialValue: lab_inspection.WBC_P_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="尿蛋白(＋/－)">
          {getFieldDecorator('PRO_val', {
            initialValue: lab_inspection.PRO_val
          })(
            <Radio.Group style={{ marginRight: 20 }}>
              <Radio value="1">+</Radio>
              <Radio value="2">-</Radio>
            </Radio.Group>
          )}
          临床意义判定：
          {getFieldDecorator('PRO_rank', {
            initialValue: lab_inspection.PRO_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <h2>血生化</h2>
        <Divider className={styles.lab_inspection_divider} />
        <Form.Item label="ALT(IU/L)">
          {getFieldDecorator('ALT_val', {
            initialValue: lab_inspection.ALT_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(IU/L)" />)}
          临床意义判定：
          {getFieldDecorator('ALT_rank', {
            initialValue: lab_inspection.ALT_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="AST(IU/L)">
          {getFieldDecorator('AST_val', {
            initialValue: lab_inspection.AST_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(IU/L)" />)}
          临床意义判定：
          {getFieldDecorator('AST_rank', {
            initialValue: lab_inspection.AST_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="TBIL(umol/1)">
          {getFieldDecorator('TBIL_val', {
            initialValue: lab_inspection.TBIL_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入监测值(umol/1)" />)}
          临床意义判定：
          {getFieldDecorator('TBIL_rank', {
            initialValue: lab_inspection.TBIL_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="DBIL(umol/1)">
          {getFieldDecorator('DBIL_val', {
            initialValue: lab_inspection.DBIL_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(umol/1)" />)}
          临床意义判定：
          {getFieldDecorator('DBIL_rank', {
            initialValue: lab_inspection.DBIL_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="ALB(g/L)">
          {getFieldDecorator('ALB_val', {
            initialValue: lab_inspection.ALB_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(g/L)" />)}
          临床意义判定：
          {getFieldDecorator('ALB_rank', {
            initialValue: lab_inspection.ALB_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="Cr(umol/L)">
          {getFieldDecorator('Cr_val', {
            initialValue: lab_inspection.Cr_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(umol/L)" />)}
          临床意义判定：
          {getFieldDecorator('Cr_rank', {
            initialValue: lab_inspection.Cr_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="BUN(mmol/1)">
          {getFieldDecorator('BUN_val', {
            initialValue: lab_inspection.BUN_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(mmol/1)" />)}
          临床意义判定：
          {getFieldDecorator('BUN_rank', {
            initialValue: lab_inspection.BUN_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="Glu(mmol/L)">
          {getFieldDecorator('Glu_val', {
            initialValue: lab_inspection.Glu_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(mmol/L)" />)}
          临床意义判定：
          {getFieldDecorator('Glu_rank', {
            initialValue: lab_inspection.Glu_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="K(mmol/L)">
          {getFieldDecorator('K_val', {
            initialValue: lab_inspection.K_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(mmol/L)" />)}
          临床意义判定：
          {getFieldDecorator('K_rank', {
            initialValue: lab_inspection.K_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="Na(mmol/L)">
          {getFieldDecorator('Na_val', {
            initialValue: lab_inspection.Na_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(mmol/L)" />)}
          临床意义判定：
          {getFieldDecorator('Na_rank', {
            initialValue: lab_inspection.Na_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="Cl(mmol/L)">
          {getFieldDecorator('Cl_val', {
            initialValue: lab_inspection.Cl_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(mmol/L)" />)}
          临床意义判定：
          {getFieldDecorator('Cl_rank', {
            initialValue: lab_inspection.Cl_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="P(mmol/L)">
          {getFieldDecorator('P_val', {
            initialValue: lab_inspection.P_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(mmol/L)" />)}
          临床意义判定：
          {getFieldDecorator('P_rank', {
            initialValue: lab_inspection.P_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <h2>肿瘤标志物</h2>
        <Divider className={styles.lab_inspection_divider} />
        <Form.Item label="CEA(ng/ml)">
          {getFieldDecorator('CEA_val', {
            initialValue: lab_inspection.CEA_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(ng/ml)" />)}
          临床意义判定：
          {getFieldDecorator('CEA_rank', {
            initialValue: lab_inspection.CEA_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="SCC(U/ml)">
          {getFieldDecorator('SCC_val', {
            initialValue: lab_inspection.SCC_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入检测值(U/ml)" />)}
          临床意义判定：
          {getFieldDecorator('SCC_rank', {
            initialValue: lab_inspection.SCC_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="NSE(u/ml)">
          {getFieldDecorator('NSE_val', {
            initialValue: lab_inspection.NSE_val
          })(<Input style={{ width: 200, marginRight: 30 }} placeholder="请输入监测值(u/ml)" />)}
          临床意义判定：
          {getFieldDecorator('NSE_rank', {
            initialValue: lab_inspection.NSE_rank
          })(
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          )}
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

export default connect(mapStateToProps)(Form.create()(LabInspection))
