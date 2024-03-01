import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
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
