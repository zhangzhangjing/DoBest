<template>
  <div id="app">
    <div class="cover">
      <router-view/>
      <main-footer></main-footer>
    </div>
  </div>
</template>

<script>
import './style/bgimg.styl'
import MainFooter from './components/footer.vue'
export default {
  name: 'App',
  props:['myTitle'],
  components: {
    MainFooter
  }
}
</script>

<style lang="stylus">

</style>
