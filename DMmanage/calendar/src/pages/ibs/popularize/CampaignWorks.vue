<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar"><span style="font-size: 18px;color: #475669;">{{templateTitle}}</span></el-col>
		</el-row>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-radio-group v-model="status" style="display: block;" @change="radioGroupChanged">
			    		<el-radio-button label="">全部</el-radio-button>
					    <el-radio-button :label="CampaignStatus.Uncommitted.value">{{CampaignStatus.Uncommitted.name}}</el-radio-button>
					    <el-radio-button :label="CampaignStatus.Pending.value">{{CampaignStatus.Pending.name}}</el-radio-button>
					    <el-radio-button :label="CampaignStatus.Shared.value"><span style="color: #f56c6c;" :class="{'specialWhite': status === 2 }" >{{CampaignStatus.Shared.name}} </span></el-radio-button>
					    <el-radio-button :label="CampaignStatus.Finish.value">{{CampaignStatus.Finish.name}}</el-radio-button>
					    <el-radio-button :label="CampaignStatus.Failjoin.value">{{CampaignStatus.Failjoin.name}}</el-radio-button>
				    </el-radio-group>
				</el-form-item>
				<el-form-item>
					<el-input v-model="keyword" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="weiNickName" label="微信昵称" min-width="120"> </el-table-column>
			<el-table-column prop="reciever" label="联系人" width="120"> </el-table-column>
			<el-table-column prop="mobiephone" label="电话" width="160"> </el-table-column>
			<el-table-column prop="status" label="当前状态" width="160" :formatter="Formatter.campaignStatusFormat"> </el-table-column>

			<el-table-column label="分享情况" width="160">
				<template scope="scope">
					<span style="color:#4db3ff"> {{(scope.row.extcount || 0) + '/' + (scope.row.targetextCount || 0)}} </span>
				</template>
			</el-table-column>
			<el-table-column label="自费购买" width="160">
				<template scope="scope">
					{{scope.row.countmore || 0}}
				</template>
			</el-table-column>
			<el-table-column prop="createTimestr" label="参与时间" width="160"> </el-table-column>

			<el-table-column label="操作" width="150" fixed="right">
				<template scope="scope">
					<template v-if="scope.row.orderNoList.length > 0">
						<el-popover trigger="click" placement="top" class="popover">
							<div style="max-height:300px; overflow:auto;">
				        		<el-button type="text" class="order-button" v-for="item in scope.row.orderNoList" @click="viewOrder(item)">
				        			{{item}}
				        		</el-button>
							</div>
							<el-button size="small" slot="reference">已下单</el-button>
				        </el-popover>
					</template>
					
					<template v-else>
						<el-button   :class="{'el-button--success': scope.row.status === 2 }"  size="small" :disabled="!scope.row.purchasable" @click="orderPanelClicked(scope.$index, scope.row)">
							<span>下单</span>
						</el-button>
						<el-button  type="warning" v-show="status!==''&&scope.row.status === 1" size="small" :disabled="!scope.row.purchasable" @click="orderInvalidClicked(scope.$index, scope.row)">
							<span>失效</span>
						</el-button>
						<el-button  type="success" v-show="status!==''&&scope.row.status === 4" size="small" :disabled="!scope.row.purchasable" @click="orderActiveClicked(scope.$index, scope.row)">
							<span>激活</span>
						</el-button>
					</template>
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
		<OrderPanel :workID="workID" :visible="addFormVisible" :submitting="submitting" @submit="submitOrder" @close="addFormVisible = false;submitting=false"/>


	</section>
</template>

