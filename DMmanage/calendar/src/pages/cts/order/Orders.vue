<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-radio-group v-model="filters.ordertype" style="display: block;" @change="radioGroupChanged">
						<el-radio-button :label="null">全部</el-radio-button>
						<el-radio-button :label="OrderType.O0.value">{{OrderType.O0.name}}</el-radio-button>
					<!-- 	<el-radio-button :label="OrderType.O1.value">{{OrderType.O1.name}}</el-radio-button>
						<el-radio-button :label="OrderType.O2.value">{{OrderType.O2.name}}</el-radio-button> -->
						<el-radio-button :label="OrderType.O3.value">{{OrderType.O3.name}}</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.orderNo" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"> </el-table-column>
			<el-table-column prop="userorderid" label="订单号" min-width="120"> </el-table-column>
			<!-- 后端 -->
			<el-table-column prop="text" label="订单状态" min-width="120"> </el-table-column>
			<el-table-column prop="productTitle" label="产品类型" width="100"> </el-table-column>
			<el-table-column prop="userid" label="用户账号" width="100"> </el-table-column>
			<el-table-column prop="produceruserid" label="生产商账号" width="100"> </el-table-column>
		<!-- 	<el-table-column prop="receiver" label="收件人" width="160"> </el-table-column>
			<el-table-column prop="detailAddress" label="地址" width="160"> </el-table-column> -->
			<el-table-column prop="ordertime" label="下单时间" width="220"> </el-table-column>
			<el-table-column label="操作" width="340" fixed="right">
				<template scope="scope">
					<el-popover trigger="click" placement="bottom" class="popover">
						<div style="max-height:300px; overflow:auto;">
							<p>姓名：{{scope.row.receiver}}</p>
							<p>电话：{{scope.row.address.phone}}</p>
							<!-- <p>收货地址：{{}}</p> 收货地址查询不到 -->
							<p>联系人电话：{{scope.row.address.phone}}</p>
							<p>企业地址：{{scope.row.detailAddress}}</p>
						</div>
						<el-button size="small" slot="reference">用户查询</el-button>
				     </el-popover>
				     <el-popover trigger="click" placement="bottom" class="popover">
						<div style="max-height:300px; overflow:auto;">
							<p>账号：{{}}</p>
							<p>负责人姓名：{{}}</p>
							<p>联系电话：{{}}</p>
						</div>
						<el-button size="small" slot="reference">生产商查询</el-button>
				     </el-popover>
				      <el-button size="small" @click="viewDetail(scope.row)">订单详情</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="订单详情" :visible.sync="isShowOrder" :close-on-click-modal="false">
			<template>
				<el-form label-width="120px" label-position="left" >
					<el-form-item label="产品类型：" >
						<span>{{detailsProduct.producttitle}}</span>
					</el-form-item>
					<el-form-item label="产品款式：" >
						<span>{{detailsProduct.propertystr}}
						</span>
					</el-form-item>
					<el-form-item label="订单份数：" >
						1
					</el-form-item>
					<el-form-item label="订单金额：" >
						<span>{{detailsProduct.price || 0}}</span>
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
						<span>{{orderDetails.detailAddress}}</span>
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
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="phone">
					<el-input v-model="addForm.phone" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>


	</section>
</template>

<script>
	import util from 'common/js/util'
	import NProgress from 'nprogress'
	import api from 'src/api/api';
	import StringUtil from 'common/js/StringUtil.js';
	import {OrderType} from 'common/js/BaseModel';


	export default {
		data() {
			return {
				OrderType:OrderType,
				filters:{orderNo:'',ordertype:null,status:'',startTimeStr:'', endTimeStr:'', agentUserId:null},
				users: [],
				total: 0,
				page: 1,
				pageSize:0,
				listLoading: false,
				deleting:false,
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				// 新增
				isShowOrder: false,
				orderDetails: [],
				detailsProduct: [],
				shippingRecords:[],
				kuaidi: '',
				//新增界面数据
				addForm: {
					name: '',
					phone: ''
				}

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.ordersFetch();
			},
			//获取用户列表
			ordersFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				api.cts.ordersFetch(this.page, this.filters).then((response) => {
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						if(item.orderproduct){
							item.productTitle = item.orderproduct.producttitle;
						}
						var address = item.address;
						if(address){
							item.receiver = address.reciver;
							item.detailAddress = address.province + address.city + address.district + address.streetdetail;
						}
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
					}
					that.users = list;
					that.total = response.total;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该账号吗?', '提示', { type: 'warning' }).then(() => {
					this.deleting = true;
					api.ibs.stuffAccountDelete(row.userid).then(res =>{
						this.ordersFetch();
						this.deleting = false;
						this.$notify({ title: '成功', message: '删除成功', type: 'success' });
					}).catch(error => {
						this.deleting = false;
						this.$notify({ title: '错误', message: error.message || "删除失败", type: 'error' });
					});

				}).catch(() => {
					console.log("取消按钮");
				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					phone: ''
				};
			},
			//新增
			addSubmit: function () {

				var phone = this.addForm.phone;
				var name = StringUtil.trim(this.addForm.name);
				if(!name){
					this.$notify({ title: '错误', message: "请输入姓名", type: 'error' });
					return;
				}
				NProgress.start();
				this.addLoading = true;
				api.ibs.stuffAccountAdd(name, phone).then(response =>{
					this.ordersFetch();
					this.addFormVisible = false;
					this.addLoading = false;
					NProgress.done();
					this.$notify({ title: '成功', message: '添加成功', type: 'success' });
				}).catch(error => {
					this.addLoading = false;
					NProgress.done();
					this.$notify({ title: '错误', message: error.message || "添加失败", type: 'error' });
				});
			},
			radioGroupChanged:function(value)
	        {
	            this.ordersFetch();
	        },
			search:function(){
				this.ordersFetch();
			},
			// 新增订单详情
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
			viewDetail: function (item) {
				this.isShowOrder = true;
				console.log('this.isShowOrder', this.isShowOrder)
				var number = parseInt(item.status)
				this.orderDetails = item;
				if (this.orderDetails.orderproduct) {
					this.detailsProduct = item.orderproduct
				}
				console.log(item)
				 var orderID = item.userorderid;
				if (number > 3) {
					this.orderDetailFetch(orderID)
				}
			}
		},
		mounted() {
			this.pageSize = api.CountPerPage;
			this.ordersFetch();
		}
	}

</script>

<style scoped>
 .el-form-item{
 	margin-bottom: 0px!important;
 }
</style>
