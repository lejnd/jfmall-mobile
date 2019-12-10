import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/reset.css'
import './plugin/fly'

import VueMeta from 'vue-meta';

import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);
Vue.use(VueMeta);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
