import {
  login,
  // logout,
  getInfo,
  register
} from '@/api/user'
import {
  getToken,
  setToken,
  setUuid,
  getUuid,
  removeToken,
  removeUuid
} from '@/utils/auth'
import router, {
  resetRouter
} from '@/router'
import {
  MessageBox,
  Message
} from 'element-ui'



const state = {
  token: getToken(),
  uuid: getUuid(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },

  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_UUID: (state, uuid) => {
    state.uuid = uuid
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_PHONE: (state, mobile_phone) => {
    state.mobile_phone = mobile_phone
  },
  SET_NATION: (state, nationcode) => {
    state.nationcode = nationcode
  },
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo

    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        const {
          data
        } = response
        // console.log(data)
        if (response.status == 200) {
          commit('SET_TOKEN', data.token)
          commit('SET_UUID', data.userId)
          commit('SET_NAME', data.name)
          commit('SET_EMAIL', data.email)

          //这里先不保存roles信息，不然登录白屏，具体为啥，还没搞清楚
          // const roles = [];
          // roles.push(data.role);
          // commit('SET_ROLES', roles)

          // const accessRoutes = store.dispatch('permission/generateRoutes', roles)

          // // dynamically add accessible routes
          // router.addRoutes(accessRoutes)

          setToken(data.token)
          setUuid(data.userId)

          resolve()
        }
      }).catch(error => {

        // console.log(error.response.status);
        // console.log(error.response.headers);
        if (error.response.status === 401) {
          Message({
            message: "用户名或密码错误 " + error.response.status,
            type: 'error',
            duration: 5 * 1000
          })
        } else {
          Message({
            message: "网络连接出现问题" + error.response.status,
            type: 'error',
            duration: 5 * 1000
          })
        }
        reject(error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.uuid).then(response => {
        const {
          data
        } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const {
          uuid,
          email,
          name,
          role,
          description,
          mobile_phone,
          nationcode
        } = data
        const roles = [];
        roles.push(role);
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          // console.log("roles必须为数组")
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_UUID', uuid)
        commit('SET_EMAIL', email)
        commit('SET_NAME', name)
        commit('SET_ROLES', roles)
        commit('SET_PHONE', mobile_phone)
        commit('SET_NATION', nationcode)



        // console.log(data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  register({}, ruleForm) {
    // console.log(ruleForm)
    const form = {
      "name": ruleForm.name,
      "mobile_phone": ruleForm.mobile_phone,
      "email": ruleForm.email,
      "password": ruleForm.password,
      "nationcode": ruleForm.nationcode,
    };

    // console.log(form)
    return new Promise((resolve, reject) => {
        register(form).then(response => {
          // console.log(response)
          // console.log("收到了")
          resolve()
        }).catch(error => {
          // console.log(error)
          // console.log("出错了")
          reject(error)
        })
      }

    )
  },
  // user logout
  logout({
    commit,
    state,
    dispatch
  }) {
    return new Promise((resolve, reject) => {

      commit('SET_TOKEN', '')
      commit('SET_UUID', '')
      commit('SET_ROLES', [])
      removeToken()
      removeUuid()
      resetRouter()

      // this.$router.go(0)
      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485

      dispatch('tagsView/delAllViews', null, {
        root: true
      })



    })

  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_UUID', '')
      removeToken()
      removeUuid()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({
    commit,
    dispatch
  }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const {
      roles
    } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, {
      root: true
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
