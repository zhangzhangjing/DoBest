<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="postid" label="ID" width="60"></el-table-column>
			<el-table-column prop="postModelName" label="名称" width="120"></el-table-column>
			<el-table-column prop="amount" label="价格" width="100"> </el-table-column>
			<el-table-column prop="areaname" label="区域" min-width="200"> </el-table-column>
			<el-table-column prop="areacode" label="区域编码" width="120"> </el-table-column>
			<el-table-column prop="createtime" label="创建时间" width="200"> </el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="区域名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="区域编码" prop="code">
					<el-input v-model="addForm.code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="价格" prop="amount">
					<el-input v-model="addForm.amount" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="ID" prop="templateID">
					<el-input v-model="addForm.templateID" auto-complete="off"></el-input>
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
				list: [],
				total: 0,
				page: 1,
				pageSize:0,
				listLoading: false,


				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入区域名称', trigger: 'blur' }
					],
					code: [
						{ required: true, message: '请输入区域编码', trigger: 'blur' }
					],
					amount: [
						{ required: true, message: '请输入价格', trigger: 'blur' }
					],
					templateID: [
						{ required: true, message: '请输入模板ID', trigger: 'blur' }
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
				this.$router.replace({ name: 'ForbiddenCarriage', query: { page: val}});
				this.carriageFetch();
			},
			//获取用户列表
			carriageFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.forbiddenCarriageFetch(this.page).then((response) => {
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
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该模板吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					NProgress.start();
					console.log(index, row);

					yiya.removeForbiddenCarriage(row.postid).then(res =>{
						this.carriageFetch();
						this.listLoading = false;
						NProgress.done();
						this.$notify({ title: '成功', message: '删除成功', type: 'success' });
					}).catch(error => {
						this.$notify({ title: '错误', message: error.message || "删除失败", type: 'error' });
					});

				}).catch(() => {
					console.log("取消按钮");
				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = { name: '', code: '', amount:0, templateID:''};
			},
			//新增
			addSubmit: function () {

				var name = StringUtil.trim(this.addForm.name);
				var code = StringUtil.trim(this.addForm.code);
				var amount = StringUtil.trim(this.addForm.amount);
				var templateID = StringUtil.trim(this.addForm.templateID);


				this.addLoading = true;
				NProgress.start();
				yiya.addForbiddenCarriage(name, code, amount, templateID).then(response =>{
					this.carriageFetch();
					this.addFormVisible = false;
					this.addLoading = false;
					NProgress.done();
					this.$notify({ title: '成功', message: '添加成功', type: 'success' });

				}).catch(error => {
					this.addLoading = false;
					NProgress.done();
					this.$notify({ title: '错误', message: error.message || "添加失败", type: 'error' });
				});
			}


		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			this.page = this.$route.query.page || 1;
			this.carriageFetch();
			console.log("ForbiddenCarriage mounted");
		}
	}

</script>

<style scoped>

</style>