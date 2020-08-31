import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Col, Form, Button, Radio, Input, Checkbox, Table, Row, DatePicker } from 'antd'
import styles from '../../style.css'

const inclusion_criteria_basic = [
  {
    id: 1,
    des: '年龄≥18岁，男女不限'
  },
  {
    id: 2,
    des: '确诊为晚期非鳞非小细胞肺癌且疾病分期按照AJCC第八版为ⅢB，ⅢC期、Ⅳ期'
  },
  {
    id: 3,
    des: '至少有1个肿瘤病灶既往未经过照射等局部治疗，并且可以准确测量，最长径≥10 mm'
  },
  {
    id: 4,
    des:
      '临床确诊EGFR基因19号外显子缺失突变(EXON19DEL)和/或21号外显子置换突变；伴（仅针对奥西替尼组患者）/或不伴20号外显子置换突变(T790M)'
  },
  {
    id: 5,
    des: '既往未接受过EGFR-TKI治疗'
  },
  {
    id: 6,
    des: '患者自愿加入本项目，签署知情同意书'
  }
]

const exclusion_criteria_basic = [
  {
    id: 1,
    des: '已证实对贝伐珠单抗和/或其辅料过敏者'
  },
  {
    id: 2,
    des: '贝伐珠单抗禁忌症患者'
  }
]

