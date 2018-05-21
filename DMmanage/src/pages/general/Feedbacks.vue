<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="postBtnClicked">发布通知</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" v-loading="listLoading" style="width: 100%;">
			<el-table-column type="expand">
				<template scope="props">
					<span>{{ props.row.content }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="summary" label="内容" min-width="120"> </el-table-column>
			<el-table-column prop="userid" label="UID" width="60"> </el-table-column>
			<el-table-column prop="createtime" label="时间" width="200"> </el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="内容" prop="content">
					<el-input type="textarea" v-model="addForm.content"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="postNotification" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>


	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';

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
				pageSize:10,
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
					phone: [
						{ required: true, message: '请输入内容', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					content: ''
				}

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.presentRecordsFetch();
			},
			//获取用户列表
			presentRecordsFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.feedbacksFetch(this.page).then(response => {
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						var content = item.content || "";
						item.summary = content.substr(0, 40);
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
			//显示新增界面
			postBtnClicked: function () {
				this.addFormVisible = true;
				this.addForm = { title: '', content: '' };
			},
			//新增
			postNotification: function () {
				this.addLoading = true;
				yiya.postNotification(this.addForm.title, this.addForm.content).then(response =>{
					this.addFormVisible = false;
					this.addLoading = false;
					this.$notify({ title: '成功', message: '发布成功', type: 'success' });

				}).catch(error => {
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "发布失败", type: 'error' });
				});
			}


		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			this.presentRecordsFetch();
		}
	}

</script>

<style scoped>

</style>