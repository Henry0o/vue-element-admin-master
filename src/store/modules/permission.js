import {
  asyncRoutes,
  constantRoutes
} from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // console.log(roles)
  if (route.meta && route.meta.roles) {
    // console.log("需要权限判断")
    // let boolvalue;
    // boolvalue = roles.some(roles => route.meta.roles.includes(roles));
    // console.log(boolvalue)

    // return roles.some(roles => route.meta.roles.includes(roles))
    if (route.meta.roles.includes(roles)) {
      return true;
    } else {
      return false;
    }

  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  // console.log("开始填充路由")
  routes.forEach(route => {
    const tmp = {
      ...route
    }
    // console.log(tmp)
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({
    commit
  }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      // console.log("开始生成路由")
      if (roles.includes('ADMIN')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      // console.log("生成路由结束，生成的路由为")
      // console.log(accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
