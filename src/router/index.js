import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName:"login_home_welcome" */'@/views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: () => import(/* webpackChunkName:"login_home_welcome" */'@/views/Home.vue'),
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import(/* webpackChunkName:"login_home_welcome" */'@/components/Welcome.vue')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import(/* webpackChunkName:"users_roles_rights" */'@/views/UserManage/UserList.vue')
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import(/* webpackChunkName:"users_roles_rights" */'@/views/Authority/AuthList.vue')
      },
      {
        path: '/rights',
        name: 'rights',
        component: () => import(/* webpackChunkName:"users_roles_rights" */'@/views/Authority/RoleManage.vue')
      },
      {
        path: '/goods',
        name: 'goods',
        component: () => import(/* webpackChunkName:"goods_addgoods" */'@/views/GoodsManage/GoodsList.vue')
      },
      {
        path: '/goods/add',
        name: 'addGoods',
        component: () => import(/* webpackChunkName:"goods_addgoods" */'@/views/GoodsManage/AddGoods.vue')

      },
      {
        path: '/params',
        name: 'params',
        component: () => import(/* webpackChunkName:"goods_params_cate" */'@/views/GoodsManage/ClassifyParam.vue')
      },
      {
        path: '/categories',
        name: 'categories',
        component: () => import(/* webpackChunkName:"goods_params_cate" */'@/views/GoodsManage/GoodsClassify.vue')
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import(/* webpackChunkName:"orders_reports" */'@/views/OrderManage/OrderList.vue')
      },
      {
        path: '/reports',
        name: 'reports',
        component: () => import(/* webpackChunkName:"orders_reports" */'@/views/DataStatistics/DataReport.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  var token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
