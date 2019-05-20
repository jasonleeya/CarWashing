// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import '@/system/url'

import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'


import {mySelect,mySelectAll,myZhiFu,mySubmit} from './system/http'

import VueBus from 'vue-bus';

Vue.use(VueBus);

Vue.prototype.mySubmit = mySubmit;
Vue.prototype.mySelect = mySelect;
Vue.prototype.myZhiFu = myZhiFu;
Vue.prototype.mySelectAll = mySelectAll;

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.axios = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,

  components: { App },
  template: '<App/>'
})
