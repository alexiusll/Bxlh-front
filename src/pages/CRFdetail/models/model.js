import { message } from 'antd'
import {
  FetchCrfInfo,
  FetchNavInfo,
  AddCycle,
  DeleteCycle,
  FetchBaseSignature,
  PostBaseSignature,
  FetchSummarySignature,
  PostSummarySignature,
  PostSummaryCraSignature,
  PostCycle,
  FetchCycleStatus,
  FetchPhotoFileList
} from '../../../services/crfBase'

const Model = {
  namespace: 'crfBase',

  state: {
    crf_info: {},
    nav_info: [],
    crfbase_sign: {},
    summary_sign: { si: {}, inspector: {} },
    file_list: [],
    cycle_status: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchCrfInfo({ payload }, { call, put }) {
      const data = yield call(FetchCrfInfo, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            crf_info: data
          }
        })
      }
    },

    *fetchNavInfo({ payload }, { call, put }) {
      const data = yield call(FetchNavInfo, payload)
      if (data) {
        yield put({
          type: 'save',
          payload: {
            nav_info: data
          }
        })
      }
    },

    *addCycle({ payload }, { call }) {
      const data = yield call(AddCycle, payload)

      if (data) {
        message.success('增加访视记录成功！')
      }
    },

    *deleteCycle({ payload }, { call }) {
      const data = yield call(DeleteCycle, payload)

      if (data) {
        message.success('删除访视记录成功！')
      }
    },

    *postCycle({ payload }, { call }) {
      const data = yield call(PostCycle, payload)

      if (data) {
        const { cycle_number } = payload
        if (cycle_number === 0) {
          message.success(`提交治疗期终止访视成功！`)
        } else {
          message.success(`提交${cycle_number === 1 ? '基线资料' : '访视' + cycle_number}成功！`)
        }
      }
    },

    *clearSignature(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          crfbase_sign: {},
          summary_sign: { si: {}, inspector: {} }
        }
      })
    },

    *fetchBaseSignature({ payload }, { call, put }) {
      const data = yield call(FetchBaseSignature, payload)
      if (data) {
        yield put({
          type: 'save',
          payload: {
            crfbase_sign: data
          }
        })
      }
    },

    *postBaseSignature({ payload }, { call }) {
      const data = yield call(PostBaseSignature, payload)
      if (data) {
        message.success('基线资料签名成功！')
      }
    },

    *fetchSummarySignature({ payload }, { call, put }) {
      const data = yield call(FetchSummarySignature, payload)
      if (data) {
        yield put({
          type: 'save',
          payload: {
            summary_sign: data
          }
        })
      }
    },

    *postSummarySignature({ payload }, { call }) {
      const data = yield call(PostSummarySignature, payload)

      if (data) {
        message.success('研究员 项目总结签名成功！')
      }
    },

    *postSummaryCraSignature({ payload }, { call }) {
      const data = yield call(PostSummaryCraSignature, payload)

      if (data) {
        message.success('监察员 项目总结签名成功！')
      }
    },

    *fetchPhotoFileList({ payload }, { call, put }) {
      const data = yield call(FetchPhotoFileList, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            file_list: data
          }
        })
      }
    },

    *fetchCycleStatus({ payload }, { call, put }) {
      const data = yield call(FetchCycleStatus, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            cycle_status: data
          }
        })
      }
    }
  }
}

export default Model
