import { message } from 'antd'
import {
  FetchInterviewTable,
  ModifyInterview,
  PostInterview,
  DeleteInterview,
  FetchSummary,
  ModifySummary,
  FetchAdverseEventAll
} from '../../../services/crfBase'

const Model = {
  namespace: 'crf_interview',

  state: {
    interview_table: [],
    summary: {},
    adverse_event_table_all: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchInterviewTable({ payload }, { call, put }) {
      const data = yield call(FetchInterviewTable, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            interview_table: data
          }
        })
      }
    },

    *modifyInterview({ payload }, { call }) {
      const data = yield call(ModifyInterview, payload)

      if (data) {
        message.success('保存生存期随访信息成功！')
      }
    },

    *postInterview({ payload }, { call }) {
      const data = yield call(PostInterview, payload)

      if (data) {
        message.success('提交生存期随访信息成功！')
      }
    },

    *deleteInterview({ payload }, { call }) {
      const data = yield call(DeleteInterview, payload)

      if (data) {
        message.success('删除生存期随访信息成功！')
      }
    },

    *fetchSummary({ payload }, { call, put }) {
      const data = yield call(FetchSummary, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            summary: data
          }
        })
      }
    },

    *modifySummary({ payload }, { call }) {
      const data = yield call(ModifySummary, payload)

      if (data) {
        message.success('保存项目总结成功！')
      }
    },

    *fetchAdverseEventAll({ payload }, { call, put }) {
      const data = yield call(FetchAdverseEventAll, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            adverse_event_table_all: data
          }
        })
      }
    }
  }
}

export default Model
