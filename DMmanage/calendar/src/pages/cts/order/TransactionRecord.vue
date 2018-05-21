<template>
	<section>
		<!--工具条-->
		<!-- cts的交易记录公用一个页面 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-radio-group v-model="transactionType" style="display: block;" @change="radioGroupChanged">
						<!-- Divide 相册推广收入 Withdraw 提现 Charge 充值 -->
						<template v-if="entityType == EntityType.Agency.value">
							<!-- <el-radio-button :label="TransactionType.Divide.value">{{TransactionType.Divide.name}}</el-radio-button> -->
							<!-- 代理商的历史记录 -->
							<el-radio-button :label="TransactionType.Withdraw.value">{{TransactionType.Withdraw.name}}</el-radio-button>
						</template>
						<!-- 生产商的历史记录 -->
						<template v-if="entityType == EntityType.Trafficsource.value">
							<!-- 企业商户 也就是广告主的历史记录 -->
							<el-radio-button :label="TransactionType.Charge.value">{{TransactionType.Charge.name}}</el-radio-button>
							<!-- 接口调用 -->
							<el-radio-button :label="TransactionType.Withdraw.value">{{TransactionType.Withdraw.name}}</el-radio-button>
							<!-- <el-radio-button :label="TransactionType.Divide.value">{{TransactionType.Divide.name}}</el-radio-button> -->
						</template>
						<template v-if="entityType == EntityType.Producer.value">
							<!-- 生产商的历史记录 -->
							<!-- <el-radio-button :label="TransactionType.Divide.value">{{TransactionType.Divide.name}}</el-radio-button> -->
							<el-radio-button :label="TransactionType.Withdraw.value">{{TransactionType.Withdraw.name}}</el-radio-button>
						</template>
						<!-- 平台 -->
						<template v-if="entityType == EntityType.Yiya.value">
							<!-- 生产商的历史记录 -->
							<!-- <el-radio-button :label="TransactionType.Divide.value">{{TransactionType.Divide.name}}</el-radio-button> -->
							<el-radio-button :label="TransactionType.Withdraw.value">{{TransactionType.Withdraw.name}}</el-radio-button>
						</template>

					</el-radio-group>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="orderid" label="交易单号" min-width="120"> </el-table-column>
			<el-table-column prop="userid" label="操作员" width="120"> </el-table-column>
			<el-table-column prop="amount" label="金额" width="100"> </el-table-column>
			<!-- 后端接口 -->
			<el-table-column prop="" label="备注" width="100"> </el-table-column>
			<el-table-column prop="createtimestr" label="交易时间" width="240"> </el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>

	</section>
</template>

<script>
	import util from 'common/js/util'
	import {EntityType,TransactionType} from 'common/js/BaseModel';
	import NProgress from 'nprogress'
	import api from 'src/api/api';
	import StringUtil from 'common/js/StringUtil.js';

	export default {
		data() {
			return {
				EntityType:EntityType,
				TransactionType:TransactionType,
				transactionType:TransactionType.Charge.value,
				uid:'',
				users: [],
				entityType:EntityType.Producer.value,
				keyword:'',
				total: 0,
				page: 1,
				pageSize:0,
				listLoading: false,
				deleting:false
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.transactionRecordFetch();
			},
			//获取用户列表
			transactionRecordFetch:function(){
				this.listLoading = true;
				NProgress.start();
				api.cts.transactionRecordFetch(this.uid, this.transactionType, this.page).then((response) => {
					var list = response.list || [];
	                var total = response.total;
	                for(var i = 0;i<list.length;i++)
	                {
	                    var item = list[i];
	                    var uid = 0;
	                    // 生产商
	                    if(this.entityType == EntityType.Producer.value){
	                        uid = item.produceruserid || 0;
	                    }
	                    // 代理商
	                    else if (this.entityType == EntityType.Agency.value) {
	                        uid = item.agentuserid || 0;
	                    }
	                    // 活动参与单位
	                    else if (this.entityType == EntityType.Trafficsource.value) {
	                        uid = item.promoteruserid || 0;
	                    }
	                    item.uid = uid;
	                    item.createtime = item.createtime || item.creattime;

	                }

					this.users = list;
					this.total = response.total;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					this.listLoading = false;
					NProgress.done();
				});
			},
			radioGroupChanged:function(value)
	        {
	            this.transactionRecordFetch();
	        }


		},
		mounted() {
			this.pageSize = api.CountPerPage;
			var entity = this.$route.query.entity;
			if(entity){
				if(entity == EntityType.Producer.value || entity == EntityType.Agency.value || entity == EntityType.Yiya.value){
					// this.transactionType = TransactionType.Divide.value;
					this.transactionType = TransactionType.Withdraw.value;	
				}
				else{
					// 充值
					this.transactionType = TransactionType.Charge.value;
				}
				this.entityType = entity;
			}

			var uid = this.$route.query.uid;
			if(uid >= 0){
				this.uid = uid;
				this.transactionRecordFetch();
			}

		}
	}

</script>

<style scoped>

</style>
