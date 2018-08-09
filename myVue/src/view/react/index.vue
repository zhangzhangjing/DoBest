<template>
<div  class="list">
  <main-header message="视频看点" returnbtn="true"></main-header>
  <div class="main-content">

    <video-player  class="video-player vjs-custom-skin"
                   ref="videoPlayer"
                   :playsinline="true"
                   :options="playerOptions"
                   @play="onPlayerPlay($event)"
                   @pause="onPlayerPause($event)"
                   @on-change="progressChange($event)"
                   @statechanged="playerStateChanged($event)"
                   @ended="onPlayerEnded($event)"
    ></video-player>


    <div class="wrap">
      <div class="bg_con" :class="{actX:type===1,actY:type===2}">
        <div class="item" v-for="(item,index) of imgLists" :key="item" :class="{active:index < currentIndex}">
          <img :src="item" alt="商品图片">
        </div>
      </div>
    </div>

  </div>
</div>
</template>

<script>
  var $ = require("jquery");
  import AlloyFinger from 'alloyfinger'
  import MainHeader from '@/components/header.vue'
  import { videoPlayer } from 'vue-video-player'
  import cts from '@/fun/cts.js'
  import {Promise} from 'core-js';
    export default {
      name: "index",
      components: {
        MainHeader,
        videoPlayer,
      },
      data(){
        return{
          progress: 0,
          playerOptions : {
            playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
            autoplay: false, //如果true,浏览器准备好时开始回放。
            muted: false, // 默认情况下将会消除任何音频。
            loop: false, // 导致视频一结束就重新开始。
            preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
            language: 'zh-CN',
            aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
            fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            sources: [{
              type: "video/mp4",
              src: "http://movie.ks.js.cn/flv/other/1_0.mp4" //url地址
            }],
            poster: "http://www.ckplayer.com/static/images/letitgo.jpg",
            // width: document.documentElement.clientWidth,
            notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
            controlBar: {
              timeDivider: true,
              durationDisplay: true,
              remainingTimeDisplay: false,
              fullscreenToggle: true
            },
          },
          page: 1,
          currentIndex:0,
          type:2,
          imgLists:[
            'http://www.lenuse.cn/gas/images/aa.jpg',
            'http://www.lenuse.cn/gas/images/cha.jpg',
            'http://www.lenuse.cn/gas/images/dangao.jpg',
            'http://www.lenuse.cn/gas/images/dd.jpg',
            'http://www.lenuse.cn/gas/images/ee.jpg',
            'http://www.lenuse.cn/gas/images/ff.jpg',
            'http://www.lenuse.cn/gas/images/gg.jpg',
            'http://www.lenuse.cn/gas/images/qq.jpg',
            'http://www.lenuse.cn/gas/images/rr.jpg',
            'http://www.lenuse.cn/gas/images/ss.jpg',
            'http://www.lenuse.cn/gas/images/tt.jpg',
            'http://www.lenuse.cn/gas/images/ww.jpg',
            'http://www.lenuse.cn/gas/images/yy.jpg',
          ],
          myTime:''
        }
      },
      methods:{
        progressChange(val){
          this.player.currentTime(val);
          this.player.play();
          sessionStorage.setItem("currentTime",val);
        },
        onPlayerPlay(val) {
          //获取历史播放进度
          this.progress = sessionStorage.getItem("currentTime");
          console.log(this.progress)
          this.player.currentTime(this.progress);
          this.player.play();
        },
        onPlayerPause(player){
          var currentTime = player.cache_.currentTime
          sessionStorage.setItem("currentTime",currentTime);
          this.progress =  sessionStorage.getItem("currentTime");

        },
        playerStateChanged(playerCurrentState) {
          // console.log(playerCurrentState)
          // var stopTime = playerCurrentState.timeupdate
          // sessionStorage.setItem("stopTime",stopTime);
        },
        onPlayerEnded(player){

        },
        progressTouchEnd(player){
          console.log(player)
        },
        getMsgAjax(){
          cts.getListMsg().then((response) => {
            var list = response.list || [];
            console.log(list)
          }).catch(error =>{
            console.log(error)
          })

        },
        Animation(){
          let that = this
          // 自动翻页
          clearInterval(that.myTime)
          that.myTime = setInterval(() => {
            if (that.currentIndex !== len) {
              that.currentIndex = that.currentIndex + 1 < len ? that.currentIndex + 1 : len
            } else {
              that.currentIndex = 0
            }
          }, 2000)

          // 翻页动画
          let af = document.querySelector('.bg_con')
          af.addEventListener('touchstart', function (event) {
            event.preventDefault()
          })
          let len = that.imgLists.length
          var myAf = new AlloyFinger(af, {
            swipe: function (e) {
              if (e.direction === 'Up') {
                console.log('Up')
                that.currentIndex = that.currentIndex + 1 < len ? that.currentIndex + 1 : len
              } else if (e.direction === 'Down') {
                console.log('Down')
                that.currentIndex = that.currentIndex > 0 ? that.currentIndex - 1 : 0
              }
              clearInterval(that.myTime)
              console.log(that.currentIndex)
            }
          })
          console.log(myAf)
        }
      },
      computed:{
        player(){
          return this.$refs.videoPlayer.player
        },
      },
      destroyed: function () {
        // console.log("我已经离开了！");
      },
      mounted(){
        this.Animation()
      },

    }
