<template>
  <el-form :model="form" :rules="rules2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">密码找回</h3>

    <el-form-item prop="phone">
        <el-input type="text" v-model="form.phone" auto-complete="off" placeholder="请输入手机号码"></el-input>
    </el-form-item>

    <el-form-item prop="verificationCode">
        <el-col :span="18">
            <el-input type="text" v-model="form.verificationCode" auto-complete="off" placeholder="请输入短信验证码"></el-input>
        </el-col>
        <el-col :span="6">
            <el-button :plain="true" :disabled="residueTime > 0" @click="codeBtnTapped">{{codeButtonLabel}}</el-button>
        </el-col>
    </el-form-item>

    <el-form-item prop="password">
        <el-input type="password" v-model="form.password" auto-complete="off" placeholder="请输入密码"></el-input>
    </el-form-item>

    <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">修改密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import api from '../../api/api';
  import NProgress from 'nprogress'
  //import routes from '../routes'
  export default {
    data() {
      return {
        logining: false,
        form:{phone:'',password:'',verificationCode:''},
        intervalID:'',
        smsSendTime:0,
        GetVerifyCodeCDTime:60,
        residueTime:-1,
        codeButtonLabel:'',
        rules2: {
          phone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          verificationCode:[
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      handleSubmit2(ev) {
            var that = this;

            this.logining = true;
            NProgress.start();

            var phone = this.form.phone;
            var password = this.form.password;
            var code = this.form.verificationCode;

            api.general.passwordReset(phone, password, code).then(response => {

              this.logining = false;
              NProgress.done();
              this.$notify({ title: '成功', message: "密码已修改", type: 'success' });

              localStorage.setItem("phone", phone);
              localStorage.setItem("password", password);

              that.$router.push({ path: '/login' });

            }).catch(error => {
              this.logining = false;
              NProgress.done();
              this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
            });
      },
      codeBtnTapped:function(){
            var that = this;
            var phone = this.form.phone;
            // if (!phone)
            // {
            //     $.toast("输入手机号", "cancel");
            //     return;
            // }

            if(this.residueTime > 0)
            {
                return;
            }

            var intervalFunc = function(){
                var now = (new Date()).getTime();
                var time = that.GetVerifyCodeCDTime - (now - that.smsSendTime) / 1000;
                that.residueTime = time;
                if (time < 0)
                {
                    clearInterval(that.intervalID);
                }
            }

            this.smsSendTime = (new Date()).getTime();
            clearInterval(this.intervalID);
            this.intervalID = setInterval(intervalFunc, 1000);
            intervalFunc();


            api.general.verifyCodeFetch(phone, 2).then(response => {
                this.$notify({ title: '成功', message: "验证码已发送", type: 'success' });
            }).catch(error => {
                clearInterval(that.intervalID);
                that.residueTime = 0;
                this.$notify({ title: '错误', message: error.message || "验证码发送失败", type: 'error' });
            });
        }



    },//end methods
    mounted:function(){
        this.residueTime = 0;
    },
    watch:{
        residueTime:function(time) {
            this.codeButtonLabel = time > 0 ? parseInt(time) + "秒" : "验证码";
        }
    }


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
