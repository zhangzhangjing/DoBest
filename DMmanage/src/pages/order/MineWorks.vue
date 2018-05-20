<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<!-- <el-button type="primary" @click="search">查询</el-button> -->
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="loading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="cartid" label="作品号" width="80"> </el-table-column>
			<el-table-column prop="title" label="标题" min-width="200"> </el-table-column>
			<el-table-column prop="productName" label="产品" width="120"> </el-table-column>
			<el-table-column prop="createtime" label="创建时间" width="120"></el-table-column>
			<el-table-column prop="inviteTime" label="邀请时间" width="120"></el-table-column>

			<el-table-column label="操作" width="160" fixed="right">
				<template scope="scope">
					<el-button size="small" :disabled="scope.row.count < 12" @click="showOrderPanel(scope.$index, scope.row)">下单</el-button>
					<el-button size="small" @click="viewDetail(scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--下单购买界面-->
		<OrderPanel :workID="workID" :productID="productID" :visible="addFormVisible" :submitting="submitting" @submit="submitOrder" @close="addFormVisible = false;submitting=false"/>


		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>

	</section>
</template>
<script>
	import yiya from '../../api/yiya';
	import NProgress from 'nprogress'
	import OrderPanel from 'src/components/OrderPanel';

	export default {
		data() {
			return {
				loading: false,
				list: [],
				total: 0,
				page: 1,
				pageSize:0,
				productMaps:{},

				addFormVisible:false,
				submitting:false,
				workID:'',
				productID:''
			}
		},
		methods: {
			//获取用户列表
			async worksFetch() {
				this.loading = true;
				NProgress.start();

				try{
					var response = await yiya.user.worksFetch(this.page);
				}
				catch(error){}

				if(response){
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						var product = this.productMaps[item.productid];
						item.productName = product ? product.title : '';
						item.workID = item.cartid || '';
						item.productID = (item.productid || '') + '';
					}
					this.list = list;
					this.total = response.total;
				}
				this.loading = false;
				NProgress.done();
			},
			async productsFetch(){
				var list = [];
				var response;
				try{
					response = await yiya.productsFetch();
				}
				catch(error){}

				if(response){
					var list = response.list || [];
					list.forEach(item=>{
						this.productMaps[item.productid] = item;
					})
				}
			},
			handleCurrentChange(val) {
				this.page = val;
				this.worksFetch();
			},
			viewDetail:function(item){
				var workID = item.cartid;
				if (workID)
				{
					this.$router.push({ name: 'WorkEditor', query: { id: workID}});
				}
			},
			showOrderPanel:function(index, item)
			{
				this.workID = item.workID + "";
				this.productID = item.productID + "";
				this.addFormVisible = true;
			},
			submitOrder:function(form){
				var workID = form.workID;
				var productID = form.productID;
				var styleID = form.styleID;
				var count = form.count;
				var remark = form.remark;
				var receiver = form.receiver;
				var phone = form.phone;
				var province = form.province;
				var city = form.city;
				var district = form.district;
				var block = form.block;
				if(!receiver){
					this.$notify({ title: '错误', message: "请填写收件人", type: 'error' });
					return;
				}
				if(!phone){
					this.$notify({ title: '错误', message: "请填写收件人电话", type: 'error' });
					return;
				}
				if(!province || !city || !district){
					this.$notify({ title: '错误', message: "请填写收件人省市区", type: 'error' });
					return;
				}
				if(!block){
					this.$notify({ title: '错误', message: "请填写收件人街道详情地址", type: 'error' });
					return;
				}

				this.submitting = true;
				var product = {productId:productID, styleId:styleID, cartId:workID, count:count};
				var addressInfo = {userid:form.uid, reciver:receiver, phone:phone, province:province, city:city, district:district, streetdetail:block};

				yiya.submitOrder2(product, addressInfo, remark).then(response =>{
					this.addFormVisible = false;
					this.submitting = false;
					this.worksFetch();
					var orderID = response.orderId;
					var message = '我们已收到您的订单，您可以通过订单号跟踪订单状态'
					this.$alert(message, '成功', {
				            confirmButtonText: '查看订单',
				            callback: action => {
				            	if(action == "confirm" && orderID)
				            	{
				            		this.$router.push({ name: 'OrderDetail', query: { orderID: orderID}});
				            	}
				            }
				    });

				}).catch(error => {
					this.submitting = false;
					var errorMessage = error.message || "下单失败"
					if(error.code == 302) {
						this.$alert(errorMessage, '失败', {
				            confirmButtonText: '去充值',
				            callback: action => {
				            	if(action == "confirm")
				            	{
				            		this.$router.push({ path: '/overview'});
				            	}
				            }
				        });
					}
					else{
						this.$notify({ title: '错误', message: errorMessage, type: 'error' });
					}
				});
			},
			async loadData(){
				await this.productsFetch();
				await this.worksFetch();
			}
		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			this.loadData();
		},
		components: {
			OrderPanel
		}
	};

</script>

<style scoped>

</style>
