import request from '@/utils/request'

export function fetchGatewaysList(queryList) {
  return request({
    url: '/gateways',
    method: 'get',
    params: {
      user: queryList.user,
      page: queryList.page - 1,
      size: queryList.size,
      sort: queryList.sort
    }
  })
}

export function editGateway(list) {
  return request({
    url: '/gateways/' + list.mac,
    method: 'put',
    data: list
  })
}


export function createNewGateway(list) {
  return request({
    url: '/gateways',
    method: 'post',
    data: list
  })
}

export function deleteGateway(uuid) {
  return request({
    url: '/gateways/' + uuid,
    method: 'delete',

  })
}

export function activatedGateway(mac) {
  return request({
    url: 'gateways/activate',
    method: 'get',
    params: {
      mac: mac
    }
  })
}

export function deactivatedGateway(mac) {
  return request({
    url: 'gateways/deactivate',
    method: 'get',
    params: {
      mac: mac
    }
  })
}

export function getCreateQRCode(str) {
  return request({
    url: '/gateways/getQrCode',
    method: 'get',
    params: {
      context: str
    }
  })
}