class ParticipatedStandard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inclusion_criteria_id: undefined,
      inclusion_criteria_state: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false },
      exclusion_criteria_state: { 1: false, 2: false },
      exclusion_criteria_id: undefined
    }
  }

  componentDidMount() {
    // const { dispatch, sample_id } = this.props

    // dispatch({
    //   type: 'crf_first_diagnose/fetchInclusionCriteria',
    //   payload: { sample_id }
    // })

    // dispatch({
    //   type: 'crf_first_diagnose/fetchExclusionCriteria',
    //   payload: { sample_id }
    // })

    this.setState({ inclusion_criteria_id: this.props.inclusion_criteria.inclusion_criteria_id })
    this.updateTable(this.props.inclusion_criteria, 'inclusion')

    this.setState({ exclusion_criteria_id: this.props.exclusion_criteria.exclusion_criteria_id })
    this.updateTable(this.props.exclusion_criteria, 'exclusion')
  }

  componentDidUpdate(prevProps) {
    if (prevProps.inclusion_criteria !== this.props.inclusion_criteria) {
      // console.log('inclusion_criteria', this.props.inclusion_criteria)
      this.setState({ inclusion_criteria_id: this.props.inclusion_criteria.inclusion_criteria_id })
      this.updateTable(this.props.inclusion_criteria, 'inclusion')
    }

    if (prevProps.exclusion_criteria !== this.props.exclusion_criteria) {
      // console.log('exclusion_criteria', this.props.exclusion_criteria)
      this.setState({ exclusion_criteria_id: this.props.exclusion_criteria.exclusion_criteria_id })
      this.updateTable(this.props.exclusion_criteria, 'exclusion')
    }
  }

  updateTable(table, type) {
    let length = type == 'inclusion' ? inclusion_criteria_basic.length : exclusion_criteria_basic.length

    for (let i = 1; i <= length; i++) {
      if (table['q' + i] === 1) {
        if (type == 'inclusion') {
          this.setState(state => {
            state.inclusion_criteria_state[i] = true
            return { inclusion_criteria_state: state.inclusion_criteria_state }
          })
        } else {
          this.setState(state => {
            state.exclusion_criteria_state[i] = true
            return { exclusion_criteria_state: state.exclusion_criteria_state }
          })
        }
      }
    }
  }

  static propTypes = {
    exclusion_criteria: PropTypes.object.isRequired,
    inclusion_criteria: PropTypes.object.isRequired,
    sample_id: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  onChange = (table_index, id) => {
    if (table_index === 1) {
      this.setState(state => {
        state.inclusion_criteria_state[id] = !state.inclusion_criteria_state[id]
        return { inclusion_criteria_state: state.inclusion_criteria_state }
      })
    } else {
      this.setState(state => {
        state.exclusion_criteria_state[id] = !state.exclusion_criteria_state[id]
        return { exclusion_criteria_state: state.exclusion_criteria_state }
      })
    }
  }

  onSubmit = () => {
    const {
      inclusion_criteria_state,
      exclusion_criteria_state,
      exclusion_criteria_id,
      inclusion_criteria_id
    } = this.state
    const { dispatch, sample_id } = this.props

    // console.log('inclusion_criteria_state', inclusion_criteria_state)
    // console.log('exclusion_criteria_state', exclusion_criteria_state)
    // console.log('exclusion_criteria_id', exclusion_criteria_id)
    // console.log('inclusion_criteria_id', inclusion_criteria_id)

    let payload = {}
    let length = 6

    for (let i = 1; i <= length; i++) {
      if (inclusion_criteria_state[i] == true) {
        payload['q' + i] = 1
      } else {
        payload['q' + i] = 0
      }
    }
    if (inclusion_criteria_id != undefined) payload.inclusion_criteria_id = inclusion_criteria_id

    // console.log('payload', payload)

    dispatch({
      type: 'crf_first_diagnose/modifyInclusionCriteria',
      payload: { sample_id: sample_id, body: payload }
    }).then(() =>
      dispatch({
        type: 'crf_first_diagnose/fetchInclusionCriteria',
        payload: { sample_id }
      })
    )

    payload = {}
    length = 2
    for (let i = 1; i <= length; i++) {
      if (exclusion_criteria_state[i] == true) {
        payload['q' + i] = 1
      } else {
        payload['q' + i] = 0
      }
    }

    if (exclusion_criteria_id != undefined) payload.exclusion_criteria_id = exclusion_criteria_id

    dispatch({
      type: 'crf_first_diagnose/modifyExclusionCriteria',
      payload: { sample_id: sample_id, body: payload }
    }).then(() =>
      dispatch({
        type: 'crf_first_diagnose/fetchExclusionCriteria',
        payload: { sample_id }
      })
    )
  }

  // 纳入标准表头
  columns1 = [
    {
      title: '问题编号',
      dataIndex: 'id',
      key: 'id',
      width: 100
    },
    {
      title: '问题描述',
      dataIndex: 'des',
      key: 'des',
      width: 0
    },
    {
      title: '是/否',
      key: 'state',
      width: 80,
      render: record => (
        <Checkbox
          checked={this.state.inclusion_criteria_state[record.id]}
          onClick={() => this.onChange(1, record.id)}
        ></Checkbox>
      )
    }
  ]

  columns2 = [
    {
      title: '问题编号',
      dataIndex: 'id',
      key: 'id',
      width: 100
    },
    {
      title: '问题描述',
      dataIndex: 'des',
      key: 'des',
      width: 0
    },
    {
      title: '是/否',
      key: 'state',
      width: 80,
      render: record => (
        <Checkbox
          checked={this.state.exclusion_criteria_state[record.id]}
          onClick={() => this.onChange(2, record.id)}
        ></Checkbox>
      )
    }
  ]

  handleSubmit = e => {
    e.preventDefault()
  }

  render() {
    const table01Loading = this.props.loading.effects['crf_first_diagnose/fetchInclusionCriteria']
    const table02Loading = this.props.loading.effects['crf_first_diagnose/fetchExclusionCriteria']

    return (
      <>
        <Table
          loading={table01Loading}
          bordered
          rowKey="id"
          title={() => <h2 style={{ marginBottom: 0 }}>纳入标准:</h2>}
          footer={() => '以上各项如任何一项为"否"，则患者不适于此项研究'}
          columns={this.columns1}
          dataSource={inclusion_criteria_basic}
          pagination={false}
        />
        <Row style={{ height: '2em' }}></Row>
        <Table
          loading={table02Loading}
          bordered
          rowKey="id"
          title={() => <h2 style={{ marginBottom: 0 }}>排除标准:</h2>}
          footer={() => '以上各项如任何一项为"是"，则患者不适于此项研究'}
          columns={this.columns2}
          dataSource={exclusion_criteria_basic}
          pagination={false}
        />
        {/* <Row style={{ marginTop: '10px' }}>
          <Checkbox style={{ marginRight: '20px' }}>是否入组</Checkbox>
          <DatePicker format="YYYY-MM-DD" />
        </Row> */}
        <Row>
          <Col span={12} offset={6} style={{ textAlign: 'center', marginTop: '10px' }}>
            <Button type="primary" onClick={this.onSubmit}>
              保存
            </Button>
          </Col>
        </Row>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    exclusion_criteria: state.crf_first_diagnose.exclusion_criteria,
    inclusion_criteria: state.crf_first_diagnose.inclusion_criteria,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(ParticipatedStandard)
