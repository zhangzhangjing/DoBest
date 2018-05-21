<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar">
				<el-form>
					<el-form-item>
						<span><b>业务目标</b>：适合用来做抽奖赠送、老客户回馈、第三方合作等活动——影楼通过活动把兑换码精准发放给客户，客户做好后自动下单，相册到店里后叫客户来取即可——此类活动的特点是精准、省力、适用面广。</br></span>
						<span><b>如何使用</b>：1.新建兑换码，设置好可以兑换哪本相册，得到一批兑换码列表；2.通过活动把兑换码发放给客户，比如可以做老客户回馈，把兑换码给对应的老客户，也可以跟像母婴店之类的第三方合作，把兑换码给母婴店来发；3.客人扫码参加活动后，输入兑换码，开始制作相册，制作完自动下单到店里，叫用户来取即可；</span>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>

		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="keyword" placeholder="兑换码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="search">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="createBtnClicked">新建活动</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="title" label="活动名称" width="120"></el-table-column>
			<el-table-column prop="productName" label="对应产品" width="160">
				<template scope="scope">
					<div>
						<p v-for="item in scope.row.products" style="margin-top:5px;margin-bottom:5px;">{{item.productName}}</p>
					</div>
			    </template>
			</el-table-column>
			<el-table-column  label="二维码" width="150">
				<template scope="scope">
			        <el-popover trigger="click" placement="top">
						<img :src="scope.row.codeurl" class="QRimage">
						<el-button type="text" class="QR-text" :loading="downloading" @click="downloadQRImage(scope.row)">点击下载二维码</el-button>
			          	<el-button type="text" slot="reference"> 查看 </el-button>
			        </el-popover>
			    </template>
			</el-table-column>
			<el-table-column prop="templateID" label="批次ID" width="100"> </el-table-column>

			<el-table-column prop="maxapplycount" label="兑换码数量" width="120"> </el-table-column>
			<el-table-column prop="count" label="已使用数量" width="120"> </el-table-column>
			<el-table-column prop="createtimestr" label="生成时间" width="120"> </el-table-column>
			<el-table-column prop="remark" label="备注" min-width="240">
				<template scope="scope">
					<span>{{scope.row.remark}}</span>
					<el-button type="text" @click="remarkBtnClicked(scope.row)">编辑</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200" fixed="right">
				<template scope="scope">
					<el-button size="small" @click="baseEditBtnTapped(scope.row)">修改设置</el-button>
					<el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>

		<el-dialog title="创建活动" size="small" v-model="addFormVisible" :close-on-click-modal="false">
			<el-steps :space="100" :active="addFormActive" finish-status="success" style="margin-bottom:30px;">
				<el-step title="基本信息"></el-step>
				<el-step title="活动信息"></el-step>
			</el-steps>

			<template v-if="addFormActive == 0">
				<el-form :model="addForm" label-width="120px" label-position="left" :rules="addFormRules" ref="addForm">

					<el-form-item label="活动名称">
						<el-input v-model="addForm.title" :disabled="addForm.edit" placeholder="请输入活动名称"></el-input>
					</el-form-item>

					<!-- <el-form-item label="对应产品"> -->
					<el-form-item v-for="(product,index) in addForm.products" :key="product.key" :label="'对应产品' + (index + 1)">
						<el-select v-model="product.productID" placeholder="请选择" :disabled="addForm.edit" style="width: 25%;" @change="productSelectorChanged(product)">
							<el-option v-for="item in products" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
						</el-select>
						<el-select v-model="product.styleID" placeholder="请选择" :disabled="addForm.edit" style="width: 45%;" @change="styleSelectorChanged(product,index)">
							<el-option v-for="item in product.styles" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-button size="small" :disabled="addForm.edit" @click="addProduct" style="margin-left:12px;">增加</el-button>
						<el-button size="small" :disabled="addForm.edit" @click.prevent="removeProduct(product)">删除</el-button>
					</el-form-item>

					<el-form-item label="生成数量">
						<el-input-number v-model="addForm.count" :min="1" :disabled="addForm.edit"></el-input-number>
					</el-form-item>

					<el-form-item label="活动要求">
						<el-radio-group v-model="addForm.conditionOption">
							<el-radio :disabled="addForm.edit" :label="0">无门槛</el-radio>
							<el-radio :disabled="addForm.edit" :label="1">分享作品</el-radio>
							<el-radio :disabled="addForm.edit" :label="2">
								<span>用户分享作品并收集到</span>
								<el-input v-model="addForm.wishCount" auto-complete="off" :disabled="addForm.edit" style="width: 40px;"></el-input>
								<span>条祝福</span>
							</el-radio>
						</el-radio-group>
					</el-form-item>

					<el-form-item label="快递方式" >
						<el-radio-group v-model="addForm.shippingOption" :disabled="addForm.edit">
							<el-radio :label="1">统一发送到店里默认地址</el-radio>
							<div style="margin:8px 0px;">
								<el-radio :label="0" >直接发送到客户收货地址（店里支付邮费）</el-radio>
							</div>
							<el-radio :label="2">让客户选择领取店面(适用于多店影楼)</el-radio>
						</el-radio-group>
					</el-form-item>

					<el-form-item label="备注">
						<el-input type="textarea" :rows="5" v-model="addForm.remark" :disabled="addForm.edit"></el-input>
					</el-form-item>

				</el-form>
			</template>

			<template v-if="addFormActive == 1">
				<el-form :model="addForm" label-width="140px" label-position="left" :rules="addFormRules" ref="addForm">

					<el-form-item label="活动须知">
						<el-input type="textarea" :rows="5" v-model="addForm.guidelines"></el-input>
					</el-form-item>

					<el-form-item v-for="item in uploaders" :label="item.label">
						<el-upload class="image-uploader"
							action="https://up.qbox.me"
							:show-file-list="false"
							:data="item.uploadForm"
							:on-success="item.uploadSuccess"
							:on-error="item.uploadFail"
							:before-upload="item.beforeUpload">
							<div v-if="item.imageURL">
								<img :src="item.previewImageURL" class="upload-image">
								<i v-if="item.uploading" class="el-icon-loading image-uploading-icon"></i>
							</div>

							<i v-else class="el-icon-plus image-uploader-icon"></i>
						</el-upload>
					</el-form-item>

					<el-form-item label="二维码简介">
						<el-input type="textarea" :disabled="!addForm.QRCodeURL" v-model="addForm.pendingContent" ></el-input>
					</el-form-item>
				</el-form>
			</template>

			<div slot="footer" class="dialog-footer">
				<el-button v-if="addFormActive == 0" type="text" @click.native="addFormVisible = false">取消</el-button>
				<el-button v-if="addFormActive > 0" type="text" @click.native="addFormActive--">上一步</el-button>
				<el-button type="primary" @click.native="addSubmitBtnClicked" :loading="addLoading">{{addFormActive < 1 ? '下一步' : '确定'}}</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog :title="addForm.templateID ? '活动设置' : '创建活动'" size="small" v-model="settingFormVisible" :close-on-click-modal="false">

			<el-tabs v-model="selectedTab">
			    <el-tab-pane label="基本设置" name="first">
			    	<el-form :model="addForm" label-width="120px" label-position="left" :rules="addFormRules" ref="addForm">

				    	<el-form-item label="活动名称">
		                    <el-input v-model="addForm.title" :disabled="addForm.edit" placeholder="请输入活动名称"></el-input>
		                </el-form-item>

						<!-- <el-form-item label="对应产品"> -->
						<el-form-item v-for="(product,index) in addForm.products" :key="product.key" :label="'对应产品' + (index + 1)">
							<el-select v-model="product.productID" placeholder="请选择" :disabled="addForm.edit" style="width: 25%;" @change="productSelectorChanged(product)">
		    					<el-option v-for="item in products" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
		  					</el-select>
		  					<el-select v-model="product.styleID" placeholder="请选择" :disabled="addForm.edit" style="width: 45%;" @change="styleSelectorChanged(product,index)">
		    					<el-option v-for="item in product.styles" :label="item.label" :value="item.value"></el-option>
		  					</el-select>
							<!-- v-if="index == addForm.products.length - 1" -->
							<!-- v-if="index != addForm.products.length - 1" -->
							<el-button size="small" :disabled="addForm.edit" @click="addProduct" style="margin-left:12px;">增加</el-button>
		                    <el-button size="small" :disabled="addForm.edit" @click.prevent="removeProduct(product)">删除</el-button>
						</el-form-item>

						<el-form-item label="生成数量">
							<el-input-number v-model="addForm.count" :min="1" :disabled="addForm.edit"></el-input-number>
						</el-form-item>


						<el-form-item label="活动要求">
							<el-radio-group v-model="addForm.conditionOption">
								<el-radio :disabled="addForm.edit" :label="0">无门槛</el-radio>
								<el-radio :disabled="addForm.edit" :label="1">分享作品</el-radio>
								<el-radio :disabled="addForm.edit" :label="2">
									<span>用户分享作品并收集到</span>
									<el-input v-model="addForm.wishCount" auto-complete="off" :disabled="addForm.edit" style="width: 40px;"></el-input>
									<span>条祝福</span>
								</el-radio>
							</el-radio-group>
						</el-form-item>

						<el-form-item label="快递方式" >
						    <el-radio-group v-model="addForm.shippingOption" :disabled="addForm.edit">
						      	<el-radio :label="1">统一发送到店里默认地址</el-radio>
								<div style="margin:8px 0px;">
									<el-radio :label="0" >直接发送到客户收货地址（店里支付邮费）</el-radio>
								</div>
								<el-radio :label="2">让客户选择领取店面(适用于多店影楼)</el-radio>
						    </el-radio-group>
						</el-form-item>

						<el-form-item label="备注">
							<el-input type="textarea" :rows="5" v-model="addForm.remark" :disabled="addForm.edit"></el-input>
						</el-form-item>

					</el-form>
			    </el-tab-pane>

			    <el-tab-pane label="主办方信息设置" name="second">
			    	<el-form :model="addForm" label-width="140px" label-position="left" :rules="addFormRules" ref="addForm">

			    		<el-form-item label="活动须知">
							<el-input type="textarea" :rows="5" v-model="addForm.guidelines"></el-input>
						</el-form-item>

						<el-form-item v-for="item in uploaders" :label="item.label">
		                    <el-upload class="image-uploader"
		                        action="https://up.qbox.me"
		                        :show-file-list="false"
		                        :data="item.uploadForm"
		                        :on-success="item.uploadSuccess"
		                        :on-error="item.uploadFail"
		                        :before-upload="item.beforeUpload">
		                        <div v-if="item.imageURL">
		                            <img :src="item.previewImageURL" class="upload-image">
		                            <i v-if="item.uploading" class="el-icon-loading image-uploading-icon"></i>
		                        </div>

		                        <i v-else class="el-icon-plus image-uploader-icon"></i>
		                    </el-upload>
		                </el-form-item>

						<el-form-item label="二维码简介">
							<el-input type="textarea" :disabled="!addForm.QRCodeURL" v-model="addForm.pendingContent" ></el-input>
						</el-form-item>
					</el-form>
			    </el-tab-pane>

			</el-tabs>


			<div slot="footer" class="dialog-footer">
				<el-button @click.native="settingFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addForm.edit ? editBaseInfoSubmit() : addSubmit()" :loading="addLoading">确定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="" v-model="remarkFormVisible" :close-on-click-modal="false">
			<el-form :model="remarkForm" label-width="80px">
				<el-form-item label="备注">
					<el-input type="textarea" v-model="remarkForm.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="remarkFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="remarkSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>


	</section>
