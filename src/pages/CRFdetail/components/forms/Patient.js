import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Col, Form, DatePicker, Button, Radio, Input, message } from 'antd'
import moment from 'moment'
import { getSampleId } from '@/utils/location'

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20, offset: 1 }
}

// 人口统计学
class Patient extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      marriage: '',
      vocation: '',
      race: ''
    }
    this.marriage_input = React.createRef()
    this.vocation_input = React.createRef()
    this.race_input = React.createRef()
  }

  static propTypes = {
    crf_first_diagnose: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleRaceChange = ({ target: { value } }) => {
    this.props.form.setFieldsValue({ race: value })
    this.setState({ race: value })
  }

  handleMarriageChange = ({ target: { value } }) => {
    this.props.form.setFieldsValue({ marriage: value })
    this.setState({ marriage: value })
  }

  handleVocationChange = ({ target: { value } }) => {
    this.props.form.setFieldsValue({ vocation: value })
    this.setState({ vocation: value })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props

        if (values.id_num && !/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(values.id_num)) {
          message.error('身份证号不合法，请重新输入！')
          return
        }

        for (const type of ['race', 'marriage', 'vocation']) {
          if (values[type] === '其他') {
            values[`${type}_other`] = this[`${type}_input`].current.input.value
          }
        }
        if (values.date) values.date = values.date.format('YYYY-MM-DD')
        const sample_id = getSampleId()

        dispatch({
          type: 'crf_first_diagnose/modifyPatient',
          payload: { sample_id, body: values }
        }).then(() =>
          dispatch({
            type: 'crf_first_diagnose/fetchPatient',
            payload: { sample_id }
          })
        )
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { patient } = this.props.crf_first_diagnose
    const submitLoading = this.props.loading.effects['crf_first_diagnose/modifyPatient']
    const { marriage, vocation, race } = this.state

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="性别">
          {getFieldDecorator('sex', {
            initialValue: patient.sex
          })(
            <Radio.Group>
              <Radio value={0}>男</Radio>
              <Radio value={1}>女</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="出生日期">
          {getFieldDecorator('date', {
            initialValue: patient.date ? moment(patient.date, 'YYYY-MM-DD') : null
          })(<DatePicker format="YYYY-MM-DD" />)}
        </Form.Item>
        <Form.Item label="人种">
          {getFieldDecorator('race', {
            initialValue: patient.race
          })(
            <Radio.Group onChange={this.handleRaceChange}>
              <Radio value="东方人">东方人</Radio>
              <Radio value="黑人">黑人</Radio>
              <Radio value="白人">白人</Radio>
              <Radio value="其他">
                其他
                {race === '其他' || (race === '' && patient.race === '其他') ? (
                  <Input ref={this.race_input} style={{ width: 200, marginLeft: 15 }} placeholder="其他人种" />
                ) : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="婚姻情况">
          {getFieldDecorator('marriage', {
            initialValue: patient.marriage
          })(
            <Radio.Group onChange={this.handleMarriageChange}>
              <Radio value="已婚">已婚</Radio>
              <Radio value="未婚">未婚</Radio>
              <Radio value="其他">
                其他
                {marriage === '其他' || (marriage === '' && patient.marriage === '其他') ? (
                  <Input ref={this.marriage_input} style={{ width: 200, marginLeft: 15 }} placeholder="其他婚姻情况" />
                ) : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="文化程度">
          {getFieldDecorator('degree', {
            initialValue: patient.degree
          })(
            <Radio.Group>
              <Radio value={0}>文盲</Radio>
              <Radio value={1}>小学</Radio>
              <Radio value={2}>初中</Radio>
              <Radio value={3}>中专或高中</Radio>
              <Radio value={4}>大专或本科</Radio>
              <Radio value={5}>本科以上</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="职业">
          {getFieldDecorator('vocation', {
            initialValue: patient.vocation
          })(
            <Radio.Group onChange={this.handleVocationChange}>
              <Radio value="脑力劳动者">脑力劳动者</Radio>
              <Radio value="体力劳动者">体力劳动者</Radio>
              <Radio value="学生">学生</Radio>
              <Radio value="离退休">离退休</Radio>
              <Radio value="无业或失业">无业或失业</Radio>
              <Radio value="其他">
                其他
                {vocation === '其他' || (vocation === '' && patient.vocation === '其他') ? (
                  <Input ref={this.vocation_input} style={{ width: 200, marginLeft: 15 }} placeholder="其他职业情况" />
                ) : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="常住地区">
          {getFieldDecorator('zone', {
            initialValue: patient.zone
          })(
            <Radio.Group>
              <Radio value={0}>城市</Radio>
              <Radio value={1}>农村</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="身份证号">
          {getFieldDecorator('id_num', {
            initialValue: patient.id_num
          })(<Input style={{ width: 250 }} placeholder="请输入身份证号" />)}
        </Form.Item>
        <Form.Item label="住院号">
          {getFieldDecorator('hospital_ids', {
            initialValue: patient.hospital_ids
          })(<Input style={{ width: 250 }} placeholder="请输入住院号" />)}
        </Form.Item>
        <Form.Item label="患者电话">
          {getFieldDecorator('phone', {
            initialValue: patient.phone
          })(<Input style={{ width: 250 }} placeholder="请输入患者电话" />)}
        </Form.Item>
        <Form.Item label="家属电话">
          {getFieldDecorator('family_phone', {
            initialValue: patient.family_phone
          })(<Input style={{ width: 250 }} placeholder="请输入家属电话" />)}
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

export default connect(mapStateToProps)(Form.create()(Patient))
