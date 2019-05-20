import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Maintain from '@/views/Maintain'
import User from '@/views/User'
import CarManage from '@/views/CarManage'
import MyOrder from '@/views/MyOrder'
import Comment from '@/views/Comment'
import Feedback from '@/views/Feedback'
import OnlyWeiXin from '@/views/OnlyWeiXin'

Vue.use(Router)

export default new Router({
  base:'/user/',
  // mode: 'history',
  routes: [
    {
      path: '/onlyweixin',
      name: 'OnlyWeixin',
      component: OnlyWeiXin,
      meta:{
        keepAlive:false,
        requiresAuth: false
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta:{
        keepAlive:false
      }
    },
    {
      path: '/',
      name: 'Maintain',
      component: Maintain,
      meta:{
        keepAlive:false,
        requiresAuth: true
      },

    },
    {
      path: '/user',
      name: 'User',
      component: User,
      meta:{
        keepAlive:true,
        requiresAuth: true
      }
    },
    {
      path: '/carmanage',
      name: 'CarManage',
      component: CarManage,
      meta:{
        keepAlive:false,
        requiresAuth: true
      }
    },
    {
      path: '/myorder',
      name: 'MyOrder',
      component: MyOrder,
      meta:{
        keepAlive:false,
        requiresAuth: true
      }
    },
    {
      path: '/comment/:order_id/:shop_id/:vehicle_id/:project_id',
      name: 'Comment',
      component: Comment,
      meta:{
        keepAlive:false,
        requiresAuth: true
      }
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: Feedback,
      meta:{
        keepAlive:false,
        requiresAuth: true
      }
    },

  ]
})
