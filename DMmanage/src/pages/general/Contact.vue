<template>
	<section>
    <div class="top-container">
        <el-input type="textarea" v-model="content" :rows="4" placeholder="请输入内容"></el-input>
        <el-button type="primary" style="float: right;margin-top: 15px;" @click.native.prevent="submitFeedback" :loading="sending">提交</el-button>
    </div>
		
    <div class="contact-container">
        <img src="../../assets/contact_qrcode.jpeg" class="qrcode"/>
        <div class="text-container">
            <p class="text">咿呀科技客服邮箱</p>
            <p class="text">support@bbyiya.com</p>
            <p class="text">咿呀科技客服微信号</p>
            <p class="text">YiYaphotos</p>
        </div>
    </div>

	</section>
</template>

<script>
  import yiya from '../../api/yiya';
  import NProgress from 'nprogress';
  export default {
    data() {
      return {
        sending: false,
        content:''

      };
    },
    methods: {
      submitFeedback(ev) {
            var that = this;
            var content = this.content;
            if(!content)
            {
            	this.$notify({ title: '错误', message: "请输入反馈内容", type: 'error' });
            	return;
            }

            this.sending = true;
            yiya.submitFeedback(content).then(response => {
              this.sending = false;
              this.$notify({ title: '成功', message: "意见已提交，感谢你的反馈", type: 'success' });
            }).catch(error => {
              this.sending = false;
              this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
            });
      }



    },//end methods
    mounted:function(){
        
    }


  }

</script>

<style lang="scss" scoped>

	.text-container{
		display: inline-block;
    position: absolute;
		margin-left: 30px;
	}

	.text{
		text-align: center;
		margin-top: 15px;
	}

	.qrcode{
		width: 202px;
		height: 269px;
	}

    .top-container{
        padding: 15px;
    }

    .top-container el-button{
        margin-top: 15px;
    }

    .contact-container{
        position: relative;
        margin-top: 50px;
        left: 50%;
        margin-left: -200px;
    }


</style>