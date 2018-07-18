<template>
  <div  class="list">
    <main-header></main-header>
    <div class="main-content">
      <div class="wrap">
        <common-list @add-to-cart="addToCart"></common-list>
        <!--<div class="shopcart">-->
          <!--<shop-cart ref="cart"></shop-cart>-->
        <!--</div>-->
      </div>
    </div>

  </div>
</template>

<script>
  import MainHeader from '@/components/header.vue'
  import CommonList from './list.vue'
  // import ShopCart from './shop-cart.vue'
  export default {
    name: "index",
    components: {
      MainHeader,
      CommonList,
      // ShopCart
    },
    data () {
      return {

      }
    },
  methods: {
    addToCart (target) {
      this.$refs.cart.drop(target)
    }
  }
  }

</script>

<style scoped>

</style>
