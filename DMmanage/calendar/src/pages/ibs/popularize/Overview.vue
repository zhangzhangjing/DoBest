<template>
	<section>
		<!--工具条-->
		<el-row class="profile-info">
            <el-col :span="12">
              <div class="profile-info-item">

                <div class="profile-info-item-header">
                    <img src="../../../assets/default-avatar.png" class="profile-info-avatar"/>
                    <div>
                        <div>欢迎使用</div>
                        <div>帐号：{{info.userid}}</div>
                    </div>
                </div>
              </div>
            </el-col>


            <el-col :span="6">
                <div class="profile-info-item">
                    <div>账户余额</div>
                    <router-link :to="{ path: '/transactions', query: { category: 2 }}" class="profile-info-item-number">{{info.availableamount}}</router-link>
                    
                </div>
            </el-col>

            <!-- <el-col :span="6">
                <div class="profile-info-item">
                    <div>邮费余额</div>
                    <router-link :to="{ path: '/carriage_transactions'}" class="profile-info-item-number">{{carriageBalance}}</router-link>
                    <el-button type="text" @click="rechargeBtnTapped(3)">充值</el-button>
                </div>
            </el-col> -->


        </el-row>

        <div class="box">
            <div class="box-main">    
                <p class="text-title">充值</p>
                <!-- <div class="box-main-img">
                    <div class="box-img">
                        <img src="../../../assets/wx.jpg">
                    </div>

                    <div class="box-img">
                        <img src="../../../assets/zfb.jpg">
                    </div>
                </div> -->
               
   


            
                <div class="box-main2">
                  
                    <div class="box-img" >
                        <img src="../../../assets/cz.png">
                    </div>
                    <p>&nbsp;</p>
                </div>
                 <div class="box-text">
	            	<p style="text-align: left;">1 添加充值账户</p>
					<p style="text-align: left;">2 转账并备注 “咿呀号：{{info.userid}}” 客服人员将会在24小时内完成充值</p>				
           	    </div>
            </div>
            


        </div>
           



	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import api from 'src/api/api';

	export default {
		data() {
			return {
				info:{},
				carriageBalance:0,
				listLoading:false

			}
		},
		methods: {
			rechargeBtnTapped:function(category){
				this.$router.push({ path: '/account/recharge', query: { category: category}});
			},
			//获取用户列表
			accountInfoFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				api.ibs.accountInfoFetch().then(response => {
					that.info = response || {};
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

			}


		},
		mounted() {
			this.accountInfoFetch();
		}
	}

</script>

<style scoped>
.box{
    width: 100%;
}
.box-main{
    width: 420px;
    margin: 0 auto;
}
.box-main-img{
    display: block;
    height: 200px;
}

.box-text{
    margin-left: 20px;
    width: 420px;
    display: block;
}

.box-main2{
    width: 200px;
    margin: 10px auto;
    
}
.text-title{
	font-weight: bold !important;
	font-size: 15px !important;
	margin: 10px;
}

.box-main2 p{
    margin-bottom: -4px;
}
.box-main p{
    text-align: center;
    font-weight: 500;
    font-size: 13px;
}

p{
    margin: 0px;
}


.box-img{
    width:200px;
    margin: 0 20px;
    height: 100%;
    float: left;
    display: block;
}
.box-img img{
    width: 100%
   
}

.profile-info{
    padding: 30px;
    border:1px solid #eeeeee;
    background-color: #fff;
}

.profile-info-item{
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    border-right: 1px solid #eeeeee;
    height: 55px;
}

.profile-info-item-header{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.profile-info-avatar{
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin-right: 20px;
}

.profile-info-item-number{
    font-size: 30px;
    color: #ff9c00;
}

a{
	text-decoration: none;
}



</style>
