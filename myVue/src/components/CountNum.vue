<template>
  <div >
    <main-header message="vuex"></main-header>
    <div class="main-content hello">
      <el-input type="number" v-model="num" style="width: 40%;"/>
      <el-button @click="clickme">点击累加</el-button>
      <span>{{$store.state.count}}</span>
    </div>
  </div>
</template>

<script>
import MainHeader from './header.vue'
export default {
  name: 'CountNum',
  data () {
    return {
      num: ''
    }
  },
  components: {
    MainHeader
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
