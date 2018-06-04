<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <button @click="clickme">点击我</button>
    <span>{{$store.state.count}}</span>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    clickme: function () {
      this.$store.commit('increment', 1)
    }
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
