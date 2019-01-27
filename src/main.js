// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import Login from '@/components/SystemUnit/Login'
import './assets/extra icons/iconfont.css'
import axios from 'axios'
Vue.prototype.$http = axios;
Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  el: '#app',
  router,
  components: { Login },
  template: '<Login/>'
})
