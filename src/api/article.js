import request from '@/utils/request'

export function fetchList(query) {

  return request({
    url: '/users',
    method: 'get',
    params: {
      page: query.page - 1,
      size: query.size,
      sort: query.sort,
      email: query.email,
      name: query.name
    }
  })
}

// export function fetchArticle(id) {
//   return request({
//     url: '/vue-element-admin/article/detail',
//     method: 'get',
//     params: {
//       id
//     }
//   })
// }

// export function fetchPv(pv) {
//   return request({
//     url: '/vue-element-admin/article/pv',
//     method: 'get',
//     params: {
//       pv
//     }
//   })
// }

// export function createArticle(data) {
//   return request({
//     url: '/vue-element-admin/article/create',
//     method: 'post',
//     data
//   })
// }

export function updateArticle(data) {
  return request({
    url: '/users/' + data.uuid,
    method: 'put',
    data
  })
}

export function activateUser(email) {
  return request({
    url: '/account/activate',
    method: 'get',
    params: {
      email: email
    }
  })
}

export function deactivateUser(email) {
  return request({
    url: '/account/deactivate',
    method: 'get',
    params: {
      email: email
    }
  })
}

export function deleteUser(uuid) {
  return request({
    url: '/users/' + uuid,
    method: 'delete'
  })
}
