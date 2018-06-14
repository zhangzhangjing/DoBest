<template>
  <div class="main-content hello">
    <p>{{msg}}</p>
    <input type="number" v-model="num"/>
    <button @click="clickme">点击累加</button>
    <span>{{$store.state.count}}</span>
  </div>
</template>

<script>
export default {
  name: 'CountNum',
  data () {
    return {
      msg: '这是一个vuex的一个实例：',
      num: ''
    }
  },
  methods: {
    clickme: function () {
      this.$store.commit('increment', this.num)
      this.num = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.hello
  font-size 22px
  color #222
</style>
