<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-select v-model="selectedProductID" placeholder="请选择">
    					<el-option v-for="item in products" :label="item.label" :value="item.value"></el-option>
  					</el-select>
				</el-form-item>

				<el-form-item>
					<el-select v-model="selectedCategoryID" placeholder="请选择">
    					<el-option v-for="item in categories" :label="item.label" :value="item.value">
    						<span style="float: left">{{ item.label }}</span>
							<el-button type="text" icon="delete" @click.stop="removeCategoryBtnClicked($event, item.value)" style="float:right;padding-top: 5px;"></el-button>
    						<el-button type="text" icon="edit" @click.stop="editCategoryBtnClicked($event, item.value)" style="float:right;margin-right: 10px;padding-top: 5px;"></el-button>
    					</el-option>
  					</el-select>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="addCategoryBtnClicked">新增分类</el-button>
				</el-form-item>
			</el-form>
			
		</el-col>

		<!--列表-->
		<el-table :data="comments" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="tipid" label="ID" width="60"></el-table-column>
			<el-table-column prop="content" label="内容" min-width="120"></el-table-column>
			<el-table-column label="操作" width="100">
				<template scope="scope">
					<el-button type="danger" size="small" :loading="deleting" @click="removeComment(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="primary" v-on:click="addCommentBtnClicked">新增评论</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="total" :total="total" style="float:right;"> </el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>

		<!--新增界面-->
		<el-dialog title="评论" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="评论">
					<el-input type="textarea" v-model="addForm.content"></el-input>
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
	import util from 'common/js/util'
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';

	export default {
		data() {
			return {
				data: [],
				comments:[],
				categories:[],
				selectedCategoryID:'',
				products:[],
				selectedProductID:'',
				total: 0,
				listLoading: false,
				deleting:false,

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
		watch:{
		  	selectedProductID:function(id){
		  		this.categoriesFetch();
		  	},
		  	selectedCategoryID:function(id){
		  		this.commentsFetch(id);
		  	}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				//this.freelancesFetch();
			},
			//获取用户列表
			commentsFetch:function(categoryID){
				var index = this.data.findIndex(item => {return item.tipclassid == categoryID});
				var item = this.data[index];
				var comments;
				if(item)
				{
					comments = item.tips;
				}

				comments = comments || [];
				this.comments = comments;
				this.total = comments.length;
			},
			categoriesFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.presetCommentsFetch(this.selectedProductID).then((response) => {
					var list = response || [];
					this.data = list;
					var categories = list.map(item =>{
						return {label:item.tipclassname, value:item.tipclassid};
					});
					this.categories = categories;
					var index = categories.findIndex(item => {return item.value == this.selectedCategoryID});
					//上次无默认选中，则选择第一个
					if(!this.selectedCategoryID || index == -1)
					{
						var firstItem = categories[0];
						if(firstItem && firstItem.value){
							this.selectedCategoryID = firstItem.value;
						}
					}
					this.commentsFetch(this.selectedCategoryID);
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

			},
			productsFetch:function(){
				yiya.productsFetch().then((response) => {
					var list = response.list || [];
					this.products = list.map(item =>{
						return {label:item.title, value:item.productid};
					});
					var firstItem = list[0];
					if(firstItem && firstItem.productid){
						this.selectedProductID = firstItem.productid;
					}
				})
			},
			showOrders: function (index, item) {
				var uid = item.userid;
				if(uid){
					this.$router.push({ path: '/freelance/orders', query: { uid: uid}});
				}
			},
			addCategoryBtnClicked:function(){
				this.$prompt('请输入分类名称', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', }).then(({value}) => {
		          	this.addCategory(value);
		        }).catch(() => { });
			},
			addCategory:function(categoryName, categoryID){
				yiya.editPresetCommentCategory(this.selectedProductID, categoryName, categoryID || "").then(response =>{
					this.categoriesFetch();
				}).catch(error =>{
					this.$notify({ title: '错误', message: error.message || "添加失败", type: 'error' });
				})
			},
			addCommentBtnClicked:function(){
				this.addForm = {categoryID:this.selectedCategoryID};
				this.addFormVisible = true;
			},
			addComment: function () {
				this.addLoading = true;
				var content = this.addForm.content;
				var categoryID = this.addForm.categoryID;
				var commentID = this.addForm.commentID || "";
				yiya.addPresetComment(categoryID, commentID, content).then(response =>{
					this.categoriesFetch();
					this.addFormVisible = false;
					this.addLoading = false;
					var message = commentID ? "修改成功" : "创建成功";
					this.$notify({ title: '成功', message: message, type: 'success' });
				}).catch(error => {
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "添加失败", type: 'error' });
				});
			},
			removeComment:function (index, row) {
				this.$confirm('确认删除该评论吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.deleting = true;
					NProgress.start();
					yiya.removePresetComment(row.tipid).then(res =>{
						this.categoriesFetch();
						this.deleting = false;
						NProgress.done();
						this.$notify({ title: '成功', message: '删除成功', type: 'success' });
					}).catch(error => {
						this.deleting = false;
						this.$notify({ title: '错误', message: error.message || "删除失败", type: 'error' });
					});

				});
			},
			editCategoryBtnClicked:function(event, categoryID){
			    this.$prompt('请输入分类名称', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', }).then(({value}) => {
		          	this.addCategory(value, categoryID);
		        }).catch(() => { });
			},
			removeCategoryBtnClicked:function(event, categoryID){
			    this.$confirm('确认删除该分类吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.deleting = true;
					NProgress.start();
					yiya.removePresetCommentCategory(categoryID).then(res =>{
						this.categoriesFetch();
						this.deleting = false;
						NProgress.done();
						this.$notify({ title: '成功', message: '删除成功', type: 'success' });
					}).catch(error => {
						this.deleting = false;
						this.$notify({ title: '错误', message: error.message || "删除失败", type: 'error' });
					});

				});
			}


		},
		mounted() {
			//this.pageSize = yiya.CountPerPage;
			this.productsFetch();
		}
	}

</script>

<style scoped>

</style>