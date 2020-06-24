import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Menu } from 'antd'
import CycleTime from './forms/CycleTime'
import MainSymptom from './forms/MainSymptom'
import PhotoEvaluate from './forms/PhotoEvaluate'
import Evaluation from './forms/Evaluation'
import LabInspection from './forms/LabInspection'
import TreatmentRecord from './forms/TreatmentRecord'
import AdverseEvent from './forms/AdverseEvent'
import Sign from './forms/Sign'
import PostCycle from './forms/PostCycle'

import { getSampleId } from '@/utils/location'
import styles from '../style.css'

class CycleRecord extends React.PureComponent {
  state = {
    current: '0'
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    cycle_number: PropTypes.number.isRequired
  }

  componentDidMount() {
    const sample_id = getSampleId()
    const { dispatch, cycle_number } = this.props

    dispatch({
      type: 'crf_cycle_record/fetchMainSymptom',
      payload: { sample_id, cycle_number }
    })
    dispatch({
      type: 'crf_cycle_record/fetchTreatmentRecord',
      payload: { sample_id, cycle_number }
    })
    dispatch({
      type: 'crf_cycle_record/fetchEvaluation',
      payload: { sample_id, cycle_number }
    })
    dispatch({
      type: 'crf_cycle_record/fetchECOG',
      payload: { sample_id, cycle_number }
    })
    dispatch({
      type: 'crf_cycle_record/fetchTreatmentStatusRecord',
      payload: { sample_id, cycle_number }
    })
  }

  handleMenuClick = e => {
    this.setState({
      current: e.key
    })
  }

  render() {
    const { current } = this.state
    const { cycle_number } = this.props

    const menu_content = [
      <CycleTime key={cycle_number} cycle_number={cycle_number} />,
      <MainSymptom key={cycle_number} cycle_number={cycle_number} />,
      <PhotoEvaluate key={cycle_number} cycle_number={cycle_number} />,
      <Evaluation key={cycle_number} cycle_number={cycle_number} />,
      <LabInspection key={cycle_number} cycle_number={cycle_number} />,
      <TreatmentRecord key={cycle_number} cycle_number={cycle_number} />,
      <AdverseEvent key={cycle_number} cycle_number={cycle_number} />,
      <Sign key={cycle_number} cycle_number={cycle_number} />,
      <PostCycle key={cycle_number} cycle_number={cycle_number} />
    ]

    return (
      <div className={styles.menu_div}>
        <Menu className={styles.menu_title} onClick={this.handleMenuClick} selectedKeys={[current]} mode="horizontal">
          <Menu.Item key="0">访视时间</Menu.Item>
          <Menu.Item key="1">主要症状体征</Menu.Item>
          <Menu.Item key="2">影像学评估</Menu.Item>
          <Menu.Item key="3">疗效评价</Menu.Item>
          <Menu.Item key="4">实验室检查</Menu.Item>
          <Menu.Item key="5">治疗记录单</Menu.Item>
          <Menu.Item key="6">不良事件</Menu.Item>
          <Menu.Item key="7">研究者签名</Menu.Item>
          <Menu.Item key="8">访视提交</Menu.Item>
        </Menu>
        <div className={styles.menu_content}>{menu_content[parseInt(current, 10)]}</div>
      </div>
    )
  }
}

export default connect()(CycleRecord)