<script>
	import util from 'common/js/util'
	import YiyaUtil from 'common/js/YiyaUtil'
	import NProgress from 'nprogress'
	import api from 'src/api/api';
	import OrderPanel from 'src/components/OrderPanel';
	import {CampaignStatus} from 'common/js/BaseModel'
	import Formatter from 'common/js/Formatter'
	var moment = require('moment');

	export default {
		data() {
			return {
				YiyaUtil:YiyaUtil,
				CampaignStatus:CampaignStatus,
				Formatter:Formatter,
				campaignID:'',
				templateTitle:'',
				template:null,
				productID:'',
				styles:[],
				list: [],
				total: 0,
				page: 0,
				loadedPage:0,
				pageSize:0,
				listLoading: false,
				reviewing:false,
				status:'',
				keyword:'',
				addFormVisible: false,//新增界面是否显示
				submitting: false,
				workID:'',
				orderProductID:'',
				orderStyleID:'',
				orderUID:''

			}
		},
		watch:{
		  	'$route': function(value){
		  		this.page = parseInt(this.$route.query.page) || 1;
		  	},
		  	page:function(value){
				this.$router.push({ name: 'CampaignWorks', query: { id:this.campaignID, page: value}});
				if(this.loadedPage != value)
				{
					this.worksFetch(value);
				}
		  	}
		},
		methods: {
			handleCurrentChange(page) {
				this.page = page;
			},
			//获取用户列表
			worksFetch:function(page){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				api.ibs.campaignWorksFetch(this.campaignID, this.status, this.keyword, page).then((response) => {
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						item.workID = item.workid || '';
						item.percent = (item.count || 0) + "/12";
						item.purchasable = item.count == 12;
						item.purchasable = true;
						//满足12张并且审核通过
						//item.purchasable = item.count == 12 && (item.activeStatus == 3);
						item.orderNoList = item.ordernolist || [];
					}
					this.list = list;
					this.loadedPage = page;
					that.total = response.total;
					this.page = page;
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
					//this.$router.push({ name: 'WorkDetail', query: { workID: workID}});
					this.$router.push({ name: 'WorkEditor', query: { id: workID}});
				}
			},
			workReject:function(item){
				var workID = item.cartid;
				if(!workID){
					return;
				}
				this.$prompt('请填写不通过原因', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', }).then(({value}) => {
		          	this.workReview(workID,false,value || "")
		        }).catch(() => { });

			},
			workReview:function(workID, enabled, remark){

				this.reviewing = true;
				yiya.userTemplateWorkReview(workID, enabled, remark).then(response =>{
					this.reviewing = false;
					this.worksFetch(this.page);
					this.$notify({ title: '成功', message: '已处理', type: 'success' });
				}).catch(error =>{
					this.reviewing = false;
					this.$notify({ title: '错误', message: error.message || "处理失败，请重试", type: 'error' });
				});
			},
			viewUser:function(index, item)
			{
				var uid = item.inviteModel ? item.inviteModel.inviteuserid : 0;
				if (uid) {
					this.$router.push({ name: 'Customers', query: { uid: uid}});
				}
			},
			orderPanelClicked:function(index, item){
				this.showOrderPanel(item);
			},
			orderInvalidClicked:function(index, item){
				var that = this;
				this.$confirm("确定失效吗？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					api.ibs.orderInvalid(item.workID).then((response) => {
						that.worksFetch(this.page)
						that.$message({
				          type: "success",
				          message: "已失效!"
				        })
					})
				})
			},
			orderActiveClicked:function(index, item){
				var that = this;
				this.$confirm("确定激活吗？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					api.ibs.orderActive(item.workID).then((response) => {
						that.worksFetch(this.page)
						that.$message({
				          type: "success",
				          message: "激活成功!"
				        })
					})
				})
			},
			showOrderPanel:function(item)
			{
				this.workID = item.workID + "";
				this.orderProductID = item.productID + "";
				this.orderStyleID = (item.styleid || "") + "";
				this.orderUID = item.userid || "";
				this.addFormVisible = true;
			},
			submitOrder:function(form){
				// var form = this.addForm;
				var uid = this.orderUID;
				var workID = this.workID;
				var count = form.count;
				var remark = form.remark;

				this.submitting = true;
				var params = {workId:workID, count:count, submitUserId:uid, remark:remark || ''}

				api.ibs.submitOrder(params).then(response =>{
					this.addFormVisible = false;
					this.submitting = false;
					this.worksFetch(this.page);
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
				if(this.page != 1){
					this.page = 1;
				}
				else{
					this.worksFetch(this.page);
				}

			},
			search:function(){
				if(this.page != 1){
					this.page = 1;
				}
				else{
					this.worksFetch(this.page);
				}
			}


		},
		mounted() {
			this.pageSize = api.CountPerPage;
			var page = parseInt(this.$route.query.page) || 1;
			var campaignID = this.$route.query.id;
			var workID = this.$route.query.work_id || "";
			if(campaignID)
			{
				this.keyword = workID;
				this.campaignID = campaignID;
				this.worksFetch(page);
			}

		},
		components: {
			OrderPanel
		}
	}

</script>

<style scoped>
.order-button{
	display: block;
}

.order-button:first-child{
	margin-left: 10px;
}

.birthday-text{
	color: #1d2088;
}

.expected-text{
	color: #e60012;
}
.el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color: #fff!important;
    background-color: #20a0ff;
    border-color: #20a0ff;
    box-shadow: -1px 0 0 0 #20a0ff;
}
.specialWhite{
	color:#fff!important;
}
</style>
