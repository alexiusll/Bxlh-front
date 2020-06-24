import request from '../utils/request'

// 获取治疗期签名
export async function FetchCycleSignature({ sample_id, cycle_number }) {
  return request(`/cycle/signature/${sample_id}/${cycle_number}`, {
    method: 'GET'
  })
}

// 添加治疗期签名
export async function PostCycleSignature({ sample_id, cycle_number, user_id }) {
  return request(`/cycle/signature/${sample_id}/${cycle_number}`, {
    method: 'POST',
    data: { user_id }
  })
}

// 获取主要症状体征列表
export function FetchMainSymptom({ sample_id, cycle_number }) {
  return request(`/main_symptom_table/${sample_id}/${cycle_number}`, {
    method: 'GET'
  })
}

// 添加或修改主要症状体征列表
export function ModifyMainSymptom({ sample_id, cycle_number, body }) {
  return request(`/main_symptom/${sample_id}/${cycle_number}`, {
    method: 'POST',
    data: body
  })
}

// 删除主要症状体征列表
export function DeleteMainSymptom({ sample_id, cycle_number, main_symptom_id }) {
  return request(`/main_symptom/${sample_id}/${cycle_number}/${main_symptom_id}`, {
    method: 'DELETE'
  })
}

// 获取治疗记录列表
export function FetchTreatmentRecord({ sample_id, cycle_number }) {
  return request(`/treatment_record_table/${sample_id}/${cycle_number}`, {
    method: 'GET'
  })
}

// 添加或修改治疗记录表单
export function ModifyTreatmentRecord({ sample_id, cycle_number, body }) {
  return request(`/treatment_record/${sample_id}/${cycle_number}`, {
    method: 'POST',
    data: body
  })
}

// 删除治疗记录列表
export function DeleteTreatmentRecord({ sample_id, cycle_number, treatment_record_id }) {
  return request(`/treatment_record/${sample_id}/${cycle_number}/${treatment_record_id}`, {
    method: 'DELETE'
  })
}

// 获取疗效评价表单
export function FetchEvaluation({ sample_id, cycle_number }) {
  return request(`/evaluation/${sample_id}/${cycle_number}`, {
    method: 'GET'
  })
}

// 添加或修改疗效评价表单
export function ModifyEvaluation({ sample_id, cycle_number, body }) {
  return request(`/evaluation/${sample_id}/${cycle_number}`, {
    method: 'POST',
    data: body
  })
}

// 获取严重不良事件
export function FetchAdverseEvent({ sample_id, cycle_number }) {
  return request(`/adverse_event_table/${sample_id}/${cycle_number}`, {
    method: 'GET'
  })
}

// 添加或修改严重不良事件
export function ModifyAdverseEvent({ sample_id, cycle_number, body }) {
  return request(`/adverse_event/${sample_id}/${cycle_number}`, {
    method: 'POST',
    data: body
  })
}

// 删除不良事件
export function DeleteAdverseEvent({ sample_id, cycle_number, adverse_event_id }) {
  return request(`/adverse_event/${sample_id}/${cycle_number}/${adverse_event_id}`, {
    method: 'DELETE'
  })
}

// 获取ECOG评分
export function FetchECOG({ sample_id, cycle_number }) {
  return request(`/ECOG/${sample_id}/${cycle_number}`, {
    method: 'GET'
  })
}

// 添加或修改ECOG评分
export function ModifyECOG({ sample_id, cycle_number, body }) {
  return request(`/ECOG/${sample_id}/${cycle_number}`, {
    method: 'POST',
    data: body
  })
}

// 获取治疗记录单调整表单
export function FetchTreatmentStatusRecord({ sample_id, cycle_number }) {
  return request(`/treatment_record_adjustment_status/${sample_id}/${cycle_number}`, {
    method: 'GET'
  })
}

// 添加或修改治疗记录单调整表单
export function ModifyTreatmentStatusRecord({ sample_id, cycle_number, body }) {
  return request(`/treatment_record_adjustment_status/${sample_id}/${cycle_number}`, {
    method: 'POST',
    data: body
  })
}
