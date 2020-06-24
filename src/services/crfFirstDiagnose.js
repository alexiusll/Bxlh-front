import request from '../utils/request'

// 获取人口统计学表单
export function FetchPatient({ sample_id }) {
  return request(`/patient/${sample_id}`, {
    method: 'GET'
  })
}

// 添加或修改人口统计学表单
export function ModifyPatient({ sample_id, body }) {
  return request(`/patient/${sample_id}`, {
    method: 'POST',
    data: body
  })
}

// 获取既往史表单
export function FetchPatientHistory({ sample_id }) {
  return request(`/patient_history/${sample_id}`, {
    method: 'GET'
  })
}

// 添加或修改既往史表单
export function ModifyPatientHistory({ sample_id, body }) {
  return request(`/patient_history/${sample_id}`, {
    method: 'POST',
    data: body
  })
}

// 获取实验室检查表单
export function FetchLabInspection({ sample_id, cycle_number }) {
  return request(`/lab_inspection/${sample_id}/${cycle_number}`, {
    method: 'GET'
  })
}

// 添加或修改实验室检查表单
export function ModifyLabInspection({ sample_id, cycle_number, body }) {
  return request(`/lab_inspection/${sample_id}/${cycle_number}`, {
    method: 'POST',
    data: body
  })
}

// 获取初诊过程表单
export function FetchFirstDiagnose({ sample_id }) {
  return request(`/first_diagnose/${sample_id}`, {
    method: 'GET'
  })
}

// 添加或修改初诊过程表单
export function ModifyFirstDiagnose({ sample_id, body }) {
  return request(`/first_diagnose/${sample_id}`, {
    method: 'POST',
    data: body
  })
}

// 获取访视时间表单
export function FetchCycleTime({ sample_id, cycle_number }) {
  return request(`/cycle_time/${sample_id}/${cycle_number}`, {
    method: 'GET'
  })
}

// 添加或修改访视时间表单
export function ModifyCycleTime({ sample_id, cycle_number, body }) {
  return request(`/cycle_time/${sample_id}/${cycle_number}`, {
    method: 'POST',
    data: body
  })
}

// 获取影像学评估表单
export function FetchPhotoEvaluateTable({ sample_id, cycle_number }) {
  return request(`/photo_evaluate_table/${sample_id}/${cycle_number}`, {
    method: 'GET'
  })
}

// 添加或修改影像学评估表单
export function ModifyPhotoEvaluateTable({ sample_id, cycle_number, body }) {
  return request(`/photo_evaluate/${sample_id}/${cycle_number}`, {
    method: 'POST',
    data: body
  })
}

// 删除影像学评估
export function DeletePhotoEvaluateTable({ sample_id, cycle_number, evaluate_id }) {
  return request(`/photo_evaluate/${sample_id}/${cycle_number}/${evaluate_id}`, {
    method: 'DELETE'
  })
}

// 获取治疗史表单
export function FetchDiagnoseHistory({ sample_id }) {
  return request(`/diagnose_history/${sample_id}`, {
    method: 'GET'
  })
}

// 添加或修改治疗史表单
export function ModifyDiagnoseHistory({ sample_id, body }) {
  return request(`/diagnose_history/${sample_id}`, {
    method: 'POST',
    data: body
  })
}

// 删除治疗史
export function DeleteDiagnoseHistory({ sample_id, diagnose_number }) {
  return request(`/diagnose_history/${sample_id}/${diagnose_number}`, {
    method: 'DELETE'
  })
}

// 获取体格报告列表
export function FetchPatientReportTable({ sample_id }) {
  return request(`/patient_report_table/${sample_id}`, {
    method: 'GET'
  })
}

// 添加或修改体格报告表单
export function ModifyPatientReportTable({ sample_id, body }) {
  return request(`/patient_report/${sample_id}`, {
    method: 'POST',
    data: body
  })
}

// 删除体格报告列表
export function DeletePatientReportTable({ sample_id, report_id }) {
  return request(`/patient_report/${sample_id}/${report_id}`, {
    method: 'DELETE'
  })
}
