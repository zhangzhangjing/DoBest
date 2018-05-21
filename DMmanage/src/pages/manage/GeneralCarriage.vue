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
			<el-table-column prop="postmodelid" label="ID" width="60"> </el-table-column>
			<el-table-column prop="name" label="名称" min-width="120"> </el-table-column>
			<el-table-column prop="amount" label="价格" width="100"> </el-table-column>
			<el-table-column prop="createtime" label="创建时间" width="200"> </el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="small" size="small" @click="edit(scope.$index, scope.row)">编辑</el-button>
					<!-- <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>

		<!--新增界面-->
		<el-dialog title="模板" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="价格" prop="amount">
					<el-input v-model="addForm.amount" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">确定</el-button>
			</div>
		</el-dialog>


	</section>
</template>

<script>
	import util from 'common/js/util'
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				list: [],
				listLoading: false,

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					amount: [
						{ required: true, message: '请输入价格', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {}

			}
		},
		methods: {
			//获取用户列表
			generalCarriageFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.generalCarriageFetch().then((response) => {
					var list = response || [];
					that.list = list;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该账号吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					NProgress.start();

					yiya.stuffAccountDelete(row.userid).then(res =>{
						this.generalCarriageFetch();
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
			edit: function (index, item) {
				this.addFormVisible = true;
				var form = Object.assign({},item);
				this.addForm = form;
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = { name: '', amount: '' };
			},
			//新增
			addSubmit: function () {
				this.addLoading = true;
				NProgress.start();

				var name = this.addForm.name;
				var amount = this.addForm.amount;
				var id = this.addForm.postmodelid;
				var func = id ? yiya.modifyGeneralCarriage(id, name, amount) : yiya.addGeneralCarriage(name, amount);
				func.then(response =>{
					this.generalCarriageFetch();
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
			this.generalCarriageFetch();
		}
	}

</script>

<style scoped>

</style>