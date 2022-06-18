import request from '@/utils/request'




export function fetchHealthInfoList(queryList) {
  return request({
    url: '/healthInfos',
    method: 'get',
    params: {
      owner: queryList.owner,
      sn: queryList.sn || undefined,
      code_color: queryList.code_color || undefined,
      type: queryList.type || undefined,
      page: queryList.page - 1,
      size: queryList.size,
      sortType: queryList.sortType || undefined,
      sortFields: queryList.sortFields || undefined
    }
  })
}

export function fetchHealthInfobyUuid(uuid) {
  return request({
    url: '/healthInfos/' + uuid,
    method: 'get'
  })
}


export function createNewHealthInfo(list) {
  return request({
    url: '/healthInfos',
    method: 'post',
    data: list
  })
}

export function deleteHealthInfo(uuid) {
  return request({
    url: '/healthInfos/' + uuid,
    method: 'delete'
  })
}

export function editHealthInfo(list) {
  return request({
    url: '/healthInfos/' + list.uuid,
    method: 'put',
    data: list
  })
}

export function getDeviceConfig() {
  return request({
    url: '/healthInfos/config',
    method: 'get'
  })
}

export function editDeviceConfig(list) {
  return request({
    url: '/healthInfos/config',
    method: 'put',
    data: list
  })
}
