<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="20" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">

					<el-form-item>
						<el-radio-group v-model="category" style="display: block;" @change="radioGroupChanged">
				    		<el-radio-button label="1">用户</el-radio-button>
						    <el-radio-button label="2">订单</el-radio-button>
					    </el-radio-group>
					</el-form-item>

					<el-form-item>
						<el-date-picker v-model="dateRange" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions" @change="datePickerChanged"> </el-date-picker>
					</el-form-item>
					
				</el-form>
			</el-col>

			<el-col :span="4" class="toolbar button-container">
            	<el-button type="primary" :loading="excelDownloading" class="download-button" @click="excelDownload">下载Excel</el-button>
            </el-col>
		</el-row>
		

		<!--列表,不同的key防止el-table元素复用-->
		<template v-if="category == 1">
			<el-table :data="list" v-loading="listLoading" style="width: 100%;" key="users">
				<el-table-column type="index" width="60"></el-table-column>
					<el-table-column prop="nickname" label="昵称" min-width="120"> </el-table-column>
					<el-table-column prop="userid" label="咿呀号" width="120"> </el-table-column>
					<el-table-column prop="amount" label="头像" width="100"> 
						<template scope="scope">
					        <img v-bind:src="scope.row.userimg" class="avatar">
					    </template>
					</el-table-column>
					<el-table-column prop="createtime" label="注册时间" width="220"> </el-table-column>
				</el-table>
		</template>
		<template v-else>
			<el-table :data="orders" v-loading="listLoading" style="width: 100%;" key="orders">
				<el-table-column prop="userorderid" label="订单号" min-width="200"> </el-table-column>
				<el-table-column prop="userid" label="咿呀号" width="120"> </el-table-column>
				<el-table-column prop="totalprice" label="金额" width="120"> </el-table-column>
				<el-table-column prop="status" label="状态" width="120" :formatter="formatStatus"> </el-table-column>
				<el-table-column prop="createtime" label="时间" width="220"> </el-table-column>
			</el-table>
		</template>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>


	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';
	import util from 'common/js/util'
	import Config from 'common/js/Config'

	export default {
		data() {
			return {
				uid:"",
				list: [],
				orders: [],
				total: 0,
				page: 1,
				listLoading: false,
				excelDownloading:false,
				pageSize:10,
				category:1,
				dateRange:'',
				startDateString:'',
				endDateString:'',
				pickerOptions:Config.pickerOptions
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.reloadData();
			},
			radioGroupChanged:function(category)
			{
				this.page = 1;
				this.reloadData();
			},
			datePickerChanged:function(){
				var dateRange = this.dateRange;
				this.startDateString = "";
				this.endDateString = "";
				if(dateRange && dateRange.length == 2)
				{
					var start = dateRange[0];
					var end = dateRange[1];
					if (start && end)
					{
						this.startDateString = util.formatDate.format(start, 'yyyy-MM-dd');
						this.endDateString = util.formatDate.format(end, 'yyyy-MM-dd');
					}
				}
				this.reloadData();
			},
			formatStatus: function (row, column) {
				return row.status == 0 ? '未结算' : row.status == 1 ? '已结算' : '未知';
			},
			reloadData:function(){
				this.category == 1 ? this.customersFetch() : this.specialAffiliateOrdersFetch();
			},
			//获取用户列表
			customersFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();

				yiya.referralsCustomersFetch(this.uid, this.page, this.startDateString, this.endDateString).then(response => {
					var list = response.list || [];
					that.list = list;
					that.total = response.total;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

			},
			specialAffiliateOrdersFetch:function()
			{
				var that = this;
				this.listLoading = true;
				NProgress.start();

				yiya.specialAffiliateOrdersFetch(this.uid, this.page, this.startDateString, this.endDateString).then(response => {
					var list = response.list || [];
					this.orders = list;
					this.total = response.total;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});
			},
			excelDownload:function()
			{
				this.excelDownloading = true;
				yiya.trafficsourceAnalyticsExcelURLFetch(this.uid, this.page, this.startDateString, this.endDateString).then(response =>{
					this.excelDownloading = false;
					var relativePath = response;
					if (relativePath)
					{
						var url = yiya.getAPIBasePath() + "/pbs/order/download?path=" + encodeURIComponent(relativePath);
						this.$alert('Excel生成完成', '成功', { confirmButtonText: '下载', callback: action => {
				          		if (action == "confirm"){
				          			window.open(url);
				          		}
				            }
				        });
					}
				}).catch(error => {
					this.excelDownloading = false;
					this.$notify({ title: '错误', message: error.message || "下载失败", type: 'error' });
				});
			}


		},
		mounted() {
			var uid = this.$route.query.uid;
			this.uid = uid;
			this.pageSize = yiya.CountPerPage;
			this.customersFetch();
		}
	}

</script>

<style scoped>
.avatar{
	width: 80px;
	height: 80px;
	border-radius: 50%;
}

.download-button{
	float: right;
}

</style>