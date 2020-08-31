import request from '../utils/request'

// 获取用户签名
export async function FetchSignature() {
  return request('/signature', {
    method: 'GET'
  })
}

// 上传用户签名
export async function PostSignature() {
  return request('/signature', {
    method: 'POST'
  })
}

// 获取研究中心名
export async function FetchResearchCenters(body) {
  return request('/v1/research_centers', {
    method: 'GET',
    params: body
  })
}

// 获取患者组别
// export async function FetchPatientGroup() {
//   return request('/group_ids', {
//     method: 'GET'
//   })
// }

// 下载文件
export async function DownloadFile(file_path, as_attachment) {
  return request('/static_file', {
    method: 'GET',
    params: {
      file_path,
      as_attachment
    }
  })
}

// 删除文件
export async function DeleteFile(body) {
  return request('/static_file', {
    method: 'DELETE',
    params: {
      file_path: body.file_path
    }
  })
}
