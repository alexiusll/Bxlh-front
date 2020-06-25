import React from 'react'
import { connect } from 'dva'
import { Link } from 'umi'
import PropTypes from 'prop-types'
import router from 'umi/router'
import {
  Table,
  Layout,
  Button,
  Menu,
  Dropdown,
  Icon,
  Modal,
  Tooltip,
  Row,
  Col,
  Input,
  Popover,
  Select,
  Spin,
  message,
  Pagination,
  Collapse
} from 'antd'
import styles from './style.css'

import CheckTags from '../../components/CheckTags'
import { getProjectId } from '@/utils/location'

import SampleModal from './SampleModal'
import CookieUtil from '@/utils/cookie'

const Content = Layout.Content
const Option = Select.Option
const Panel = Collapse.Panel

class SampleList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: {
        page: 1,
        limit: 20
      },
      // 多选批量导出
      selectedRowKeys: [],
      search_type: 0,
      sample_record: {},
      sample_modal_visible: false
    }
    this.searchInput = React.createRef()
    this.research_center_id = JSON.parse(CookieUtil.get('userInfo')).research_center_id
    this.user_id = JSON.parse(CookieUtil.get('userInfo')).id
    // this.ALTER_can_export = JSON.parse(CookieUtil.get('ALTER_can_export'))
  }

  static propTypes = {
    total: PropTypes.number.isRequired,
    sample_list: PropTypes.array.isRequired,
    sample_info: PropTypes.object.isRequired,
    research_center_info: PropTypes.array.isRequired,
    group_ids_info: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    user_permission: PropTypes.object.isRequired,
    loading: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props
    const project_id = getProjectId()
    dispatch({
      type: 'sample/fetchSampleInfo',
      payload: { project_id }
    })
    dispatch({
      type: 'sample/fetchUserPermission',
      payload: { project_id: project_id, user_id: this.user_id }
    })
    dispatch({
      type: 'global/fetchResearchCenters'
    })
    dispatch({
      type: 'global/fetchPatientGroup'
    })
    this.refreshList()
  }

  refreshList = state => {
    let { status } = this.state
    const { dispatch } = this.props

    if (state) {
      status = { ...status, ...state }
    }

    // tumor_pathological_type不传id传name
    if (status.tumor_pathological_type !== undefined && status.tumor_pathological_type >= 0) {
      const tumor_pathological = [
        '腺癌',
        '鳞癌',
        '小细胞肺癌',
        '大细胞癌',
        '神经内分泌癌',
        '肉瘤',
        '分化差的癌',
        '混合型癌'
      ]

      status.tumor_pathological_type = tumor_pathological[status.tumor_pathological_type]
    }
    dispatch({
      type: 'sample/fetchExpsampleList',
      payload: { body: status, project_id: getProjectId() }
    })
    this.setState({ status })
  }

  handleMenuClick = ({ key }, record) => {
    const { dispatch } = this.props

    switch (key) {
      case 'edit':
        // 编辑操作
        this.setState({
          sample_record: record,
          sample_modal_visible: true
        })
        break
      case 'submit':
        // 如果用户不属于本中心就不能提交本中心的样本
        if (record.research_center_id !== this.research_center_id) {
          message.warning('用户不属于该中心，无法提交')
        }

        // 提交操作
        Modal.confirm({
          title: `是否确认提交编号${record.patient_ids}样本到总中心？`,
          content: '提交之后，将不能再对该样本进行编辑。',
          okText: '确定',
          cancelText: '取消',
          onOk: () =>
            new Promise(resolve => {
              dispatch({
                type: 'sample/submitSample',
                payload: {
                  sample_id: record.sample_id
                }
              }).then(() => {
                resolve()
                this.refreshList()
              })
            })
        })
        break
      case 'unlock':
        // 解锁操作
        Modal.confirm({
          title: `是否确认解锁编号${record.patient_ids}的样本？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () =>
            new Promise(resolve => {
              dispatch({
                type: 'sample/unlockSample',
                payload: {
                  sample_id: record.sample_id
                }
              }).then(() => {
                resolve()
                this.refreshList()
              })
            })
        })
        break
      case 'delete':
        // 删除操作
        Modal.confirm({
          title: `是否确认删除编号${record.patient_ids}样本？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () =>
            new Promise(resolve => {
              dispatch({
                type: 'sample/deleteSample',
                payload: {
                  sample_id: record.sample_id
                }
              }).then(() => {
                resolve()
                this.refreshList()
              })
            })
        })
        break
      default:
        break
    }
  }

  handleCreateSample = () => {
    this.setState({
      sample_record: { sample_id: null, project_id: getProjectId() },
      sample_modal_visible: true
    })
  }

  handleSaveSample = values => {
    const { dispatch } = this.props

    dispatch({
      type: 'sample/createSample',
      payload: values
    }).then(() =>
      this.setState(
        {
          sample_modal_visible: false
        },
        this.refreshList
      )
    )
  }

  handleHideModal = () => {
    this.setState({ sample_modal_visible: false })
  }

  handleChangeSearchType = value => {
    this.setState({ search_type: value })
  }

  handleSearch = value => {
    if (value && value.trim()) {
      let obj = {}
      const { search_type } = this.state

      switch (search_type) {
        case 0:
          obj = { name: value, IDcard: null, patient_ids: null }
          break
        case 1:
          obj = { name: null, IDcard: value, patient_ids: null }
          break
        case 2:
          obj = { name: null, IDcard: null, patient_ids: value }
          break
        default:
          break
      }
      this.refreshList(obj)
    }
  }

  handleChangeStatus = id => {
    switch (id) {
      case null:
        this.refreshList({ submit_status: null, page: 1 })
        break
      case 0:
        this.refreshList({ submit_status: 0, page: 1 })
        break
      case 1:
        this.refreshList({ submit_status: 1, page: 1 })
        break
      case 2:
        this.refreshList({ submit_status: 2, page: 1 })
        break
      case 3:
        this.refreshList({ submit_status: 3, page: 1 })
        break
      default:
        break
    }
  }

  resetList = () => {
    // 清空输入框
    this.searchInput.current.input.state.value = ''
    this.refreshList({ name: null, IDcard: null, patient_ids: null, page: 1 })
  }

  handleExported = () => {
    const { dispatch } = this.props
    const { selectedRowKeys } = this.state

    dispatch({
      type: 'sample/downloadSample',
      payload: {
        sample_id_list: selectedRowKeys
      }
    })
  }

  columns = [
    {
      title: '研究中心',
      dataIndex: 'research_center_ids',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '编号',
      dataIndex: 'patient_ids',
      align: 'center',
      width: 90,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '姓名',
      dataIndex: 'patient_name',
      align: 'center',
      width: 80,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '身份证号',
      dataIndex: 'id_num',
      align: 'center',
      width: 130,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '组别',
      dataIndex: 'group_name',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
      width: 50
    },
    {
      title: '年龄',
      dataIndex: 'age',
      align: 'center',
      width: 50
    },
    {
      title: '随访进度',
      dataIndex: 'interview_status',
      align: 'center',
      width: 80,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '上一次随访时间',
      dataIndex: 'last_interview_time',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '预计下一次随访时间',
      dataIndex: 'next_interview_time',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '状态',
      dataIndex: 'submit_status',
      align: 'center',
      width: 80,
      render: (submit_status, record) => {
        // 记录生存期随访提交条数
        let interviews = 0

        // 记录治疗期访视提交条数

        record.status.interview_status.forEach(i => {
          if (i.is_submit === 1) interviews++
        })

        // 获得最大的治疗期访视
        let max_cycle_submit = -1
        record.status.cycle_status.forEach((i, index) => {
          if (i.is_submit === 1 && index != 0) max_cycle_submit = index
        })

        const content = (
          <>
            <div>
              基线资料：
              {record.status.cycle_status[0].is_submit === 1 ? (
                <span style={{ color: '#52c41a' }}>已提交</span>
              ) : (
                <span style={{ color: '#faad14' }}>未提交</span>
              )}
            </div>
            <div>
              治疗期访视：
              {max_cycle_submit == -1 ? (
                <span style={{ color: '#faad14' }}>未提交</span>
              ) : (
                <span style={{ color: '#52c41a' }}>访视{max_cycle_submit + 1}已提交</span>
              )}
            </div>
            <div>
              生存期访视：
              {interviews === 0 ? (
                <span style={{ color: '#faad14' }}>未提交</span>
              ) : (
                <span style={{ color: '#52c41a' }}>{interviews}条</span>
              )}
            </div>
          </>
        )

        if (submit_status === 2) {
          return (
            <Popover content={content} title="访视提交详情">
              <span style={{ color: '#52c41a' }}>已提交</span>
            </Popover>
          )
        } else if (submit_status === 3) {
          return (
            <Popover content={content} title="访视提交详情">
              <span style={{ color: '#1890ff' }}>已解锁</span>
            </Popover>
          )
        }

        // 如果基线资料没提交，为未提交状态
        if (submit_status === 0) {
          return (
            <Popover content={content} title="访视提交详情">
              <span style={{ color: '#faad14' }}>未提交</span>
            </Popover>
          )
        } else if (submit_status === 1) {
          return (
            <Popover content={content} title="访视提交详情">
              <span style={{ color: '#faad14' }}>部分提交</span>
            </Popover>
          )
        }
      }
    },
    {
      title: '操作',
      align: 'center',
      width: 80,
      render: (_, record) => {
        const disabled = record.submit_status === 2
        const is_center = this.research_center_id === 12
        const { user_permission } = this.props

        // 部分提交 或 已提交 不可以编辑
        // 总中心可以自己提交，不可以提交分中心， 分中心可以自己提交
        // 总中心只可以解锁已锁定的项目
        return (
          <Dropdown
            overlay={
              <Menu onClick={e => this.handleMenuClick(e, record)}>
                <Menu.Item key="edit" disabled={record.submit_status === 1 || disabled}>
                  编辑
                </Menu.Item>
                <Menu.Item
                  key="submit"
                  disabled={(is_center ? record.research_center_id !== 12 : disabled) || record.submit_status === 2}
                >
                  提交
                </Menu.Item>
                <Menu.Item
                  style={{ display: is_center ? 'block' : 'none' }}
                  disabled={(record.submit_status !== 1 && record.submit_status !== 2) || !user_permission.can_unlock}
                  key="unlock"
                >
                  解锁
                </Menu.Item>
                <Menu.Item key="delete" disabled={disabled}>
                  删除
                </Menu.Item>
              </Menu>
            }
          >
            <Button type="primary" size="small">
              <Link to={`/sample/${record.sample_id}/crf`}>
                详情
                <Icon type="down" />
              </Link>
              {/* <a href={`/p2/#/sample/${record.sample_id}/crf`}>
                详情
                <Icon type="down" />
              </a> */}
            </Button>
          </Dropdown>
        )
      }
    }
  ]

  selectBefore = (
    <Select defaultValue={0} style={{ width: '100px' }} onChange={this.handleChangeSearchType}>
      <Option value={0}>姓名</Option>
      <Option value={1}>身份证号</Option>
      <Option value={2}>编号</Option>
    </Select>
  )

  // 选择多选进行导出
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys })
  }

  render() {
    const {
      total,
      sample_info,
      sample_list,
      research_center_info,
      group_ids_info,
      loading,
      user_permission
    } = this.props
    const { page, limit } = this.state.status
    const { selectedRowKeys } = this.state
    const tableLoading = loading.effects['sample/fetchExpsampleList']
    const infoLoading = loading.effects['sample/fetchSampleInfo']
    const filterLoading = loading.effects['global/fetchResearchCenters'] || loading.effects['global/fetchPatientGroup']
    // console.log(sample_list)
    const filterList = [
      {
        text: '患者组别：',
        render: (
          <CheckTags
            itemList={[{ id: -1, name: '全部' }, ...group_ids_info]}
            handleChange={id => this.refreshList({ group_id: id, page: 1 })}
          />
        )
      },
      {
        text: '肿瘤病理类型：',
        render: (
          <CheckTags
            itemList={[
              { id: -1, name: '全部' },
              { id: 0, name: '腺癌' },
              // { id: 1, name: '鳞癌' },
              // { id: 2, name: '小细胞肺癌' },
              // { id: 3, name: '大细胞癌' },
              // { id: 4, name: '神经内分泌癌' },
              // { id: 5, name: '肉瘤' },
              // { id: 6, name: '分化差的癌' },
              { id: 7, name: '其他' }
            ]}
            handleChange={id => this.refreshList({ tumor_pathological_type: id, page: 1 })}
          />
        )
      },
      {
        text: '患者性别：',
        render: (
          <CheckTags
            itemList={[
              { id: -1, name: '全部' },
              { id: 0, name: '男' },
              { id: 1, name: '女' }
            ]}
            handleChange={id => this.refreshList({ sex: id, page: 1 })}
          />
        )
      },
      {
        text: '样本状态：',
        render: (
          <CheckTags
            itemList={[
              { id: -1, name: '全部' },
              { id: 0, name: '未提交' },
              { id: 1, name: '部分提交' },
              { id: 2, name: '已提交' },
              { id: 3, name: '已解锁' }
            ]}
            handleChange={this.handleChangeStatus}
          />
        )
      }
    ]

    if (this.research_center_id === 12) {
      filterList.unshift({
        text: '研究中心：',
        render: (
          <CheckTags
            itemList={[{ id: -1, name: '全部' }, ...research_center_info]}
            handleChange={id => this.refreshList({ research_center_id: id, page: 1 })}
          />
        )
      })
    }

    // console.log(sample_info)
    // console.log('research_center_info', research_center_info)
    let research_center_ids = ''
    for (const item of research_center_info) {
      if (item.id === sample_info.research_center_id) {
        research_center_ids = item.name
      }
    }

    return (
      <>
        <Row type="flex" align="middle">
          <Col>
            <Button type="primary" onClick={router.goBack}>
              <a href="/#/project">
                <Icon type="left" />
                返回
              </a>
            </Button>
          </Col>
          <Col>
            <Spin spinning={infoLoading}>
              <div className={styles.sample_info}>
                {sample_info.project_des}&nbsp;&nbsp;&nbsp; 编号：
                {sample_info.project_ids}&nbsp;&nbsp;&nbsp; 负责单位：
                {research_center_ids}
              </div>
            </Spin>
          </Col>
        </Row>
        <Content>
          <Spin spinning={filterLoading}>
            <Collapse className="filter_collapse">
              <Panel header={<span style={{ color: '#39bbdb' }}>展开筛选项</span>} key="1">
                {filterList.map(item => (
                  <Row className={styles.filterLine} key={item.text}>
                    <Col span={3} className={styles.filterLineLeft}>
                      {item.text}
                    </Col>
                    <Col span={21}>{item.render}</Col>
                  </Row>
                ))}
              </Panel>
            </Collapse>
          </Spin>
        </Content>
        <div className="page_body">
          <Row type="flex" align="middle" justify="space-between">
            <Col span={16} className={styles.project_search}>
              <Row type="flex" align="middle">
                <Col span={12}>
                  <Input.Search
                    ref={this.searchInput}
                    addonBefore={this.selectBefore}
                    placeholder="请输入搜索内容"
                    size="large"
                    enterButton
                    onSearch={this.handleSearch}
                  />
                </Col>
                <Col offset={1}>
                  <Tooltip title="清空输入项">
                    <Button onClick={this.resetList} shape="circle" loading={tableLoading} icon="sync"></Button>
                  </Tooltip>
                </Col>
                <Col offset={1}>
                  <Button
                    type="primary"
                    disabled={selectedRowKeys.length === 0 || !user_permission.can_export}
                    onClick={this.handleExported}
                  >
                    <Icon type="download" />
                    导出样本
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col>
              <span
                className={styles.bannerText}
                style={{
                  display: tableLoading ? 'none' : 'inline-block'
                }}
              >
                共{total}个样本
              </span>
              <Button type="primary" onClick={this.handleCreateSample}>
                <Icon type="plus" />
                添加样本
              </Button>
            </Col>
          </Row>
        </div>
        <Table
          loading={tableLoading}
          rowSelection={{
            selectedRowKeys,
            onChange: this.onSelectChange
          }}
          className={`${styles.sample_table} page_body`}
          rowKey={'sample_id'}
          size="small"
          bordered={true}
          pagination={false}
          scroll={{ x: 1080 }}
          columns={this.columns}
          dataSource={sample_list}
        />
        <Pagination
          pageSize={limit}
          style={{ marginTop: '15px', marginBottom: '30px' }}
          current={page}
          total={total}
          onChange={page => this.refreshList({ page })}
        />
        <SampleModal
          record={this.state.sample_record}
          visible={this.state.sample_modal_visible}
          handleSaveSample={this.handleSaveSample}
          onCancel={this.handleHideModal}
        />
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    total: state.sample.total,
    sample_list: state.sample.sample_list,
    sample_info: state.sample.sample_info,
    research_center_info: state.global.research_center_info,
    group_ids_info: state.global.group_ids_info,
    user_permission: state.sample.user_permission,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(SampleList)
