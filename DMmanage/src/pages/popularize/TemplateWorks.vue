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
			    		<el-radio-button label="0">全部</el-radio-button>
					    <el-radio-button label="1">制作中</el-radio-button>
					    <el-radio-button label="3">制作已完成</el-radio-button>
					    <el-radio-button label="4">作品不通过</el-radio-button>
					    <el-radio-button label="5">下单成功</el-radio-button>
				    </el-radio-group>
				</el-form-item>
				<el-form-item>
					<el-input v-model="keyword" placeholder="手机号/作品名称/作品ID"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="sort" label="序号" width="70"> </el-table-column>
			<el-table-column prop="title" label="作品名称" width="120"> </el-table-column>
			<el-table-column prop="inviter" label="本店员工" width="100"> </el-table-column>
			<el-table-column label="客户昵称" width="130">
				<template scope="scope">
					<el-button type="text" @click="viewUser(scope.$index, scope.row)">{{scope.row.invitee || '用户'}}</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="babyBirthday" :render-header="YiyaUtil.babyBirthdayRenderHeader" width="150" sortable>
				<template scope="scope">
					<span :class="scope.row.isExpectedDate ? 'expected-text' : 'birthday-text'">{{scope.row.babyBirthday}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="invitationStatusString" label="活动状态" width="120"> </el-table-column>
			<el-table-column prop="productTitle" label="制作类型" width="120"> </el-table-column>
			<el-table-column prop="percent" label="作品进度" width="100"> </el-table-column>
			<el-table-column prop="commentsCount" label="评论数" width="100"> </el-table-column>
			<el-table-column prop="inviteePhone" label="客户手机" width="140"> </el-table-column>
			<el-table-column prop="address" label="收货地址" min-width="140"> </el-table-column>
			<el-table-column prop="updatetime" label="最近更新时间" width="240"> </el-table-column>
			<el-table-column label="操作" width="300" fixed="right">
				<template scope="scope">
					<el-button size="small" @click="viewWork(scope.$index, scope.row)">查看</el-button>
					<el-button size="small" :disabled="!scope.row.purchasable" @click="orderPanelClicked(scope.$index, scope.row)">下单</el-button>
			        <el-button size="small" :disabled="scope.row.activeStatus != 3" :loading="reviewing"  @click="workReject(scope.row)">作品不合格</el-button>

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
			<el-button size="small" :loading="downloading" @click="downloadExcel">下载Excel</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>

		</el-col>

		<!--下单购买界面-->
		<OrderPanel :workID="workID" :productID="orderProductID" :styleID="orderStyleID" :visible="addFormVisible" :submitting="submitting" @submit="submitOrder" @close="addFormVisible = false;submitting=false"/>


	</section>
</template>

<script>
	import util from 'common/js/util'
	import YiyaUtil from 'common/js/YiyaUtil'
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';
	import OrderPanel from 'src/components/OrderPanel';
	var moment = require('moment');

	export default {
		data() {
			return {
				YiyaUtil:YiyaUtil,
				templateID:'',
				templateTitle:'',
				template:null,
				productID:'',
				styles:[],
				addresses:[],
				addressesGroup:[],
				list: [],
				total: 0,
				page: 0,
				loadedPage:0,
				pageSize:0,
				listLoading: false,
				reviewing:false,
				status:0,
				keyword:'',

				addFormVisible: false,//新增界面是否显示
				submitting: false,
				workID:'',
				orderProductID:'',
				orderStyleID:'',
				downloading:false

			}
		},
		watch:{
		  	'$route': function(value){
		  		this.page = parseInt(this.$route.query.page) || 1;
		  	},
		  	page:function(value){
				this.$router.push({ name: 'TemplateWorks', query: { id:this.templateID, page: value}});
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
			templateBaseInfoFetch:function(){
				yiya.ibs.templateBaseInfoFetch(this.templateID).then((response) => {
					this.template = response;
					this.templateTitle = response.title;
				}).catch(error =>{ })
			},
			//获取用户列表
			worksFetch:function(page){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.templateWorksFetch(this.templateID, this.status, page, this.keyword).then((response) => {
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						item.percent = (item.count || 0) + "/12";
						item.customerName = item.userName || item.author || item.userid;
						item.inviter = item.userName || item.userid;
						item.invitationStatusString = yiya.templateWorkStatusDescFecth(item.activeStatus);
						//满足12张并且审核通过
						//item.purchasable = item.count == 12 && (item.activeStatus == 3);
						item.purchasable = item.count == 12;

						item.productID = item.productid;
						item.workID = item.cartid;
						if(item.inviteModel)
						{
							item.invitee = item.invitedName || "";
							item.inviteePhone = item.inviteModel.invitephone || "";
						}

						if (item.birthdayStr){
							var birthday = moment(item.birthdayStr, "YYYY-MM-DD HH:mm:ss");
							var today = moment({hour: 0});
							var isExpectedDate = birthday.isAfter(today) || birthday.isSame(today);
							item.babyBirthday = birthday.format('YYYY-MM-DD');
							item.isExpectedDate = isExpectedDate;
						}

						item.orderNoList = item.orderNoList || [];
					}


					that.list = list;
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
				var alert = item.activeStatus == 1 && this.template && this.template.amountlimit > 0;
				if(alert){
					var message = '“制作中”的作品，我们无法扣除众筹的红包，现在下单为影楼支付相册费用';
					this.$alert(message, '', { confirmButtonText: '确定',
			            callback: action => {
			            	if(action == "confirm") {
			            		this.showOrderPanel(item);
			            	}
			            }
				    });
				}else{
					this.showOrderPanel(item);
				}
			},
			showOrderPanel:function(item)
			{
				this.workID = item.workID + "";
				this.orderProductID = item.productID + "";
				this.orderStyleID = (item.styleid || "") + "";
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
			},
			downloadExcel:function(){
				this.downloading = true;
				yiya.ibs.templateWorksExcelURLFetch(this.templateID, this.status, this.keyword).then(relativePath =>{
					this.downloading = false;
					if (relativePath)
					{
						var url = yiya.getAPIBasePath() + "/pbs/order/download?path=" + encodeURIComponent(relativePath);
						this.$alert('下载Excel', '成功', {
				          confirmButtonText: '下载',
				          callback: action => {
				            	if(action == "confirm"){
					          		window.open(url);
					          	}
				          }
				        });
					}
				}).catch(error =>{
					this.downloading = false;
				})
			}


		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			var page = parseInt(this.$route.query.page) || 1;
			var templateID = this.$route.query.id;
			var workID = this.$route.query.work_id || "";
			if(templateID)
			{
				this.keyword = workID;
				this.templateID = templateID;
				this.worksFetch(page);
				this.templateBaseInfoFetch(templateID);
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

</style>
