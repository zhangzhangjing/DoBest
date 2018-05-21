<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">
					<el-form-item label="标题">
						<el-input v-model="title" placeholder="请输入标题" @blur="titleEndEdit"></el-input>
					</el-form-item>
					<el-form-item label="作者">
						<el-input v-model="author" placeholder="作者" @blur="authorEndEdit"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="addBtnTapped">添加图片</el-button>
					</el-form-item>
				</el-form>

			</el-col>

		</el-row>

		<el-col :span="24" class="main">
			<div class="container">
				<!--列表-->

				<template v-for="(item,index) in photos">

					<el-card :body-style="{ padding: '0px' }" style="" class="card">

				      <img v-if="item.imgurl" v-bind:src="item.imgurl" class="image">
					  <img v-else src="../../assets/addphoto.jpeg" class="add-image" @click="editItem(item)">


				      <div style="padding: 14px; bottom: 0px;">
				        <span><b>{{item.omitTitle}}</b></span>
				      	<p style="max-height: 38px;overflow: hidden;margin-top: 0px;margin-bottom: 5px;">{{item.omitDescription}}</p>
				      	<p v-if="index > 0" style="max-height: 38px;overflow: hidden;margin-top: 0px;margin-bottom: 0px;">{{item.omitContent}}</p>

				      </div>

				        <div class="bottom clearfix">
				          <el-button type="text" class="button" @click="editItem(item)">编辑</el-button>
				          <el-button type="text" class="button" @click="clearItem(item)">删除</el-button>
				        </div>
				    </el-card>

				</template>

				<template v-if="photos.length < 12">
					<el-card :body-style="{ padding: '0px' }" style="" class="card">
					  <img src="../../assets/addphoto.jpeg" class="add-image-large"  @click="addBtnTapped">
				    </el-card>
				</template>

			</div>

		</el-col>

		<!--新增界面-->
		<el-dialog title="编辑" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">

				<template v-if="isCover">
					<el-form-item label="封面描述" prop="description">
						<el-input type="textarea" :maxlength="120" v-model="addForm.description"></el-input>
					</el-form-item>
				</template>
				<template v-else>
					<el-form-item label="标题" prop="title">
						<el-input v-model="addForm.title" :maxlength="15"></el-input>
					</el-form-item>
					<el-form-item label="照片描述" prop="description2">
						<el-input type="textarea" :maxlength="120" v-model="addForm.description2"></el-input>
					</el-form-item>
					<el-form-item label="想说的话" prop="content">
						<el-input type="textarea" :maxlength="120" v-model="addForm.content"></el-input>
					</el-form-item>
				</template>



				<el-form-item label="图片">
					<input type="file" id="file" @change="chooseImage($event)" accept="image/jpeg,image/jpg,image/png" class="el-button browse-button" :value="fileValue"/>
					<img id="previewImage" :src="previewImage" :width="previewWidth" :height="previewHeight" class="preview-image">
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="pageModify" :loading="addLoading">确定</el-button>
			</div>
		</el-dialog>

		<canvas id="myCanvas" :width="canvasWidth" :height="canvasHeight" class="canvas" :style="{ width: canvasWidth + 'px', height: canvasHeight  + 'px' }" >Canvas</canvas>



	</section>
