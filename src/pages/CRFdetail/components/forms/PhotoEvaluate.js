import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Modal, Row, Form, DatePicker, Button, Radio, Input, Table, Spin, Icon, message } from 'antd'
import moment from 'moment'

import UploadFile from '@/components/UploadFile'
import { getSampleId } from '@/utils/location'
import { post_prefix } from '@/utils/request'

import styles from '../../style.css'

// 影像学评估
class PhotoEvaluate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      record: {},
      visible: false,
      file_visible: false,
      evaluate_id: null,
      method: '',
      file_status: 0
    }
  }

  static propTypes = {
    cycle_status: PropTypes.array.isRequired,
    crf_first_diagnose: PropTypes.object.isRequired,
    file_list: PropTypes.array.isRequired,
    cycle_number: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { dispatch, cycle_number } = this.props
    const sample_id = getSampleId()

    dispatch({
      type: 'crf_first_diagnose/fetchPhotoEvaluateTable',
      payload: { sample_id, cycle_number }
    })
  }

  handleDelete = evaluate_id => {
    Modal.confirm({
      title: '请问是否确认删除？',
      okText: '确定',
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch, cycle_number } = this.props
          const sample_id = getSampleId()

          dispatch({
            type: 'crf_first_diagnose/deletePhotoEvaluateTable',
            payload: { sample_id, cycle_number, evaluate_id }
          }).then(() => {
            resolve()
            dispatch({
              type: 'crf_first_diagnose/fetchPhotoEvaluateTable',
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

        // 重构时间
        if (values.time) values.time = values.time.format('YYYY-MM-DD')
        values.evaluate_id = record.evaluate_id

        dispatch({
          type: 'crf_first_diagnose/modifyPhotoEvaluateTable',
          payload: { sample_id, cycle_number, body: values }
        }).then(() => {
          this.setState({ visible: false })
          dispatch({
            type: 'crf_first_diagnose/fetchPhotoEvaluateTable',
            payload: { sample_id, cycle_number }
          })
        })
      }
    })
  }

  handleEditModel = record => {
    this.setState({ record, visible: true })
  }

  handleCancel = () => {
    this.setState({ visible: false, file_visible: false })
  }

  handleStateChange = (type, { target: { value } }) => {
    this.setState({ [type]: value })
  }

  openFileModel = evaluate_id => {
    const { dispatch, cycle_number } = this.props
    const sample_id = getSampleId()

    this.setState({ file_visible: true, evaluate_id })
    dispatch({
      type: 'crfBase/fetchPhotoFileList',
      payload: { sample_id, cycle_number, evaluate_id }
    })
  }

  handleDeleteFile = file_path => {
    const { dispatch } = this.props

    this.setState({ file_status: 2 })
    dispatch({
      type: 'global/deleteFile',
      payload: { file_path }
    }).then(() => {
      this.setState({ file_status: 0 })
      const { dispatch, cycle_number } = this.props
      const { evaluate_id } = this.state
      const sample_id = getSampleId()

      dispatch({
        type: 'crfBase/fetchPhotoFileList',
        payload: { sample_id, cycle_number, evaluate_id }
      })
    })
  }

  handleStatusChange = (status, name) => {
    if (status === 'uploading') {
      this.setState({ file_status: 1 })
    } else if (status === 'done') {
      message.success(`${name} 上传成功！`)
      this.setState({ file_status: 0 })
      const { dispatch, cycle_number } = this.props
      const { evaluate_id } = this.state
      const sample_id = getSampleId()

      dispatch({
        type: 'crfBase/fetchPhotoFileList',
        payload: { sample_id, cycle_number, evaluate_id }
      })
    } else if (status === 'error') {
      message.error(`${name} 上传失败！`)
      this.setState({ file_status: 0 })
    }
  }

  columns = [
    {
      title: '部位',
      dataIndex: 'part',
      align: 'center'
    },
    {
      title: '方法',
      dataIndex: 'method',
      align: 'center'
    },
    {
      title: '肿瘤长径(cm)',
      dataIndex: 'tumor_long',
      align: 'center'
    },
    {
      title: '肿瘤短径(cm)',
      dataIndex: 'tumor_short',
      align: 'center'
    },
    {
      title: '时间',
      dataIndex: 'time',
      align: 'center'
    },
    {
      title: '肿瘤描述',
      dataIndex: 'tumor_desc',
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
            type="primary"
            size="small"
            onClick={() => this.openFileModel(record.evaluate_id)}
          >
            文件
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            type="danger"
            size="small"
            onClick={() => this.handleDelete(record.evaluate_id)}
          >
            删除
          </Button>
        </>
      )
    }
  ]

  render() {
    const { getFieldDecorator } = this.props.form
    const { photo_evaluate_table } = this.props.crf_first_diagnose
    const { file_list, cycle_status, cycle_number, loading } = this.props

    const { record, evaluate_id, visible, file_visible, method, file_status } = this.state

    const tableLoading = loading.effects['crf_first_diagnose/fetchPhotoEvaluateTable']
    const file_tableLoading = loading.effects['crfBase/fetchPhotoFileList']
    const submitLoading = loading.effects['crf_first_diagnose/modifyPhotoEvaluateTable']

    const action = `/photo_evaluate/file/${getSampleId()}/${cycle_number}/${evaluate_id}`

    const file_columns = [
      {
        title: '文件名',
        dataIndex: 'file_name',
        align: 'center'
      },
      {
        title: '创建日期',
        dataIndex: 'file_ctime',
        align: 'center'
      },
      {
        title: '文件大小',
        dataIndex: 'file_size',
        align: 'center'
      },
      {
        title: '操作',
        align: 'center',
        render: (_, record) => (
          <>
            <Button type="primary" size="small">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${post_prefix}/static/tempFiles${record.file_path.substring(1)}`}
              >
                查看
              </a>
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              type="danger"
              size="small"
              onClick={() => this.handleDeleteFile(record.file_path)}
            >
              删除
            </Button>
          </>
        )
      }
    ]

    return (
      <>
        <Button type="primary" onClick={() => this.handleEditModel({ evaluate_id: null })}>
          添加
        </Button>
        <Table
          loading={tableLoading}
          className={styles.patient_report_table}
          rowKey="evaluate_id"
          size="small"
          bordered
          pagination={false}
          scroll={{ x: true }}
          columns={this.columns}
          dataSource={photo_evaluate_table}
        />
        <Modal
          title="文件列表"
          className={styles.file_modal}
          visible={file_visible}
          destroyOnClose
          onCancel={this.handleCancel}
          centered
          footer={null}
        >
          <div className={styles.file_tip}>*上传文件名相同的文件会被覆盖</div>
          <Spin spinning={file_status !== 0} tip={file_status === 1 ? '文件上传中...' : '文件删除中...'}>
            <Table
              loading={file_tableLoading}
              rowKey="file_path"
              size="small"
              bordered
              pagination={false}
              columns={file_columns}
              dataSource={file_list}
              locale={{
                emptyText: (
                  <UploadFile
                    cycle_status={cycle_status}
                    cycle_number={cycle_number}
                    multiple={true}
                    action={action}
                    handleStatusChange={this.handleStatusChange}
                  >
                    <span className={styles.download_text}>暂无文件，点击上传</span>
                  </UploadFile>
                )
              }}
            />
            <div className={styles.inline_upload} style={{ display: file_list.length !== 0 ? 'block' : 'none' }}>
              <UploadFile
                cycle_status={cycle_status}
                cycle_number={cycle_number}
                multiple={true}
                action={action}
                handleStatusChange={this.handleStatusChange}
              >
                <Button>
                  <Icon type="upload" />
                  点击上传
                </Button>
              </UploadFile>
            </div>
          </Spin>
        </Modal>
        <Modal
          title="编辑影像学评估"
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
            <Form.Item label="部位">
              {getFieldDecorator('part', {
                initialValue: record.part
              })(<Input style={{ width: '250px' }} placeholder="请输入部位" />)}
            </Form.Item>
            <Form.Item label="方法">
              {getFieldDecorator('method', {
                initialValue: record.method
              })(
                <Radio.Group onChange={e => this.handleStateChange('method', e)}>
                  <Radio value="CT">CT</Radio>
                  <Radio value="MRI">MRI</Radio>
                  <Radio value="超声">超声</Radio>
                  <Radio value="X线平片">X线平片</Radio>
                  <Radio value="PET-CT">PET-CT</Radio>
                  <Radio value="其他">
                    数量(个突变/Mb)
                    {method === '其他' || (method === '' && record.method === '其他') ? (
                      <div style={{ display: 'inline-block' }}>
                        {getFieldDecorator('method_other', {
                          initialValue: record.method_other
                        })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="请输入数量" />)}
                      </div>
                    ) : null}
                  </Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="肿瘤长径(cm)">
              {getFieldDecorator('tumor_long', {
                initialValue: record.tumor_long
              })(<Input style={{ width: '250px' }} type="number" placeholder="请输入肿瘤长径(cm)" />)}
            </Form.Item>
            <Form.Item label="肿瘤短径(cm)">
              {getFieldDecorator('tumor_short', {
                initialValue: record.tumor_short
              })(<Input style={{ width: '250px' }} type="number" placeholder="请输入肿瘤短径(cm)" />)}
            </Form.Item>
            <Form.Item label="时间">
              {getFieldDecorator('time', {
                initialValue: record.time ? moment(record.time, 'YYYY-MM-DD') : null
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
            <Form.Item label="肿瘤描述">
              {getFieldDecorator('tumor_desc', {
                initialValue: record.tumor_desc
              })(<Input style={{ width: '250px' }} placeholder="请输入肿瘤描述" />)}
            </Form.Item>
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
    cycle_status: state.crfBase.cycle_status,
    crf_first_diagnose: state.crf_first_diagnose,
    file_list: state.crfBase.file_list,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(PhotoEvaluate))
