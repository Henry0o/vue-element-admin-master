import request from '@/utils/request'

export function gwVerQuery(gatewayMac){
  return request({
    url: '/account/gateway/verquery',
    method: 'post',
    params: {
      gatewayMac
    }
  })
}

export function gwSetFps(gatewayMac,fps){
  return request({
    url: '/account/gateway/setfps',
    method: 'post',
    params: {
      gatewayMac,
      fps
    }
  })
}

export function gwSetLocation(gatewayMac,blockLocation){
  return request({
    url: '/account/gateway/setlocation',
    method: 'post',
    params: {
      gatewayMac
    },
    data: {
      x: blockLocation.x,
      y: blockLocation.y,
      with: blockLocation.with,
      high: blockLocation.high
    }
  })
}

export function gwExposureCapQuery(gatewayMac){
  return request({
    url: '/account/gateway/expcapquery',
    method: 'post',
    params: {gatewayMac}
  })
}

export function gwExpParamSet(gatewayMac,exposureParam){
  return request({
    url: '/account/gateway/expparamset',
    method: 'post',
    params: {gatewayMac},
    data: {
      exp: exposureParam.exp,
      dgain: exposureParam.dgain,
      again: exposureParam.again
    }
  })
}

export function gwOptimalExpParamSet(gatewayMac,exposureParam){
  return request({
    url: '/account/gateway/optexpset',
    method: 'post',
    params: {gatewayMac},
    data: {
      exp: exposureParam.exp,
      dgain: exposureParam.dgain,
      again: exposureParam.again
    }
  })
}
