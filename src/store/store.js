import Vue from 'vue';
import Vuex from 'vuex';
import manHeader from '../assets/images/manHeader.jpg';
import wmHeader from '../assets/images/wmHeader.jpg';
Vue.use (Vuex);
let store = new Vuex.Store({
  state: {
    avatar: ''
  },
  actions: {
    setAvatarUrl ({ commit, state }, newAvatar) {
      commit('setAvatar', newAvatar);
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