</template>
<script>
	import yiya from '../../api/yiya';
	import ImageUtil from 'common/js/ImageUtil.js';
	import ViewUtil from 'common/js/ViewUtil.js';
	import YiyaUtil from 'common/js/YiyaUtil.js';
	import StringUtil from 'common/js/StringUtil.js';
	import NProgress from 'nprogress'
	export default {
		data() {
			return {
				loading: false,
				workID:'',
				description:'',
				title:'',
				author:'',
				photos: [ ],
				fileValue:'',
				downloading:false,
				isCover:false,

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' },
						{ min: 0, max: 15, message: '不能超过15个字', trigger: 'blur' }
					],
					description: [
						{ required: true, message: '请输入描述', trigger: 'blur' },
						{ min: 0, max: 120, message: '不能超过120个字', trigger: 'blur' }
					],
					description2: [
						{ required: true, message: '请输入描述', trigger: 'blur' },
						{ min: 0, max: 120, message: '不能超过120个字', trigger: 'blur' }
					],
					content: [
						{ required: true, message: '请输入想说的话', trigger: 'blur' },
						{ min: 0, max: 120, message: '不能超过120个字', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: { },

				canvasWidth:0,
				canvasHeight:0,
				previewWidth:0,
				previewHeight:0,
				previewImage:""
			}
		},
		methods: {
			//获取用户列表
			workDetailFetch: function () {
				var that = this;
				this.loading = true;
				NProgress.start();
				var workID = this.workID;
				yiya.workDetail4EditFetch(workID).then(response =>{

		            this.loading = false;
					NProgress.done();

					var photos = response.detailslist || [];
					
					
					
					for(var i = 0; i < photos.length; i++)
					{
						var photo = photos[i];
						var imageURL = photo.imgurl
						if (imageURL && imageURL.indexOf("http://") == -1)
		                {
		                    photo.imgurl = "http://pic.bbyiya.com/" + imageURL;
		                }

		                if(i == 0 && photo.sort == 0 && !photo.description)
		                {
		                	photo.description = response.description;
		                }

		                photo.pdid = photo.pdid || 0;
		                photo.deleting = false;
		                photo.omitTitle = (i + 1) + ".  " + YiyaUtil.omit(photo.title, 18);
		                photo.omitDescription = YiyaUtil.omit(photo.description, 40);
		                photo.omitContent = YiyaUtil.omit(photo.content, 40);
					}

					this.photos = photos;
					this.description = response.description;
					this.title = response.title;
					this.author = response.author;



				}).catch(error =>{

					this.loading = false;
					NProgress.done();
				});
			},
			refreshBtnTapped:function(){
				this.workDetailFetch();
			},
			titleEndEdit:function(){
				if(this.title){
					yiya.workTitleModify(this.workID, this.title);
				}
			},
			authorEndEdit:function(){
				if(this.author) {
					yiya.workAuthorModify(this.workID, this.author);
				}
			},
			//显示新增界面
			addBtnTapped: function () {
				if(this.photos.length >= 12)
				{
					this.$notify({ title: '错误', message:"最多只能添加12张", type: 'error' });
					return;
				}
				var form = {pid:"", title:"", content:"", description:"", photoURL:"", photoData:''};
				if(this.photos.length == 0)
				{
					form.description = this.description;
				}
				this.editItem(form);
			},
			editItem:function(item)
			{
				this.fileValue = '';
				var photoURL = item.imgurl || "";
				this.addForm.photoData = "";
				if(photoURL)
				{
					this.previewWidth = 250;
					this.previewHeight = photoURL;
				}
				else
				{
					this.previewWidth = 0;
					this.previewHeight = 0;
				}
				this.previewImage = photoURL;
				var isCover = item.sort == 0 || this.photos.length == 0;
				this.isCover = isCover;

				this.addFormVisible = true;
				var form = {pid:item.pdid, title:item.title, content:item.content, photoURL:item.imgurl, photoData:''};
				if(isCover){
					form.description = item.description;
				}
				else{
					form.description2 = item.description;
				}
				this.addForm = form;
			},
			clearItem:function(item)
			{
				this.$confirm('确认删除该照片吗?', '提示', {
					type: 'warning'
				}).then(() => {
					item.deleting = true;
					NProgress.start();
					yiya.removeWorkPhoto(item.pdid).then(res =>{
						this.workDetailFetch();
						item.deleting = false;
						NProgress.done();
						this.$notify({ title: '成功', message: '删除成功', type: 'success' });
					}).catch(error => {
						item.deleting = false;
						this.$notify({ title: '错误', message: error.message || "删除失败", type: 'error' });
					});

				}).catch(() => {
					console.log("取消按钮");
				});
			},
			close:function(){
				window.history.go(-1);
			},
			chooseImage:function(e, loaded){
				var that = this;
				var file = e.target ? e.target.files[0] : e;
				//image/jpeg
				if(file && /image\/\w+/.test(file.type))
				{
					//this.fileValue = file.name;
					var regexp = /^data:image\/.*;base64,/;
					var reader = new FileReader();
					reader.onload = function(e) {
						var data = e.target.result;
						reader.onload = null;
						var image = new Image();
						image.onload=function(){
							that.imageLoadedComplete(image);
						}
						image.src= data;
					};
					reader.readAsDataURL(file);
				}
			},
			imageLoadedComplete:function(image)
			{
				var that = this;
				var width = image.width;
				var height = image.height;
				var canvas = document.getElementById("myCanvas");

				var rect = ImageUtil.getCropRectWithRatio(width, height, 1500);
				var canvasWidth = rect.canvasWidth;
				var canvasHeight = rect.canvasHeight;

				this.canvasWidth = canvasWidth;
				this.canvasHeight = canvasHeight;

				var scale = ViewUtil.getAdaptiveScale(canvasWidth, canvasHeight, 250, 250, true);
				this.previewWidth = canvasWidth * scale;
				this.previewHeight = canvasHeight * scale;
				//this.transformScale = "scale(" + scale + ", " + scale + ")";

				setTimeout(function(){
					var data = ImageUtil.cropImage(image, canvas, rect);
					var previewImage = document.getElementById("previewImage");
					that.addForm.photoData = data;
					if(previewImage)
					{
						previewImage.src = data;
					}

				},200);



			},
			pageModify:function(){
				var pid = this.addForm.pid || 0;
				var productID = this.addForm.productID;
				var title = StringUtil.trim(this.addForm.title || '');
				var content = StringUtil.trim(this.addForm.content || '');
				var description = StringUtil.trim(this.addForm.description || this.addForm.description2 || '');
				var photoURL = this.addForm.photoURL;
				var photoData = this.addForm.photoData;
				var cover = this.isCover;


				if(!description)
				{
					this.$notify({ title: '错误', message:"请输入描述", type: 'error' });
					return;
				}

				if(!(photoURL || photoData))
				{
					this.$notify({ title: '错误', message:"请先上传图片", type: 'error' });
					return;
				}

				if(!cover)
				{
					if(!title)
					{
						this.$notify({ title: '错误', message:"请输入标题", type: 'error' });
						return;
					}
					if(!content)
					{
						this.$notify({ title: '错误', message:"请输入想说的话", type: 'error' });
						return;
					}
				}


				this.addLoading = true;

				var uploadPromise;
				if(photoData)
				{
					uploadPromise = yiya.uploadBase64Image(photoData, parseInt(this.canvasWidth), parseInt(this.canvasHeight));
				}
				else if(photoURL)
				{
					uploadPromise = yiya.successDefaultPromise(photoURL);
				}

				if(uploadPromise)
				{
					uploadPromise.then(photoURL => {
						this.addForm.photoData = "";
						return cover ? yiya.workCoverModify(this.workID, pid, photoURL, description) : yiya.workPageModify(this.workID, pid, photoURL, title, content, description)
					}).then(response =>{
						this.workDetailFetch();
						this.addFormVisible = false;
						this.addLoading = false;
						var message = pid ? '修改成功' : '添加成功';
						this.$notify({ title: '成功', message: message, type: 'success' });
					}).catch(error =>{
						this.addLoading = false;
						this.$notify({ title: '错误', message: error.message || "添加失败", type: 'error' });
					})
				}


			}

		},
		mounted() {
			var workID = this.$route.query.id;
			//workID = 1605;
			if(workID)
			{
				this.workID = workID;
				this.workDetailFetch();
			}



		}//end mounted
	};

</script>

<style scoped>


.container{
	padding-top: 30px;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 0px;
    background-color: #fff;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.card{
	width: 312px;
	height:400px;
	display: inline;
	margin-bottom: 20px;
	margin-left: 30px;
}

.card:first-child{
	/*margin-left: 0;*/
}


  .bottom {
    /*line-height: 50px;*/
    position: relative;
    bottom: 0;

    padding: 0 10px;
  }

  .button {
  	position: relative;
  	right: 0px;
    padding: 0;
    float: right;
    margin-left: 15px;
  }



  .image {
    width: 100%;
    height: 250px;
    display: block;
    object-position: center;
    object-fit: cover;
    overflow: hidden;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }

  .canvas {
    position: fixed;
    left: 2000px;
    /*left: 0px;*/
    top: 0px;
    background-color: red;
}

.preview-image{
	display: block;
	max-width: 250px;
	margin-top: 25px;
}

.browse-button{
	overflow: hidden;
}

.add-image{
	background-color: #ededed;
	width: 100%;
    height: 250px;
    display: block;
    object-position: center;
}

.add-image-large{
	width: 100%;
    height: 400px;
    object-fit: cover;
    object-position: center;

}

</style>
