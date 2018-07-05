import Vue from 'vue'
import Vuex from 'vuex'
import VideoPlayer from 'vue-video-player'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import { mutations } from '@/js/action.js'
import 'element-ui/lib/theme-chalk/index.css'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vuex)
// VideoPlayer.config({
//   youtube: true,
//   switcher: true,
//   hls: true
// })
Vue.use(VideoPlayer)

/* eslint-disable no-new */

const module = {
  state: {
    count: 0,
    tableData:[
      { id: 1,
        date: 1,
        wage:1,
        total: 1}
    ],
  },
  mutations
}
const store = new Vuex.Store(module)
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  mounted(){

  },
  data(){
    return{

    }
  }
})
