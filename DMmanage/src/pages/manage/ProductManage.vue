<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="addBtnClicked">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="title" label="产品名称" min-width="120" > </el-table-column>
			<el-table-column prop="productid" label="产品ID" width="140"> </el-table-column>
			<el-table-column prop="createtime" label="创建时间" width="240"> </el-table-column>
			<el-table-column prop="oldprice" label="原价" width="80"> </el-table-column>
			<el-table-column prop="price" label="现价" width="80"> </el-table-column>
			<el-table-column label="操作" width="260" fixed="right">
				<template scope="scope">
					<el-button size="small" @click="viewStyles(scope.$index, scope.row)">查看款式</el-button>
					<el-button size="small" @click="viewScene(scope.$index, scope.row)">编辑场景</el-button>
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
		<el-dialog title="" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名称" prop="title">
					<el-input v-model="addForm.title"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input type="textarea" :rows="5" v-model="addForm.description"></el-input>
				</el-form-item>
				<el-form-item label="产品状态" >
					<el-radio-group v-model="addForm.status">
						<el-radio :label="0">草稿箱</el-radio>
						<el-radio :label="1">销售中</el-radio>
						<el-radio :label="2">已删除</el-radio>
						<el-radio :label="4">已下架</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="价格">
					<el-input v-model="addForm.price"></el-input>
				</el-form-item>
				<el-form-item label="排序号">
					<el-input v-model="addForm.sort"></el-input>
				</el-form-item>
				<el-form-item label="邮费模板">
					<el-input v-model="addForm.postmodelid"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editProduct" :loading="addLoading">提交</el-button>
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
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: { }

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.productsFetch();
			},
			//获取用户列表
			productsFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.productsFetch(this.page).then(response => {
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

			},
			submitOrder:function(index, item)
			{

			},
			viewStyles:function(index, item)
			{
				var productID = item.productid;
				if(productID)
				{
					this.$router.push({ path: '/product/detail', query: { product_id: productID}});
				}
			},
			viewScene:function(index, item)
			{
				var productID = item.productid;
				if(productID)
				{
					this.$router.push({ name: 'ProductScenes', query: { product_id: productID}});
				}
			},
			editBtnClicked:function(index, item)
			{
				this.addFormVisible = true;
				this.addForm = Object.assign({}, item);
			},
			editProduct:function(){
				this.addLoading = true;
				var form = this.addForm;
				var params = {productid:form.productid,
							userid:form.userid,
							defaultimg:form.defaultimg,
							title:form.title,
							price:form.price,
							status:form.status,
							postmodelid:form.postmodelid,
							description:form.description,
							sort:form.sort};
				yiya.cts.editProduct(params).then(response =>{
					this.productsFetch();
					this.addFormVisible = false;
					this.addLoading = false;
					this.$notify({ title: '成功', message: '修改成功', type: 'success' });
				}).catch(error => {
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
				});
			}


		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			this.productsFetch();
		}
	}

</script>

<style scoped>

</style>