</script>

<style scoped lang="stylus">
.video-player
    width: 50%;
    height: 80%;
    margin 0 auto
.btn
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
.wrap
  width 80%
  margin 50px auto
  border 1px solid #eee
.bg_con
  width 60%
  height 500px
  margin 30px auto
  background #ffffff
  box-shadow 10px 10px 10px #eeeeee
  position relative
.item
  width 100%
  height inherit
  background #ffffff
  position absolute
  left 0
  top 0
.item img
  width 100%
  height inherit
.bg_con div
  transition all .8s linear
  transform-origin top
.bg_con .item:nth-child(1)
  z-index 36
.bg_con .item:nth-child(2)
  z-index 35
.bg_con .item:nth-child(3)
  z-index 34
.bg_con .item:nth-child(4)
  z-index 33
.bg_con .item:nth-child(5)
  z-index 32
.bg_con .item:nth-child(6)
  z-index 31
.bg_con .item:nth-child(7)
  z-index 30
.bg_con .item:nth-child(8)
  z-index 29
.bg_con .item:nth-child(9)
  z-index 28
.bg_con .item:nth-child(10)
  z-index 27
.bg_con .item:nth-child(11)
  z-index 26
.bg_con .item:nth-child(12)
  z-index 25
.bg_con .item:nth-child(13)
  z-index 24
.bg_con .item:nth-child(14)
  z-index 23
.bg_con .item:nth-child(15)
  z-index 22
.bg_con .item:nth-child(16)
  z-index 21
.bg_con .item:nth-child(17)
  z-index 20
.bg_con .item:nth-child(18)
  z-index 19
.bg_con .item:nth-child(19)
  z-index 18
.bg_con .item:nth-child(20)
  z-index 17
.bg_con .item:nth-child(21)
  z-index 15
.bg_con .item:nth-child(22)
  z-index 15
.bg_con .item:nth-child(23)
  z-index 14
.bg_con .item:nth-child(24)
  z-index 13
.bg_con .item:nth-child(25)
  z-index 12
.bg_con .item:nth-child(26)
  z-index 11
.bg_con .item:nth-child(27)
  z-index 10
.bg_con .item:nth-child(28)
  z-index 9
.bg_con .item:nth-child(29)
  z-index 8
.bg_con .item:nth-child(30)
  z-index 7
.bg_con .item:nth-child(31)
  z-index 6
.bg_con .item:nth-child(32)
  z-index 5
.bg_con .item:nth-child(33)
  z-index 4
.bg_con .item:nth-child(34)
  z-index 3
.bg_con .item:nth-child(35)
  z-index 2
.bg_con .item:nth-child(36)
  z-index 1
.actX div
  transform rotateX(0deg) skewX(180deg)
.actY div
  transform rotateY(0deg) skewY(0deg)
  transform-origin 0 50%
.actX .active
  transform rotateX(270deg) skewX(185deg)
.actY .active
  transform rotateY(-90deg) skewY(-20deg)
// transform rotateX(270deg)




</style>
