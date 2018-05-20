<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="40"></el-table-column>
			<el-table-column prop="userorderid" label="订单号" min-width="120"></el-table-column>
			<el-table-column prop="totalprice" label="价格" width="80"></el-table-column>
			<el-table-column prop="createtime" label="下单时间" width="200"> </el-table-column>
			<el-table-column prop="userid" label="买家咿呀号" width="120"></el-table-column>
			<el-table-column prop="statusString" label="状态" width="100"></el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="showOrderDetail(scope.$index, scope.row)">详情</el-button>
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
				uid:'',
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
			freelanceOrdersFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.freelanceOrdersFetch(this.uid, this.page).then((response) => {
					var list = response.list || [];
					for (var i = 0; i < list.length; i++) {
						var item = list[i];
						item.statusString = yiya.orderStatusDescFecth(item.status || 0);
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
			showOrderDetail: function (index, item) {
				var orderID = item.userorderid;
				if(orderID){
					this.$router.push({ name: 'OrderDetail', query: { orderID: orderID}});
				}
			}


		},
		mounted() {
			var uid = this.$route.query.uid;
			this.pageSize = yiya.CountPerPage;
			if(uid)
			{
				this.uid = uid;
				this.freelanceOrdersFetch();
			}
		}
	}

</script>

<style scoped>

</style>