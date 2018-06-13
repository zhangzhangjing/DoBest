// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vuex)

/* eslint-disable no-new */
const module = {
  state: {
    count: 0
  },
  mutations: {
    increment (state, n) {
      state.count += n * 1
      console.log(state.count)
    }
  }
}
const store = new Vuex.Store(module)
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
