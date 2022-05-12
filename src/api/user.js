import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/token',
    method: 'post',
    data
  })
}

export function getInfo(uuid) {
  return request({
    url: '/users/' + uuid,
    method: 'get',

  })
}

export function register(form) {
  return request({
    url: '/account/register',
    method: 'post',
    data: {
      "name": form.name,
      "mobile_phone": form.mobile_phone,
      "email": form.email,
      "password": form.password,
      "nationcode": form.nationcode
    }
  })
}

// export function logout() {
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
// }
