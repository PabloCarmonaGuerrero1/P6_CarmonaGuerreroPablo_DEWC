import { createStore } from 'vuex';  

export default createStore({
  state: {
    isFriend: false,
  },
  mutations: {
    setFriendStatus(state, status) {
      state.isFriend = status;
    },
  },
  actions: {
    updateFriendStatus({ commit }, status) {
      commit('setFriendStatus', status);
    },
  },
  getters: {
    getFriendStatus: state => state.isFriend,
  },
});
