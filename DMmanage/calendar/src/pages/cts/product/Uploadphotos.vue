<template>
	
	<section>
	
		
		
		<!--工具条-->
		<!--<el-row>
			<el-col :span="24" class="toolbar">
				
			</el-col>
		</el-row>-->

		<el-row>
			<el-col :span="29" class="toolbar" style="padding-bottom: 0px; ">
				<el-form :inline="true" style="margin: 15px; margin-bottom: 5px;">
					 <el-form-item>
						
						 <el-radio-group v-model="type" style="margin-bottom:30px; margin-right:230px;" @change="radiobtn(type)">
							<el-radio-button :label="3">台历</el-radio-button>
							<el-radio-button :label="1">挂历</el-radio-button>							
						</el-radio-group>

					
						<el-form-item label="款式："  >
						<el-select v-model="styleindex" placeholder="请选择" size="6px" @change="selectstyle(styleindex)"  >

							<el-option v-for="item in StyleList" :label="item.stylename" :value="item.showstyleid"></el-option>
						</el-select>
						</el-form-item>
						
					
						
						<el-form-item label="模板名称：" style="margin-left:20px;">
							<!-- <span>模板名称</span> -->
							<el-input placeholder="请输入模板名称" v-model="Templatename"></el-input>
							
						</el-form-item>
						
						<el-form-item  >
					    		<el-button type="primary" @click="Submit()" style="width: 60px; height: 40px;" >提交</el-button>						
						</el-form-item>

					</el-form-item> 

					
				</el-form>
			</el-col>
		</el-row>
		

		<div style="margin:20px;">
			<el-upload
				action="https://up.qbox.me"
				list-type="picture-card"
				:show-file-list="true"
				:file-list="detailImageList"
				:data="uploadForm"
				:on-remove="detailFileRemove"
				:on-change="detailUploaderChanged"
				:on-success="detailUploadSuccess"
				:before-upload="detailBeforeUpload">
				<i class="el-icon-plus"></i>
			</el-upload>
			<!-- <el-dialog :visible.sync="dialogVisible" size="tiny">
				<img width="100%" :src="dialogImageUrl" alt="">
			</el-dialog> -->
		</div>


		
		<!-- 单张图片预览 -->
		<el-dialog title="预览" :visible.sync="previewImg"  >
			<div class="item">
				<div class="imgBtmLayer" :style="{ left: valuee.left + '%', top: valuee.top + '%', width: valuee.width + '%', height: valuee.height + '%' }">
					<img class="userP" :src="urlimg">
				</div>
				<img  class="imgUpLayer" :src="urlimg2">					
			</div>
		
		</el-dialog>


	</section>
</template>

