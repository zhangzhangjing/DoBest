<template>
  <div class="hello">
    <p>{{msg}}</p>
    <button @click="clickme">点击我</button>
    <span>{{$store.state.count}}</span>
  </div>
</template>

<script>
export default {
  name: 'CountNum',
  data () {
    return {
      msg: '这是一个vuex的一个实例：'
    }
  },
  methods: {
    clickme: function () {
      this.$store.commit('increment', 1)
    }
  }
}
</script>

<style scoped>

</style>
