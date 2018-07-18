<template>
  <div class="shop-cart">
    <div class="cart">
      <i class="el-icon-goods"></i>
    </div>
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

<style scoped>

</style>
