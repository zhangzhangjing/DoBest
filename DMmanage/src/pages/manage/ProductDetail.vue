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
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="propertyStr" label="产品名称" min-width="200" > </el-table-column>
			<el-table-column prop="styleId" label="款式ID" width="140"> </el-table-column>
			<el-table-column prop="createTimeStr" label="创建时间" width="200"> </el-table-column>
			<el-table-column prop="price" label="原价" width="120"> </el-table-column>
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
		<el-dialog title="" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名称" prop="title">
					<el-input v-model="addForm.propertyStr"></el-input>
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

				<el-form-item label="封面">
					<el-upload class="image-uploader"
						action="https://up.qbox.me"
						:show-file-list="false"
						:data="uploadForm"
						:on-success="uploadSuccess"
						:on-error="uploadFail"
						:before-upload="beforeUpload">
						<div v-if="addForm.defaultimg">
							<img :src="addForm.defaultimg" class="upload-image">
							<i v-if="uploading" class="el-icon-loading image-uploading-icon"></i>
						</div>

						<i v-else class="el-icon-plus image-uploader-icon"></i>
					</el-upload>
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
				productID:'',
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				pageSize:10,

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				uploading:false,
				uploadForm:{},
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
				this.productPropertiesFetch();
			},
			//获取用户列表
			productPropertiesFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.productPropertiesFetch(this.productID, this.page).then(response => {
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
			editBtnClicked:function(index, item)
			{
				this.addFormVisible = true;
				var form = Object.assign({}, item);
				form.status = item.status || 1;
				form.defaultimg = item.defaultImg || '';
				this.addForm = form;
			},
			editProduct:function(){
				this.addLoading = true;
				var form = this.addForm;
				var params = {productid:form.productId,
							styleid:form.styleId,
							defaultimg:form.defaultimg,
							propertystr:form.propertyStr,
							price:form.price,
							status:form.status,
							description:form.description};
				yiya.cts.editProductStyle(params).then(response =>{
					this.productPropertiesFetch();
					this.addFormVisible = false;
					this.addLoading = false;
					this.$notify({ title: '成功', message: '修改成功', type: 'success' });
				}).catch(error => {
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
				});
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
					var form = this.addForm;
					form.defaultimg = "http://pic.bbyiya.com/" + response.key;
					this.addForm = form;
				}
		    }


		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			var productID = this.$route.query.product_id;
			if(productID)
			{
				this.productID = productID;
				this.productPropertiesFetch();
			}
		}
	}

</script>

<style scoped>
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
	/*display: block;*/
}
</style>
