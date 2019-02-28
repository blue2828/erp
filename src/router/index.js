import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/SystemUnit/Login'
import Index from '@/components/SystemUnit/Index'
import UserManage from '@/components/SystemManage/UserManage'
import Role_Permission from '@/components/SystemManage/Role_Permission'
import GoodsManage from "../components/BaseConfig/GoodsManage";
import RepoManage from "../components/BaseConfig/RepoManage";
import EmployeeManage from "../components/BaseConfig/EmployeeManage";
import SupplierManage from '@/components/BuyManage/SupplierManage';
import CustomerManage from '@/components/SaleManage/CustomerManage';
import BuyOrder from '@/components/BuyManage/BuyOrder';
import SaleOrder from '@/components/SaleManage/SaleOrder';
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: '登录', component: Login },
    { path: '/index', name: '首页', component: Index,
      children: [
        { path: '/userManage', name: '用户管理', component: UserManage, meta: { title: '用户管理' } },
        { path: '/role_Permission', name: '角色管理', component: Role_Permission, meta: { title: '角色管理' } },
        { path: '/goodsManage', name: '商品管理', component: GoodsManage, meta: { title: '商品管理' } },
        { path: '/repoManage', name: '仓库管理', component: RepoManage, meta: { title: '仓库管理' } },
        { path: '/employeeManage', name: '员工管理', component: EmployeeManage, meta: { title: '员工管理' } },
        { path: '/supplierManage', name: '供应商管理', component: SupplierManage, meta: { title: '供应商管理' } },
        { path: '/customerManage', name: '客户管理', component: CustomerManage, meta: { title: '供应商管理' } },
        { path: '/buyOrder', name: '采购订单', component: BuyOrder, meta: { title: '采购订单' } },
        { path: '/saleOrder', name: '销售订单', component: SaleOrder, meta: { title: '销售订单' } }
      ]
    }
  ]
})
