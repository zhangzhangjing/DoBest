<template>
	<section>
		<!--工具条-->
		<el-row class="profile-info">
            <el-col :span="12">
              <div class="profile-info-item">

                <div class="profile-info-item-header">
                    <img src="../../assets/default-avatar.png" class="profile-info-avatar"/>
                    <div>
                        <div>欢迎使用</div>
                        <div>咿呀号：{{info.userid}}</div>
                    </div>
                </div>
              </div>
            </el-col>


            <el-col :span="6">
                <div class="profile-info-item">
                    <div>账户余额</div>
                    <router-link :to="{ path: '/transactions', query: { category: 2 }}" class="profile-info-item-number">{{info.availableamount}}</router-link>
                    <el-button type="text" @click="rechargeBtnTapped(2)">充值</el-button>
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


	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';

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
				yiya.accountInfoFetch().then(response => {
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
    height: 115px;
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
