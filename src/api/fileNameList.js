import request from '@/utils/request'

export function fetchFileNameList(queryList) {
  return request({
    url: '/fileNameList',
    method: 'get',
    params: {
      fileName: queryList.fileName,
      page: queryList.page - 1,
      size: queryList.size,
      sortType: queryList.sortType,
      sortFields: queryList.sortFields
    }
  })
}
export function fetchAllFileNameList() {
  return request({
    url: '/fileNameList',
    method: 'get',

  })
}

export function addFileName(fileInfo) {
  return request({
    url: '/fileNameList',
    method: 'post',
    data: fileInfo
  })
}

export function editFileName(fileId, fileInfo) {
  return request({
    url: '/fileNameList/' + fileId,
    method: 'put',
    data: fileInfo
  })
}

export function deleteFileName(fileId) {
  return request({
    url: '/fileNameList/' + fileId,
    method: 'delete'
  })
}

export function deleteFile(fileName) {
  return request({
    url: '/healthInfos/delete',
    method: 'post',
    params: {
      name: fileName
    }
  })
}
