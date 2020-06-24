import { message } from 'antd'
import {
  FetchPatient,
  ModifyPatient,
  FetchPatientHistory,
  ModifyPatientHistory,
  FetchLabInspection,
  ModifyLabInspection,
  FetchFirstDiagnose,
  ModifyFirstDiagnose,
  FetchCycleTime,
  ModifyCycleTime,
  FetchPhotoEvaluateTable,
  ModifyPhotoEvaluateTable,
  DeletePhotoEvaluateTable,
  FetchDiagnoseHistory,
  ModifyDiagnoseHistory,
  DeleteDiagnoseHistory,
  FetchPatientReportTable,
  ModifyPatientReportTable,
  DeletePatientReportTable
} from '../../../services/crfFirstDiagnose'

const Model = {
  namespace: 'crf_first_diagnose',

  state: {
    patient: {},
    patient_report_table: [],
    cycle_time: '',
    first_diagnose: {},
    diagnose_history: [],
    photo_evaluate_table: [],
    patient_history: {},
    lab_inspection: {}
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchPatient({ payload }, { call, put }) {
      const data = yield call(FetchPatient, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            patient: data
          }
        })
      }
    },

    *modifyPatient({ payload }, { call }) {
      const data = yield call(ModifyPatient, payload)

      if (data) {
        message.success('保存人口统计学表单成功！')
      }
    },

    *fetchPatientHistory({ payload }, { call, put }) {
      const data = yield call(FetchPatientHistory, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            patient_history: data
          }
        })
      }
    },

    *modifyPatientHistory({ payload }, { call }) {
      const data = yield call(ModifyPatientHistory, payload)

      if (data) {
        message.success('保存既往史表单成功！')
      }
    },

    *fetchLabInspection({ payload }, { call, put }) {
      const data = yield call(FetchLabInspection, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            lab_inspection: data
          }
        })
      }
    },

    *modifyLabInspection({ payload }, { call }) {
      const data = yield call(ModifyLabInspection, payload)

      if (data) {
        message.success('保存实验室检查表单成功！')
      }
    },

    *fetchFirstDiagnose({ payload }, { call, put }) {
      const data = yield call(FetchFirstDiagnose, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            first_diagnose: data
          }
        })
      }
    },

    *modifyFirstDiagnose({ payload }, { call }) {
      const data = yield call(ModifyFirstDiagnose, payload)

      if (data) {
        message.success('保存初诊过程表单成功！')
      }
    },

    *fetchCycleTime({ payload }, { call, put }) {
      const data = yield call(FetchCycleTime, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            cycle_time: data.cycle_time
          }
        })
      }
    },

    *modifyCycleTime({ payload }, { call }) {
      const data = yield call(ModifyCycleTime, payload)

      if (data) {
        message.success('保存访视时间成功！')
      }
    },

    *fetchPhotoEvaluateTable({ payload }, { call, put }) {
      const data = yield call(FetchPhotoEvaluateTable, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            photo_evaluate_table: data
          }
        })
      }
    },

    *modifyPhotoEvaluateTable({ payload }, { call }) {
      const data = yield call(ModifyPhotoEvaluateTable, payload)

      if (data) {
        message.success('保存影像学评估表单成功！')
      }
    },

    *deletePhotoEvaluateTable({ payload }, { call }) {
      const data = yield call(DeletePhotoEvaluateTable, payload)

      if (data) {
        message.success('删除影像学评估成功！')
      }
    },

    *fetchDiagnoseHistory({ payload }, { call, put }) {
      const data = yield call(FetchDiagnoseHistory, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            diagnose_history: data
          }
        })
      }
    },

    *modifyDiagnoseHistory({ payload }, { call }) {
      const data = yield call(ModifyDiagnoseHistory, payload)

      if (data) {
        message.success('保存治疗史表单成功！')
      }
    },

    *deleteDiagnoseHistory({ payload }, { call }) {
      const data = yield call(DeleteDiagnoseHistory, payload)

      if (data) {
        message.success('删除治疗史成功！')
      }
    },

    *fetchPatientReportTable({ payload }, { call, put }) {
      const data = yield call(FetchPatientReportTable, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            patient_report_table: data
          }
        })
      }
    },

    *modifyPatientReportTable({ payload }, { call }) {
      const data = yield call(ModifyPatientReportTable, payload)

      if (data) {
        message.success('保存体格报告表单成功！')
      }
    },

    *deletePatientReportTable({ payload }, { call }) {
      const data = yield call(DeletePatientReportTable, payload)

      if (data) {
        message.success('删除体格报告成功！')
      }
    }
  }
}

export default Model
