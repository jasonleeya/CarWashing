export default {
  state: {
    Loading: false,
    in: false,
    user: {},
    videoshow: false
  },
  mutations: {
    login(state, data) {
      state.in = true;
      state.user = data
    },
    logout(state) {
      state.in = false;
      state.user = {};
      sessionStorage.removeItem('user')
    }
  },



}
