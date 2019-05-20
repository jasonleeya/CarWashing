import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Index from '@/views/Index'
import IndexChip from '@/components/Chips/IndexChip'
import BranchManager from '@/components/Chips/BranchManager'
import ServiceContentMaintain from "@/components/Chips/ServiceContentMaintain";
import CarTypeMaintain from "../components/Chips/CarTypeMaintain";
import ShopMaintain from "../components/Chips/ShopMaintain";
import LookOverFeedback from "../components/Chips/LookOverFeedback";
import ModifyOrderState from "../components/Chips/ModifyOrderState";
import OrderBrowse from "../components/Chips/OrderBrowse";
import BrandMaintain from "../components/Chips/BrandMaintain";
import CarClassifyMaintain from "../components/Chips/CarClassifyMaintain";
import ModifyPassword from "../components/Chips/ModifyPassword";
import '@/assets/styles/reset.css'
import '@/assets/iconfont/iconfont.css'

Vue.use(Router);

export default new Router({
  base:'/admin/',
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    }, {
      path: '/main',
      name: 'Main',
      component: Index,
      children: [
        {
          path: 'index',
          component: IndexChip,
        }, {
          path: 'manager',
          component: BranchManager
        }, {
          path: 'servicecontent',
          component: ServiceContentMaintain
        }, {
          path: 'cartype',
          component: CarTypeMaintain
        }, {
          path: 'shop',
          component: ShopMaintain
        }, {
          path: 'feedback',
          component: LookOverFeedback
        }, {
          path: 'brand',
          component: BrandMaintain
        }, {
          path: 'carclassify',
          component: CarClassifyMaintain
        }, {
          path: 'modifypwd',
          component: ModifyPassword
        }
      ]
    },
    {
      path: '/branch',
      name: 'Branch',
      component: Index,
      children: [
        {
          path: 'order',
          component: OrderBrowse
        }, {
          path: 'modifystate',
          component: ModifyOrderState
        }
      ]
    }
  ]
})
