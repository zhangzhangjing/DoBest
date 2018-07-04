<template>
  <div id="app">
    <img id="bg_img" class="curBg" v-if="show" :src="imgSrc" style="width: 100%;height: 100%">
    <div class="coverbg" v-show="!show">
      <p class="tips">网页加载中，请耐心等候……</p>
      <img class="loading" src="http://www.86y.org/images/loading.gif"/>
    </div>
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
  },
  data(){
      return {
        loading: false,
        imgSrc:'',
        count : 0,
        show : false
      }
  },
  methods:{
  },
  mounted(){
    var _that = this
    var newImg = new Image()
    newImg.src = 'http://www.lenuse.cn/gas/static/img/bg.eea018f.jpg';
    newImg.onerror = (error) => {    // 图片加载错误时的替换图片
      console.log(error)
      _that.imgSrc = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1489486509807&di=22213343ba71ad6436b561b5df999ff7&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F77%2F31%2F20300542906611142174319458811.jpg'
    }
    newImg.onload = function () {
      // 图片加载成功后把地址给原来的img
      _that.imgSrc = newImg.src
      _that.show = true
    }
  },
  watch:{

  }
}
</script>

<style lang="stylus">
.curBg
  width 100%
  height 100%
.coverbg
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  background: #fff;
.loading
  position absolute
  top 50%
  left 50%
.tips
  position absolute
  width 260px
  top 30%
  left calc(50% - 100px)
</style>
