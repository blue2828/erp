import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/SystemUnit/Login'
import Index from '@/components/SystemUnit/Index'
import UserManage from '@/components/SystemManage/UserManage'
import Role_Permission from '@/components/SystemManage/Role_Permission'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: '登录', component: Login },
    { path: '/index', name: '首页', component: Index,
      children: [
        { path: '/userManage', name: '用户管理', component: UserManage, meta: { title: '用户管理' } },
        { path: '/role_Permission', name: '角色管理', component: Role_Permission, meta: { title: '角色管理' } }
      ]
    }
  ]
})