<script>
	import util from 'common/js/util'
	import {pinyin} from 'common/js/pinyin'
	import NProgress from 'nprogress'
	import api from 'src/api/api';
	import StringUtil from 'common/js/StringUtil.js';
	import Formatter from 'common/js/Formatter'
	import ImageFactory from 'common/js/ImageFactory'
	import yiya from 'src/api/yiya.js';
	import Vue from 'vue'
	import Croppa from 'vue-croppa';
	
	import $ from 'jquery'

	Vue.use(Croppa) 
    import AddressSelector from '../../../components/AddressSelector';



	export default {
		data() {
			return {
	
		isActive:false,
	
		deleting:false,
		sels: [],//列表选中列
		products:[],
		products2:[],		//选择产品列表
		StyleList:[],		//选择样式列表
		selectIndex:'',		//选中的产品
		
		
		
		fullscreenLoading:false,

        urlimg:'',
  		urlimg2:'',
		valuee:{},				//图片大小定位
		previewImg:false,

		QRcode:'',				//二维码
		ispreview:false,

		products:[],

		
		uploadForm:{}, 
		imgArr:[],	
		imgArr2:[],
		imgArr3:[],
		imgUrlsss:'',
		
		coverUploadForm:{},
		
		styles:[],
		status:'',
		
		keyword:'',
		downloading:false,
		canvasWidth:0,
		canvasHeight:0,
		generateReady:false,
		
		uploading:false,

		addFormActive:0,
		addLoading: false,
		
		iflocalStorage:true,
		count:0,
		// --------
		styleindex:'',		//选中的产品样式
		Templatename:'',
		type:3,
		itemlist:'',
		coverUploadForm: {},
		imglist:[],

		id:this.$route.query.id,
	


		detailImageList:[],
		uploadForm: {},
		tempid:this.$route.query.id || 0,

		}
	},
	
	components: {
      AddressSelector
  },
	methods: {


		detailFileRemove(file, fileList) {
			this.detailImageList = fileList;
			console.log("detailFileRemove", fileList.length);
		},
		detailUploaderChanged(file, fileList) {
			this.detailImageList = fileList;
		},
		detailUploadSuccess(response, file, fileList) {
			if (response.key) {
				var imageURL = "http://pic.bbyiya.com/" + response.key;
				file.url = imageURL;
			}
			this.detailImageList = fileList;
			console.log("detailUploadSuccess", fileList.length);
		},
		detailBeforeUpload: function(file) {
			var key = api.general.qiniuUploadKeyGenerate();
			return api.general.uploadTokenFetch().then(response => {
				var token = response.upToken;
				this.uploadForm = { key: key, token: token };
			});
		},


		//获取最新数据
		getlistimg(){
			
			var that = this;
			// console.log(that.styleindex)
			// console.log(that.type)


			that.detailImageList = [];
			NProgress.start();
			api.cts.productShowInfo(this.tempid).then((res)=>{
				that.Templatename = res.tempname;
				// console.log(res)
			//	that.styleindex	
				 res.templateinfos.map((item,index)=>{
					if(item.cateid==that.type){
						if(item.showstyleid==that.styleindex){							
							// return { url:item.imglist.url, status: "finished"}
							if(item.imglist.length>0){
								item.imglist.map((item2,index2)=>{
									var obj = {}
									obj.url = item.imglist[index2].url
									obj.status= "finished"
									that.detailImageList.push(obj)
									
								})
								
							}
						}
					}
					NProgress.done();
				})
						 
			}).catch(error=>{
				NProgress.done();
			});
			
		},


		//台历挂历选择
		radiobtn(type){
			// console.log(type)
			this.getlistimg()
		},

		//选择款式
		selectstyle(index){
			
			this.getlistimg()
	
		},


	


 		// this.detailImageList = (response.imglist || []).map(item => {
        //     return { url: item.imgurl, status: "finished" };
        //   });
        //   NProgress.done();


		//提交作品
		Submit() {
			
			var trueis = true;
			var that = this;
			
			var tempname = '';
			var showstyleid = '';
			var cateid = this.type;
			var imglist = [];
			var iftrue = false;

			if(!this.Templatename){
				this.$notify({ title: '错误', message:"请输入模板名称！", type: 'error' });
				return;
			}else{
				tempname = this.Templatename
			};
			
			if(!this.styleindex){
				this.$notify({ title: '错误', message:"请选择产品样式！", type: 'error' });
				return;
			}else{
				showstyleid = this.styleindex
			};
			// console.log(this.detailImageList)
			
			this.detailImageList.map((item)=>{
				let obj = {}
				obj.url = item.url
				imglist.push(obj)
			})	
			
			var productJson = {
				'tempname':tempname,
				'showstyleid':showstyleid,
				'cateid':cateid,
				'imglist':imglist,
			};
			
			productJson.tempid = this.tempid
			

			// console.log(imglist)
			api.cts.addOrEditProductPageturn(productJson).then(res => {
				if(that.id>0){
					that.$notify({ title: '成功', message:"修改成功！", type: 'success' });
				}else{
					that.$notify({ title: '成功', message:"增加成功！", type: 'success' });
				}
					
			}).catch(function(err){
				alert('保存失败');
				console.log(err)
				that.$notify({ title: '错误', message:err.message, type: 'error' });
			});	
		},
		
	
		//获取信息
		productsFetch: function() {
			var that = this
			api.cts.getproductshowstyles().then((response) => {				
				this.StyleList = response				
				that.imgArr = []
				that.imgArr2 = []
				that.imgArr3 = []	

			});
		},


	


	},
	mounted() {
		this.pageSize = api.CountPerPage;
		this.productsFetch();
		this.getlistimg()

	}
}
</script>

