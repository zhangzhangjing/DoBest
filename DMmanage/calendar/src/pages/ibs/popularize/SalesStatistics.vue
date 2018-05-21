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
					<el-radio-group v-model="addresstype" style="display: block;" @change="changeRadio(addresstype)" >
			    		<el-radio-button :label="0">上门自提</el-radio-button>
					    <el-radio-button :label="1">直邮到家</el-radio-button>
				    </el-radio-group>
				</el-form-item>

				<el-form-item>
					<el-input v-model="keyword" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">查询</el-button>
				</el-form-item>
				<el-form-item style="float:right; ">
					<p v-if="addresstype==0" style="font-size:18px;">总运费：{{Totalprice || 0}}</p>
				</el-form-item>
			</el-form>
			

		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="userorderid" label="订单号" min-width="120"> </el-table-column>
			<el-table-column v-if="addresstype==0" prop="name" label="用户姓名" width="120"> </el-table-column>
			<el-table-column v-if="addresstype==0" prop="mobilephone" label="联系方式" width="160"> </el-table-column>
			<el-table-column v-if="addresstype==0" prop="postage" label="运费" width="160" > </el-table-column>

			<el-table-column prop="submittimestr" label="下单时间" > </el-table-column>

			<el-table-column label="状态" width="120" fixed="right">
				<template scope="scope">

					<span v-if="scope.row.status==0" style="font-weight: bold;">申请中</span>
					<span v-if="scope.row.status==1" style="font-weight: bold;">已支付</span>
				

					<template v-if="scope.row.status==2">
						<el-popover trigger="click" placement="top" class="popover">
							<div style="max-height:300px; overflow:auto;">
				        		<el-button type="text" class="order-button"  @click="viewOrder(scope.row.userorderid)">{{scope.row.userorderid}}</el-button> <!-- v-for="item in scope.row.userorderid" -->
							</div>
							<el-button size="small" slot="reference">已下单</el-button>
				        </el-popover>
					</template>

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
	import YiyaUtil from 'common/js/YiyaUtil'
	import NProgress from 'nprogress'
	import api from 'src/api/api';
	import Formatter from 'common/js/Formatter'
	var moment = require('moment');

	export default {
		data() {
			return {
				YiyaUtil:YiyaUtil,
				Formatter:Formatter,
				campaignID:'',
				templateTitle:'',
				template:null,
				productID:'',
				styles:[],
				list: [],
				total: 0,
				page: 1,
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
				orderUID:'',
				size:10,


				// ------------
				gactid:this.$route.query.gactid,
				addresstype:0,
				Totalprice:0,

			}
		},
		// watch:{
		//   	// '$route': function(value){
		//   	// 	this.page = parseInt(this.$route.query.page) || 1;
		//   	// },
		//   	// page:function(value){
		// 	// 	this.$router.push({ name: 'CampaignWorks', query: { id:this.campaignID, page: value}});
		// 	// 	if(this.loadedPage != value)
		// 	// 	{
		// 	// 		this.worksFetch(value);
		// 	// 	}
		//   	// }
		// },
		methods: {
			
			viewOrder(orderID){
				if(orderID){
					this.$router.push({ name: 'OrderDetail', query: { orderID: orderID}});
				}
			},

			changeRadio(value){
				this.addresstype = value
				this.worksFetch()
			},

			handleCurrentChange(page) {
				this.page = page;
				this.worksFetch()
			},
			//获取用户列表
			worksFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();

				api.ibs.getSumPostAgeByGactid(this.gactid).then((response)=>{
					this.Totalprice = response.sumpostage
				})


				api.ibs.getGroupActWorkListByGactid( this.page,this.size,this.gactid,this.addresstype, this.keyword,).then((response) => {
		
					var list = response.list || [];
					this.total = response.total;
				
					this.list = list;
					this.loadedPage = page;
								
					this.page = page;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

			},
		
			orderPanelClicked:function(index, item){
				this.showOrderPanel(item);
			},
			showOrderPanel:function(item)
			{
				this.workID = item.workID + "";
				this.orderProductID = item.productID + "";
				this.orderStyleID = (item.styleid || "") + "";
				this.orderUID = item.userid || "";
				this.addFormVisible = true;
			},	
			search:function(){
				this.worksFetch(this.page)
			}
		},
		mounted() {
			this.pageSize = api.CountPerPage;
			var page = 1;		
			this.worksFetch(page);

			


		},
		
	}

</script>

<style scoped>

.popover{
	display: inline-block;
	
}

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
