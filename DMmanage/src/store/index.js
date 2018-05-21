

import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        uid: 0,
        token:''
    },
    strict: false,
    plugins: []
})
