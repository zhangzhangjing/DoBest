<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="40"></el-table-column>
			<el-table-column prop="name" label="名称" min-width="120"></el-table-column>
			<el-table-column prop="mobilephone" label="电话" width="120"></el-table-column>
			<el-table-column prop="createtime" label="加入时间" width="200"> </el-table-column>
			<el-table-column prop="userid" label="咿呀号" width="80"></el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="showOrders(scope.$index, scope.row)">订单</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>


	</section>
</template>

<script>
	import util from 'common/js/util'
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';

	export default {
		data() {
			return {
				list: [],
				total: 0,
				page: 1,
				pageSize:0,
				listLoading: false

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.freelancesFetch();
			},
			//获取用户列表
			freelancesFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.freelancesFetch(this.page).then((response) => {
					var list = response.list || [];
					that.list = list;
					that.total = response.total;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

			},
			showOrders: function (index, item) {
				var uid = item.userid;
				if(uid){
					this.$router.push({ path: '/freelance/orders', query: { uid: uid}});
				}
			}


		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			this.freelancesFetch();
		}
	}

</script>

<style scoped>

</style>