import { message } from 'antd'
import {
  FetchCycleSignature,
  PostCycleSignature,
  FetchMainSymptom,
  ModifyMainSymptom,
  DeleteMainSymptom,
  FetchTreatmentRecord,
  ModifyTreatmentRecord,
  DeleteTreatmentRecord,
  FetchEvaluation,
  ModifyEvaluation,
  FetchAdverseEvent,
  ModifyAdverseEvent,
  DeleteAdverseEvent,
  FetchECOG,
  ModifyECOG,
  FetchTreatmentStatusRecord,
  ModifyTreatmentStatusRecord
} from '../../../services/crfCycleRecord'

const Model = {
  namespace: 'crf_cycle_record',

  state: {
    crf_cycle_sign: {},
    main_symptom_table: [],
    treatment_record_table: [],
    evaluation: '',
    adverse_event_table: [],
    ECOG: -1,
    treatment_record_adjustment_status: {}
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchCycleSignature({ payload }, { call, put }) {
      const data = yield call(FetchCycleSignature, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            crf_cycle_sign: data
          }
        })
      }
    },

    *postCycleSignature({ payload }, { call }) {
      const data = yield call(PostCycleSignature, payload)

      if (data) {
        const { cycle_number } = payload

        message.success(`访视${cycle_number}签名成功！`)
      }
    },

    *clearSignature(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          crf_cycle_sign: {}
        }
      })
    },

    *fetchMainSymptom({ payload }, { call, put }) {
      const data = yield call(FetchMainSymptom, payload)

      if (data) {
        data.forEach(item => {
          if (item.existence === '存在') {
            item.existence = '0'
          } else if (item.existence === '消失') {
            item.existence = '1'
          }
        })
        yield put({
          type: 'save',
          payload: {
            main_symptom_table: data
          }
        })
      }
    },

    *modifyMainSymptom({ payload }, { call }) {
      const data = yield call(ModifyMainSymptom, payload)

      if (data) {
        message.success('保存主要症状体征表单成功！')
      }
    },

    *deleteMainSymptom({ payload }, { call }) {
      const data = yield call(DeleteMainSymptom, payload)

      if (data) {
        message.success('删除主要症状体征成功！')
      }
    },

    *fetchTreatmentRecord({ payload }, { call, put }) {
      const data = yield call(FetchTreatmentRecord, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            treatment_record_table: data
          }
        })
      }
    },

    *modifyTreatmentRecord({ payload }, { call }) {
      const data = yield call(ModifyTreatmentRecord, payload)

      if (data) {
        message.success('保存治疗记录表单成功！')
      }
    },

    *deleteTreatmentRecord({ payload }, { call }) {
      const data = yield call(DeleteTreatmentRecord, payload)

      if (data) {
        message.success('删除治疗记录成功！')
      }
    },

    *fetchEvaluation({ payload }, { call, put }) {
      const data = yield call(FetchEvaluation, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            evaluation: data.evaluation
          }
        })
      }
    },

    *modifyEvaluation({ payload }, { call }) {
      const data = yield call(ModifyEvaluation, payload)

      if (data) {
        message.success('保存疗效评价成功！')
      }
    },

    *fetchAdverseEvent({ payload }, { call, put }) {
      const data = yield call(FetchAdverseEvent, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            adverse_event_table: data
          }
        })
      }
    },

    *modifyAdverseEvent({ payload }, { call }) {
      const data = yield call(ModifyAdverseEvent, payload)

      if (data) {
        message.success('保存严重不良事件成功！')
      }
    },

    *deleteAdverseEvent({ payload }, { call }) {
      const data = yield call(DeleteAdverseEvent, payload)

      if (data) {
        message.success('删除严重不良事件成功！')
      }
    },

    *fetchECOG({ payload }, { call, put }) {
      const data = yield call(FetchECOG, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            ECOG: data.ECOG
          }
        })
      }
    },

    *modifyECOG({ payload }, { call }) {
      const data = yield call(ModifyECOG, payload)

      if (data) {
        message.success('保存ECOG评分成功！')
      }
    },

    *fetchTreatmentStatusRecord({ payload }, { call, put }) {
      const data = yield call(FetchTreatmentStatusRecord, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            treatment_record_adjustment_status: data
          }
        })
      }
    },

    *modifyTreatmentStatusRecord({ payload }, { call }) {
      const data = yield call(ModifyTreatmentStatusRecord, payload)

      if (data) {
        message.success('保存治疗记录单调整表单成功！')
      }
    }
  }
}

export default Model
