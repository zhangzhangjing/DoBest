<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="订单号/手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="search">查询</el-button>
				</el-form-item> -->
				
				
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="list" highlight-current-row v-loading="loading" @row-click="rowClicked" style="width: 100%;">
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="orderID" label="订单号" width="200"> </el-table-column>
				<el-table-column prop="orderDate" label="时间" width="200" sortable> </el-table-column>
				<el-table-column prop="receiver" label="姓名" width="120"> </el-table-column>
				<el-table-column prop="addressDetail" label="地址" min-width="180"></el-table-column>
				<el-table-column label="操作" width="150">
					<template scope="scope">
						<el-button type="danger" size="small" :loading="rushing" @click.stop="rushOder(scope.$index, scope.row, $event)">抢单</el-button>
					</template>
				</el-table-column>

			</el-table>
		</template>

	</section>
</template>
<script>
	import yiya from '../../api/yiya';
	import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
				rushing:false,
				status:1,//订单状态
				list: [ ]
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			//获取用户列表
			ordersListFetch: function (status) {
				this.loading = true;
				NProgress.start();
				yiya.unownedOrderListFetch(status).then(response =>{
					//var list = (response.length || 0) > 0 ? response : [];
					var list = response instanceof Array ? response : [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						var address = item.address;
						if (address)
						{
							item.receiver = address.reciver;
							item.addressDetail = (address.district || "") + (address.streetdetail || "");
						}
						item.orderDate = item.paytime;
						item.orderID = item.userorderid;
					}


					this.list = list;
					this.loading = false;
					NProgress.done();
				}).catch(error =>{
					this.loading = false;
					NProgress.done();
				});
			},
			search:function(content){

			},
			rushOder:function(index, item, event)
			{
				if (this.rushing)
				{
					return;
				}

				var orderID = item.orderID;
				if (orderID)
				{
					this.rushing = false;
					NProgress.done();
					yiya.rushOder(orderID).then(response =>{
						this.$notify({ title: '成功', message: '抢单成功', type: 'success' });
						this.rushing = false;
						NProgress.done();
						this.ordersListFetch(this.status);

					}).catch(error =>{
						this.$notify({ title: '错误', message: error.message || "抢单失败", type: 'error' });
						this.rushing = false;
						NProgress.done();
					});
				}
			},
			rowClicked:function(item, event, column){
				var orderID = item.userorderid;
				if (orderID)
				{
					this.$router.push({ name: 'OrderDetail', query: { orderID: orderID}});
				}
			}
		},
		mounted() {

			this.ordersListFetch(this.status);
		}
	};

</script>

<style scoped>

</style>