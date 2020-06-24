import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Menu } from 'antd'
import CycleTime from './forms/CycleTime'
import Patient from './forms/Patient'
import PatientReport from './forms/PatientReport'
import PatientHistory from './forms/PatientHistory'
import FirstDiag from './forms/FirstDiag'
import DiagnoseHistory from './forms/DiagnoseHistory'
import LabInspection from './forms/LabInspection'
import PhotoEvaluate from './forms/PhotoEvaluate'
import Sign from './forms/Sign'
import PostCycle from './forms/PostCycle'

import { getSampleId } from '@/utils/location'
import styles from '../style.css'

class FirstDiagnose extends React.Component {
  state = {
    current: '0'
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const sample_id = getSampleId()
    const { dispatch } = this.props

    dispatch({
      type: 'crf_first_diagnose/fetchPatient',
      payload: { sample_id }
    })
    dispatch({
      type: 'crf_first_diagnose/fetchPatientHistory',
      payload: { sample_id }
    })
    dispatch({
      type: 'crf_first_diagnose/fetchFirstDiagnose',
      payload: { sample_id }
    })
    dispatch({
      type: 'crf_first_diagnose/fetchDiagnoseHistory',
      payload: { sample_id }
    })
    dispatch({
      type: 'crf_first_diagnose/fetchPatientReportTable',
      payload: { sample_id }
    })
  }

  handleMenuClick = e => {
    this.setState({
      current: e.key
    })
  }

  render() {
    const { current } = this.state

    const menu_content = [
      <CycleTime key={1} cycle_number={1} />,
      <Patient key={1} />,
      <PatientReport key={1} />,
      <PatientHistory key={1} />,
      <FirstDiag key={1} />,
      <DiagnoseHistory key={1} />,
      <LabInspection key={1} cycle_number={1} />,
      <PhotoEvaluate key={1} cycle_number={1} />,
      <Sign key={1} cycle_number={1} />,
      <PostCycle key={1} cycle_number={1} />
    ]

    return (
      <div className={styles.menu_div}>
        <Menu className={styles.menu_title} onClick={this.handleMenuClick} selectedKeys={[current]} mode="horizontal">
          <Menu.Item key="0">访视时间</Menu.Item>
          <Menu.Item key="1">人口统计学</Menu.Item>
          <Menu.Item key="2">体格检查</Menu.Item>
          <Menu.Item key="3">既往史</Menu.Item>
          <Menu.Item key="4">初诊过程</Menu.Item>
          <Menu.Item key="5">治疗史</Menu.Item>
          <Menu.Item key="6">实验室检查 </Menu.Item>
          <Menu.Item key="7">影像学评估</Menu.Item>
          <Menu.Item key="8">研究者签名</Menu.Item>
          <Menu.Item key="9">访视提交</Menu.Item>
        </Menu>
        <div className={styles.menu_content}>{menu_content[parseInt(current, 10)]}</div>
      </div>
    )
  }
}

export default connect()(FirstDiagnose)
