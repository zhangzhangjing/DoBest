<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar">
				<el-form>
					<el-form-item>
						<span><b>资源含义</b>：指在代理地区自费下单的潜在客户（当地玩咿呀12的用户越多，带来的潜在客户就越多</br></span>
						<span><b>板块说明</b>：潜在客户下单后，其资料将在此处</span>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>

		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="keyword" placeholder="咿呀号/手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="dateRange" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions" @change="datePickerChanged"> </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" width="60"> </el-table-column>
			<el-table-column prop="name" label="客户昵称" min-width="120" sortable :sort-method="nameSort"></el-table-column>
			<el-table-column prop="babyBirthday" :render-header="YiyaUtil.babyBirthdayRenderHeader" width="150" sortable>
				<template scope="scope">
					<span :class="scope.row.isExpectedDate ? 'expected-text' : 'birthday-text'">{{scope.row.babyBirthday}}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="sourcename" label="客户来源" width="120"> </el-table-column> -->
			<el-table-column prop="phone" label="客户手机" width="160"> </el-table-column>
			<el-table-column prop="babyNickName" label="宝宝昵称" width="160"> </el-table-column>
			<el-table-column prop="address" label="收货地址" width="220"> </el-table-column>
			<el-table-column prop="addedDate" label="注册时间" width="180" sortable></el-table-column>
			<el-table-column prop="lastBuyDateStr" label="下单时间" width="180"></el-table-column>
			<el-table-column label="备注" width="150">
				<template scope="scope">
					<span>{{scope.row.remark}}</span>
					<el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="120" fixed="right">
				<template scope="scope">
					<el-button size="small" :disabled="(scope.row.userid || '').length == 0" @click="buyHistory(scope.$index, scope.row)">购买记录</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>

		<!--新增界面-->
		<el-dialog title="" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<!-- <el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="phone">
					<el-input v-model="addForm.phone" auto-complete="off"></el-input>
				</el-form-item> -->
				<el-form-item label="备注">
					<el-input type="textarea" v-model="addForm.remark"></el-input>
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
	import YiyaUtil from 'common/js/YiyaUtil'
	import {pinyin} from 'common/js/pinyin'
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';
	import Config from 'common/js/Config'
	var moment = require('moment');

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				YiyaUtil:YiyaUtil,
				users: [],
				total: 0,
				page: 1,
				pageSize:0,
				listLoading: false,
				deleting:false,
				sels: [],//列表选中列
				keyword:'',
				dateRange:'',
				startDateString:'',
				endDateString:'',
				pickerOptions:Config.pickerBirthdayOptions,


				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					phone: [
						{ required: true, message: '请输入手机号码', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					phone: '',
					remark:''
				}

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			nameSort:function(lhs,rhs)
			{
				var a = lhs.letter > rhs.letter ? 1 : 0;
				return a
			},
			//获取用户列表
			getUsers:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.latentCustomersListFetch(this.page, this.keyword, this.startDateString, this.endDateString).then((response) => {
					var list = response.list|| [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						var name = item.name || "";
						var firstLetter = name.substr(0,1);
						item.letter = (pinyin.getCamelChars(firstLetter) || "").toLowerCase();
						item.addedDate = item.createtimeStr;
						item.isExpectedDate = false;
						if (item.babyBirthday){
							var birthday = moment(item.babyBirthday, "YYYY-MM-DD HH:mm:ss");
							var today = moment({hour: 0});
							var isExpectedDate = birthday.isAfter(today) || birthday.isSame(today);
							item.babyBirthday = birthday.format('YYYY-MM-DD');
							item.isExpectedDate = isExpectedDate;
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
			//修改
			handleEdit: function (index, row) {
				this.addFormVisible = true;
				this.addForm = Object.assign({}, row);
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该客户吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.deleting = true;
					NProgress.start();
					yiya.customerDelete(row.customerid).then(res =>{
						this.getUsers();
						this.deleting = false;
						NProgress.done();
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
					phone: '',
					remark:'',
					customerid:''
				};
			},
			//新增
			addSubmit: function () {
				this.addLoading = true;
				var uid = this.addForm.customerid;
				yiya.customerAdd(this.addForm).then(response =>{
					this.getUsers();
					this.addFormVisible = false;
					this.addLoading = false;
					var message = uid ? '修改成功' : '添加成功';
					this.$notify({ title: '成功', message: message, type: 'success' });

				}).catch(error => {
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "添加失败", type: 'error' });
				});
			},
			buyHistory: function (index, item) {
				var uid = item.userid;
				if (uid) {
					this.$router.push({ path: '/order/customer', query: { uid: uid}});
				}

			},
			selsChange: function (sels) {
				this.sels = sels;
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
				this.getUsers();
			},
			search:function(){
				this.getUsers();
			}


		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			this.getUsers();
		}
	}

</script>

<style scoped>
.birthday-text{
	color: #1d2088;
}

.expected-text{
	color: #e60012;
}
</style>
