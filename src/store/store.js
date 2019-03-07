import Vue from 'vue';
import Vuex from 'vuex';
import manHeader from '../assets/images/manHeader.jpg';
import wmHeader from '../assets/images/wmHeader.jpg';
Vue.use (Vuex);
let store = new Vuex.Store({
  state: {
    avatar: '',
    currentUser: ''
  },
  actions: {
    setAvatarUrl ({ commit, state }, newAvatar) {
      commit('setAvatar', newAvatar);
    },
    setCurrentUser ({ commit, state }, newUser) {
      commit('setCurrentUser', newUser)
    }
  },
  mutations : {
    setAvatar (state, newAvatar) {
      state.avatar = newAvatar;
    },
    setCurrentUser (state, newUser) {
      state.currentUser = newUser;
    }
  },
  getters: {
    getAvatar (state) {
      return state.avatar;
    },
    getCurrentUser (state) {
      return state.currentUser;
    }
  }

});

export default store;
