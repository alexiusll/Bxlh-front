import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import router from 'umi/router'
import { Button, Divider, Icon, Row, Col, Menu, Spin, Modal, message } from 'antd'
import FirstDiagnose from './components/FirstDiagnose'
import CycleRecord from './components/CycleRecord'
import InterviewTable from './components/InterviewTable'
import SummaryTable from './components/SummaryTable'
import { getSampleId } from '@/utils/location'
import styles from './style.css'
import CookieUtil from '../../utils/cookie'

const { SubMenu } = Menu

class CRFDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedKeys: ['first_diagnose']
    }
  }

  static propTypes = {
    crf_info: PropTypes.object.isRequired,
    nav_info: PropTypes.array.isRequired,
    research_center_info: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props
    const sample_id = getSampleId()

    dispatch({
      type: 'crfBase/fetchCrfInfo',
      payload: { sample_id }
    })
    dispatch({
      type: 'crfBase/fetchNavInfo',
      payload: { sample_id }
    })
    dispatch({
      type: 'crfBase/fetchCycleStatus',
      payload: { sample_id }
    })
    dispatch({
      type: 'global/fetchResearchCenters'
    })
  }

  handleMenuClick = ({ keyPath }) => {
    const { dispatch } = this.props
    const sample_id = getSampleId()

    if (keyPath[0] === 'add') {
      dispatch({
        type: 'crfBase/addCycle',
        payload: { sample_id, is_stopped_cycle: 0 }
      })
        .then(() =>
          dispatch({
            type: 'crfBase/fetchNavInfo',
            payload: { sample_id }
          })
        )
        .then(() => {
          const { nav_info } = this.props

          this.setState({
            selectedKeys: [`${nav_info.length + 1}`, 'cycle_record']
          })
        })
      return
    }

    if (keyPath[0] === 'delete') {
      const { nav_info } = this.props

      if (nav_info && nav_info.length === 0) {
        message.warning('暂无访视！')
        return
      }
      const { cycle_number } = nav_info[nav_info.length - 1]

      Modal.confirm({
        title: `请问是否确认删除访视${cycle_number}？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () =>
          new Promise(resolve => {
            dispatch({
              type: 'crfBase/deleteCycle',
              payload: { sample_id }
            }).then(() => {
              resolve()
              dispatch({
                type: 'crfBase/fetchNavInfo',
                payload: { sample_id }
              })
            })
          })
      })
      return
    }
    this.setState({ selectedKeys: keyPath })
  }

  render() {
    const { description, patient_name, project_ids, research_center_ids, group_name, patient_ids } = this.props.crf_info
    const { nav_info, research_center_info } = this.props
    const { selectedKeys } = this.state
    const menuLoading = this.props.loading.effects['crfBase/fetchNavInfo']
    const infoLoading = this.props.loading.effects['crfBase/fetchCrfInfo']

    this.research_center_id = JSON.parse(CookieUtil.get('userInfo')).research_center_id
    this.research_center_name = ''
    let IsSameRc = false

    for (const item of research_center_info) {
      if (item.id === this.research_center_id) {
        this.research_center_name = item.name
        break
      }
    }

    if (this.research_center_name === research_center_ids) {
      IsSameRc = true
    } else {
      IsSameRc = false
    }

    // 接口正确后删除
    IsSameRc = true

    // console.log('research_center_id', this.research_center_id)
    // console.log('research_center_name', this.research_center_name)
    // console.log('research_center_ids', research_center_ids)
    // console.log('nav_info', nav_info)
    // console.log('selectedKeys', selectedKeys)
    let crf_body

    if (selectedKeys[0] === 'first_diagnose') {
      crf_body = <FirstDiagnose />
    } else if (selectedKeys[1] === 'cycle_record') {
      crf_body = (
        <CycleRecord
          cycle_number={selectedKeys[0] === '-1' ? nav_info.length + 1 : parseInt(selectedKeys[0], 10)}
          key={selectedKeys[0] === '-1' ? '-1' : parseInt(selectedKeys[0], 10)}
        />
      )
    } else if (selectedKeys[0] === 'interview_table') {
      crf_body = <InterviewTable />
    } else if (selectedKeys[0] === 'summary_table') {
      crf_body = <SummaryTable />
    } else if (selectedKeys[0] === 'cycle_end_record') {
      crf_body = <CycleRecord cycle_number={0} key={0} />
    }

    return (
      <>
        <Row type="flex" align="middle">
          <Col>
            <Button type="primary" onClick={router.goBack}>
              <Icon type="left" />
              返回
            </Button>
          </Col>
          <Col>
            <div className={styles.crf_info}>
              <Spin spinning={infoLoading}>
                <div>
                  {description}&nbsp;&nbsp;&nbsp; 编号：{project_ids}
                  &nbsp;&nbsp;&nbsp; 负责单位：{research_center_ids}
                </div>
                <div>
                  受试者姓名：{patient_name}&nbsp;&nbsp;&nbsp; 受试者编号：
                  {patient_ids}&nbsp;&nbsp;&nbsp; 组别：{group_name}
                  &nbsp;&nbsp;&nbsp; 研究中心：{research_center_ids}
                </div>
              </Spin>
            </div>
          </Col>
        </Row>
        <Divider />
        <div className={styles.crf_content}>
          <div className={styles.crf_aside}>
            <Spin spinning={menuLoading}>
              <Menu
                mode="inline"
                defaultOpenKeys={['cycle_record']}
                selectedKeys={selectedKeys}
                onClick={this.handleMenuClick}
              >
                <Menu.Item key="first_diagnose">
                  <span>
                    <Icon type="align-right" />
                    基线资料（访视1）
                  </span>
                </Menu.Item>
                <SubMenu
                  key="cycle_record"
                  title={
                    <span>
                      <Icon type="dashboard" />
                      治疗期随访
                    </span>
                  }
                >
                  {nav_info.map(child => (
                    <Menu.Item key={child.cycle_number}>
                      <span>{child.title}</span>
                    </Menu.Item>
                  ))}
                  {IsSameRc ? (
                    <Menu.Item key="add" disabled={!IsSameRc}>
                      <span style={{ color: '#39bbdb' }}>
                        新增&nbsp;&nbsp;
                        <Icon type="file-add" />
                      </span>
                    </Menu.Item>
                  ) : (
                    <></>
                  )}
                  {IsSameRc ? (
                    <Menu.Item key="delete" disabled={!IsSameRc}>
                      <span style={{ color: '#faad14' }}>
                        删除&nbsp;&nbsp;
                        <Icon type="delete" />
                      </span>
                    </Menu.Item>
                  ) : (
                    <></>
                  )}{' '}
                </SubMenu>
                <Menu.Item key="cycle_end_record">
                  <span>
                    <Icon type="dashboard" />
                    治疗期终止随访
                  </span>
                </Menu.Item>
                <Menu.Item key="interview_table">
                  <span>
                    <Icon type="hourglass" />
                    生存期随访
                  </span>
                </Menu.Item>
                <Menu.Item key="summary_table">
                  <span>
                    <Icon type="file-text" />
                    项目总结
                  </span>
                </Menu.Item>
              </Menu>
            </Spin>
          </div>
          <div className={styles.crf_body}>
            <div className="page_body">{crf_body}</div>
          </div>
        </div>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    crf_info: state.crfBase.crf_info,
    nav_info: state.crfBase.nav_info,
    research_center_info: state.global.research_center_info,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(CRFDetail)
