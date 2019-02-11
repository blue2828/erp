import Vue from 'vue';
import Vuex from 'vuex';
Vue.use (Vuex);
let store = new Vuex.Store({
  state: {
    avatar: ''
  },
  actions: {
    setAvatarUrl ({ commit, state }, newAvatar) {
      commit("setAvatar", newAvatar);
    }
  },
  mutations : {
    setAvatar (state, newAvatar) {
      state.avatar = newAvatar;
    }
  },
  getters: {
    getAvatar (state) {
      return state.avatar;
    }
  }

});

export default store;
