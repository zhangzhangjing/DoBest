<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-radio-group v-model="category" @change="radioGroupChanged">
			    		<el-radio-button label="1">消费</el-radio-button>
					    <el-radio-button label="2">充值</el-radio-button>
				    </el-radio-group>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="payid" label="交易单号" min-width="120"> </el-table-column>
			<el-table-column prop="amount" label="金额" width="100"> </el-table-column>
			<el-table-column prop="createtimestr" label="交易时间" width="200"> </el-table-column>
			
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

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				list: [],
				total: 0,
				page: 1,
				category:1,
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
				yiya.carriageTransactionRecordsFetch(this.category, this.page).then(response => {
					var list = response.list || [];
					that.list = list;
					that.total = response.total;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

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
		}
	}

</script>

<style scoped>

</style>