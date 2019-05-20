import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  isLogin: false,
  currentUser: {},
  token: '',
  choosedShop: '',
  pQueue:'',
  choosedProject:'',
  shopLineList: []
}

const mutations = {
  userStatus (state, user) {
    state.currentUser = {}
    state.currentUser = user
    state.isLogin = true


    // else if (user === null) {
    //   sessionStorage.setItem('phone', null)
    //   // sessionStorage.setItem('userToken', '')
    //   state.currentUser = null
    //   state.isLogin=false
    //   state.token = ''
    // }
  },
  shopStatus (state, shop) {
    state.choosedShop=shop
  },
  pQueueStatus (state,pQueue) {
    state.pQueue=pQueue
  },
  choosedProjectStatus (state,choosedProject) {
    state.choosedProject=choosedProject
  },
  shopListStatus (state, shopList) {
    state.shopLineList=shopList
  }
}

const actions = {
  setUser ({commit}, user) {
    commit('userStatus', user)
  },
  setShop ({commit}, shop) {
    commit('shopStatus', shop)
  },
  setQueue ({commit},queue) {
    commit('pQueueStatus', queue)
  },
  setChoosedProject ({commit},choosedProject) {
    commit('choosedProjectStatus', choosedProject)
  },
  setShopList({commit},shopList) {
    commit('shopListStatus', shopList)
  }

}

export default new Vuex.Store({
  state,
  actions,
  mutations
})

