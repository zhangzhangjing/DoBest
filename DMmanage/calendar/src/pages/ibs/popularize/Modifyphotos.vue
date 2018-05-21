<template>
	
	<section>
		
		<!--<title>上传照片</title>-->
		
		
		<!--工具条-->
		<!--<el-row>
			<el-col :span="24" class="toolbar">
				
			</el-col>
		</el-row>-->

		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
				<el-form :inline="true" style="margin: 15px; margin-bottom: 5px;">
					 <span style="font-weight:bold;">警告：修改保存后将替换掉用户的照片，此操作无法撤销。</span>
					 <el-form-item class="RightBtn">
						
					
						<el-form-item >
						
							 <el-popover trigger="click" placement="bottom">
								<div v-if="ispreview">
									<img :src="QRcode" class="QRimage">								
									<p style="text-align: center">微信扫一扫，查看真实日历效果</p>
								</div>
								<p style="text-align: center" v-else>请先上传几张图片，再预览</p>

								<el-button type="primary" slot="reference" style="width: 70px; height: 40px;" @click="preview2()"> 整体预览 </el-button>
							</el-popover> 
							
						</el-form-item>


						
						<el-form-item  >
					    		<el-button type="primary" @click="Submit()" style="width: 70px; height: 40px;" >覆盖保存</el-button>						
						</el-form-item>

							




					</el-form-item> 

					
					
					
					
					
				</el-form>
			</el-col>
		</el-row>
		
		<ul>
			<li class="ULli"  v-for="(item,index) in imgArr2" @click="clickImg(index)"  > <!--@click="clickImg(index)"-->
				
				 <img class="output" id="imglist"  :src="item.imageurl2" alt="点击上传图片 ">

				<br/>

				 <div class="btns" v-if="item.imageurl2" > 
					 
				<el-button type="text" @click.stop="preview(index)">预览</el-button>
				<a @click="Replace()">替换</a>&ensp;<a  @click.stop="Delimg(index)">删除</a></div>
			</li>
			
		</ul>
		
		<!-- 单张图片预览 -->
		<el-dialog title="预览" :visible.sync="previewImg"  >
			<div class="item">
				<div class="imgBtmLayer" :style="{ left: valuee.left + '%', top: valuee.top + '%', width: valuee.width + '%', height: valuee.height + '%' }">
					<img class="userP" :src="urlimg">
				</div>
				<img  class="imgUpLayer" :src="urlimg2">					
			</div>
		</span>
		</el-dialog>


		
				<!--新增界面-->
			<el-dialog title="添加照片" :visible.sync="addFormVisible" :close-on-click-modal="false"  size='tiny' v-loading.fullscreen.lock="fullscreenLoading"   element-loading-text="拼命上传中..."  >
				<el-form :model="addForm" label-width="60px"  ref="addForm" style="width: 100px; margin-left: 40px;">			
					
				
					<croppa v-model="myCroppa" 
						canvas-color="transparent" 						
						:prevent-white-space="true"
						:class="{ active: isActive}" 
						:zoom-speed="3"
						:width="imgWidth" 
						:height="imgHeight"
						placeholder="上传调整图片"
						@new-image='oninitimg'
						@file-size-exceed="onFileSizeExceed"
						@click="clickss(this)"
						:quality="imgQuality"
						></croppa>	
				</el-form>
				<!--:file-size-limit="3200000"-->
				<!--@file-size-exceed="onFileSizeExceed"-->
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="addFormVisible = false" style="width: 50px; height: 30px;">取消</el-button>
		<!--@click.native="pageModify"--><el-button type="primary"  :loading="addLoading" style="width: 50px; height: 30px;" @click="generateImage()">确定</el-button>
				</div>
			</el-dialog>
	
		
			
			
			
			
		
		
		
		<!--<canvas id="adCanvas" :width="canvasWidth" :height="canvasHeight" class="canvas" >Canvas</canvas>-->


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
	import Croppa from 'vue-croppa'
	
	Vue.use(Croppa) 
    



	export default {
		data() {
			return {

		isActive:false,
		inputg:'',	//名称、电话
		Formatter:Formatter,
		templates: [],
		total: 0,
		page: 1,
		pageSize:0,
		listLoading: false,
		deleting:false,
		sels: [],//列表选中列
	
		
		radio:'1',
		radio2:'0',
//				indexx:12,			//照片数量
		Imgshow:false,
		addFormVisible:false, //弹出剪切图片页面
		ReceivingAddress:false,	//弹出收货地址
		
		IMGindex:'',		//第几个照片
		
		inputnum:5,			//人数
		productID:'',	//产品id
		styleId:'',		//产品样式id
		price:0,			//价格
		
		imgsize:{},		//图片样式图片比例
		imgQuality:1,		//分辨率品质
		imgWidth:250,		//剪切图片框宽度
		imgHeight:250,		//剪切图片框高度
		
		fullscreenLoading:false,

        urlimg:'',
  		urlimg2:'',
		valuee:{},				//图片大小定位
		previewImg:false,

		QRcode:'',				//二维码
		ispreview:false,

	  
        formLabelWidth: '90px',
		detailedAddwidth:'100px',
		
		activityJson:{},	//图片信息
		activityJson2:{},	//预览图片信息
		addressJson:{},		//收货地址信息
		AddressIf:true,	   //收货地址显示
		TelTrue:false,
		
		products:[],

		imgUrl: '',
		//图片裁剪
		myCroppa: {},
		dataUrl:'',
		imgstr:'',
		
		
		PromptState:true,	//提示状态
		
		
		uploadForm:{}, 
		imgArr:[],	
		imgArr2:[],
		imgUrlsss:'',
		
		coverUploadForm:{},
		addForm:{open:false,updatetime:'',description:'',defaultimg:'',imglist:[]},

		
		styles:[],
		status:'',
		type:0,
		keyword:'',
		downloading:false,
		canvasWidth:0,
		canvasHeight:0,
		generateReady:false,
		

		addFormActive:0,
		addLoading: false,
		

		//
		ID:this.$route.query.ID || "",
		}
	},
		

	methods: {
		


		//预览效果
		preview(index){
			
			
			this.urlimg = this.imgArr[index].imageurl;
			this.urlimg2 = this.imgsize.imgLayList[index].layerimgpreview;


			this.valuee.left = this.imgsize.imgLayList[index].imgCoordMod.pointleft;
			this.valuee.top =  this.imgsize.imgLayList[index].imgCoordMod.pointtop;
			this.valuee.width =  this.imgsize.imgLayList[index].imgCoordMod.pointwidth;
			this.valuee.height =  this.imgsize.imgLayList[index].imgCoordMod.pointhight;
		
			this.previewImg = true;
		},


		//预览提交
		preview2(){

			if(this.imgArr2.length!=0){
				for(let i=0;i<this.imgArr2.length;i++){				
					if(this.imgArr[i].imageurl!=undefined){						
												
						var needShareCount = 0;
						var needRedpacketTotal = 0;
						if(this.radio == 1){
							needShareCount = this.inputnum;			
						}else{
							needRedpacketTotal = this.price;
						};

						this.activityJson2 = {
							'workId':'',
							"productId":this.productID, 
							"styleId":this.styleId,
							"needShareCount":needShareCount,
							"needRedpacketTotal":needRedpacketTotal,
							"details":this.imgArr
						};

						api.ibs.reviewWorkForCustomer(this.activityJson2).then(res => {
							this.ispreview = true;
							this.QRcode = res.codeurl;
							
						}).catch(function(err) {
							alert('上传失败');
							console.log(err);
						})
					}else{
						this.ispreview = false;
						return;
					}		
				}
			}


		},



		
	
        
        
	
		
	
	
	
		//提交作品
		Submit() {
			if(this.imgArr2.length!=0){
					for(let i=0;i<this.imgArr2.length;i++){				
						if(this.imgArr[i].imageurl==undefined){						
							trueis = false
							this.$notify.error({
					          title: '提交失败',
					          message: '图片尚未上传完！'
					       });
							return
						}
					}
				}
		},

		//删除图片
		Delimg(index) {

			this.$set(this.imgArr2, index, {
				sort: index
			})
			this.$set(this.imgArr, index, {
				sort: index
			})

		},

		//点击图片
		clickImg(index) {
			this.IMGindex = index
			this.addFormVisible = true
			

			
			//是否为圆形
			if(this.imgsize.imgLayList[index].isround == 1){
				this.isActive = true
				this.imgWidth =  this.imgsize.imgLayList[index].widthhight*250	

			}else if(this.imgsize.imgLayList[index].isround == 0){
				this.isActive = false	//不为圆形
				this.imgWidth =  this.imgsize.imgLayList[index].widthhight*250	
			}
			
			
			//删除之前选的
			this.myCroppa.remove()
			

		},
		//超过限制的提示
		onFileSizeExceed(){
			this.$notify.error({
		          title: '上传失败',
		          message: '上传照片不得大于3MB！'
			});	
		},
		
		
		
		//获取图片信息
		oninitimg:function(){


			if(this.myCroppa.img.height<1000){
				this.$notify.error({
			          title: '上传失败',
			          message: '上传照片不得小于1000像素！'
				});	
				this.myCroppa.remove();		
			}

		
			
			this.imgQuality = this.myCroppa.img.height/250;
			
		},
		
		
		
		//图片添加处理
		generateImage: function(index) {

//			 
			let url = this.myCroppa.generateDataUrl('image/jpeg', 0.8) //获取base64  并进行图片压缩

			var widths = this.myCroppa.img.width //选择的图片宽度
			var heights = this.myCroppa.img.height //选择的图片高度

			this.imgArr2[this.IMGindex] = {
				imageurl2: url,
				sort: this.IMGindex
			}

			if(!url) {
				alert('图片上传失败')
				return
			} else {
				this.imgUrl = url
				this.fullscreenLoading = true	//开启上传提示
				//奇牛转换
				var that = this
				api.general.uploadBase64Image(url, widths, heights).then(res => {
					that.imgArr[that.IMGindex].imageurl = 'http://pic.bbyiya.com/' + res
					
				}).then(res => {
					that.addFormVisible = false //关闭弹框页面
					that.fullscreenLoading = false	//关闭上传提示
					
				}).catch(function(err) {
					alert('上传失败');
				})
			}
			
			
		},

	


	},
	mounted() {
		this.pageSize = api.CountPerPage;
		this.productsFetch();

	}
}
</script>

<style scoped>
@import url("../../../../../common/css/vue-croppa.css");
*{
	margin: 0px;
	padding: 0px;	
}	
.RightBtn{
	float: right;
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
	border: 1px solid #000000;
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

.image-uploading-icon
{
	position: absolute;
	top: 15px;
	left: 50%;
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
