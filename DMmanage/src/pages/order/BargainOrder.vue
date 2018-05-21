<template>
	<section>
		<!--工具条-->
		<el-row>
			<!-- <el-col :span="2" class="toolbar"><span>业务说明</span></el-col> -->
			<el-col :span="24" class="toolbar">
				<el-form>
					<el-form-item>
						<span><b>业务目标</b>：其他分店的活动中，如果有客户选择本店领取活动礼品，则订单和客户信息都会共享到本店</br></span>
						<span><b>如何使用</b>：根据收到的礼品里的订单号，搜索用户信息</span>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>

		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<!-- <el-form-item>
					<el-radio-group v-model="status" style="display: block;" @change="radioGroupChanged">
			    		<el-radio-button label="0">未支付</el-radio-button>
					    <el-radio-button label="1">已支付</el-radio-button>
					    <el-radio-button label="2">等待发货</el-radio-button>
					    <el-radio-button label="3">已发货</el-radio-button>
					    <el-radio-button label="4">已签收</el-radio-button>
				    </el-radio-group>
				</el-form-item> -->
				<el-form-item>
					<el-input v-model="keyword" placeholder="订单号/手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="loading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="orderID" label="订单号" width="200"> </el-table-column>
			<el-table-column prop="branchname" label="订单来源" width="200"> </el-table-column>
			<el-table-column label="订单客户" width="130">
				<template scope="scope">
					<el-button type="text" @click="viewUser(scope.$index, scope.row)">{{scope.row.customername || '用户'}}</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="producttitle" label="制作类型" width="120"> </el-table-column>
			<el-table-column prop="phone" label="客户手机" width="140"></el-table-column>
			<el-table-column prop="babyBirthday" :render-header="YiyaUtil.babyBirthdayRenderHeader" width="160" sortable>
				<template scope="scope">
					<span :class="scope.row.isExpectedDate ? 'expected-text' : 'birthday-text'">{{scope.row.babyBirthday}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="address" label="用户地址" min-width="180"></el-table-column>
			<!-- <el-table-column label="客户信息" width="120">
				<template scope="scope">
					<el-button type="text" @click="viewSource(scope.row)">{{scope.row.workTitle || '客户作品'}}</el-button>
				</template>
			</el-table-column> -->
			<el-table-column label="详情" width="100" fixed="right">
				<template scope="scope">
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

	</section>
</template>
<script>
	import yiya from '../../api/yiya';
	import YiyaUtil from 'common/js/YiyaUtil'
	import NProgress from 'nprogress'
	var moment = require('moment');

	export default {
		data() {
			return {
				YiyaUtil:YiyaUtil,
				loading: false,
				status:1,//订单状态
				list: [],
				total: 0,
				page: 1,
				pageSize:0,
				keyword:''
			}
		},
		methods: {
			//获取用户列表
			ordersListFetch: function () {
				this.loading = true;
				NProgress.start();
				yiya.bargainOrdersFetch(this.status, this.page, this.keyword).then(response =>{
					// var list = response instanceof Array ? response : [];
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						item.orderID = item.userorderid;
						item.isExpectedDate = false;
						if (item.babybirthdaystr){
							var birthday = moment(item.babybirthdaystr, "YYYY-MM-DD HH:mm:ss");
							var today = moment({hour: 0});
							var isExpectedDate = birthday.isAfter(today) || birthday.isSame(today);
							item.babyBirthday = birthday.format('YYYY-MM-DD');
							item.isExpectedDate = isExpectedDate;
						}
					}


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
			viewUser:function(index, item)
			{
				var uid = item.userid;
				if (uid) {
					this.$router.push({ name: 'Customers', query: { uid: uid}});
				}
			},
			viewDetail:function(item){
				var orderID = item.userorderid;
				if (orderID)
				{
					this.$router.push({ name: 'OrderDetail', query: { orderID: orderID}});
				}
			},
			viewSource:function(item){
				var templateID = item.tempid;
				var workID = item.cartid;
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
			this.pageSize = yiya.CountPerPage;
			this.ordersListFetch();
		}
	};

</script>

<style scoped>
.birthday-text{
	color: #1d2088;
}

.expected-text{
	color: #e60012;
}
</style>
