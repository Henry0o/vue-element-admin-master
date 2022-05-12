const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  avatar: state => state.user.avatar,

  introduction: state => state.user.introduction,

  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  token: state => state.user.token,
  name: state => state.user.name,
  roles: state => state.user.roles,
  uuid: state => state.user.uuid,
  email: state => state.user.email,
  mobile_phone: state => state.user.mobile_phone,
  nationcode: state => state.user.nationcode,

}
export default getters
