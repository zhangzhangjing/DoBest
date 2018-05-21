<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-radio-group v-model="status" style="display: block;" @change="radioGroupChanged">
						<!-- <el-radio-button label="" >全部</el-radio-button> -->
			    		<el-radio-button label="0">未支付</el-radio-button>
					    <el-radio-button label="1">已支付</el-radio-button>
					    <el-radio-button label="2">等待发货</el-radio-button>
					    <el-radio-button label="3">已发货</el-radio-button>
					    <el-radio-button label="4">已签收</el-radio-button>
				    </el-radio-group>
				</el-form-item>
				<el-form-item>
					<el-input v-model="keyword" placeholder="作品ID/订单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="loading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="orderID" label="订单号" > </el-table-column>
			<el-table-column prop="producttitle" label="产品类型" width="150"> </el-table-column>
			<el-table-column prop="cartid" label="作品ID" width="190"> </el-table-column>
			<el-table-column prop="paytime" label="时间" width="200" sortable> </el-table-column>
			<el-table-column label="详情" width="200">
				<template scope="scope">
					<el-popover
						ref="popover2"
						placement="bottom"
						width="200"
						trigger="click">
						<p>客户昵称：{{scope.row.actkhmc || scope.row.address.reciver }}</p>
						<p>联系方式：{{scope.row.actkhphone || scope.row.address.phone }}</p>
					</el-popover>
					<el-button size="small" v-popover:popover2>查询客户</el-button>
					<el-button size="small" @click="viewDetail(scope.row)">订单详情</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>
		<el-dialog title="订单详情" :visible.sync="isShowOrder" :close-on-click-modal="false">
			<template>
				<el-form label-width="120px" label-position="left" >
					<el-form-item label="产品类型：" >
						<span>{{orderDetails.producttitle}}</span>
					</el-form-item>
					<el-form-item label="产品款式：" >
						<span>{{orderDetails.propertystr}}
						</span>
					</el-form-item>
					<el-form-item label="订单份数：" >
						1
					</el-form-item>
					<el-form-item label="订单金额：" >
						<span>{{orderDetails.price || 0}}</span>
					</el-form-item>
					<el-form-item label="订单状态：" >
						{{orderDetails.text}}
					</el-form-item>
					<el-form-item label="收件人：" >
						{{orderDetails.receiver}}
					</el-form-item>
					<el-form-item label="收件人电话：" >
						<span v-if="orderDetails&&orderDetails.address">{{orderDetails.address.phone}}</span>
					</el-form-item>
					<el-form-item label="发货地址：" >
						{{orderDetails.addressDetail}}
					</el-form-item>
					<el-form-item label="物流单号：" >
						{{kuaidi || '无'}}
					</el-form-item>
					<el-form-item label="物流详情：" >
						<template v-if="shippingRecords.length > 0">
							<el-steps :space="40" direction="vertical" :active="0">
						  		<el-step v-for="item in shippingRecords" :title="item.time + item.context"></el-step>
							</el-steps>
						</template>
						<template v-if="shippingRecords.length===0">
							<div>无物流信息!</div>
						</template>
					</el-form-item>
				</el-form>
			</template>
		</el-dialog>
	</section>
</template>
<script>
	import api from 'src/api/api';
	import NProgress from 'nprogress'
	export default {
		data() {
			return {
				loading: false,
				status:2,//订单状态
				list: [],
				total: 0,
				page: 1,
				pageSize:0,
				keyword:'',
				isShowOrder: false,
				orderDetails: [],
				shippingRecords:[],
				kuaidi: ''
			}
		},
		methods: {
			//获取用户列表
			ordersListFetch: function () {
				this.loading = true;
				NProgress.start();
				api.ibs.mineOrdersListFetch(this.status, this.page, this.keyword).then(response =>{
					// var list = response instanceof Array ? response : [];
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						var address = item.address;

						if (address)
						{
							item.receiver = address.reciver;
							item.addressDetail = (address.province || "") + (address.city || "") + (address.district || "") + (address.streetdetail || "");
						}
						item.orderDate = item.paytime;
						item.orderID = item.userorderid;
						var source = parseInt(item.sourcetype);
						item.source = source;
						// item.sourceDesc = yiya.workSourceDescFecth(source);
						item.workTitle = item.orderProduct ? item.orderProduct.cartTitle : "";
						// item.workTitle = "aaa";
					}
					console.log(list)
					this.list = list;
					this.total = response.total;
					this.loading = false;
					NProgress.done();
				}).catch(error =>{
					this.loading = false;
					NProgress.done();
				});
			},
			radioGroupChanged:function(statusValue)
			{
				this.ordersListFetch(statusValue);
			},
			handleCurrentChange(val) {
				this.page = val;
				this.ordersListFetch();
			},
			shippingInfoFetch:function(carrier, shippingNo){
				console.log(carrier, shippingNo)
				api.ibs.shippingInfoFetch(carrier, shippingNo).then(response =>{
					this.shippingRecords = response.data || [];
				}).catch(error =>{
				});
			},
			orderDetailFetch: function (id) {
				let self = this
				api.ibs.orderDetailFetch(id).then(response =>{
					var carrierID = response.expresscode || "";
				 	var shippingNo = response.expressorder || "";
				 	self.kuaidi = response.expresscom || ""
					self.shippingInfoFetch(carrierID, shippingNo)
				}).catch(error =>{
				});
			},
			viewDetail:function(item){
				console.log('item', item)
				this.isShowOrder = true;
				var number = parseInt(item.status)
				switch (item.status)
				{
					case 0:
						item.text = "未支付";
						break;
					case 1:
						item.text = "已支付";
						break;
					case 2:
						item.text = "等待发货";
						break;
					case 3:
						item.text = "已发货";
						break;
					case 4:
						item.text = "已签收";
						break;
				}
				this.orderDetails = item;
				console.log(item)
				 var orderID = item.userorderid;
				if (number > 3) {
					this.orderDetailFetch(orderID)
				}
				// var orderID = item.userorderid;
				// if (orderID){
				// 	this.isShowOrder = true;
				// this.$router.push({ name: 'OrderDetail', query: { orderID: orderID}});
				// }
			},
			viewSource:function(item){
				var templateID = item.tempid;
				var workID = item.orderProduct.cartid;
				var source = item.source;
				if (source == 0){
					if(templateID) {
						this.$router.push({ name: 'TemplateWorks', query: { id: templateID,work_id:workID}});
					}
				}
				else if (source == 1){
					this.$router.push({ name: 'Present', query: {work_id:workID}});
				}
				else if (source == 2){
					if(templateID) {
						this.$router.push({ name: 'PromotionCodes', query: { id: templateID,work_id:workID}});
					}
				}
				else if (source == 3){
					if(workID){
						this.$router.push({ name: 'WorkDetail', query: { workID: workID}});
					}
				}
				else if (source == 4){
					this.$router.push({ name: 'Present2', query: {work_id:workID}});
				}

			},
			search:function(){
				this.ordersListFetch();
			}
		},
		mounted() {
			this.pageSize = api.CountPerPage;
			this.ordersListFetch();
		}
	};

</script>

<style scoped>
 .el-form-item{
 	margin-bottom: 0px!important;
 }
</style>
