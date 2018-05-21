<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="16" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">
					<el-form-item>
						<el-radio-group v-model="category" style="display: block;" @change="radioGroupChanged">
				    		<el-radio-button label="">全部</el-radio-button>
				    		<el-radio-button :label="TransactionType.Order.value">{{TransactionType.Order.name}}</el-radio-button>
						    <el-radio-button :label="3">运费消耗</el-radio-button>
						    <el-radio-button :label="2">充值</el-radio-button>
						    <el-radio-button :label="5">推广收入</el-radio-button>
					    </el-radio-group>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="8" class="toolbar">
				<div class="account-container">
					<div>账户余额</div>
					<div class="balance">{{account.availableamount}}</div>
				</div>
			</el-col>
		</el-row>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
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
	import yiya from '../../api/yiya';
	import {TransactionType} from 'common/js/BaseModel.js';
	import Formatter from 'common/js/Formatter.js';

	export default {
		data() {
			return {
				TransactionType:TransactionType,
				Formatter:Formatter,
				list: [],
				total: 0,
				page: 1,
				category:1,
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
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.ibs.transactionRecordsFetch(this.category, this.page).then(response => {
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
				yiya.accountInfoFetch().then(response => {
					this.account = response || {};
				}).catch(error =>{ });
			}



		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			var category = this.$route.query.category;
			if(category)
			{
				this.category = category;
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
