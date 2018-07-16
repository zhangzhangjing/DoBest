<template>
  <div>
    <main-header message="" returnbtn="true"></main-header>
    <el-form label-position="left" label-width="0px"  fill="#ffa200" class="demo-ruleForm login-container">
      <div class="contentre">
        <div class="u-input m_t_30">
          <label>帐&nbsp;&nbsp;号</label>
          <div class="inputWrapper">
            <input type="text" v-model="phone" placeholder="请输入手机号码或邮箱" class="inputme" v-on:change="changePhone"/>
          </div>
          <span class="msg z-err">
            <span v-show="phoneTip">
              <i class="el-icon-circle-close"></i><font>请输入帐号</font>
            </span>
					</span>
        </div>

        <div class="u-input">
          <label>密&nbsp;&nbsp;码</label>
          <div class="inputWrapper">
            <input type="password" v-model="password" placeholder="4-20个字符，区分大小写" class="inputme" v-on:change="changePassword"/>
          </div>
          <span class="msg z-err">
            <span v-show="passwordTip">
						  <i class="el-icon-circle-close"></i><font>请输入密码</font>
            </span>
					</span>
        </div>

        <div class="u-input" style="margin-bottom: 15px">
          <label>验证码</label>
          <div class="inputWrapper">
            <input type="text" v-model="vcode" placeholder="请输入验证码" class="inputme" v-on:change="changeVcode"/>
            <div class="vcode">
              <button class="btnvcode" @click="vcodeBtn" v-if="!btnFlag">获取验证码</button>
              <button class="btnvcode" v-if="btnFlag">{{codeTips}}</button>
            </div>
          </div>
          <span class="msg z-err">
            <span v-show="vcodeTip">
						  <i class="el-icon-circle-close"></i><font>请获取验证码</font>
            </span>
					</span>
        </div>

        <div class="u-input" style="margin-bottom: 10px">
          <label></label>
          <div class="inputWrapper b_b_n">
            <el-checkbox v-model="checked"  fill="#ffa200" class="remember">我同意《服务条款》及《法律声明》</el-checkbox>
          </div>
          <span class="msg z-err" style="display: inline-block;">
					</span>
        </div>

        <div class="u-input">
          <label></label>
          <div class="inputWrapper b_b_n">
            <el-button type="primary" style="width:100%;" @click="handleSubmit2">免费注册</el-button>
          </div>
          <span class="msg z-err" style="display: inline-block;">
					</span>
        </div>

      </div>
    </el-form>
  </div>
</template>

<script>
  import MainHeader from '@/components/header.vue'
  export default {
    name: 'index',
    data () {
      return {
        msg: 'MyPath的页面',
        checked: true,
        phone: '',
        password: '',
        vcode:'',
        phoneTip:false,
        passwordTip:false,
        vcodeTip:false,
        codeTips:'获取验证码',
        btnFlag:false,
      }
    },
    components: {
      MainHeader
    },
    methods: {
      resetBtnTapped: function () {
        console.log('记住密码')
      },
      changePhone:function(){
        if (this.phone ) {
          this.phoneTip = false
        }
      },
      changePassword:function(){
        if (this.password ) {
          this.passwordTip = false
        }
      },
      changeVcode:function(){
        if (this.vcode ) {
          this.vcodeTip = false
        }
      },
      vcodeBtn(){
        var that = this
        if (this.phone === '') {
          this.phoneTip = true
          return false
        }
        var i = 60
        var timer = setInterval(function(){ myTimer() }, 1000);
        function myTimer() {
          i--
          that.codeTips = i + "秒"
          that.btnFlag = true
          if(i == 0){
            that.btnFlag = false
            clearInterval(timer)
          }
        }

      },
      handleSubmit2: function () {
        if (this.phone === '') {
          this.phoneTip = true
          return false
        }
        if (this.password === '') {
          this.passwordTip = true
          return false
        }
        if (this.vcode === '') {
          this.vcodeTip = true
          return false
        }
        if (this.phone === '18791589763' && this.password === '123456') {
          this.$notify({ title: '成功', message: '登录成功！', type: 'success' })
          this.$router.push({path: '/PersonalCenter'})
          var userInfo = {
            phone: '18791589763',
            password: '123456',
            vcode:'1234'
          }
          sessionStorage.setItem('userInfo', userInfo)
        } else {
          this.$notify.error({ title: '错误', message: '用户名或密码错误，请检查再登录' })
          return false
        }
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  .login-container {
    border-top: 5px solid #ffa200;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin-bottom: 20px;
    background-color: #fff;
    margin: 100px auto;
    width: 800px;
    padding: 35px 35px 15px;
    box-shadow: 0 0 9px 0 rgba(92,128,255,0.17);
  }
  .contentre
    width 800px
  .remember {
    margin: 0 0 35px;
  }
  .el-checkbox {
    cursor: pointer;
    display: inline-block;
    position: relative;
    white-space: nowrap;
    float: left;
  }
  .u-input
    position: relative;
    width: 100%;
    margin-bottom 45px
  .vcode
    position absolute
    width 50%
    right 0
    height 50px
    background #fff
    bottom -2px
  .btnvcode
    border 1px solid #ffa200
    height: 30px;
    padding: 5px 15px;
    border-radius: 3px;
    background: #fff;
    vertical-align: middle;
    margin-top: 10px;
    cursor pointer
    outline none
    color #ffa200
  .u-input .b_b_n
    border-bottom none
  .u-input label
    width: calc(30% - 15px);
    display: inline-block;
    text-align: right;
    font-size: 16px;
    padding-right 15px
    color: #738299;
    font-family: "微软雅黑";
    margin-bottom: 4px;
  .u-input .msg
    width: calc(32% - 10px);
    position: relative;
    text-align left
    margin-left 10px
    font-size 12px
    color red
    display inline-block
  .inputWrapper
    width: 36%;
    height 30px
    position: relative;
    display inline-block
    border-bottom: 1px solid #ddd;
  .inputme
    border none
    outline none
    width 90%
    background none
</style>
