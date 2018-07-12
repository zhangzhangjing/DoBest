<template>
  <div>
    <main-header message="" returnbtn="true"></main-header>
    <el-form label-position="left" label-width="0px"  fill="#ffa200" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="phone">
        <el-input type="text" v-model="phone" auto-complete="off" placeholder="手机号/咿呀号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked"  fill="#ffa200" class="remember">记住密码</el-checkbox>
      <el-button type="text" @click="resetBtnTapped" style="float:right;">忘记密码?</el-button>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="handleSubmit2">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import MainHeader from './header.vue'
export default {
  name: 'MyPath',
  data () {
    return {
      msg: 'MyPath的页面',
      checked: true,
      phone: '18791589763',
      password: '123456'
    }
  },
  components: {
    MainHeader
  },
  methods: {
    resetBtnTapped: function () {
      console.log('记住密码')
    },
    handleSubmit2: function () {
      if (this.phone === '') {
        this.$notify.error({ title: '错误', message: '请输入用户名' })
        return false
      }
      if (this.password === '') {
        this.$notify.error({ title: '错误', message: '请输入密码' })
        return false
      }
      if (this.phone === '18791589763' && this.password === '123456') {
        this.$notify({ title: '成功', message: '登录成功！', type: 'success' })
        this.$router.push({path: '/TodoList'})
        var userInfo = {
          phone: '18791589763',
          password: '123456'
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
<style scoped>
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
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin-bottom: 20px;
  background-color: #f9fafc;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px;
}
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
</style>
