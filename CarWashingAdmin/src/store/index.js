import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

import login from './login'

export default new vuex.Store({
    modules: {
        login: login
    }
})