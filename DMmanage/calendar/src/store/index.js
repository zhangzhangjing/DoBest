

import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        uid: 0,
        token:'',
        products:'',
      
    },
    mutations: {
       
        setData(state,item){          
            state.products=item //修改数据库 
            // this.$store.commit('setData', item)
        }
    },
    getters: {
        done(state) {
          return state.products;  //获取数据库
        //   this.$store.getters.done
        }
    },
    strict: false,
    plugins: []
})