<style scoped>
@import url("../../../../../common/css/vue-croppa.css");
*{
	margin: 0px;
	padding: 0px;	
}	



.titleText{
	color: red !important;
}

 .imgBtmLayer{

	position:absolute;
	z-index:-1;
	overflow:hidden;
 }
.imgUpLayer{
	width:100%;
	height:100%;
	z-index:2;
	border: 1px solid #666;
}

 .userP{
	width:100%;
	height:100%;
}
.item{
	position: relative;
	width:50%;
	margin: 0 auto;

}
.QRimage{
	widows: 200px;
	height: 200px;
}





div.el-dialog--small{
	width: 250px;
}


.croppa-container {
  background-color: white;
  border: 1px solid black
}




.btns{
	float: left;
    position: absolute;
    bottom: 3px;
    right: 10px;
	font-weight: bold;
    color: #559fff;
    cursor:pointer;
}




.ULli{
	float: left; list-style: none; margin: 16px;
	width: 200px;
	height: 200px;
	background-size: contain;
	position: relative;
	
}

#imglist{
	width: 200px;
	height: 200px;
	background:#EEEEEE ;
	background: center;
	display: block;
}

 

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
    width: 200px;
    height: 200px;
    line-height: 200px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
	
	
	
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
	position: relative;
	width: 180px;
	height:180px;
	display: inline;
	margin-bottom: 20px;
	margin-left: 30px;
}

.background-image{
	position: absolute;
	width: 180px;
	height:180px;
	object-fit: cover;
    object-position: center;
}

.image-uploader {
	position: absolute;
	width: 178px;
	height: 178px;
	/*top:30%;
	left: 20%;*/
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
	
  }

.image-uploader:hover {
	border-color: #20a0ff;
}

.image-uploader-icon
{
	position:absolute;
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}

.image-uploading-text{
	
    position: absolute;
    top: 117px;
    left: 25%;
    z-index: 3;
	color: #4db3ff;

}

.image-uploading-icon
{
	position: absolute;
    top: 89px;
    left: 45%;
    z-index: 3;
    font-size: 20px;
	color: #4db3ff;
}

.upload-image
{
	position: absolute;
	left: 0px;
	top: 0px;
	width: 178px;
	height: 178px;
}

.delete-button{
	position:absolute;
	top: 0px;
	right: 0px;
}
	
	
	

	
	
	
	
.btn1{
	float: left;
}
.Back{
	position: absolute;
    top: 24px;
    background: #20a0ff;
    width: 60px;
    height: 25px;
    line-height: 0px;
    border-radius: 4px;
}


.canvas {
  position: fixed;
  left: 2000px;
  top: 0px;
  background-color: white;
}

.popover-button{
	display: block;
}

.popover-button:first-child{
	margin-left: 10px;
}

.popover{
	display: inline-block;
	/*margin-left: 15px;*/
}

.text-underline{
	text-decoration: underline;
}

.active{
	border-radius:50%;
	overflow: hidden;
}



</style>
<style>
	.abc canvas{
		/*width: 100% !important;
		height: 100% !important;
		*/
	}
	/*.abc svg{
		top: -10.025px !important;
	    right: -10.025px !important;
	    width: 10% !important;
	    height: 10% !important;
	}*/
	
</style>
