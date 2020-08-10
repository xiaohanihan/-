import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import User from '../components/User.vue'
import HelloWorld from '../components/HelloWorld.vue'
import Rights from '../components/rights/Rights.vue'
import Roles from '../components/rights/Roles.vue'
import GoodsList from '../components/goodsManage/GoodsList.vue'
import GoodsType from '../components/goodsManage/GoodsType.vue'

Vue.use(VueRouter)
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/',
        component: HelloWorld,
        meta: {
          keepAlive: false
        }
      },
      {
        path: '/users',
        component: User,
        meta: {
          keepAlive: false
        }
      },
      { path: '/rights', component: Rights },
      {
        path: '/roles',
        component: Roles,
        meta: {
          keepAlive: true
        }
      },
      { path: '/goods', component: GoodsList },
      { path: '/categories', component: GoodsType }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/About.vue')
  }
]

const router = new VueRouter({
  routes
})
// 路由收尾校验，如果token不存在则返回登录页面
router.beforeEach((to, from, next) => {
  const tokenStr = window.sessionStorage.getItem('token')

  if (to.path === '/login') {
    if (!tokenStr) {
      return next()
    } else {
      next('/home')
    }
  } else {
    if (!tokenStr) {
      return next('/login')
    } else {
      next()
    }
  }
})

export default router
