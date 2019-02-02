import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/SystemUnit/Login'
import Index from '@/components/SystemUnit/Index'
import UserManage from '@/components/SystemManage/UserManage'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: '登录', component: Login },
    { path: '/index', name: '首页', component: Index,
      children: [
        { path: '/userManage', name: '用户管理', component: UserManage, meta: { title: '用户管理' } }
      ]
    }
  ]
})
