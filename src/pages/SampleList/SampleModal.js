import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal, Form, Input, Select, Button, Radio, DatePicker, Divider } from 'antd'

import { disabledDateAfterToday } from '@/utils/util'
import styles from './style.css'
import CookieUtil from '@/utils/cookie'

const { Option } = Select

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17, offset: 1 }
}

class SampleModal extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props)
  }
  static propTypes = {
    record: PropTypes.object.isRequired,
    research_center_info: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    handleSaveSample: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { record, handleSaveSample } = this.props

        for (let type of ['date', 'in_group_time', 'sign_time']) {
          if (values[type]) {
            values[type] = values[type].format('YYYY-MM-DD')
          }
        }
        if (values.sex === '女') {
          values.sex = 1
        } else if (values.sex === '男') {
          values.sex = 0
        }
        values.sample_id = record.sample_id
        values.project_id = record.project_id
        handleSaveSample(values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const submitLoading = this.props.loading.effects['sample/createSample']
    const { record, visible, onCancel, research_center_info } = this.props
    const { research_center_id } = JSON.parse(CookieUtil.get('userInfo'))

    return (
      <Modal
        className={styles.modal}
        title="编辑样本"
        visible={visible}
        onCancel={onCancel}
        okText="保存"
        cancelText="取消"
        destroyOnClose
        centered
        footer={null}
      >
        <Form className="sample_form" {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="研究中心">
            {getFieldDecorator('research_center_id', {
              initialValue: record.research_center_id || research_center_id,
              rules: [{ required: true, message: '请选择研究中心' }]
            })(
              <Select>
                {research_center_info.map(item => (
                  <Option key={item.id} disabled={item.id !== research_center_id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="患者姓名">
            {getFieldDecorator('patient_name', {
              initialValue: record.patient_name,
              rules: [{ required: true, message: '请输入患者姓名' }]
            })(<Input placeholder="请输入患者姓名" />)}
          </Form.Item>
          <Form.Item label="患者编号">
            {getFieldDecorator('patient_ids', {
              initialValue: record.patient_ids,
              rules: [{ required: true, message: '请输入患者编号' }]
            })(<Input placeholder="请输入患者编号" />)}
          </Form.Item>
          <Form.Item label="患者身份证号">
            {getFieldDecorator('id_num', {
              initialValue: record.id_num,
              rules: [
                { required: true, message: '请输入患者身份证号' },
                { pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式不合法，请重新输入' }
              ]
            })(<Input placeholder="请输入身份证号" />)}
          </Form.Item>
          {/* <Form.Item label="患者组别">
            {getFieldDecorator('group_id', {
              initialValue: record.group_id,
              rules: [{ required: true, message: '请选择患者组别' }]
            })(
              <Select placeholder="请选择患者组别">
                <Option value={1}>安罗替尼</Option>
                <Option value={2}>安罗替尼 + TKI</Option>
                <Option value={3}>安罗替尼 + 化疗</Option>
                <Option value={4}>安罗替尼 + 免疫</Option>
                <Option value={5}>其他</Option>
              </Select>
            )}
          </Form.Item> */}
          <Form.Item label="性别">
            {getFieldDecorator('sex', {
              initialValue: record.sex,
              rules: [{ required: true, message: '请选择性别' }]
            })(
              <Radio.Group
                options={[
                  { label: '男性', value: '男' },
                  { label: '女性', value: '女' }
                ]}
              />
            )}
          </Form.Item>
          <Form.Item label="出生日期">
            {getFieldDecorator('date', {
              initialValue: record.date ? moment(record.date, 'YYYY-MM-DD') : null,
              rules: [{ required: true, message: '请选择出生日期' }]
            })(<DatePicker format={'YYYY-MM-DD'} disabledDate={disabledDateAfterToday} placeholder="请选择日期" />)}
          </Form.Item>
          <Form.Item label="签署同意书日期">
            {getFieldDecorator('sign_time', {
              initialValue: record.sign_time ? moment(record.sign_time, 'YYYY-MM-DD') : null,
              rules: [{ required: true, message: '请选择签署同意书日期' }]
            })(<DatePicker format={'YYYY-MM-DD'} disabledDate={disabledDateAfterToday} placeholder="请选择日期" />)}
          </Form.Item>
          <Form.Item label="检查日期">
            {getFieldDecorator('in_group_time', {
              initialValue: record.in_group_time ? moment(record.in_group_time, 'YYYY-MM-DD') : null,
              rules: [{ required: true, message: '请选择检查日期' }]
            })(<DatePicker format={'YYYY-MM-DD'} disabledDate={disabledDateAfterToday} placeholder="请选择日期" />)}
          </Form.Item>
          <Divider className={styles.modal_divider} />
          <div className={styles.modal_bottom}>
            <Button className={styles.modal_submit} htmlType="submit" type="primary" loading={submitLoading}>
              保存
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </div>
        </Form>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    research_center_info: state.global.research_center_info,
    loading: state.loading
  }
}

const WrappedSampleModal = Form.create()(SampleModal)

export default connect(mapStateToProps)(WrappedSampleModal)
