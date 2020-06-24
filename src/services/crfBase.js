import request from '../utils/request'

// 获取部分CRF展示信息
export async function FetchCrfInfo({ sample_id }) {
  return request(`/CRF_div_info/${sample_id}`, {
    method: 'GET'
  })
}

// 获取CRF的导航信息
export async function FetchNavInfo({ sample_id }) {
  return request(`/nav/${sample_id}`, {
    method: 'GET'
  })
}

// 增加cycle记录
export async function AddCycle({ sample_id }) {
  return request(`/cycle/${sample_id}`, {
    method: 'POST'
  })
}

// 删除cycle记录
export async function DeleteCycle({ sample_id }) {
  return request(`/cycle/${sample_id}`, {
    method: 'DELETE'
  })
}

// 提交cycle记录
export async function PostCycle({ sample_id, cycle_number }) {
  return request(`/submit_cycle/${sample_id}/${cycle_number}`, {
    method: 'POST'
  })
}

// 获取基线资料的签名
export async function FetchBaseSignature({ sample_id }) {
  return request(`/sample/signature/${sample_id}`, {
    method: 'GET'
  })
}

// 添加基线资料的签名
export async function PostBaseSignature({ sample_id, user_id }) {
  return request(`/sample/signature/${sample_id}`, {
    method: 'POST',
    data: { user_id }
  })
}

// 获取项目总结的签名
export async function FetchSummarySignature({ sample_id }) {
  return request(`/summary/signature/${sample_id}`, {
    method: 'GET'
  })
}

// 添加si项目总结的签名
export async function PostSummarySignature({ sample_id, user_id }) {
  return request(`/summary/signature/${sample_id}`, {
    method: 'POST',
    data: { user_id }
  })
}

// 添加cra项目总结的签名
export async function PostSummaryCraSignature({ sample_id, user_id }) {
  return request(`/summary/cra_signature/${sample_id}`, {
    method: 'POST',
    data: { user_id }
  })
}

// 获取随访提交状态信息
export async function FetchCycleStatus({ sample_id }) {
  return request(`/cycle/submit_info/${sample_id}`, {
    method: 'GET'
  })
}

// 获取生存期随访信息
export async function FetchInterviewTable({ sample_id }) {
  return request(`/interview_table/${sample_id}`, {
    method: 'GET'
  })
}

// 提交单条生存期随访
export async function PostInterview({ interview_id }) {
  return request(`/interview/submit/${interview_id}`, {
    method: 'POST'
  })
}

// 添加或修改生存期随访信息
export function ModifyInterview({ sample_id, body }) {
  return request(`/interview/${sample_id}`, {
    method: 'POST',
    data: body
  })
}

// 删除生存期随访
export function DeleteInterview({ sample_id, interview_id }) {
  return request(`/interview/${sample_id}/${interview_id}`, {
    method: 'DELETE'
  })
}

// 获取项目总结
export async function FetchSummary({ sample_id }) {
  return request(`/summary/${sample_id}`, {
    method: 'GET'
  })
}

// 提交项目总结
export async function ModifySummary({ sample_id, body }) {
  return request(`/summary/${sample_id}`, {
    method: 'POST',
    data: body
  })
}

// 获取全部严重不良事件
export function FetchAdverseEventAll({ sample_id }) {
  return request(`/adverse_event_table_all/${sample_id}`, {
    method: 'GET'
  })
}

// 获取影像学评估的文件列表
export function FetchPhotoFileList({ sample_id, cycle_number, evaluate_id }) {
  return request(`/photo_evaluate/file/${sample_id}/${cycle_number}/${evaluate_id}`, {
    method: 'GET'
  })
}
