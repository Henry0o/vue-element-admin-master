import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path(.*)',
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      meta: {
        title: '牛图云',
        icon: 'nt',
        affix: true
      }
    }]
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
    path: '/user',
    component: Layout,
    redirect: '/user/personalInfo',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '用户管理',
      icon: 'lock',
      roles: ['ADMIN', 'USER'] // you can set roles in root nav
    },
    children: [{
        path: 'personalInfo',
        component: () => import('@/views/user/personalInfo'),
        name: 'personalInfo',
        meta: {
          title: '个人信息'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'userTable',
        component: () => import('@/views/user/userTable'),
        name: 'UserTable',
        meta: {
          title: '用户列表',
          roles: ['ADMIN']
        }
      }

      // {
      //   path: 'role',
      //   component: () => import('@/views/permission/role'),
      //   name: 'RolePermission',
      //   meta: {
      //     title: 'Role Permission',
      //     roles: ['ADMIN']
      //   }
      // }
    ]
  },
  {
    path: '/gateways',
    component: Layout,
    redirect: '/gateways/PersonalGatewayList',
    alwaysShow: true,
    name: 'Table',
    meta: {
      title: '设备管理',
      icon: 'table',

    },
    children: [
      // {
      //   path: 'dynamic-table',
      //   component: () => import('@/views/table/dynamic-table/index'),
      //   name: 'DynamicTable',
      //   meta: {
      //     title: 'Dynamic Table'
      //   }
      // },
      // {
      //   path: 'drag-table',
      //   component: () => import('@/views/table/drag-table'),
      //   name: 'DragTable',
      //   meta: {
      //     title: 'Drag Table'
      //   }
      // },
      // {
      //   path: 'inline-edit-table',
      //   component: () => import('@/views/table/inline-edit-table'),
      //   name: 'InlineEditTable',
      //   meta: {
      //     title: 'Inline Edit'
      //   }
      // },
      {
        path: 'gatewayList',
        component: () => import('@/views/gateways/gatewayList'),
        name: 'gatewayList',
        meta: {
          title: '设备列表',
          roles: ['ADMIN']
        },
      },
      {
        path: 'PersonalGatewayList',
        component: () => import('@/views/gateways/PersonalGatewayList'),
        name: 'PersonalGatewayList',
        meta: {
          title: '您的设备'
        },
        roles: ['USER']
      },

      // {
      //   path: 'webSocketDemo02',
      //   component: () => import('@/views/gateways/webSocketDemo02'),
      //   name: 'webSocketDemo02',
      //   meta: {
      //     title: 'webSocket02测试'
      //   }
      // },

      //设备远程连接， 通过MQTT
      // {
      //   path: 'mqtt_operation',
      //   component: () => import('@/views/gateways/mqtt_operation'),
      //   name: 'mqtt_operation',
      //   meta: {
      //     title: '远程连接'
      //   },
      // },


      {
        path: 'healthCodeInfomation',
        component: () => import('@/views/HealthInfo/HealthInfoList'),
        name: 'healthCodeInfomation',
        meta: {
          title: '通行记录'
        }
      },
      {
        path: 'profile',
        component: () => import('@/views/gateways/file_transfer'),
        name: 'profile',
        meta: {
          title: '上传更新包',
          roles: ['ADMIN']
        }
      },
      {
        path: 'device_config',
        component: () => import('@/views/gateways/device_config'),
        name: 'device_config',
        meta: {
          title: '设备配置'
          // roles: ['ADMIN']
        }
      }
      // {
      //   path: 'test',
      //   component: () => import('@/views/video/test'),
      //   name: 'test',
      //   meta: {
      //     title: '测试'
      //   }
      // },
      // {
      //   path: 'test2',
      //   component: () => import('@/views/video/test2'),
      //   name: 'test2',
      //   meta: {
      //     title: '测试2'
      //   }
      // }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'hash',

  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
