<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="addBtnClicked">添加</el-button>
				</el-form-item>
				<el-form-item>
					<el-input v-model="keyword" placeholder="请输入搜索内容"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="search">搜索</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="title" label="名称" width="120" > </el-table-column>
			<el-table-column prop="mintitle" label="小标题" width="120" > </el-table-column>
			<el-table-column prop="tips" label="提示文字" width="120" > </el-table-column>
			<el-table-column prop="content" label="场景详情" width="200"> </el-table-column>
			<el-table-column prop="recreason" label="推荐理由" min-width="140"> </el-table-column>
			<el-table-column label="操作" width="150" fixed="right">
				<template scope="scope">
					<el-button size="small" @click="editBtnClicked(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>

		<!--新增界面-->
		<el-dialog title="评论" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名称">
					<el-input type="textarea" v-model="addForm.title"></el-input>
				</el-form-item>
				<el-form-item label="小标题">
					<el-input type="textarea" v-model="addForm.mintitle"></el-input>
				</el-form-item>
				<el-form-item label="提示文字">
					<el-input type="textarea" v-model="addForm.tips"></el-input>
				</el-form-item>
				<el-form-item label="场景详情">
					<el-input type="textarea" v-model="addForm.content"></el-input>
				</el-form-item>
				<el-form-item label="推荐理由">
					<el-input type="textarea" v-model="addForm.recreason"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addComment" :loading="addLoading">确定</el-button>
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
				productID:'',
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				pageSize:0,
				keyword:'',

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: { }

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.productScenesFetch();
			},
			//获取用户列表
			productScenesFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.cts.productScenesFetch(this.productID, this.page, this.keyword).then(response => {
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
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
			addBtnClicked:function(){
				this.addForm = {};
				this.addFormVisible = true;
			},
			editBtnClicked:function(index, item)
			{
				this.addForm = Object.assign({}, item);
				this.addFormVisible = true;
			},
			addComment: function () {
				this.addLoading = true;
				this.addForm.productid = this.productID;
				var id = this.addForm.id;
				yiya.cts.addScenes(this.addForm).then(response =>{
					this.productScenesFetch();
					this.addFormVisible = false;
					this.addLoading = false;
					var message = id ? "修改成功" : "创建成功";
					this.$notify({ title: '成功', message: message, type: 'success' });
				}).catch(error => {
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "添加失败", type: 'error' });
				});
			},
			search:function(){
				this.productScenesFetch();
			}


		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			var productID = this.$route.query.product_id;
			if(productID)
			{
				this.productID = productID;
				this.productScenesFetch(); 
			}
		}
	}

</script>

<style scoped>

</style>
