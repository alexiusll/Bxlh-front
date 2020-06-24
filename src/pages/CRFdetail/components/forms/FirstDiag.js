import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Col, Form, Button, Radio, Input, Checkbox } from 'antd'
import { getSampleId } from '@/utils/location'
import styles from '../../style.css'

// 初诊过程
class FirstDiag extends React.Component {
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
        // 重构clinical_symptoms
        const clinical_symptoms = {}

        clinical_symptoms['clinical_symptoms[其他]_other'] = values.clinical_symptoms['其他']._other
        if (values.clinical_symptoms['其他']._else) {
          clinical_symptoms['clinical_symptoms[其他]'] = 'on'
        }
        for (const type in values.clinical_symptoms) {
          if (values.clinical_symptoms[type] === true) {
            clinical_symptoms[`clinical_symptoms[${type}]`] = 'on'
          }
        }
        values.clinical_symptoms = clinical_symptoms
        // 重构gene_mutation_type
        const gene_mutation_type = {}

        gene_mutation_type['gene_mutation_type[ALK]_other'] = values.gene_mutation_type.ALK._other
        gene_mutation_type['gene_mutation_type[EGFR]_other'] = values.gene_mutation_type.EGFR._other
        if (values.gene_mutation_type.ALK._ALK) {
          gene_mutation_type['gene_mutation_type[ALK]'] = 'on'
        }
        if (values.gene_mutation_type.EGFR._EGFR) {
          gene_mutation_type['gene_mutation_type[EGFR]'] = 'on'
        }
        for (const type in values.gene_mutation_type) {
          if (values.gene_mutation_type[type] === true) {
            gene_mutation_type[`gene_mutation_type[${type}]`] = 'on'
          }
        }
        values.gene_mutation_type = gene_mutation_type
        // 重构transfer_site
        const transfer_site = {}

        transfer_site['transfer_site[其他]_other'] = values.transfer_site['其他']._other
        if (values.transfer_site['其他']._else) {
          transfer_site['transfer_site[其他]'] = 'on'
        }
        for (const type in values.transfer_site) {
          if (values.transfer_site[type] === true) {
            transfer_site[`transfer_site[${type}]`] = 'on'
          }
        }
        values.transfer_site = transfer_site

        const { dispatch } = this.props
        const sample_id = getSampleId()

        dispatch({
          type: 'crf_first_diagnose/modifyFirstDiagnose',
          payload: { sample_id, body: values }
        }).then(() =>
          dispatch({
            type: 'crf_first_diagnose/fetchFirstDiagnose',
            payload: { sample_id }
          })
        )
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { first_diagnose } = this.props.crf_first_diagnose
    const submitLoading = this.props.loading.effects['crf_first_diagnose/modifyFirstDiagnose']
    const { biopsy_method, tumor_pathological_type, genetic_testing_specimen, tmb } = this.state

