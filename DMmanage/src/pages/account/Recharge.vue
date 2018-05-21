<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<!-- <el-form-item>
					<el-radio-group v-model="category" @change="radioGroupChanged">
			    		<el-radio-button label="2">货款</el-radio-button>
					    <el-radio-button label="3">邮费</el-radio-button>
				    </el-radio-group>
				</el-form-item> -->

				<el-form-item>
					<el-input v-model="amount" placeholder="金额"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="rechargeBtnTapped" :loading="paying">充值</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<el-col :span="24" class="toolbar" v-if="QRImageURL.length > 0">
			<div class="content">
				<img v-bind:src="QRImageURL" class="QRImage">
				<p>微信扫一扫支付</p>
				<el-button type="text" @click="checkBtnTapped">我已支付成功</el-button>
			</div>
		</el-col>


	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';

	export default {
		data() {
			return {
				paying:false,
				category:2,
				amount:0,
				payID:'',
				QRImageURL:''

			}
		},
		methods: {
			fetchRechargeQRImageURL:function(amount){
				this.paying = true;
				yiya.recharge(amount, this.category).then(response =>{
					var payID = response;
					return yiya.wechatPayQRCodeFetch(payID);
				}).then(response =>{
					this.QRImageURL = response;
					this.paying = false;
				}).catch(error =>{
					this.paying = false;
					this.$notify({ title: '错误', message: error.message || "充值失败", type: 'error' });
				});
			},
			radioGroupChanged:function(statusValue)
			{
				var amount = this.amount || 0;
				if (amount <= 0)
				{
					return;
				}

				this.fetchRechargeQRImageURL(amount);
			},
			rechargeBtnTapped:function(){
				var amount = this.amount || 0;
				if (amount <= 0)
				{
					this.$notify({ title: '错误', message: "请输入充值金额", type: 'error' });
					return;
				}

				this.fetchRechargeQRImageURL(amount);
			},
			checkBtnTapped:function(){
				//this.$notify({ title: '成功', message: '充值成功', type: 'success' });
				//window.history.go(-1);
				if(this.category == 2)
				{
					this.$router.push({ path: '/transactions', query: { category: 2}});
				}
				else
				{
					this.$router.push({ path: '/carriage_transactions', query: { category: 2}});
				}

			}


		},
		mounted() {
			this.category = this.$route.query.category || 2;
		}
	}

</script>

<style scoped>

.container{
	min-height: 100%;
}

.content{
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}

.QRImage{
	width: 200px;
	height: 200px;
}


</style>
