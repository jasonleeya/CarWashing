// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/styles/iconfont.css'
import '@/assets/styles/reset.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/system/url'
import store from './store'
import axios from 'axios'
import {mySelect, mySelectAll, myZhiFu, mySubmit} from './system/http'
import infiniteScroll from 'vue-infinite-scroll'
import cookie from 'vue-cookie'

Vue.use(infiniteScroll)
Vue.use(ElementUI, {size: 'small'})
Vue.use(cookie)

Vue.prototype.mySubmit = mySubmit
Vue.prototype.mySelect = mySelect
Vue.prototype.myZhiFu = myZhiFu
Vue.prototype.mySelectAll = mySelectAll
Vue.prototype.axios = axios
Vue.config.productionTip = false


var ua = navigator.userAgent.toLowerCase()
var isWeixin = ua.indexOf('micromessenger') !== -1
if (!isWeixin) {
 router.push('/onlyweixin')
}

if (cookie.get('userInfo')) {
  store.dispatch('setUser',JSON.parse(cookie.get('userInfo')))

}
router.beforeEach((to, from, next) => {


  if (to.meta.requiresAuth) {
    if (cookie.get('userInfo')) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
