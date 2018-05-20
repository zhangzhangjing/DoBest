<template>
	<section>
		<!--工具条-->
		<el-row>
			<!-- IBS代理商和ibs广告主推广商公共页面 -->
			<el-col :span="18" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">
					<el-form-item>
						<el-radio-group v-model="category" style="display: block;" @change="radioGroupChanged">
				    		<el-radio-button label="">全部</el-radio-button>
							<template v-if="entity == EntityType.Agency.value">
								<!-- <el-radio-button :label="TransactionType.Divide.value">{{TransactionType.Divide.name}}</el-radio-button> -->

								<el-radio-button :label="TransactionType.CommissionEarning.value">{{TransactionType.CommissionEarning.name}}</el-radio-button>
								<el-radio-button :label="TransactionType.Withdraw.value">{{TransactionType.Withdraw.name}}</el-radio-button>
								
							</template>
							<template v-if="entity == EntityType.Trafficsource.value">
								<el-radio-button :label="TransactionType.Order.value">{{TransactionType.Order.name}}</el-radio-button>
							    <!-- <el-radio-button :label="TransactionType.Carriage.value">{{TransactionType.Carriage.name}}</el-radio-button> -->
							    <el-radio-button :label="TransactionType.CommissionEarning.value">{{TransactionType.CommissionEarning.name}}</el-radio-button>
							    <el-radio-button :label="TransactionType.Charge.value">{{TransactionType.Charge.name}}</el-radio-button>
						<!-- 	    <el-radio-button :label="TransactionType.Divide.value">{{TransactionType.Divide.name}}</el-radio-button> -->
							    
								<!-- <el-radio-button :label="TransactionType.Promotionincome.value">{{TransactionType.Promotionincome.name}}</el-radio-button> -->
								<!-- <el-radio-button :label="TransactionType.distribution.value">{{TransactionType.distribution.name}}</el-radio-button> -->
							</template>
							
							<template v-if="entity == EntityType.Producer.value">
								<el-radio-button :label="TransactionType.OrderEarning.value">{{TransactionType.OrderEarning.name}}</el-radio-button>
							    <el-radio-button :label="TransactionType.CarriageEarning.value">{{TransactionType.CarriageEarning.name}}</el-radio-button>
							    <el-radio-button :label="TransactionType.Withdraw.value">{{TransactionType.Withdraw.name}}</el-radio-button>
							
							</template>
					    </el-radio-group>
					</el-form-item>
					<el-form-item>
						<el-input v-model="keyword" placeholder="订单号"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="search">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="6" class="toolbar">
				<div class="account-container">
					<div>账户余额</div>
					<div class="balance">{{account.availableamount}}</div>
				</div>
			</el-col>
		</el-row>

		<!--列表-->
		<el-table :data="list" v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="orderid" label="交易单号" min-width="120"> </el-table-column>
			<el-table-column v-if="!category" label="类型" :formatter="Formatter.transactionTypeFormat" width="120"> </el-table-column>
			<el-table-column prop="userid" label="操作员" width="120"> </el-table-column>
			<el-table-column prop="amount" label="金额" width="100"> </el-table-column>
			<el-table-column prop="createtimestr" label="交易时间" width="240"> </el-table-column>

		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import api from 'src/api/api';
	import {TransactionType, EntityType} from 'common/js/BaseModel.js';
	import Formatter from 'common/js/Formatter.js';
	import Role from 'common/js/role.js';

	export default {
		data() {
			return {
				TransactionType:TransactionType,
				EntityType:EntityType,
				Formatter:Formatter,
				entity:0,
				list: [],
				entity:0,
				total: 0,
				page: 1,
				category:'',
				keyword:'',
				account:{},
				listLoading: false,
				pageSize:10

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.transactionRecordsFetch();
			},
			radioGroupChanged:function(statusValue)
			{
				this.page = 1;
				this.transactionRecordsFetch();
			},
			//获取用户列表
			transactionRecordsFetch:function(){
				
				
//				TransactionType:TransactionType,
//				EntityType:EntityType,
				
				console.log(this.TransactionType)
				console.log(this.EntityType)
				console.log(this.Formatter)
				
				
				var that = this;
				this.listLoading = true;
				NProgress.start();
				api.ibs.transactionRecordsFetch(this.category, this.page, this.keyword).then(response => {
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						// var remark = "";
						// if (item.usetype == 3)
						// {
						// 	remark = "充值返现"
						// }
						// item.remark = remark;
					}

					that.list = list;
					that.total = response.total;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

			},
			accountInfoFetch(){
				api.ibs.accountInfoFetch().then(response => {
					this.account = response || {};
				}).catch(error =>{ });
			},
			search(){
				this.transactionRecordsFetch();
			}



		},
		mounted() {
			this.pageSize = api.CountPerPage;
			this.keyword = this.$route.query.orderID || '';
			var category = this.$route.query.category;
			if(category)
			{
				this.category = category;
			}
			var identity = parseInt(sessionStorage.getItem('identity'));
			if(Role.permitted(identity,Role.CalendarAgency)){
				this.entity = EntityType.Agency.value;
			}
			else if(Role.permitted(identity, Role.CalendarTrafficsource)){
				this.entity = EntityType.Trafficsource.value;
			}
			else if(Role.permitted(identity, Role.CalendarProducer)){
				this.entity = EntityType.Producer.value;
			}
			this.transactionRecordsFetch();
			this.accountInfoFetch();
		}
	}

</script>

<style scoped>
.balance{
    font-size: 30px;
    color: #ff9c00;

}

.account-container{
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

	float: right;
}
</style>
