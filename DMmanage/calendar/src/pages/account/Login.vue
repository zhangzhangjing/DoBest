<template>
  <el-form :model="form" :rules="rules" mod label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="phone">
      <el-input type="text" v-model="form.phone" auto-complete="off" placeholder="手机号/咿呀号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="form.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-button type="text" @click="resetBtnTapped" style="float:right;">忘记密码?</el-button>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  //import { requestLogin } from '../api/api';
  import api from '../../api/api';
  import Role from 'common/js/role.js';
  import RouteUtil from 'common/js/RouteUtil.js'
  import NProgress from 'nprogress'
  import freelanceRoutes from '../../route/routes_freelance.js'


  export default {
    data() {
      return {
        logining: false,
        phone:'',
        password:'',
        form:{phone:'', password:''},
        rules: {
          phone: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        checked: true
      };
    },
    mounted:function(){
      this.form.phone = localStorage.getItem("phone");
      this.form.password = localStorage.getItem("password");
    },
    methods: {
      handleSubmit2(ev) {
            var that = this;

            this.logining = true;
            NProgress.start();

            var phone = this.form.phone;
            var password = this.form.password;

            localStorage.setItem("phone", phone);
            localStorage.setItem("password", password);

            api.general.login(phone, password).then(response => {
                  var identity = response.identity || 0;
                  this.logining = false;
                  NProgress.done();
                  sessionStorage.setItem('ticket', response.ticket);
                  sessionStorage.setItem('uid', response.userId);
                  sessionStorage.setItem('identity', identity);
                  sessionStorage.setItem('user', JSON.stringify(response));


                  if(identity == Role.Freelance)
                  {
                      var routes = freelanceRoutes;
                  }
                  else
                  {
                      var routes = RouteUtil.routes;
                  }
                  RouteUtil.addRoutes(this.$router, routes);
                  RouteUtil.addRoutes(this.$router, [{ path: '*', hidden: true, privileges:0, redirect: { path: '/404' } }]);

                  console.log('platform:', that.platform);
                //   var route = routes[0].children[0];
                //   if (route){
                //       that.$router.push({ name: route.name });
                //   }
                if(that.platform == 'ibs'){
                    if (Role.permitted(identity,Role.CalendarProducer))
                    {
                          that.$router.push({ name: 'FactoryOrder' });
                    }
                    else if (Role.permitted(identity,Role.CalendarTrafficsource))
                    {
                          that.$router.push({ name: 'MineOrder' });
                    }
                    else if (Role.permitted(identity,Role.CalendarAgency))
                    {
                          that.$router.push({ name: 'Trafficsources' });
                    }
                    else
                    {
                          that.$router.push({ path: '/401' });
                    }
                }
                else if(that.platform == 'cts'){
                    if (Role.permitted(identity,Role.CTSAdmin | Role.CTSUser))
                    {
                          that.$router.push({ name: 'ApplicationReview' });
                    }
                    else if (Role.permitted(identity,Role.CalendarFinancial))
                    {
                          that.$router.push({ name: 'Finance' });
                    }
                    else
                    {
                          that.$router.push({ path: '/401' });
                    }
                }





            }).catch(error => {
              this.logining = false;
              NProgress.done();
              this.$notify({ title: '错误', message: error.message || "登陆失败", type: 'error' });
            });
      },
      resetBtnTapped:function(){
          this.$router.replace({ path: '/password_reset' });
      }



    }//end methods
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin-bottom: 20px;
    background-color: #F9FAFC;
    margin: 180px auto;
    border: 2px solid #8492A6;
    width: 350px;
    padding: 35px 35px 15px 35px;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
