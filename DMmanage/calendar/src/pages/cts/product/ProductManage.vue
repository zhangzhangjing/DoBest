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
			<el-table-column prop="price" label="现价" width="80"> </el-table-column>
			<el-table-column label="操作" width="400" fixed="right">
				<template scope="scope">
					<!--<el-button size="small" @click="viewStyles(scope.$index, scope.row)">查看款式</el-button>-->
					<!--<el-button size="small" @click="editBtnClicked(scope.$index, scope.row)">编辑</el-button>-->
					<el-button size="small" @click="addBtnClicked">编辑属性</el-button>
					<el-button size="small" @click="goADtem()">广告模版</el-button>
					<el-button size="small" @click="viewStyles(scope.$index, scope.row)">编辑款式</el-button>
					<el-button size="small" @click="viewStyles(scope.$index, scope.row)">上架</el-button>
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
		<el-dialog title="" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">

				<el-form-item label="名称" prop="title">
					<el-input v-model="addForm.title"></el-input>
				</el-form-item>

				<el-form-item label="描述" prop="description">
					<el-input type="textarea" :rows="5" v-model="addForm.description"></el-input>
				</el-form-item>

				<el-form-item label="价格">
					<el-input v-model="addForm.price"></el-input>
				</el-form-item>

				<el-form-item label="广告数">
					<el-input v-model="addForm.advertcount"></el-input>
				</el-form-item>

				<el-form-item label="种类">
					<el-input v-model="addForm.cateid"></el-input>
				</el-form-item>

				<el-form-item label="封面图">
				<el-upload
				  class="avatar-uploader"
				  action="https://up.qbox.me"
				  :show-file-list="false"
				  :data="uploadForm"
				  :on-success="CovermapUploadSuccess"
				  :before-upload="beforeUpload">
					<div v-if="addForm.defaultimg">
						<img :src="addForm.defaultimg" class="avatar">
					</div>
				  
				</el-upload>
				</el-form-item>



				<el-form-item label="轮播图">
					<el-upload
						action="https://up.qbox.me"
						list-type="picture-card"
						:show-file-list="true"
						:file-list="coverImageList"
						:data="uploadForm"
						:on-remove="coverFileRemove"
						:on-change="coverUploaderChanged"
						:on-success="coverUploadSuccess"
						:before-upload="beforeUpload">
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>



				<el-form-item label="详情图">
					<el-upload
						action="https://up.qbox.me"
						list-type="picture-card"
						:show-file-list="true"
						:file-list="detailImageList"
						:data="uploadForm"
						:on-remove="detailFileRemove"
						:on-change="detailUploaderChanged"
						:on-success="detailUploadSuccess"
						:before-upload="beforeUpload">
						<i class="el-icon-plus"></i>
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
	import api from 'src/api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				coverImageList:[],
				detailImageList:[],
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				pageSize:10,

				addFormVisible: false,
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: { },
				uploading:false,
				uploadForm: { },
				imageUrl: '',
				loading:false,
				loadings:0,
			}
		},
		methods: {
      goADtem () {
        this.$router.push({ name: 'ADtemplate'});
			},
			handleCurrentChange(val) {
				this.page = val;
				this.productsFetch();
			},
			//获取用户列表
			productsFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				api.cts.productsFetch(1).then(response => {
					var list = response || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
					}

					this.list = list;
					this.total = list.length;
					this.pageSize = list.length;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

			},
			addBtnClicked:function(){
        this.$router.push({ name: 'ProductAdd'});
			},
			submitOrder:function(index, item)
			{

			},
			viewStyles:function(index, item)
			{
				var productID = item.productid;
				if(productID)
				{
					this.$router.push({ name: 'ProductStyles', query: { product_id: productID}});
				}
			},
			editBtnClicked:function(index, item)
			{
				this.addFormVisible = true;
				this.addForm = Object.assign({}, item);

				this.coverImageList = (item.imglist || []).map(item =>{
					return {url:item.url, status: 'finished'}
				})

				this.detailImageList = (item.descriptionImglist || []).map(item =>{
					return {url:item.url, status: 'finished'}
				})
			},
			editProduct:function(){
				this.addLoading = true;
				var form = this.addForm;
				var productID = form.productid;
				var coverImages = this.coverImageList.map(item =>{
					return {url:item.url}
				})

				var params = {};
				params['productid'] = form['productid'];
				params['title'] = form['title'];
				params['defaultimg'] = form['defaultimg'];
				params['price'] = form['price'];
				params['description'] = form['description'];
				params['advertcount'] = form['advertcount'];
				params['cateid'] = form['cateid'];

				console.log('coverImages:', coverImages.length);



				api.cts.editProduct(params, coverImages).then(response =>{
					var detailImages = this.detailImageList.map(item =>{
						return {url:item.url}
					})
					return api.cts.editProductDetailImages(productID, detailImages);
				}).then(response =>{
					this.productsFetch();
					this.addFormVisible = false;
					this.addLoading = false;
					this.$notify({ title: '成功', message: '修改成功', type: 'success' });
				}).catch(error => {
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
				});
			},
			beforeUpload:function(file){
				var key = api.general.qiniuUploadKeyGenerate()
				return api.general.uploadTokenFetch().then(response => {
					var token = response.upToken;
					this.uploadForm = {key:key, token:token};
				})



			},
			coverUploadSuccess(response, file, fileList) {
				if (response.key) {
					var imageURL = "http://pic.bbyiya.com/" + response.key;
					file.url = imageURL;
				}
				this.coverImageList = fileList;

				console.log('coverUploadSuccess', fileList.length);

		    },




			detailUploadSuccess(response, file, fileList) {
				if (response.key) {
					var imageURL = "http://pic.bbyiya.com/" + response.key;
					file.url = imageURL;
				}
				this.detailImageList = fileList;

				console.log('detailUploadSuccess', fileList.length);
		    },



			coverFileRemove(file, fileList){
				this.coverImageList = fileList;
				console.log('coverFileRemove', fileList.length);
			},
			detailFileRemove(file, fileList){
				this.detailImageList = fileList;
				console.log('detailFileRemove', fileList.length);
			},


			CovermapUploadSuccess(response, file, fileList) {
					if (response.key) {
						var imageURL = "http://pic.bbyiya.com/" + response.key;
						var form = this.addForm;
						form.defaultimg = imageURL;
						this.addForm = form;
					}
		    },




			coverUploaderChanged(file, fileList){
				this.coverImageList = fileList;
				console.log('coverUploaderChanged', fileList.length);
			},
			detailUploaderChanged(file, fileList){
				this.detailImageList = fileList;
			}



		},
		mounted() {
			this.productsFetch();
		}
	}

</script>

<style scoped>

 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
