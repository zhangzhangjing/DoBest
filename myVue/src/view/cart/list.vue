<template>
  <!-- list.vue -->
  <ul class="main">
    <li class="item" v-for="item in commonList" :key="item.id">
      <span style="float: left;">{{item.name}}</span>
      <span @click="addToShopCart($event, item.id)"><i class="el-icon-circle-plus"></i></span>
    </li>
  </ul>
</template>

<script>

  export default {
    name: 'list',
    data () {
      return {
        commonList:[
          {id:0,name:'产品1'},
          {id:1,name:'产品2'},
          {id:2,name:'产品3'},
          {id:3,name:'产品4'},
          {id:4,name:'产品5'}
          ]
      }
    },
    methods: {
      addToShopCart(){
        this.$emit('add-to-cart', event.target)
      }


    }
  }

</script>


<style scoped lang="stylus">
.item
  width 100%
  height 45px
  line-height 45px
  list-style none
  float left
</style>
