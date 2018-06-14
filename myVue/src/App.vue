<template>
  <div id="app">
    <div class="cover">
      <main-header></main-header>
      <router-view/>
      <main-footer></main-footer>
    </div>
  </div>
</template>

<script>
import './style/bgimg.styl'
import MainHeader from './components/header.vue'
import MainFooter from './components/footer.vue'
export default {
  name: 'App',
  props:['myTitle'],
  components: {
    MainHeader,
    MainFooter
  }
}
</script>

<style lang="stylus">

</style>
