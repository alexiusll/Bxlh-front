import { message } from 'antd'
import { FetchResearchCenters, FetchPatientGroup, FetchSignature, PostSignature, DeleteFile } from '../services/global'
import CookieUtil from '@/utils/cookie'

const Model = {
  namespace: 'global',

  state: {
    research_center_info: [],
    group_ids_info: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchResearchCenters(_, { call, put }) {
      const data = yield call(FetchResearchCenters, { project_id: 1 })

      if (data) {
        yield put({
          type: 'save',
          payload: { research_center_info: data }
        })
      }
    },

    *fetchPatientGroup({ payload }, { call, put }) {
      const data = yield call(FetchPatientGroup, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            group_ids_info: data
          }
        })
      }
    },

    *fetchSignature(_, { call }) {
      const data = yield call(FetchSignature)

      if (data && data.file_path !== undefined) {
        CookieUtil.set('user_signature', data.file_path, new Date(+new Date() + 24 * 60 * 60 * 1000))
      }
    },

    *postSignature({ payload }, { call }) {
      const data = yield call(PostSignature, payload)

      if (data) {
        message.success('保存签名成功！')
      }
    },

    *deleteFile({ payload }, { call }) {
      const data = yield call(DeleteFile, payload)

      if (data) {
        message.success('删除成功！')
      }
    }
  }
}

export default Model
