<template>
    <div class="main-header">
      <div class="navbar">
        <div class="container">
          <div class="header-container-wrap">
            <div class="nav-logo">
              <div class="logo-link">
                <a href="" class="link-a">
                  <img src="../../src/images/pic/logo-nav.png" alt="logo" class="logo-pic">
                </a>
              </div>
            </div>
            <div class="header-nav-wrap">
              <ul class="ul_item">
                <li><a href="" @click="routerToIndex">网站首页</a></li>
                <li><a href="#/product">产品管理</a></li>
                <li><a href="#/countnum">财务明细</a></li>
                <li><a href="#/worklist">工作流</a></li>
                <li><a href="#/reactstudy">视频看点</a></li>
                <li v-if="!sessionFlag"><a href="#/login">登录</a></li>
                <li v-if="sessionFlag" class="p_r_0">
                  <a>您好，
                    <span class="mestyle">
                      <span class="color1">Mrs 薄荷凉 </span>
                      <i class="el-icon-arrow-down"></i>
                      <div class="iltemsme">
                        <a href="#/personalcenter">个人中心</a>
                        <a href="#/cart">我的购物车</a>
                        <a @click="clearUserinfo">退出</a>
                      </div>
                    </span>
                  </a>
                </li>
                <li v-if="sessionFlag">
                  <shop-cart ref="cart"></shop-cart>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!--<el-button class="btn-return" icon="el-icon-arrow-left" circle @click="routerToIndex" v-show="returnbtn"></el-button>-->
      <!--<span>{{message}}</span>-->
    </div>
</template>

<script>
  import ShopCart from '@/view/cart/shop-cart.vue'
export default {
  name: 'MainHeader',
  props: ['message','returnbtn'],
  data () {
    return {
      myTitle: 'TodoList',
      // returnBtn: true
      sessionFlag:false
    }
  },
  components:{
    ShopCart
  },
  methods:{
    routerToIndex(){
      this.$router.push({path: '/'})
    },
    obtainSessionMsg(){
      var userInfo = sessionStorage.getItem("userInfo");
      if(userInfo){
        this.sessionFlag = true
      }
    },
    clearUserinfo(){
      sessionStorage.removeItem('userInfo')
      this.sessionFlag = false
      this.$router.push({path: '/'})
    },
  },
  created(){
    const urlstr = window.location.href
    const reg =/\/$/
    if(reg.test(urlstr)){
    }
    this.obtainSessionMsg()
  }
}
</script>

<style scoped lang="stylus">
.main-header
  position relative
  text-align center
  min-height 80px
  /*height 700px*/
  color: #313131;
  font-size 14px
  font-weight normal
  background-attachment: fixed;
  background-position: top center;
  background-size: cover;
  background-image: url(https://demo.themeisle.com/azera-shop/wp-content/themes/azera-shop/images/background-images/background.jpg);
  display block
  box-sizing: inherit;
.navbar
  width 100%
  position fixed
  top: 0;
  opacity: 1;
  min-height: 70px;
  line-height 80px
  margin-bottom: 0px !important;
  -webkit-box-shadow: 0 2px 8px 0 rgba(50, 50, 50, 0.08);
  box-shadow: 0 2px 8px 0 rgba(50, 50, 50, 0.08);
  background #ffffff
  z-index 999
.btn-return
  position absolute
  left 10%
  top 20px
.ul_item .p_r_0
  padding-right 0


@media  screen and (min-width:1200px){
  .container {
    width: 1170px;
  }
}


@media screen and (min-width: 992px) and (max-width:1199px){
  .container {
    width: 970px;
  }
}

@media screen and (min-width: 768px) and (max-width:991px){
  .container {
    width: 750px;
  }
}

.container {
  margin-right: auto;
  margin-left: auto;
  padding-left: 15px;
  padding-right: 15px;
  width 80%
}
.header-container-wrap
  display: table;
  width: 100%;
.nav-logo
  display: table-cell;
  float: left;
  width: 180px;
  box-sizing: inherit;
  vertical-align: middle;
.logo-link
  display: table-cell;
  width: 180px;
  padding: 12px 0;
  text-align: center;
  vertical-align: middle;
.link-a
  height: 70px;
  padding: 7px 7px 7px 0;
  line-height: 52px;
  margin-left: 0;
  display block
.logo-pic
  display: inline-block;
  max-height: 56px;
  vertical-align: middle;
  margin-top: 14px;
.header-nav-wrap
  display: table-cell;
  vertical-align: middle;
.ul_item
  display block
  float right
.ul_item li
  list-style none
  display inline-block
  padding-right 15px
.ul_item li a
  display block
  text-decoration none
  color: #313131;
.ul_item li a :link,.ul_item li a :visited
  color: #313131;
.mestyle
  display: inline-block;
  height: 30px;
  line-height: 30px;
  padding: 5px 10px;
  position relative
  cursor pointer
.color1
  color #FF8400
.mestyle:hover
  background #eeeeee
.iltemsme
  display none
  position absolute
  left 0
  top 38px
  width 100%
  background #ffffff
.mestyle:hover .iltemsme
  display block
.iltemsme a
  display block
  height 30px
  line-height 30px
  border 1px solid #FECC5B
  border-top none
  padding-left 10px
  text-align left
  text-decoration none
.iltemsme a:hover
  background #fff5da

</style>
