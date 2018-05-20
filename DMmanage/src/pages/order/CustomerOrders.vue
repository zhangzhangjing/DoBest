<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" @row-click="rowClicked" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="userorderid" label="订单号" min-width="200"> </el-table-column>
			<!-- <el-table-column prop="createtime" label="创建时间" min-width="200"> </el-table-column> -->
			<el-table-column prop="title" label="产品名称" width="300"> </el-table-column>
			<el-table-column prop="price" label="价格" width="120"> </el-table-column>
			<el-table-column prop="count" label="数量" width="120"> </el-table-column>
		</el-table>


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
				uid:'',
				list: [],
				listLoading: false

			}
		},
		methods: {
			//获取用户列表
			ordersFetch:function(uid){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.customerOrdersListFetch(uid).then(response => {
					var list = response || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						item.title = (item.producttitle || "") + (item.propertystr || "");
					}

					that.list = list;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

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
			var uid = this.$route.query.uid;
			if(uid)
			{
				this.uid = uid;
				this.ordersFetch(uid);
			}
		}
	}

</script>

<style scoped>

</style>