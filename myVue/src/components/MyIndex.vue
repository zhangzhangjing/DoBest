<template>
  <div class="hello">
    <main-header message="首页"></main-header>
    <div class="bgfixed">
      <div class="meng">
        <div class="content_sy">
          <div class="contenter">
            <div class="wenzi">
              <div class="h1">Reliable, Simple and Secure Platform</div>
              <div class="h2">Sandboxing UDID content management system ruby on rails continuous deployment big data infographic. Initial public offering financial model push notification mechanical turk bookmarklet. Term sheet convertible note colluding bootstrapping.</div>
              <button class="standard-button">GET STARTED</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section1">
      <div class="contanier">
        <ul class="ul_item">
          <li><a><img src="../images/pic/1.png"></a></li>
          <li><a><img src="../images/pic/2.png"></a></li>
          <li><a><img src="../images/pic/1.png"></a></li>
          <li><a><img src="../images/pic/2.png"></a></li>
          <li><a><img src="../images/pic/1.png"></a></li>
          <li><a><img src="../images/pic/2.png"></a></li>
        </ul>
      </div>
    </div>
    <div class="section1 m_t_90 m_b_60">
      <div class="contanier" style="height: 500px">
       <p class="title">我们服务</p>
        <div class="colored-line"></div>
      </div>
    </div>
    <ul class="content" style="display: none">
      <tab :items="tabItems"  :content = 'tabItems' @on-click="clickItem"></tab>
      <li>
        <a href="#/MyPath">登录页面</a>
      </li>
      <li>
        <a href="#" @click= 'routerIn'>todoList</a>
      </li>
      <li>
        <a href="#/CountNum">点击添加记录</a>
      </li>
      <li>
        <a href="#/WorkList">工作计划列表</a>
      </li>
      <li>
        <a href="#/MacDetail">Mac</a>
      </li>
      <li>
        <a href="#/PersonalCenter">个人中心</a>
      </li>
      <li>
        <a href="#/ReactStudy">视频看点</a>
      </li>
      <li>
        <a href="#/Product">产品管理</a>
      </li>
    </ul>
  </div>
</template>

<script>
import MainHeader from './header.vue'
import Tab from '@/components/tab.vue'
export default {
  name: 'MyIndex',
  data () {
    return {
      tabItems: ['选项一', '选项二','选项三', '选项四','选项五', '选项六'],
    }
  },
  components: {
    MainHeader,
    Tab,
  },
  methods: {
    routerIn: function () {
      if (sessionStorage.getItem('userInfo')) {
        this.$router.push({path: '/TodoList'})
      } else {
        this.$router.push({path: '/MyPath'})
      }
    },
    clickItem:function (item) {
      console.log(item)
    }
  }
}
</script>

<style scoped lang="stylus">
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.content
  height 500px
  width 80%
  background #ffffff
  padding 20px
  margin 0 auto
.bgfixed
  position relative
  text-align center
  min-height 80px
  height 600px
  color: #313131;
  font-size 14px
  font-weight normal
  background-attachment: fixed;
  background-position: top center;
  background-size: cover;
  background-image: url(https://demo.themeisle.com/azera-shop/wp-content/themes/azera-shop/images/background-images/background.jpg);
  display block
  box-sizing: inherit;
.meng
  background: rgba(0, 0, 0, 0.1);
  position relative
  height 600px
  background-attachment: fixed;
  background-position: top center;
  background-size: cover;
  display block
  box-sizing: inherit;
.content_sy
  width 80%
  height 600px
  margin 0 auto
.contenter
  float left
  width 100%
  height 300px
  margin-top 150px
.wenzi
  width 50%
  color white
.h1
  font-size 3.75rem
  line-height 5rem
  width 600px
  text-align left
.h2
  font-size 16px
  font-weight 300
  text-align left
  line-height 28px
  margin-top: 30px;
  margin-bottom: 40px;
.standard-button
  background-color: rgba(255,162,0,1);
  background-image url("../images/pic/tr-btn.png")
  background-repeat repeat-x
  padding: 18px 40px 18px 40px;
  border: none;
  border-radius: 3px;
  color: #fff;
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: 1px;
  text-transform: uppercase;
  webkit-box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.3);
  float left
.standard-button:hover
  background-color: rgba(255,162,0,0.8);
.ul_item li
  margin: 25px 25px 25px 25px;
  vertical-align: middle;
.title
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 2.4rem;
  line-height: 3.125rem;
  color: #454545;

</style>
