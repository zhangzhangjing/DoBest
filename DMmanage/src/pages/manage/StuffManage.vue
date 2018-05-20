<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="username" label="名称" min-width="120"> </el-table-column>
			<el-table-column prop="userid" label="咿呀号" width="100"> </el-table-column>
			<el-table-column prop="type" label="type" width="120"> </el-table-column>
			<el-table-column prop="createtime" label="添加时间" width="240"> </el-table-column>
			<el-table-column label="操作" width="210">
                <template scope="scope">
                    <el-button size="small" type="danger" :loading="deleting" @click="removeStuff(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>

		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
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
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';
	import StringUtil from 'common/js/StringUtil.js';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				deleting:false,
				pageSize:10,

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					phone: [
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
			handleCurrentChange(val) {
				this.page = val;
				this.stuffsFetch();
			},
			//获取用户列表
			stuffsFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.cts.stuffsFetch(this.page).then(response => {
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						item.remark = "remark";
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
			removeStuff: function (index, row) {
				this.$confirm('确认删除该员工吗?', '提示', { type: 'warning' }).then(() => {
					this.deleting = true;
					NProgress.start();
					yiya.cts.removeStuff(row.customerid).then(res =>{
						this.stuffsFetch();
						this.deleting = false;
						NProgress.done();
						this.$notify({ title: '成功', message: '删除成功', type: 'success' });
					}).catch(error => {
						this.deleting = false;
						this.$notify({ title: '错误', message: error.message || "删除失败", type: 'error' });
					});

				}).catch(() => { });
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = { phone: '' };
			},
			//新增
			addSubmit: function () {

				var phone = StringUtil.trim(this.addForm.phone);
				if(!phone){
					this.$notify({ title: '错误', message: "请输入手机号", type: 'error' });
					return;
				}

				NProgress.start();
				this.addLoading = true;
				yiya.cts.addStuff(phone).then(response =>{
					this.stuffsFetch();
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


		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			this.stuffsFetch();
		}
	}

</script>

<style scoped>

</style>