    return (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 19, offset: 1 }} onSubmit={this.handleSubmit}>
        <Form.Item label="初诊临床症状">
          <Form.Item style={{ display: 'inline-block' }}>
            {getFieldDecorator('clinical_symptoms[咳嗽]', {
              initialValue: first_diagnose['clinical_symptoms[咳嗽]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>咳嗽</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[咳痰]', {
              initialValue: first_diagnose['clinical_symptoms[咳痰]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>咳痰</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[咳血]', {
              initialValue: first_diagnose['clinical_symptoms[咳血]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>咳血</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[发热]', {
              initialValue: first_diagnose['clinical_symptoms[发热]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>发热</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[胸闷]', {
              initialValue: first_diagnose['clinical_symptoms[胸闷]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>胸闷</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[胸痛]', {
              initialValue: first_diagnose['clinical_symptoms[胸痛]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>胸痛</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[喘气]', {
              initialValue: first_diagnose['clinical_symptoms[喘气]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>喘气</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[消瘦]', {
              initialValue: first_diagnose['clinical_symptoms[消瘦]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>消瘦</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[体重下降]', {
              initialValue: first_diagnose['clinical_symptoms[体重下降]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>体重下降</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[不详]', {
              initialValue: first_diagnose['clinical_symptoms[不详]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>不详</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[其他]_else', {
              initialValue: first_diagnose['clinical_symptoms[其他]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>其他</Checkbox>)}
            <div style={{ display: 'inline-block' }}>
              {getFieldDecorator('clinical_symptoms[其他]_other', {
                initialValue: first_diagnose['clinical_symptoms[其他]_other']
              })(<Input style={{ width: 200 }} placeholder="其他症状" />)}
            </div>
          </Form.Item>
        </Form.Item>
        <Form.Item label="病灶部位">
          {getFieldDecorator('tumor_part', {
            initialValue: first_diagnose.tumor_part
          })(
            <Radio.Group>
              <Radio value={0}>左上肺</Radio>
              <Radio value={1}>左下肺</Radio>
              <Radio value={2}>右上肺</Radio>
              <Radio value={3}>右中肺</Radio>
              <Radio value={4}>右下肺</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="转移部位">
          <Form.Item style={{ display: 'inline-block' }}>
            {getFieldDecorator('transfer_site[无]', {
              initialValue: first_diagnose['transfer_site[无]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>无</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[对侧肺门淋巴结]', {
              initialValue: first_diagnose['transfer_site[对侧肺门淋巴结]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>对侧肺门淋巴结</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[锁骨上淋巴结肺内]', {
              initialValue: first_diagnose['transfer_site[锁骨上淋巴结肺内]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>锁骨上淋巴结肺内</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[肺内]', {
              initialValue: first_diagnose['transfer_site[肺内]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>肺内</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[脑]', {
              initialValue: first_diagnose['transfer_site[脑]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>脑</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[脊柱骨]', {
              initialValue: first_diagnose['transfer_site[脊柱骨]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>脊柱骨</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[四肢骨]', {
              initialValue: first_diagnose['transfer_site[四肢骨]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>四肢骨</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[肝]', {
              initialValue: first_diagnose['transfer_site[肝]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>肝</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[肾上腺]', {
              initialValue: first_diagnose['transfer_site[肾上腺]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>肾上腺</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[其他]_else', {
              initialValue: first_diagnose['transfer_site[其他]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>其他</Checkbox>)}
            <div style={{ display: 'inline-block' }}>
              {getFieldDecorator('transfer_site[其他]_other', {
                initialValue: first_diagnose['transfer_site[其他]_other']
              })(<Input style={{ width: 200 }} placeholder="其他部位" />)}
            </div>
          </Form.Item>
        </Form.Item>
        <Form.Item label="活检方式">
          {getFieldDecorator('biopsy_method', {
            initialValue: first_diagnose.biopsy_method
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
                {biopsy_method === '其他' || (biopsy_method === '' && first_diagnose.biopsy_method === '其他') ? (
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('biopsy_method_other', {
                      initialValue: first_diagnose.biopsy_method_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他方式" />)}
                  </div>
                ) : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="肿瘤病理类型">
          {getFieldDecorator('tumor_pathological_type', {
            initialValue: first_diagnose.tumor_pathological_type
          })(
            <Radio.Group onChange={e => this.handleStateChange('tumor_pathological_type', e)}>
              <Radio value="腺癌">腺癌</Radio>
              <Radio value="鳞癌">鳞癌</Radio>
              <Radio value="小细胞肺癌">小细胞肺癌</Radio>
              <Radio value="大细胞癌">大细胞癌</Radio>
              <Radio value="神经内分泌癌">神经内分泌癌</Radio>
              <Radio value="肉瘤">肉瘤</Radio>
              <Radio value="分化差的癌">分化差的癌</Radio>
              <Radio value="混合型癌">
                混合型癌
                {tumor_pathological_type === '混合型癌' ||
                (tumor_pathological_type === '' && first_diagnose.tumor_pathological_type === '混合型癌') ? (
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('tumor_pathological_type_other', {
                      initialValue: first_diagnose.tumor_pathological_type_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他类型" />)}
                  </div>
                ) : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="基因检测标本">
          {getFieldDecorator('genetic_testing_specimen', {
            initialValue: first_diagnose.genetic_testing_specimen
          })(
            <Radio.Group onChange={e => this.handleStateChange('genetic_testing_specimen', e)}>
              <Radio value="无">无</Radio>
              <Radio value="外周血">外周血</Radio>
              <Radio value="原发灶组织">原发灶组织</Radio>
              <Radio value="转移灶组织">
                转移灶组织
                {genetic_testing_specimen === '转移灶组织' ||
                (genetic_testing_specimen === '' && first_diagnose.genetic_testing_specimen === '转移灶组织') ? (
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('genetic_testing_specimen_other', {
                      initialValue: first_diagnose.genetic_testing_specimen_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他标本" />)}
                  </div>
                ) : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="基因检测方法">
          {getFieldDecorator('genetic_testing_method', {
            initialValue: first_diagnose.genetic_testing_method
          })(
            <Radio.Group>
              <Radio value={0}>无</Radio>
              <Radio value={1}>ARMS</Radio>
              <Radio value={2}>FISH</Radio>
              <Radio value={3}>NGS</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="基因突变类型">
          <Form.Item style={{ display: 'inline-block' }}>
            {getFieldDecorator('gene_mutation_type[未测]', {
              initialValue: first_diagnose['gene_mutation_type[未测]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>未测</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[不详]', {
              initialValue: first_diagnose['gene_mutation_type[不详]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>不详</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[无突变]', {
              initialValue: first_diagnose['gene_mutation_type[无突变]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>无突变</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[ROS-1]', {
              initialValue: first_diagnose['gene_mutation_type[ROS-1]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>ROS-1</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[cMET]', {
              initialValue: first_diagnose['gene_mutation_type[cMET]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>cMET</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[BRAF]', {
              initialValue: first_diagnose['gene_mutation_type[BRAF]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>BRAF</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[KRAS]', {
              initialValue: first_diagnose['gene_mutation_type[KRAS]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>KRAS</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[Her-2]', {
              initialValue: first_diagnose['gene_mutation_type[Her-2]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>Her-2</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[RET]', {
              initialValue: first_diagnose['gene_mutation_type[RET]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>RET</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[ERBB2]', {
              initialValue: first_diagnose['gene_mutation_type[ERBB2]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>ERBB2</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[TP53]', {
              initialValue: first_diagnose['gene_mutation_type[TP53]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>TP53</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[EGFR]_EGFR', {
              initialValue: first_diagnose['gene_mutation_type[EGFR]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>EGFR</Checkbox>)}
            <div style={{ display: 'inline-block' }}>
              {getFieldDecorator('gene_mutation_type[EGFR]_other', {
                initialValue: first_diagnose['gene_mutation_type[EGFR]_other']
              })(<Input style={{ width: 200 }} placeholder="EGFR描述" />)}
            </div>
          </Form.Item>
          <Form.Item style={{ display: 'inline-block', marginLeft: '20px' }}>
            {getFieldDecorator('gene_mutation_type[ALK]_ALK', {
              initialValue: first_diagnose['gene_mutation_type[ALK]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>ALK</Checkbox>)}
            <div style={{ display: 'inline-block' }}>
              {getFieldDecorator('gene_mutation_type[ALK]_other', {
                initialValue: first_diagnose['gene_mutation_type[ALK]_other']
              })(<Input style={{ width: 200 }} placeholder="ALK描述" />)}
            </div>
          </Form.Item>
        </Form.Item>
        <Form.Item label="PD-L1表达">
          {getFieldDecorator('pdl1', {
            initialValue: first_diagnose.pdl1
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
            initialValue: first_diagnose.tmb
          })(
            <Radio.Group onChange={e => this.handleStateChange('tmb', e)}>
              <Radio value="未测">未测</Radio>
              <Radio value="不详">不详</Radio>
              <Radio value="其他">
                数量(个突变/Mb)
                {tmb === '其他' || (tmb === '' && first_diagnose.tmb === '其他') ? (
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('tmb_other', {
                      initialValue: first_diagnose.tmb_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="tmb数量" />)}
                  </div>
                ) : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="微卫星不稳定性(MSI)">
          {getFieldDecorator('msi', {
            initialValue: first_diagnose.msi
          })(
            <Radio.Group>
              <Radio value={0}>未测</Radio>
              <Radio value={1}>不详</Radio>
              <Radio value={2}>微卫星稳定型</Radio>
              <Radio value={3}>微卫星不稳定型</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Col offset={5}>
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

export default connect(mapStateToProps)(Form.create()(FirstDiag))
