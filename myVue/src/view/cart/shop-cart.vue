<template>
  <div class="shop-cart">
    <a class="cart" href="#/cart">
      <img class="cart_ico" src="http://www.lenuse.cn/gas/images/cart_ico.png" alt="购物车"/>
    </a>
    <shop-cart-balls ref="ball"></shop-cart-balls>
  </div>
</template>

<script>
  import ShopCartBalls from './shop-cart-balls.vue'
    export default {
      name: "shop-cart",
      data () {
        return {

        }
      },
      components: {
        ShopCartBalls
      },
      methods: {
        drop (target) {
          this.$refs.ball.drop(target)
        }
      }
    }
</script>

<style scoped lang="stylus">
  .cart_ico
    width 15px
    height 15px


</style>
