// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import Login from '@/components/SystemUnit/Login'
import './assets/extra icons/iconfont.css'
import formatTimeStampToTime from '@/common/util.js';
import randomData from '@/common/util.js';
import isImg from '@/common/util.js';
import isNumed from '@/common/util.js';
import getUserImgAndSetToStore from '@/common/util.js';
import isNotNulled from '@/common/util.js';
import axios from 'axios'
import App from './App'
import Vuex from 'vuex';
import $ from 'jquery'
import store from './store/store.js';
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.use(formatTimeStampToTime);
Vue.use(randomData);
Vue.use(isImg);
Vue.use(isNumed);
Vue.use(isNotNulled);
Vue.use(getUserImgAndSetToStore);
Vue.use(ElementUI);
Vue.use(Vuex);
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
