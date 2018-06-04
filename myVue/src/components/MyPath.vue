<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <div>111</div>
    <!--<p>{{ count }}</p>-->
    <!--<p>-->
      <!--<button @click="increment">+</button>-->
      <!--<button @click="decrement">-</button>-->
    <!--</p>-->
  </div>
</template>

<script>
// const store = new Vuex.Store({
//   state: {
//     count: 0
//   },
//   mutations: {
//     increment: state => state.count++,
//     decrement: state => state.count--
//   }
// })
export default {
  name: 'MyPath',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
  // computed: {
  //   count () {
  //     return store.state.count
  //   }
  // },
  // methods: {
  //   increment () {
  //     store.commit('increment')
  //   },
  //   decrement () {
  //     store.commit('decrement')
  //   }
  // }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
