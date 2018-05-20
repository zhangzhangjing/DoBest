<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-tooltip effect="dark" content="在添加员工到内部账号前，需要员工先注册咿呀账号" placement="top">
				      	<el-button type="primary" @click="handleAdd">新增</el-button>
				    </el-tooltip>

				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="姓名" min-width="120">
			</el-table-column>
			<el-table-column prop="userid" label="咿呀号" width="100">
			</el-table-column>
			<el-table-column prop="phone" label="员工手机" width="160">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="danger" size="small" :loading="deleting" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
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
	import yiya from '../../api/yiya';
	import StringUtil from 'common/js/StringUtil.js';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
				deleting:false,


				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					phone: ''
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
			//获取用户列表
			getUsers:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.stuffAccountsFetch().then((response) => {
					var list = response || [];
					that.users = list;
					that.total = list.length;
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
					yiya.stuffAccountDelete(row.userid).then(res =>{
						this.getUsers();
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
				yiya.stuffAccountAdd(name, phone).then(response =>{
					this.getUsers();
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
			selsChange: function (sels) {
				this.sels = sels;
			}


		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>
