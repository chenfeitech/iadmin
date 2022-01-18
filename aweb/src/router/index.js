import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import store from  "@/store/index"
import NProgress from "nprogress"
import Layout from "@/layout/layout";

const baseRouters = [
  {
    path: '/',
    name:'Layout',
    // redirect: {name: 'index'},
    meta:{
    },
    component: Layout,
    children: [
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta:{
      title: '登录',
    },
    component: () => import('@/views/system/login/login')
  },
  {
    path: '/register',
    name: 'register',
    meta:{
      title: '注册',
    },
    component: () => import('@/views/system/login/register')
  },

]
const router = createRouter({
  history: createWebHistory('/'),
  routes: baseRouters
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // 防止刷新后动态路由重置
  if(store.getters['user/token']&&baseRouters.length===router.getRoutes().length){
    await store.dispatch('router/SetAsyncRouter')
    await router.push(to.path)
  }

  // 若是在登录页面或注册页面则不需要再额外跳转
  if(to.name==='login'||to.name==='register'){
    next()
  }
  // 先判断是否登录,若没有登录直接跳转登录页面
  const token = store.getters['user/token']
  if (token && token !== 'undefined' && token!=='') {
    // 如果需要tab标签页，则commit一下
    if(to.meta.keep_alive)
      store.commit('tabs/openPage',to)
    next()
  }else{
    next({name:'login'})
  }
})
router.afterEach(()=>{
  NProgress.done()
})
router.onError((callback)=>{
  console.log(callback)
  router.replace({name:'404'})
})
export default router
