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

    <el-button  class="btn" @click="getMsgAjax">点击</el-button>
  </div>
</div>
</template>

<script>
  import MainHeader from '@/components/header.vue'
  import { videoPlayer } from 'vue-video-player'
  import cts from '@/fun/cts.js'
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
          page: 1
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
          cts.getListMsg()
        }
      },
      computed:{
        player(){
          return this.$refs.videoPlayer.player
        }
      },
      destroyed: function () {
        console.log("我已经离开了！");
      },

    }
</script>

<style scoped lang="stylus">
.video-player
    width: 50%;
    height: 80%;
.btn
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;


</style>
