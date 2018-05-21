<template>
	<section>
		<el-row >
			<el-col :span="24" class="toolbar">
				<el-form>
					<el-form-item>
						<template v-if="identity == Role.Freelance">
							<span><b>业务目标</b>：专属流量主的咿呀12首页，用于长期收集潜在的客户资料，获取电话号码，微信昵称等。</br></span>
							<span><b>如何使用</b>：流量主在微信公众号，给专属店铺页一个固定入口即可。</span>
						</template>
						<template v-else>
							<span><b>业务目标</b>：专属影楼的咿呀12首页，用于长期收集潜在的客户资料，获取电话号码，微信昵称等。</br></span>
							<span><b>如何使用</b>：影楼在微信公众号，给专属店铺页一个固定入口即可。</span>
						</template>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>

		<el-tabs v-model="selectedTab" >
			<el-tab-pane label="基本信息" name="first">

				<el-row>
					<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
						<el-form :inline="true">
							<el-form-item>
								<el-input v-model="specialAffiliateURL" style="min-width:650px;">
									<template slot="prepend">专属推广链接:</template>
								</el-input>
							</el-form-item>
						</el-form>
					</el-col>

				</el-row>

				<el-row v-if="identity != Role.Freelance">
					<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
						<el-form :inline="true">
							<el-form-item label="Logo">
								<el-upload class="image-uploader"
								    action="https://up.qbox.me"
								    :show-file-list="false"
								    :data="uploadForm"
								    :on-success="uploadSuccess"
								    :on-error="uploadFail"
								    :before-upload="beforeUpload">
								    <div v-if="branchInfo.logo">
								    	<img :src="branchInfo.logo" class="upload-image">
								    	<i v-if="uploading" class="el-icon-loading image-uploading-icon"></i>
								    </div>

								    <i v-else class="el-icon-plus image-uploader-icon"></i>
								</el-upload>
							</el-form-item>

							<el-form-item label="广告语">
								<el-input type="textarea" resize="none" :rows="5" :maxlength="45" v-model="branchInfo.promotionstr" class="ad-content-textarea"></el-input>
								<el-button type="primary" :loading="submitting" style="float:right;margin-top:15px;" @click="submitBtnTapped">修改</el-button>
							</el-form-item>
						</el-form>
					</el-col>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="推广效果" name="second">

				<el-row>
					<el-col :span="16" class="toolbar" style="padding-bottom: 0px;">
						<el-form :inline="true">
							<el-form-item>
								<el-radio-group v-model="category" style="display: block;" @change="radioGroupChanged">
						    		<el-radio-button label="3">自传播用户</el-radio-button>
						    		<el-radio-button label="1">用户</el-radio-button>
								    <el-radio-button label="2">推广流水</el-radio-button>
							    </el-radio-group>
							</el-form-item>
							<el-form-item v-if="category != 2">
								<el-date-picker v-model="dateRange" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions" @change="datePickerChanged"> </el-date-picker>
							</el-form-item>
						</el-form>
					</el-col>
					<el-col :span="8" class="toolbar">
						<div v-if="category == 2" class="account-container">
							<div class="balance">{{totalIncome}}</div>
							<div>（收入已转入账户）</div>
						</div>
					</el-col>
				</el-row>

				<!--列表,不同的key防止el-table元素复用-->
				<template v-if="category == 1 || category == 3">
					<el-table :data="list" v-loading="listLoading" style="width: 100%;" key="users">
						<el-table-column type="index" width="60"></el-table-column>
							<el-table-column prop="nickname" label="昵称" min-width="120"> </el-table-column>
							<el-table-column prop="userid" label="咿呀号" width="120"> </el-table-column>
							<el-table-column prop="mobilephone" label="手机号" width="160"> </el-table-column>
							<el-table-column prop="babyBirthday" :render-header="YiyaUtil.babyBirthdayRenderHeader" width="160" sortable>
								<template scope="scope">
									<span :class="scope.row.isExpectedDate ? 'expected-text' : 'birthday-text'">{{scope.row.babyBirthday}}</span>
								</template>
							</el-table-column>
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
						<el-table-column prop="orderid" label="订单号" min-width="200"> </el-table-column>
						<el-table-column prop="createtimestr" label="时间" width="220"> </el-table-column>
						<el-table-column prop="ordertotalprice" label="订单金额" width="120"> </el-table-column>
						<el-table-column prop="amount" label="推广收入" width="120"> </el-table-column>
						<!-- <el-table-column prop="userid" label="咿呀号" width="120"> </el-table-column> -->
						<!-- <el-table-column prop="status" label="状态" width="120" :formatter="formatStatus"> </el-table-column> -->

					</el-table>
				</template>

				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
					</el-pagination>
					<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
				</el-col>

			</el-tab-pane>
		</el-tabs>

	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';
	import YiyaUtil from 'common/js/YiyaUtil'
	import util from 'common/js/util'
	import Config from 'common/js/Config'
	import Role from 'common/js/role.js'
	var moment = require('moment');

	export default {
		data() {
			return {
				YiyaUtil:YiyaUtil,
				Role:Role,
				identity:0,
				list: [],
				orders: [],
				total: 0,
				page: 1,
				listLoading: false,
				pageSize:10,
				specialAffiliateURL:"",
				category:1,
				dateRange:'',
				startDateString:'',
				endDateString:'',
				pickerOptions:Config.pickerOptions,
				branchInfo:{},
				totalIncome:0,
				selectedTab:'second',
				uploading:false,
				uploadForm:{},
				submitting:false
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
				(this.category == 1 || this.category == 3) ? this.customersFetch() : this.specialAffiliateOrdersFetch();
			},
			//获取用户列表
			customersFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();

				yiya.mineReferralsCustomersFetch(this.category, this.page, this.startDateString, this.endDateString).then(response => {
					var list = response.list || [];

					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						if (item.birthdaystr){
							var birthday = moment(item.birthdaystr, "YYYY-MM-DD HH:mm:ss");
							var today = moment({hour: 0});
							var isExpectedDate = birthday.isAfter(today) || birthday.isSame(today);
							item.babyBirthday = birthday.format('YYYY-MM-DD');
							item.isExpectedDate = isExpectedDate;
						}

					}
					this.list = list;
					this.total = response.total;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

			},
			specialAffiliateURLFetch:function(){
				yiya.specialAffiliateURLFetch().then(response => {
					this.specialAffiliateURL = response;
				}).catch(error =>{

				});
			},
			branchInfoFetch:function(){
				yiya.ibs.getBranchInfo().then(response => {
					this.branchInfo = response;
				}).catch(error =>{ });
			},
			specialAffiliateOrdersFetch:function()
			{
				var that = this;
				this.listLoading = true;
				NProgress.start();

				yiya.mineSpecialAffiliateOrdersFetch(this.page, this.startDateString, this.endDateString).then(response => {

					var record = response.listpage || {};
					var list = record.list || [];
					this.totalIncome = response.sumCommission;
					this.orders = list;
					this.total = record.total || 0;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});
			},
			modifyBranchInfo:function(logoURL, adContent){
				this.submitting = true;
				yiya.ibs.modifyBranchInfo(logoURL, adContent).then(response=>{
					this.submitting = false;
					this.$notify({ title: '成功', message: '修改成功', type: 'success' });
				}).catch(error =>{
					this.submitting = false;
					this.$notify({ title: '错误', message: error.message || "删除失败", type: 'error' });
				})
			},
			submitBtnTapped:function(){
				this.modifyBranchInfo(this.branchInfo.logo, this.branchInfo.promotionstr);
			},
			beforeUpload:function(file){
				this.uploading = true;
				var key = yiya.qiniuUploadKeyGenerate()
				return yiya.uploadTokenFetch().then(token => {
					this.uploadForm = {key:key, token:token};
				})
			},
			uploadFail:function(err, file){
				this.uploading = false;
			},
			uploadSuccess(response, file) {
				this.uploading = false;
				if (response.key)
				{
					var imageURL = "http://pic.bbyiya.com/" + response.key;
					this.branchInfo.logo = imageURL;
					this.modifyBranchInfo(imageURL, this.branchInfo.promotionstr);
				}
		    }
		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			this.customersFetch();
			this.specialAffiliateURLFetch();
			this.branchInfoFetch();
			var identity = parseInt(sessionStorage.getItem('identity'));
			this.identity = identity;
		}
	}

</script>

<style scoped>
.avatar{
	width: 60px;
	height: 60px;
	margin-top: 10px;
	border-radius: 50%;
}

.image-uploader {
	width: 178px;
	height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

.image-uploader:hover {
	border-color: #20a0ff;
}

.image-uploader-icon
{
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}

.image-uploading-icon
{
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}

.upload-image
{
	width: 178px;
	height: 178px;
	top: 0px;
	left: 0px;
	position: absolute;
}

.ad-content-textarea{
	min-width: 300px;
}

.balance{
    font-size: 30px;
    color: #ff9c00;
}

.account-container{
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

	float: right;
}

.birthday-text{
	color: #1d2088;
}

.expected-text{
	color: #e60012;
}

</style>