</template>

<script>
	import util from 'common/js/util'
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';
	import StringUtil from 'common/js/StringUtil.js';

	export default {
		data() {
			return {
				templateID:'',
				list: [],
				total: 0,
				page: 1,
				pageSize:0,
				listLoading: false,
				products:[],
				styles:[],
				selectedTab:'first',
				addFormVisible: false,//新增界面是否显示
				settingFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addFormActive:0,
				addForm: { },
				uploadForm:{},
				uploading:false,
				downloading:false,
				keyword:'',

				remarkFormVisible:false,
				remarkForm: { },

				uploaders:[{name:'qrcode', label:"主办方二维码图片", uploading:false, imageURL:'', previewImageURL:'', uploadForm:{},
	                              beforeUpload:file =>{return this.beforeUpload("qrcode", file)},
								  uploadFail:(error,file)=>{this.uploadFail("qrcode", error, file);},
								  uploadSuccess:(response,file)=>{this.uploadSuccess("qrcode", response, file);}},
	                      {name:'logo', label:"主办方Logo", uploading:false, imageURL:'', previewImageURL:'', uploadForm:{},
								  beforeUpload:file =>{return this.beforeUpload("logo", file)},
								  uploadFail:(error,file)=>{this.uploadFail("logo", error, file);},
								  uploadSuccess:(response,file)=>{this.uploadSuccess("logo", response, file);}}
	            ]




			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.listFetch();
			},
			//获取用户列表
			listFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.ibs.promotionsFetch(this.page, this.keyword).then((response) => {
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						var review = item.needverifer == 1;
						var limitCount = item.maxapplycount || 0;
						var status = item.status || 0;
						item.templateID = item.tempid;
						item.applycount = item.applycount || 0;
						item.workID = item.cartid;
						item.enable = item.status == 1;
						item.review = review;
						item.reviewLabel = review ? "是" : "否";
						item.guidelines = item.discription || "";
						item.limitCount = limitCount;
						item.limit = limitCount > 0 ? limitCount : "无";
						item.statusChanging = false;
						item.statusString = status == 1 ? "进行中" : status == 3 ? "已结束" : "未开启";
						var products = (item.tempextlist || []).map(i =>{
							return {productName:i.productname, productID:i.productid, styleID:i.styleid, styles:[]}
						});
						if(products.length == 0){
							products.push({productName:item.productName, productID:item.productid, styleID:item.styleid, styles:[]});
						}
						item.products = products;

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
			productsFetch:function(){
				yiya.productsFetch().then((response) => {
					var list = response.list || [];
					this.products = list.map(item =>{
						return {label:item.title, value:item.productid, disabled:false};
					});

					// var firstItem = this.products[0];
					// if(firstItem )
					// {
					// 	this.stylesFetch(firstItem.value);
					// }
				})
			},
			stylesFetch:function(productID, product){
				yiya.stylesFetch(productID).then(response => {
					var list = response.styleslist || [];
					var aList = list.map(item =>{
						return {label:item.propertyStr + "  ￥" + item.price, value:item.styleId};
					});
					product.styles = aList;
					var item = aList[this.addForm.styleIndex || 0];
					if(item){
						// product.styleID = item.value;
					}

					var form = Object.assign({}, this.addForm);
	                this.addForm = form;
				})
			},
			downloadQRImage:function(item){
				this.downloading = true;
				yiya.templateQRImageDownloadURLFetch(item.workID, '', 2).then(relativePath =>{
					this.downloading = false;
					if (relativePath)
					{
						var url = yiya.getAPIBasePath() + "/pbs/order/download?path=" + encodeURIComponent(relativePath);
						this.$alert('下载二维码', '成功', {
				          confirmButtonText: '下载',
				          callback: action => {
				            	if(action == "confirm"){
					          		window.open(url);
					          	}
				          }
				        });
					}
				}).catch(error =>{
					this.downloading = false;
				})
			},
			productSelectorChanged:function(product){
		    	var productID = product.productID;
				product.styles = [];
	            product.styleID = '';
	            var form = Object.assign({}, this.addForm);
	            this.addForm = form;
		  		if (productID)
		  		{
		  			this.stylesFetch(productID, product);
		  		}
		    },
			styleSelectorChanged:function(product, index){
				var styleID = product.styleID;
				if (index == 0){
					var styleIndex = product.styles.findIndex(item => {return item.value == styleID});
					this.addForm.styleIndex = styleIndex || 0;
				}

				var addedCount = this.addForm.products.reduce((start,item) =>{
					return start + (item.styleID == styleID ? 1 : 0);
				},0)
				if(addedCount > 1){
					this.$notify({ title: '错误', message:"此款式已添加", type: 'error' });
				}
			},
			createProductModel:function(){
	            return {productID:"", styleID:"", styles:[], key: Date.now()}
	        },
			productSelectorDisableUpdate:function(){
				var addedProductID = this.addForm.products.map(item =>{
					return item.productID;
				});
				var products = this.products;
				products.forEach(item =>{
					item.disabled = addedProductID.indexOf(item.value) != -1;
				})
				this.products = products;
			},
			addProduct:function(){
				var count = (this.addForm.products || []).length;
				var maxCount = 10;
				if(count >= maxCount){
					this.$notify({ title: '错误', message:"最大数量不能超过" + maxCount + "个", type: 'error' });
					return;
				}
	            var form = Object.assign({}, this.addForm);
	            form.products.push(this.createProductModel());
	            this.addForm = form;
	        },
	        removeProduct:function(product){
	            var products = this.addForm.products || [];
				if(products.length <= 1){
					this.$notify({ title: '错误', message:"产品数量至少一个", type: 'error' });
					return;
				}
	            var index = products.findIndex(item => {return item.key == product.key});
	            if(index >= 0 && index < products.length){
	                products.splice(index, 1);
	            }
	            var form = Object.assign({}, this.addForm);
	            this.addForm = form;
	        },
			viewDetail:function(item){
				var templateID = item.templateID;
				if(templateID){
					this.$router.push({ name: 'PromotionCodes', query: { id: templateID, title:item.title}});
				}
			},
			createBtnClicked:function(){
				this.selectedTab = 'first';
				this.addFormActive = 0;
				this.addFormVisible = true;
				this.setUploaderImageURL("qrcode", '');
				this.setUploaderImageURL("logo", '');
				var form = {title:'', edit:false, count: 1, products:[this.createProductModel()], conditionOption:1, wishCount:1, shippingOption:1, remark:'',guidelines:'', QRCodeURL:'', pendingContent:''};

				// var firstProduct = this.products[0];
				// form.productID = firstProduct ? firstProduct.value : "";
				// var firstStyle = this.styles[0];
				// form.styleID = firstStyle ? firstStyle.value : "";
				this.addForm = form;
			},
			search:function(){
				this.listFetch();
			},
			addSubmitBtnClicked:function(){

				var form = this.addForm;
				var name = StringUtil.trim(form.title);
				if(!name) {
					this.$notify({ title: '错误', message:"请输入名称", type: 'error' });
					return;
				}

				if(this.addFormActive < 1){
					this.addFormActive += 1;
					return;
				}

				this.addSubmit();
			},
			addSubmit: function () {
				var title = this.addForm.title;
				var productID = this.addForm.productID;
				var styleID = this.addForm.styleID;
				var count = parseInt(this.addForm.count);
				var remark = this.addForm.remark;
				var templateID = this.addForm.templateID;
				var shippingOption = parseInt(this.addForm.shippingOption);
				var forceShare = this.addForm.conditionOption == 1 ? 1 : 0;
				var wishCount = this.addForm.conditionOption == 2 ? parseInt(this.addForm.wishCount) : 0;
				var guidelines = this.addForm.guidelines;
				var products = this.addForm.products.filter(item =>{
					return item.productID && item.styleID;
				}).map(item =>{
	                return {productId:item.productID, styleId:item.styleID};
	            });

				if(count <= 0)
				{
					this.$notify({ title: '错误', message:"数量必须大于0", type: 'error' });
					return;
				}

				if(products.length <= 0)
				{
					this.$notify({ title: '错误', message:"请选择对应产品", type: 'error' });
					return;
				}


				var params = {};
				params.title = title;
				params.remark = remark;
				params.productid = productID;
				params.styleId = styleID;
				params.applycount = count;
				params.discription = guidelines;
				params.isbranchaddress = shippingOption;
				params.needshared = forceShare;
				params.blesscount = wishCount;
				params.codeurl = this.addForm.QRCodeURL || "";
				params.codesm = this.addForm.pendingContent || "";
				params.logourl = this.getImageURLFromUploader('logo') || '';

				this.addLoading = true;
				var func = yiya.ibs.createPromotion(params, products);
				func.then(response =>{
					this.listFetch();
					this.addFormVisible = false;
					this.addLoading = false;
					this.$notify({ title: '成功', message: '创建成功', type: 'success' });

				}).catch(error => {
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "添加失败", type: 'error' });
				});
			},
			//修改
			baseEditBtnTapped: function (item) {
				var templateID = item.templateID;
				if(!templateID){
					return;
				}

				this.setUploaderImageURL("qrcode", item.tempcodeurl);
				this.setUploaderImageURL("logo", item.logourl);

				var productID = item.productid;
				var products = Object.assign([], item.products || []);
				if(products.length == 0){
					products.push({productID:productID, styleID:item.styleid, styles:[]});
				}
				this.selectedTab = 'second';
				this.settingFormVisible = true;
				var conditionOption = 0
				if(item.needshared){
					conditionOption = 1;
				}
				else if(item.blesscount){
					conditionOption = 2;
				}
				var form = {templateID:templateID, title:item.title, edit:true, count: item.maxapplycount, products:products,
					wishCount:Math.max(item.blesscount || 0, 1), conditionOption:conditionOption, shippingOption:item.isbranchaddress, remark:item.remark, guidelines:item.guidelines,
					QRCodeURL:item.tempcodeurl, pendingContent:item.tempcodesm};
				this.addForm = form;


				products.forEach(product =>{
	                if(product.productID){
	                    this.stylesFetch(product.productID, product);
	                }

	                var styleID = product.styleID;
	                if(styleID){
	                    setTimeout(()=>{
	                        product.styleID = styleID;
	                        var form = Object.assign({}, this.addForm);
	                        this.addForm = form;
	                    },100)
	                }

	            })
			},
			editBaseInfoSubmit:function(){
				var templateID = this.addForm.templateID;
				var guidelines = this.addForm.guidelines;
				var QRCodeURL = this.addForm.QRCodeURL;
				var pendingContent = this.addForm.pendingContent;
				var logoURL = this.getImageURLFromUploader('logo') || '';

				this.addLoading = true;
				yiya.ibs.promotionBaseInfoSetting(templateID, QRCodeURL, pendingContent, logoURL, guidelines).then(response =>{
					this.listFetch();
					this.settingFormVisible = false;
					this.addLoading = false;
					this.$notify({ title: '成功', message: "修改成功", type: 'success' });
				}).catch(error => {
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
				});
			},
			beforeUpload:function(name, file){
	            var item = this.uploaders.filter(item =>{return item.name == name})[0];
	            if(item){
	                item.uploading = true;
	                var key = yiya.qiniuUploadKeyGenerate("ibs")
	                return yiya.uploadTokenFetch().then(token => {
	                    item.uploadForm = {key:key, token:token};
	                })
	            }
	            return false;
	        },
	        uploadFail:function(name, err, file){
	            var item = this.uploaders.filter(item =>{return item.name == name})[0];
	            if(item){
	                item.uploading = false;
	            }
	        },
	        uploadSuccess(name, response, file) {
	            if (response.key) {
	                var imageURL = "http://pic.bbyiya.com/" + response.key;
	                var item = this.setUploaderImageURL(name, imageURL);
	                if(item){
	                    item.uploading = false;
	                }

					if (name == 'qrcode'){
						var form = this.addForm;
						form.QRCodeURL = imageURL;
						this.addForm = form;
					}else if (name == 'logo'){
						var form = this.addForm;
						form.logoURL = imageURL;
						this.addForm = form;
					}


	            }
	        },
			getImageURLFromUploader:function(name){
				var item = this.uploaders.filter(item =>{return item.name == name})[0];
	            if(item && item.imageURL){
	                return item.imageURL;
	            }
				return "";
			},
			setUploaderImageURL:function(name, imageURL){
				if (!name){
					return;
				}
				imageURL = imageURL || "";
	            var item = this.uploaders.filter(item =>{return item.name == name})[0];
	            if(item){
					var previewImageURL = imageURL ? imageURL + '?imageView2/2/w/200/q/80' : ''
	                item.imageURL = imageURL
	                item.previewImageURL = previewImageURL;
	                return item;
	            }
	            return null;
	        },
			remarkBtnClicked:function(item){
				this.remarkForm = {templateID:item.templateID, remark:''};
				this.remarkFormVisible = true;
			},
			remarkSubmit:function(){
				this.addLoading = true;
				yiya.ibs.templateRemarkModify(this.remarkForm.templateID, this.remarkForm.remark).then(response =>{
					this.listFetch();
					this.remarkFormVisible = false;
					this.addLoading = false;
					this.$notify({ title: '成功', message: "修改成功", type: 'success' });
				}).catch(error => {
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
				});
			}


		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			this.productsFetch();
			this.listFetch();

		}
	}

</script>

<style scoped>

.QRimage{
	display: block;
	width: 145px;
	height: 145px;
}

.QR-text{
	width: 145px;
	text-align: center;
}

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
