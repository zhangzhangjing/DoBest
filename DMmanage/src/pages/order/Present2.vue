<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form>
				<el-form-item>
					<span><b>功能含义</b>：指客户使用自己新建的作品，一对一邀请影楼员工</br></span>
					<span><b>板块说明</b>：客户邀请后，会留下手机号码地址等信息（利用此功能，可灵活开展市场活动）</span>
				</el-form-item>
			</el-form>
		</el-col>

		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-radio-group v-model="status" style="display: block;" @change="radioGroupChanged">
			    		<el-radio-button label="0">全部</el-radio-button>
					    <el-radio-button label="1">邀请中</el-radio-button>
					    <!-- <el-radio-button label="2">忽略邀请</el-radio-button> -->
					    <el-radio-button label="3">制作中</el-radio-button>
					    <!-- <el-radio-button label="4">完成制作</el-radio-button> -->
				    </el-radio-group>
				</el-form-item>
				<el-form-item>
					<el-input v-model="keyword" placeholder="手机号/作品名称/咿呀号" style="min-width:280px;"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="title" label="作品名称" width="120"> </el-table-column>
			<el-table-column prop="invitationStatusString" label="活动状态" width="120"> </el-table-column>
			<el-table-column prop="productTitle" label="制作类型" width="120"> </el-table-column>

			<el-table-column prop="inviter" label="本店员工" width="100"> </el-table-column>
			<el-table-column prop="inviteeUID" label="员工咿呀号" width="130"> </el-table-column>
			<el-table-column prop="invitee" label="客户昵称" width="130"> </el-table-column>
			<el-table-column prop="inviteePhone" label="客户手机" width="140"> </el-table-column>

			<el-table-column prop="isDue" label="是否预产期" width="140"> </el-table-column>
			<el-table-column prop="birthdayStr" label="宝宝生日" width="120"> </el-table-column>
			<el-table-column prop="present" label="作品进度" width="100"> </el-table-column>
			<el-table-column prop="commentsCount" label="评论数" width="100"> </el-table-column>
			<el-table-column prop="updatetime" label="最近更新时间" min-width="120"> </el-table-column>
			<el-table-column label="操作" width="220" fixed="right">
				<template scope="scope">
					<el-button size="small" :disabled="scope.row.count < 12" @click="showOrderPanel(scope.$index, scope.row)">下单</el-button>
					<el-button size="small" @click="viewWork(scope.$index, scope.row)">查看</el-button>
					<el-popover trigger="click" placement="top" class="popover" v-if="scope.row.orderNoList.length > 0">
						<div style="max-height:300px; overflow:auto;">
							<el-button type="text" class="order-button" v-for="item in scope.row.orderNoList" @click="viewOrder(item)">{{item}}</el-button>
						</div>
						<el-button type="text" slot="reference">订单x{{scope.row.orderNoList.length}}</el-button>
			        </el-popover>

				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>

		<!--下单购买界面-->
		<OrderPanel :workID="workID" :productID="productID" :visible="addFormVisible" :submitting="submitting" @submit="submitOrder" @close="addFormVisible = false;submitting=false"/>



	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';
	import OrderPanel from 'src/components/OrderPanel';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				list: [],
				total: 0,
				page: 1,
				status:0,
				category:'passivity',
				keyword:'',
				listLoading: false,
				pageSize:10,

				addFormVisible: false,//新增界面是否显示
				submitting:false,
				workID:'',
				productID:''


			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.worksFetch();
			},
			//获取用户列表
			worksFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.presentRecordsFetch(this.category, this.page, this.status, this.keyword).then(response => {
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						item.present = (item.count || 0) + "/12";
						item.customerName = item.userName || item.author || item.userid;
						item.isDue = item.isdue ? "是" : "否";
						item.invitationStatusString = yiya.invitationStatusDescFecth(item.invitestatus);

						item.productID = item.productid;
						item.workID = item.cartid;

						item.inviter = item.invitedName || "";
						item.invitee = item.userName || item.userid;
						item.inviteePhone = item.phone;
						item.inviteeUID = item.inviteModel.inviteuserid;

						item.orderNoList = item.orderNoList || [];
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
			viewWork:function(index, item)
			{
				var workID = item.cartid;
				if (workID)
				{
					this.$router.push({ path: '/order/work/edit', query: { id: workID}});
				}
			},
			showOrderPanel:function(index, item)
			{
				this.workID = item.workID + "";
				this.productID = item.productID + "";
				this.addFormVisible = true;
			},
			submitOrder:function(form){
				// var form = this.addForm;
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
			viewOrder:function(orderID)
			{
				if(orderID){
					this.$router.push({ name: 'OrderDetail', query: { orderID: orderID}});
				}
			},
			radioGroupChanged:function(statusValue)
			{
				this.page = 1;
				this.worksFetch(this.page);
			},
			categoryRadioGroupChanged:function(statusValue){
				this.page = 1;
				this.worksFetch(this.page);
			},
			search:function(){
				this.page = 1;
				this.worksFetch(this.page);
			}


		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			var workID = this.$route.query.work_id;
	    	if (workID)
	    	{
				this.keyword = workID;
			}
			this.worksFetch();
		},
		components: {
			OrderPanel
		}
	}

</script>

<style scoped>
.orders-container{
	display: inline-block;
	width: 130px;

}

.order-button{
	display: block;
}

.order-button:first-child{
	margin-left: 10px;
}

.popover{
	display: inline-block;
	margin-left: 15px;
}
</style>
