<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar">
				<el-form>
					<el-form-item>
						<span><b>业务目标</b>：让每个上门的客户参与回馈DM活动，既能回馈客户，又能借客户的手积累当地影响力，传播业务和广告，日积月累“发声”给潜在客户群。</br></span>
						<span><b>如何使用</b>：点击待客制作，上传客片调整到最佳效果，选择赠送条件后提交作品，分享作品给客户，客户完成条件后会自动下单送出。</span>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">
					<el-form-item  >
				    		<el-button type="primary" @click="Make()" >代客制作</el-button>
					</el-form-item>
					<el-form-item>
						<el-input v-model="keyword" placeholder="客户名称/电话" ></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="search" @click="search()">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<!--列表-->
		<el-table :data="templates" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index"  width="80"></el-table-column>
			<el-table-column prop="customername" label="客户名称" ></el-table-column>
			<el-table-column prop="mobilephone" label="电话"   > </el-table-column>
		<!-- 	<el-table-column prop="condition" label="条件"   >
			</el-table-column> -->
			<el-table-column label="完成情况"  >
					<template scope="scope" >
						<span type="text" @click="viewWorks(scope.row)" v-if="scope.row.condition=='分享'" > &ensp;&ensp; {{ (scope.row.sharedcount || 0)  + '/' + (scope.row.needsharecount || 0) }}  </span>
				    	<span type="text" @click="viewWorks(scope.row)" v-else> &ensp;&ensp; {{(scope.row.redpacketamount || 0)  + '/' + (scope.row.needredpackettotal || 0) }}  </span>
					</template>
			</el-table-column>
			<el-table-column label="分享页链接"   >
				<template scope="scope">
				        <el-popover trigger="click" placement="top">
							<img :src="scope.row.codeUrl" class="QRimage">
							<el-button type="text" class="QR-text" :loading="downloading" @click="downloadQRImage(scope.row)">&ensp;点击下载二维码</el-button>
				          	<el-button type="text" slot="reference"> 查看 </el-button>
				       </el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="createtimestr" label="制作时间"  >
			</el-table-column>
			<el-table-column  prop="status" label="操作" width="190" >
				<template scope="scope" >
					<template v-if="scope.row.status==3">
						<el-popover trigger="click" placement="top" class="popover">
							<div style="max-height:300px; overflow:auto;">
				        		<el-button type="text" class="order-button" v-for="item in scope.row.ordernolist" @click="viewOrder(item)">{{item}}</el-button>
							</div>
							<el-button size="small" slot="reference">已下单</el-button>
				        </el-popover>
					</template>
					<template v-else>
						<el-button size="small"  @click="PlaceanOrder(scope.row)">下单</el-button>
						<!-- <el-button size="small" @click="Modify(scope.row)">帮助修改</el-button> -->
					</template>
				</template>
			</el-table-column>
		</el-table>
		<!--下单页面-->
		<el-dialog title="下单信息" :visible.sync="dialogFormVisible">
			<el-form :model="addForm" label-width="80px" ref="addForm">
                <el-form-item label="产品款式">
                    <!--<el-input v-model="addForm.styleName" ></el-input>-->
                    {{addForm.styleName}}
				</el-form-item>

				<el-form-item label="数量">
					<el-input-number v-model="count" size="small" :min="1" :max="99" @change="numClick"></el-input-number> 
				</el-form-item>
				<el-form-item label="收货地址 ">
					<el-select v-model="Selectvalue" placeholder="请选择" @change="selectclick()">
					    <el-option v-for="item in options"  :key="item.value"  :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="收件人">
					<el-input  v-model="addForm.receiver" placeholder="收件人" style="width: 30%;"></el-input>
					<el-input  v-model="addForm.phone" placeholder="收件人电话" style="width: 60%;"></el-input>
					<!-- maxlength="11" -->
				</el-form-item>
				<el-form-item label="地址">
					<template v-if="addressIndex == 999">
                        <AddressSelector :province="addForm.province" :city="addForm.city" @change="addressSelectorChanged"/>
					</template>
					<template v-else><!---->
						<el-input :disabled="true" v-model="addForm.provinceName" placeholder="省" style="width: 30%;"></el-input>
						<el-input :disabled="true" v-model="addForm.cityName" placeholder="市" style="width: 30%;"></el-input>
						<el-input :disabled="true" v-model="addForm.districtName" placeholder="区" style="width: 30%;"></el-input>
					</template>
				</el-form-item>
				<el-form-item label="详细地址">
					<el-input type="textarea" v-model="addForm.streetdetail" placeholder="街道地址"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="addForm.remark"></el-input>
				</el-form-item>
			</el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="isok()">确 定</el-button>
		  </div>
		</el-dialog>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- :page-size="pageSize"-->
			<el-pagination layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>
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
	import Uploadphotos from './Uploadphotos.vue'
	import AddressSelector from '../../../components/AddressSelector';
	export default {
		data() {
			return {
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
				styles:[],
				status:'',
				type:10,
				keyword:'',
				downloading:false,
				canvasWidth:0,
				canvasHeight:0,
				generateReady:false,


				OrderPanelif:true,
				count:1,	//数量
				styleName:'',
				address:'',
				options:[],	//地址选择项
				Selectvalue:'',
				dialogFormVisible: false,
				addForm:{},
				workID:'',
				addressIndex:0,
			}
		},
		components: {

		   AddressSelector
		},


		methods: {


			downloadQRImage:function(item){
				this.downloading = true;

				var url = item.codeUrl 

				// 将链接地址字符内容转变成blob地址
				fetch(url).then(res => res.blob().then(blob => {	
					// 创建隐藏的可下载链接		
					var a = document.createElement('a');
					a.style.display = 'none';
					a.href = URL.createObjectURL(blob);				 
					a.download = 'QRcode.jpg';
					document.body.appendChild(a);
					a.click();
					//移除元素
					document.body.removeChild(a);
					this.downloading = false;
				}));




				// api.ibs.downWorkForCusRQcode(item.workid).then(relativePath =>{
				// 	this.downloading = false;
				// 	if (relativePath)
				// 	{
				// 		var url = api.ibs.getAPIBasePath() + "/pbs/order/download?path=" + encodeURIComponent(relativePath);
				// 		this.$alert('下载二维码', '成功', {
				//           confirmButtonText: '下载',
				//           callback: action => {
				//             	if(action == "confirm"){
				// 	          		window.open(url);
				// 	          	}
				//           }
				//         });
				// 	}
				// }).catch(error =>{
				// 	this.downloading = false;
				// })
			},

			numClick(value){
				this.addForm.count = value
			},
			//搜索
			search(){

				this.campaignsFetch()

			},

			viewOrder(orderID)
			{
				if(orderID){
					this.$router.push({ name: 'OrderDetail', query: { orderID: orderID}});
				}
			},
			//下单
			isok(){


				if(this.addForm.receiver == '' || this.addForm.province == '' || this.addForm.city == '' || this.addForm.phone == '' || this.addForm.district == '' ||  this.addForm.streetdetail == ''){
					this.$notify.error({
				          title: '下单失败',
				          message: '请填写正确完整信息！'
					});
				}else if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test( this.addForm.phone))){
					this.$notify.error({
			          title: '输入有误！',
			          message: '手机号码输入有误'
					});
				}else{

					let productJsonStr = {}
					let addressJsonStr = {}

					productJsonStr.workId = this.workID
					productJsonStr.count = this.addForm.count
					productJsonStr.remark = this.addForm.remark

					addressJsonStr.addresstype = this.addForm.addressType
					addressJsonStr.reciver = this.addForm.receiver
					addressJsonStr.phone = this.addForm.phone
					addressJsonStr.province = this.addForm.province
					addressJsonStr.city = this.addForm.city
					addressJsonStr.district = this.addForm.district
					addressJsonStr.streetdetail = this.addForm.streetdetail

					let that = this
					api.ibs.ibsSubmitTiCustomerHandOrder(productJsonStr,addressJsonStr).then( res => {
						that.campaignsFetch()
						that.dialogFormVisible = false
						var message = '我们已收到您的订单，您可以通过订单号跟踪订单状态'
						this.$alert(message, '成功', {
				            confirmButtonText: '查看订单',
				            callback: action => {
				            	if(action == "confirm" )
				            	{
				            		that.$router.push({ name: 'OrderDetail', query: { orderID: res.orderId}});
				            	}
				            }
					    });

					}).catch(error =>{

						that.dialogFormVisible = false
						var errorMessage = error.message || "下单失败"
						if(error.code == 300) {
							this.$alert(errorMessage, '失败', {
					            confirmButtonText: '确定',
					            callback: action => {
					            	if(action == "confirm")
					            	{
					            	}
					            }
					        });
						}
						else{
							this.$notify({ title: '错误', message: errorMessage, type: 'error' });
						}
					});

				}

			},


			//跳转代客制作
			Make(){

				this.$router.push({ name: 'Uploadphotos'});
			},
			addressSelectorChanged:function(province, city, district){
				this.addForm.province = province
				this.addForm.city = city
				this.addForm.district = district

	        },

			Modify(value){
				this.$router.push({ name: 'Modifyphotos', query:{ID:value.workid}});
				
				
			},



			//地址选中
			selectclick(){
				

				this.addressIndex = 999
				let that = this
				if(this.Selectvalue == '本店地址'){
					this.address.map(function(item,index){
						if(item.addressType==0){
							that.addForm.addressType = item.addressType
							that.addForm.provinceName = item.provinceName
							that.addForm.cityName = item.cityName
							that.addForm.districtName = item.districtName
							that.addForm.province = item.province
							that.addForm.city = item.city
							that.addForm.district = item.district
							that.addForm.receiver = item.reciver
							that.addForm.phone = item.phone
							that.addForm.streetdetail  = item.streetdetail
							that.addressIndex = 0
						}
					})

				}else if(this.Selectvalue == '用户地址'){
					this.address.map(function(item,index){
						if(item.addressType==1){


							that.addForm.addressType = item.addressType
							that.addForm.provinceName = item.provinceName
							that.addForm.cityName = item.cityName
							that.addForm.districtName = item.districtName

							that.addForm.province = item.province
							that.addForm.city = item.city
							that.addForm.district = item.district

							that.addForm.receiver = item.reciver
							that.addForm.phone = item.phone
							that.addForm.streetdetail  = item.streetdetail

							that.addressIndex = 1
						}
					})


				}else if(this.Selectvalue == '自定义'){
					that.addForm.receiver = ''
					that.addForm.phone = ''
					that.addForm.streetdetail  = ''
					that.addForm.province = ''
					that.addForm.city = ''
					that.addForm.district = ''
					that.addForm.addressType = 1

				}
			},

			//获取列表
			campaignsFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();

				api.ibs.workForCustomerList(this.page, this.type, this.keyword).then((response) => {
					var list = response.list || [];

					for(var i = 0;i < list.length; i++)
					{

						if(list[i].condition==0){
							list[i].condition = '分享'
						}else if(list[i].condition==1){
							list[i].condition = '收集红包'
						}

					}


					that.templates = list;


					that.total = response.total;
					this.listLoading = false;
					NProgress.done();

				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

			},

			//下单
			PlaceanOrder(item){


				if(item.status==3){

				}else{
					this.workID = item.workid
					let that = this
					api.ibs.getTiCustomerSubmitAddressList(item.workid).then(res => {

						that.addForm.styleName = res.style.description

						that.address = res.address
						that.options = []

						that.address.map(function(item,index){
							if(item.addressType==0){
								that.addForm.addressType = 0
								that.options.push({value: '本店地址'})
								that.addForm.receiver = item.reciver
							    that.addForm.phone = item.phone

								that.addForm.provinceName = item.provinceName
								that.addForm.cityName = item.cityName
								that.addForm.districtName = item.districtName

								that.addForm.province = item.province
								that.addForm.city = item.city
								that.addForm.district = item.district


								that.addForm.streetdetail  = item.streetdetail
								that.addForm.count = 1

							}else if(item.addressType==1){
								that.options.push({value: '用户地址'})
							}
						})
						that.options.push({value: '自定义'})

						that.Selectvalue = '本店地址'

					}).then(res => {

						this.dialogFormVisible = true



					}).catch(error =>{
						that.listLoading = false;
						alert('下单失败')
					});

				}

			},

			downloadBtnClicked(item){
				console.log(item)
				var adImageURL = item.codeUrl + '.jpg';

			    window.open(adImageURL);


			},
			handleCurrentChange(val) {
				this.page = val;
				this.campaignsFetch();
			},
		},
		mounted() {

			this.campaignsFetch();
		}
	}

</script>

<style scoped>

.order-button{
	display: block;
}

.order-button:first-child{
	margin-left: 10px;
}

.QR-text{
	width: 145px;
	text-align: center;
}

.QRimage{
	display: block;
	width: 145px;
	height: 145px;
}



.btn1{
	float: left;
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

</style>
