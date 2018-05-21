<template>
	<section>
		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
				<el-form :inline="true" style="margin: 15px; margin-bottom: 5px;">
					<el-form-item>	
						<el-form-item label="产品：" >
							<el-select  v-model="selectIndex" placeholder="请选择" @change="selectorChanged"  @visible-change="selectorChanged2">
								<el-option v-for="item in products2" :label="item.title" :value="item.title" :productid="item.productid"></el-option>
							</el-select>
						</el-form-item>				
						<el-form-item label="款式：">
							<el-select v-model="styleindex" placeholder="请选择" size="6px" @change="selectorstyle()" @visible-change="Prompt" >
								<el-option v-for="item in StyleList" :label="item.description" :value="item.description"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="完成条件:" >
							<el-radio class="radio" v-model="radio" label="1" @change="clickradio()">需要集赞</el-radio> 
							<el-input v-model="inputnum" style="width: 40px; height: 40px;" @blur="BlurInput()" > </el-input>个
							<el-radio class="radio" v-model="radio" label="2" @change="clickradio()">收集红包 {{price}}元</el-radio>
						</el-form-item>
						<el-form-item>
							 <el-popover trigger="click" placement="bottom">
								<div v-if="ispreview">
									<img :src="QRcode" class="QRimage">								
									<p style="text-align: center">微信扫一扫，查看真实日历效果</p>
								</div>
								<p style="text-align: center" v-else>请先上传几张图片，再预览</p>
								<el-button type="primary" slot="reference" style="width: 70px; height: 40px;" @click="preview2()"> 效果预览 </el-button>
							</el-popover> 
						</el-form-item>					
						<el-form-item  >
					    	<el-button type="primary" @click="Submit()" style="width: 70px; height: 40px;" >提交作品</el-button>		
						</el-form-item>
					</el-form-item> 
					<el-form-item  >
						<!--<el-radio-group v-model="type" style="display: block;" @change="radioGroupChanged">-->
				    		<!--<div v-for="item in products2.title"  >{{item}}</div>-->
					   <!-- </el-radio-group>-->
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>	
		<ul>
			<li class="ULli"  v-for="(item,index) in imgArr3" @click="clickImg(index)"  > <!--@click="clickImg(index)"-->
				 <!-- <img class="output" id="imglist"   :src="item.imageurl" alt="点击上传图片 ">
				 <i style="width: 200px; height: 200px; opacity: 0.8; background: #fff; z-index: 2; display: block; position: absolute; top: 0px;"></i>
				 <i  class="el-icon-loading image-uploading-icon"></i>	 -->
				<img v-if="item.imageurl" class="output" id="imglist" :src="item.imageurl" >
				<i v-else v-show="!item.Upload" class="el-icon-plus avatar-uploader-icon"></i>
				<i v-if="item.Upload" class="el-icon-loading image-uploading-icon"></i>	
				<span v-if="item.Upload" class="image-uploading-text">正在拼命上传中.... </span>
				<span v-if="item.NOUpload" class="image-uploading-text" style="color:red;">上传失败请重新上传！ </span>
			<!-- :class="{titleText:active}">{{titleText}} -->
				<br/>
				 <div class="btns" v-if="item.imageurl" > 				 
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
		</el-dialog>
			<!--新增界面-->
			<el-dialog title="添加照片"  :visible.sync="addFormVisible"  style="width:70%; margin-left:20%; "  :close-on-click-modal="false"   v-loading.fullscreen.lock="fullscreenLoading">
				<el-form :model="addForm" label-width="60px"   ref="addForm" style="width: 100px; margin-left: 40px;">			
					<croppa v-model="myCroppa" 
						canvas-color="transparent" 						
						:prevent-white-space="true"
						:class="{ active: isActive}" 
						:zoom-speed="3"
						:width="imgWidth" 
						:height="imgHeight"
						placeholder="上传调整图片"
						@new-image='oninitimg'						
						@click="clickss(this)"
						:quality="imgQuality"
					></croppa>	
				</el-form>
					<div style="margin-top: 20px;margin-left: 40px;font-weight:bold;">
						<p>请调整图片达到最佳效果</p>
						<p>1.鼠标拖动调整位置</p>
						<p>2.鼠标滚轮控制缩放</p>
						<p>注意: 过大的图片会导致卡顿</p>
					</div>
				<!--:file-size-limit="3200000"-->
				<!--@file-size-exceed="onFileSizeExceed"-->
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="addFormVisible = false" style="width: 50px; height: 30px;">取消</el-button>
		<!--@click.native="pageModify"--><el-button type="primary"  :loading="addLoading" style="width: 50px; height: 30px;" @click="generateImage()">确定</el-button>
				</div>
			</el-dialog>
			<!--收货地址新页面-->
			<el-dialog title="收货地址" :visible.sync="ReceivingAddress" size='tiny'>
			  <el-form :model="form">
			    <el-form-item label="客户昵称" :label-width="formLabelWidth" :rules="{ required: true, message: '昵称不能为空', trigger: 'blur'}">
			      <el-input v-model="form.name" auto-complete="off" style="width: 250px;" placeholder="请输入昵称" :maxlength="10"></el-input>
			    </el-form-item>
				 <br />
				 <el-form-item label="宝宝昵称" :label-width="formLabelWidth">
			      <el-input v-model="form.babynickname" auto-complete="off" style="width: 250px;" placeholder="选填，输入宝宝昵称" :maxlength="10"></el-input>
			    </el-form-item>
			    <br />
			    <el-form-item label="联系方式" :label-width="formLabelWidth" :rules="{ required: true, message: '联系方式不能为空', trigger: 'blur'}">
			      <el-input v-model="form.tel" auto-complete="off" style="width: 250px; " placeholder="请输入手机号码" :maxlength="11" @blur="BLUR()"></el-input>
			    </el-form-item>
			    <br />
			  </el-form>
			  <div v-if="radio2==1">
			   <span>&nbsp;<span style="color: red;">*</span>地址：</span>
			    <AddressSelector   @change="addressSelectorChanged"/> 
			    <br />
			 	<el-input v-model="form.detailed" placeholder="详细地址" style="width: 380px;"></el-input>
			  </div>
				
				<br />
				<div>
					<el-radio class="radio" v-model="radio2" label="0">发送到影楼默认地址</el-radio>
				 	<el-radio class="radio" v-model="radio2" label="1">发送该收货地址</el-radio> 
				</div>	
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="ReceivingAddress = false" style="width: 70px; height: 40px;">取 消</el-button>
			    <el-button type="primary" @click="SaveAddress()" style="width: 70px;  height: 40px;">确 定</el-button>
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
	import $ from 'jquery'
	Vue.use(Croppa) 
    import AddressSelector from '../../../components/AddressSelector';
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
				products:[],
				products2:[],		//选择产品列表
				StyleList:[],		//选择样式列表
				selectIndex:'',		//选中的产品
				styleindex:'',		//选中的产品样式
				radio:'1',
				radio2:'0',
		//				indexx:12,			//照片数量
				Imgshow:false,
				addFormVisible:false, //弹出剪切图片页面
				ReceivingAddress:false,	//弹出收货地址				
				IMGindex:'',		//第几个照片				
				inputnum:18,			//人数
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
			    form: {
		          name: '',
		          tel:'',
		          delivery: false,
		          type: [],
		          resource: '',
				  desc: '',
				  babynickname:'',
		          province:'',	//省
		          city:'',		//城市
		          district:'',	//区
		          detailed:'',	//详细地址
		        },
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
				imgArr3:[],
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
				uploading:true,
				addFormActive:0,
				addLoading: false,
				iflocalStorage:true,
				count:0,
			}
	 	},
	components: {
		AddressSelector
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
		addressSelectorChanged:function(province, city, district){
			this.form.province = province
			this.form.city = city
			this.form.district = district
        },	
        //优惠卷人数
        BlurInput(){
        	if(this.inputnum<15){
        		this.$notify.error({
			        title: '错误！',
			        message: '分享优惠卷不能低于15人！'
				});	
        	}
        },
		BLUR(){
			if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.form.tel))){ 
		       	this.$notify.error({
					title: '输入有误！',
					message: '手机号码输入有误'
				});	
				this.TelTrue = false
		        return false; 
		    }else{
		    	this.TelTrue = true
		    }
		},
		//保存收货地址
		SaveAddress(){
			if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.form.tel))&& this.form.name ==''){ 
		       	this.$notify.error({
					title: '信息错误！',
					message: '信息填写有误！'
				});	
				this.TelTrue = false
		        return false; 
		    }else if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.form.tel))){ 
		       	this.$notify.error({
			          title: '输入有误！',
			          message: '手机号码输入有误'
				});	
				this.TelTrue = false
		        return false; 
			
			}else{
		    	this.TelTrue = true
		    }
			if(this.radio2==1){
				if(this.form.province == '' || this.form.city == '' || this.form.district == '' || this.form.detailed == ''){
					this.$notify.error({
				          title: '保存失败',
				          message: '请填写正确完整信息！'
					});	
				}else{				  	
					 this.ifok()
				}
			}else {
				this.form.province = null
				this.form.city	= null
				this.form.district = null
				this.form.detailed = null
				this.ifok()
			}	
		},
		ifok:function(){
			var that = this
			if(this.form.name =='' || this.form.tel == '' || this.form.tel.length != 11 || this.TelTrue == false){
					this.$notify.error({
						title: '保存失败',
						message: '请填写正确完整信息！'
					});	
				}else{
					this.ReceivingAddress = false
					var needShareCount = 0
					var needRedpacketTotal = 0
					if(this.radio == 1){
						needShareCount = this.inputnum				
					}else{
						needRedpacketTotal = this.price
					}
					this.activityJson = {
						"productId":this.productID, 
						"styleId":this.styleId,
						"needShareCount":needShareCount,
						'babynickname':this.form.babynickname,
						"needRedpacketTotal":needRedpacketTotal,
						"details":this.imgArr
					},
					this.addressJson = {
						"phone":this.form.tel,
						"reciver":this.form.name,
						"addressType":this.radio2,
					    "province": this.form.province,
					    "city": this.form.city,
					    "district": this.form.district,
					    "streetdetail": this.form.detailed,
					}
					api.ibs.addWorkForCustomer(this.activityJson,this.addressJson).then(res => {
						this.$notify.success({
							title: '保存成功',
							message: '作品提交成功！'
						});		
						that.$router.push({ name: 'Valetproductions'});				
					}).then(res => {
					}).catch(function(err) {
						alert('保存失败');
						console.log(err)
					})
				}
		},
		//提交作品
		Submit() {
			var trueis = true
			if(this.inputnum<5){
				this.$notify.error({
			        title: '错误！',
			        message: '分享优惠卷不能低于5人！'
				});	
			}else{
				if(this.imgArr2.length!=0){
					for(let i=0;i<this.imgArr2.length;i++){				
						if(this.imgArr[i].imageurl==undefined){						
							trueis = false;
							this.$notify.error({
					          title: '提交失败',
					          message: '图片尚未上传完！'
					       });
							return
						}
					}
					if(trueis){
						this.ReceivingAddress = true;
						localStorage.setItem('myCat', 'Tom');
					}			
				}else{
					this.$notify.error({
		         	title: '提交失败',
		          	message: '请选择产品及样式！'
					})			
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
			this.$set(this.imgArr3, index, {
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
			// this.myCroppa.remove()
			var t = setTimeout(function(){	
				$("input[type='file']").click()
				clearTimeout(t)
			},100)
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
		    //this.fullscreenLoading = true	//开启上传提示
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
			var IMGindex = this.IMGindex
  			var that = this
			let url = this.myCroppa.generateDataUrl('image/jpeg', 0.8) //获取base64  并进行图片压缩
			var widths = this.myCroppa.img.width //选择的图片宽度
			var heights = this.myCroppa.img.height //选择的图片高度
			// this.imgArr2[this.IMGindex].Upload = true
			this.imgArr3[IMGindex].NOUpload = false;
			this.imgArr2[IMGindex] = {
				imageurl2: url,
				sort: IMGindex,
			};
			this.imgArr3[IMGindex].Upload = true
			if(!url) {
				alert('图片上传失败')
				return
			} else {
				this.imgUrl = url
				//奇牛转换
				that.addFormVisible = false
				api.general.uploadBase64Image(url, widths, heights).then(res => {
					that.imgArr3[IMGindex].Upload = false;
					that.imgArr[IMGindex].imageurl = 'http://pic.bbyiya.com/' + res;
					that.imgArr3[IMGindex].imageurl = 'http://pic.bbyiya.com/' + res;
					// that.imgArr2[this.IMGindex].Upload = false;
				}).then(res => {
					that.imgArr3[IMGindex].Upload = false;
					// JSON.parse(JSON.stringify(that.imgArr))
					// that.addFormVisible = false //关闭弹框页面
					that.fullscreenLoading = false	//关闭上传提示
				}).catch(function(err) {
					that.imgArr3[IMGindex].Upload = false;
					that.imgArr3[IMGindex].NOUpload = true;
					alert('上传失败');
				})
			}			
		},
		//选择产品
		selectorChanged() {
			this.selectIndex = this.selectIndex || localStorage.getItem('Productselection');
			var item = this.products2[this.selectIndex]
			var that = this;
			this.products2.map(function(item) {
				if(item.title == that.selectIndex) {
					that.productID = item.productid
					that.productStyleList(item.productid)
					that.styleindex = ''
					that.imgArr = []
					that.imgArr2 = []
					that.imgArr3 = []					
				}
			})
		},
		//点击选择时清空
		selectorChanged2(){
			localStorage.setItem('Styleselection','')
			localStorage.setItem('styleID','')
			localStorage.setItem('Productselection', this.selectIndex)
		},		
		//选择样式前提醒
		Prompt(value){
			if(value){
				if(this.PromptState == true){
					if(this.imgArr2.length!=0){
						for(let i=0;i<this.imgArr2.length;i++){				
							if(this.imgArr[i].imageurl!=undefined){						
								this.$confirm('切换款式将失去当前的照片处理进度确认更换？')
						          .then(_ => {
						          	this.PromptState = false	
						          }).catch(_ => {});								
							}		
						}
					}
				}	
			}
		},
		//选择产品样式
		selectorstyle() {
			var that = this
			that.styleindex = that.styleindex ? that.styleindex :localStorage.getItem('Styleselection')
			localStorage.setItem('Styleselection',that.styleindex)
			console.log('that.styleindex', that.styleindex)
			console.log('this.StyleList', this.StyleList)
			if (this.StyleList&&this.StyleList.length === 0) {
				return
			}
			this.StyleList.map(function(item,index) {
				if(item.description == that.styleindex) {
					that.price = item.promoterprice
					that.styleId = item.styleid 
					api.ibs.getCoordinates(that.styleId).then(response => {
						that.imgsize = response												
						that.imgArr = []
						that.imgArr2 = []
						that.imgArr3 = []
						for(let i = 0; i < item.imgcount; i++) {
							that.imgArr.push({
								sort: i
							})
							that.imgArr2.push({
								sort: i
							})
							that.imgArr3.push({
								sort: i,
								Upload:false,
							})
						}
						that.PromptState = true	
					}).catch(function(err) {
						alert('选择产品款式失败！');
					}) ;
				}
			})

		},
		//获取产品样式
		productStyleList: function(styleID) {
			localStorage.setItem('styleID',styleID)
			console.log('styleID', styleID)
			api.ibs.productStyleList(styleID).then(response => {
				this.StyleList = response
				console.log('StyleList', this.StyleList)
				var that = this
				this.StyleList.map(function(item) {
					if(item.description == that.styleindex) {
						that.price = item.promoterprice
						that.indexx = item.imgcount
					}
				})
			})
		},
		//获取产品
		productsFetch: function() {
			localStorage.setItem('Styleselection','')
			localStorage.setItem('styleID','')
			localStorage.setItem('Productselection', '')
			api.cts.productsFetch().then((response) => {
				var list = response || [];
				this.products = list.map(item => {
					return {
						label: item.title + "  ￥" + item.price,
						value: item.productid
					};
				});
				var that = this
				// console.log()
				var styleID = localStorage.getItem('styleID') || 0
				if (styleID === 0) {
					this.productStyleList(styleID);
				}
				this.selectorChanged();
				var t = setTimeout(function(){
					that.selectorstyle();
					clearTimeout(t)
				},200)
				this.products2 = list
				var firstItem = this.products[0];
				if(firstItem) {
					
				}
			})
		}
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
