<template>
    <div class="main-header">
      <el-button class="btn-return" icon="el-icon-arrow-left" circle @click="routerToIndex" v-show="returnBtn"></el-button>
      <span>{{message}}</span>
    </div>
</template>

<script>
export default {
  name: 'MainHeader',
  props: ['message'],
  data () {
    return {
      myTitle: 'TodoList',
      returnBtn: true
    }
  },
  methods:{
    routerToIndex(){
      this.$router.push({path: '/'})
    }
  },
  created(){
    const urlstr = window.location.href
    const reg =/\/$/
    if(reg.test(urlstr)){
      this.returnBtn = true
    }
  }
}
</script>

<style scoped lang="stylus">
.main-header
  position relative
  text-align center
  font-size 40px
  color #D03438
  height 80px
  line-height 80px
.btn-return
  position absolute
  left 10%
  top 20px
</style>
