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
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import('@/components/Welcome.vue')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('@/views/UserManage/UserList.vue')
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import('@/views/Authority/AuthList.vue')
      },
      {
        path: '/rights',
        name: 'rights',
        component: () => import('@/views/Authority/RoleManage.vue')
      },
      {
        path: '/goods',
        name: 'goods',
        component: () => import('@/views/GoodsManage/GoodsList.vue')
      },
      {
        path: '/params',
        name: 'params',
        component: () => import('@/views/GoodsManage/ClassifyParam.vue')
      },
      {
        path: '/categories',
        name: 'categories',
        component: () => import('@/views/GoodsManage/GoodsClassify.vue')
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import('@/views/OrderManage/OrderList.vue')
      },
      {
        path: '/reports',
        name: 'reports',
        component: () => import('@/views/DataStatistics/DataReport.vue')
      }
    ]
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('../views/About.vue')
  // }
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
