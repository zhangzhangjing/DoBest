<template>
	<section>
		<!--工具条-->
		<el-row>
			<!-- <el-col :span="2" class="toolbar"><span>业务说明</span></el-col> -->
			<el-col :span="24" class="toolbar">
				<el-form>
					<el-form-item>
						<span><b>业务目标</b>：用册子作为奖品吸引新的客人——1.客人扫描二维码参加活动，店里获得客人的联系方式；2.在客人做册子的过程中，保持沟通引导消费；3.在客人做完册子后，送上门进行转化；</br></span>
						<span><b>如何使用</b>：1.新建一个活动，设置好活动信息，得到活动二维码；2.把二维码用在想招揽新顾客的地方，比如活动现场做喷绘、异业合作的商家店里、网络平台进行发布；3.客人扫码参加活动后，在后台查看活动状态，跟进客人的进度；</span>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-radio-group v-model="status" style="display: block;" @change="radioGroupChanged">
				    		<el-radio-button label="-1">全部活动</el-radio-button>
						    <el-radio-button label="0">未开启</el-radio-button>
						    <el-radio-button label="1">进行中</el-radio-button>
						    <el-radio-button label="3">已结束</el-radio-button>
					    </el-radio-group>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="handleAdd">新增活动</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<!--列表-->
		<el-table :data="templates" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="40"></el-table-column>
			<el-table-column prop="title" label="活动名称" width="160"></el-table-column>
			<el-table-column  label="二维码" width="150">
				<template scope="scope">
			        <el-popover trigger="click" placement="top">
						<img :src="scope.row.codeurl" class="QRimage">
						<el-button type="text" class="QR-text" :loading="downloading" @click="downloadQRImage(scope.row)">点击下载二维码</el-button>
			          	<el-button type="text" slot="reference"> 查看 </el-button>
			        </el-popover>
			    </template>
			</el-table-column>
			<el-table-column v-if="status == -1" prop="statusString" label="活动状态" width="100"></el-table-column>
			<el-table-column prop="createtimestr" label="生成时间" width="120"> </el-table-column>
			<el-table-column prop="applycount" label="总报名人数" width="120"> </el-table-column>

			<el-table-column prop="count" label="已通过客户" width="120">
				<template scope="scope">
			        <el-button type="text" :disabled="scope.row.count == 0" @click="viewWorks(scope.row)">  {{scope.row.count}}  </el-button>
			    </template>
			</el-table-column>

			<el-table-column prop="needCheckCount" label="待审核人数" width="120">
				<template scope="scope">
			        <el-button type="text" class="text-underline" :disabled="scope.row.needCheckCount == 0" @click="viewUsers(scope.row)">  {{scope.row.reviewLabel}}  </el-button>
			    </template>
			</el-table-column>

			<el-table-column prop="productName" label="对应产品" width="160"> </el-table-column>

			<el-table-column prop="remark" label="备注" min-width="220">
				<template scope="scope">
					<span>{{scope.row.remark}}</span>
					<el-button type="text" @click="remarkBtnClicked(scope.row)">编辑</el-button>
				</template>
			</el-table-column>

			<el-table-column label="操作" width="200" fixed="right">
				<template scope="scope">
					<el-popover trigger="click" placement="top" class="popover">
						<el-button type="text" class="popover-button" @click="baseEditBtnTapped(scope.$index, scope.row)">修改活动设置</el-button>
						<el-button type="text" class="popover-button" @click="showDetail(scope.$index, scope.row)">编辑照片模板</el-button>
						<el-button type="text" class="popover-button" @click="viewStuffs(scope.row)">员工拓客设置</el-button>
						<el-button type="text" size="small" :loading="deleting" v-if="scope.row.status == 0" class="popover-button" @click="handleDel(scope.$index, scope.row)">删除模板</el-button>
			          	<el-button size="small" slot="reference">活动设置</el-button>
			        </el-popover>
					<el-button size="small" v-if="scope.row.status < 3" :loading="scope.row.statusChanging" @click="changeStatusBtnClicked(scope.row)">{{scope.row.status == 0 ? '开启活动' : '结束活动'}}</el-button>
				</template>
			</el-table-column>

		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>

		<!--新增界面-->
		<el-dialog title="创建活动" v-model="addFormVisible" :close-on-click-modal="false" style="min-width: 600px;">
			<el-steps :active="addFormActive" finish-status="success" style="margin-bottom:30px;">
				<el-step title="基本信息"></el-step>
				<el-step title="活动门槛"></el-step>
				<el-step title="活动信息"></el-step>
			</el-steps>

			<template v-if="addFormActive == 0">
				<el-form :model="addForm" label-width="120px" label-position="left" :rules="addFormRules" ref="addForm0">
					<el-form-item label="活动名称" prop="name">
						<el-input v-model="addForm.name" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item label="活动奖品">
						<el-select v-model="addForm.productID" placeholder="请选择" style="width: 25%;" @change="productSelectorChanged">
							<el-option v-for="item in products" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-select v-model="addForm.styleID" placeholder="请选择" style="width: 70%;">
							<el-option v-for="item in styles" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="备注">
	                    <el-input type="textarea" v-model="addForm.remark"></el-input>
	                </el-form-item>

				</el-form>
			</template>
			<template v-if="addFormActive == 1">
				<el-form :model="addForm" label-width="140px" label-position="left" :rules="addFormRules" ref="addForm1">

					<el-form-item label="可报名人数" >
					    <el-radio-group v-model="addForm.limitOption">
					      	<el-radio :label="0">无限制</el-radio>
					      	<el-radio :label="1">
					      		<el-input v-model="addForm.limitCount" :disabled="addForm.limitOption != 1" auto-complete="off" style="width: 60px;"></el-input>
					      		<span>人   （达到人数后将无法再报名）</span>
					      	</el-radio>
					    </el-radio-group>
					</el-form-item>

					<el-form-item label="报名审核">
						<el-switch v-model="addForm.review"></el-switch>
						<span>（审核用户资料，通过才能参与活动。特殊情况使用）</span>

					</el-form-item>

					<el-form-item label="能完成活动人数" >
					    <el-radio-group v-model="addForm.standardOption">
					      	<el-radio :label="0">无限制</el-radio>
					      	<el-radio :label="1">
					      		<span>先完成的</span>
					      		<el-input v-model="addForm.standardHumanCount" :disabled="addForm.standardOption != 1" auto-complete="off" style="width: 60px;"></el-input>
					      		<span>人</span>
					      	</el-radio>
					    </el-radio-group>
					</el-form-item>

					<el-form-item label="活动门槛" >
					    <el-radio-group v-model="addForm.conditionOption">
							<el-radio :label="0">无门槛</el-radio>
							<el-radio :label="1">分享作品</el-radio>
					      	<el-radio :label="2">
					      		<span>收集</span>
					      		<el-input v-model="addForm.wishCount" :disabled="addForm.conditionOption != 2" auto-complete="off" style="width: 60px;"></el-input>
					      		<span>条祝福留言</span>
					      	</el-radio>
							<div  style="margin-top:15px;">
								<el-radio :label="3">
						      		<span>收集亲友的红包</span>
									<el-input-number v-model="addForm.tipCount" :disabled="addForm.conditionOption != 3" size="small" :min="0" :max="addForm.maxTipCount" style="top:10px;"></el-input-number>
						      		<span>（降低奖品成本 {{addForm.tipCount}}￥）</span>
						      	</el-radio>
							</div>
					    </el-radio-group>
					</el-form-item>

					<el-form-item label="相册领取">
						<el-checkbox-group v-model="addForm.shippingOptions">
							<el-checkbox label="store">让客户选择领取店面(适用于客户上门自取)</el-checkbox>
						</el-checkbox-group>
					</el-form-item>

				</el-form>
			</template>
			<template v-if="addFormActive == 2">
				<el-form :model="addForm" label-width="140px" label-position="left" :rules="addFormRules" ref="addForm2">
					<el-form-item label="活动须知" prop="guidelines">
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
						<el-input type="textarea" :disabled="!addForm.QRCodeURL" :maxlength="120" v-model="addForm.pendingContent" @blur="pendingTextareaBlur(addForm.pendingContent)"></el-input>
					</el-form-item>
				</el-form>
			</template>

			<div slot="footer" class="dialog-footer">
				<el-button v-if="addFormActive == 0" type="text" @click.native="addFormVisible = false">取消</el-button>
				<el-button v-if="addFormActive > 0" type="text" @click.native="addFormActive--">上一步</el-button>
				<el-button type="primary" @click.native="addSubmitBtnClicked" :loading="addLoading">{{addFormActive < 2 ? '下一步' : '确定'}}</el-button>
			</div>
		</el-dialog>


		<el-dialog title="编辑活动" v-model="settingFormVisible" :close-on-click-modal="false" style="min-width: 600px;">
			<el-tabs v-model="selectedTab" >
				<el-tab-pane label="基本设置" name="first">
					<el-form :model="addForm" label-width="120px" label-position="left" :rules="addFormRules" ref="addForm0">
						<el-form-item label="活动名称" prop="name">
							<el-input v-model="addForm.name" @change="baseInfoChanged=true"></el-input>
						</el-form-item>

						<el-form-item label="活动奖品">
							<el-input v-model="addForm.productName" :disabled="true"></el-input>
						</el-form-item>

						<el-form-item label="备注">
		                    <el-input type="textarea" v-model="addForm.remark" @change="baseInfoChanged=true"></el-input>
		                </el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="活动门槛" name="second">
					<el-form :model="addForm" label-width="140px" label-position="left" :rules="addFormRules" ref="addForm1">

						<el-form-item label="可报名人数" >
						    <el-radio-group v-model="addForm.limitOption" @change="conditionInfoChanged=true">
						      	<el-radio :label="0">无限制</el-radio>
						      	<el-radio :label="1">
						      		<el-input v-model="addForm.limitCount" :disabled="addForm.limitOption != 1" @change="conditionInfoChanged=true" style="width: 60px;"></el-input>
						      		<span>人   （审核用户资料，通过才能参与活动。特殊情况使用）</span>
						      	</el-radio>
						    </el-radio-group>
						</el-form-item>

						<el-form-item label="报名审核">
							<el-switch v-model="addForm.review" @change="conditionInfoChanged=true"></el-switch>
							<span>（审核用户资料，通过才能参与活动。特殊情况使用）</span>
						</el-form-item>

						<el-form-item label="能完成活动人数" >
						    <el-radio-group v-model="addForm.standardOption" @change="conditionInfoChanged=true">
						      	<el-radio :label="0">无限制</el-radio>
						      	<el-radio :label="1">
									<span>先完成的</span>
						      		<el-input v-model="addForm.standardHumanCount" :disabled="addForm.standardOption != 1" @change="conditionInfoChanged=true" style="width: 60px;"></el-input>
						      		<span>人（需大于{{addForm.standardMinHumanCount}}）</span>
						      	</el-radio>
						    </el-radio-group>
						</el-form-item>

						<el-form-item label="活动门槛" >
						    <el-radio-group v-model="addForm.conditionOption" @change="conditionInfoChanged=true">
								<el-radio :disabled="!addForm.conditionEditable" :label="0">无门槛</el-radio>
								<el-radio :disabled="!addForm.conditionEditable" :label="1">分享作品</el-radio>
						      	<el-radio :disabled="!addForm.conditionEditable" :label="2">
						      		<span>收集</span>
						      		<el-input v-model="addForm.wishCount" :disabled="!addForm.conditionEditable" @change="conditionInfoChanged=true" style="width: 60px;"></el-input>
						      		<span>条祝福留言</span>
						      	</el-radio>
								<div  style="margin-top:15px;">
									<el-radio :disabled="!addForm.conditionEditable" :label="3">
							      		<span>收集亲友的红包</span>
										<el-input-number v-model="addForm.tipCount" :disabled="!addForm.conditionEditable" size="small" :min="0" :max="addForm.maxTipCount" @change="conditionInfoChanged=true" style="top:10px;"></el-input-number>
							      		<span>（降低奖品成本 {{addForm.tipCount}}￥）</span>
							      	</el-radio>
								</div>
						    </el-radio-group>
						</el-form-item>

						<el-form-item label="相册领取">
							<el-checkbox-group v-model="addForm.shippingOptions" @change="conditionInfoChanged=true">
								<el-checkbox :disabled="!addForm.shippingEditable" label="store">让客户选择领取店面(适用于客户上门自取)</el-checkbox>
							</el-checkbox-group>
						</el-form-item>

					</el-form>
				</el-tab-pane>
				<el-tab-pane label="活动信息" name="third">
					<el-form :model="addForm" label-width="140px" label-position="left" :rules="addFormRules" ref="addForm2">
						<el-form-item label="活动须知" prop="guidelines">
							<el-input type="textarea" :rows="5" v-model="addForm.guidelines" @change="pendingInfoChanged=true"></el-input>
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
							<el-input type="textarea" :disabled="!addForm.QRCodeURL" :maxlength="120" v-model="addForm.pendingContent" @change="pendingInfoChanged=true" @blur="pendingTextareaBlur(addForm.pendingContent)"></el-input>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>

			<div slot="footer" class="dialog-footer">
				<el-button  @click.native="settingFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="settingSubmitBtnClicked" :loading="addLoading">确定</el-button>
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
	import {pinyin} from 'common/js/pinyin'
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';
	import StringUtil from 'common/js/StringUtil.js';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				templates: [],
				total: 0,
				page: 1,
				pageSize:0,
				listLoading: false,
				deleting:false,
				sels: [],//列表选中列
				products:[],
				styles:[],
				status:-1,
				downloading:false,

				addFormVisible: false,//新增界面是否显示
				addFormActive:0,
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					guidelines: [
						{ required: true, message: '请输入活动须知', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: { },
				selectedTab:'first',
				membersFormVisible:false,
				pendingContentMaxChars:120,

				addBaseFormVisible:false,
				addBaseLoading: false,
				addBaseForm: { },

				baseInfoChanged:false,
				conditionInfoChanged:false,
				pendingInfoChanged:false,

				remarkFormVisible:false,
				remarkForm: { },



				uploadForm:{},
				uploading:false,

				uploaders:[{name:'qrcode', label:"主办方二维码图片", uploading:false, imageURL:'', previewImageURL:'', uploadForm:{},
	                              beforeUpload:file =>{return this.beforeUpload("qrcode", file)},
								  uploadFail:(error,file)=>{this.uploadFail("qrcode", error, file);},
								  uploadSuccess:(response,file)=>{this.uploadSuccess("qrcode", response, file);}},
	                      {name:'logo', label:"主办方Logo", uploading:false, imageURL:'', previewImageURL:'', uploadForm:{},
								  beforeUpload:file =>{return this.beforeUpload("logo", file)},
								  uploadFail:(error,file)=>{this.uploadFail("logo", error, file);},
								  uploadSuccess:(response,file)=>{this.uploadSuccess("logo", response, file);}}
	            ],



				settingFormVisible: false,
				setting:false,
				settingForm: { },


			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.templatesFetch();
			},
			downloadQRImage:function(item){
				this.downloading = true;
				yiya.templateQRImageDownloadURLFetch(item.workID).then(relativePath =>{
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
			productsFetch:function(){
				yiya.productsFetch().then((response) => {
					var list = response.list || [];
					this.products = list.map(item =>{
						return {label:item.title, value:item.productid};
					});

					var firstItem = this.products[0];
					if(firstItem )
					{
						this.stylesFetch(firstItem.value);
					}
				})
			},
			stylesFetch:function(productID){
				yiya.stylesFetch(productID).then(response => {
					var list = response.styleslist || [];
					this.styles = list.map(item =>{
						return {label:item.propertyStr + "  ￥" + item.price, value:item.styleId};
					});

					if(this.styles.length > 0)
					{
						var firstItem = this.styles[0];
						var form = Object.assign({}, this.addForm);

						form.styleID = firstItem ? firstItem.value : "";
						this.addForm = form;
					}
				})
			},
			//获取模板列表
			templatesFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.templatesFetch(this.page, this.status).then((response) => {
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
						item.reviewLabel = review ? (item.needCheckCount || 0) : "无需";
						item.guidelines = item.discription || "";
						item.limitCount = limitCount;
						item.limit = limitCount > 0 ? limitCount : "无";
						item.statusChanging = false;
						item.statusString = status == 1 ? "进行中" : status == 3 ? "已结束" : "未开启";
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
			radioGroupChanged:function(statusValue)
			{
				if(this.page != 1){
					this.page = 1;
				}

				this.templatesFetch();
			},
			productSelectorChanged:function(event){
		    	var productID = this.addForm.productID;
		  		this.styles = [];
		  		var form = Object.assign({}, this.addForm);
		  		form.styleID = '';
		  		this.addForm = form;

		  		if (productID)
		  		{
		  			this.stylesFetch(productID);
		  		}
		    },
			viewUsers:function(item){
				var templateID = item.templateID;
				if(templateID) {
					this.$router.push({ name: 'TemplateUsers', query: { id: templateID}});
				}
			},
			viewWorks:function(item){
				var templateID = item.templateID;
				// var productID = item.productid;
				if(templateID) {
					this.$router.push({ name: 'TemplateWorks', query: { id: templateID,page:1}});
				}
			},
			viewStuffs:function(item){
				var templateID = item.templateID;
				if(templateID) {
					this.$router.push({ name: 'TemplateStaffs', query: { id: templateID,work_id:item.workID,review:item.review}});
				}
			},
			showDetail: function (index, item) {
				var workID = item.workID;
				if (workID) {
					this.$router.push({ path: '/template/edit', query: { id: workID}});
				}
			},
			//修改
			baseEditBtnTapped: function (index, item) {
				this.settingFormVisible = true;
				this.selectedTab = "first";
				this.setUploaderImageURL("qrcode", item.tempcodeurl);
				this.setUploaderImageURL("logo", item.logourl);

				var limitOption = item.limitCount > 0 ? 1 : 0;
				var standardOption = item.maxcompletecount > 0 ? 1 : 0;
				var conditionOption = 0;
				if(item.needshared){
					conditionOption = 1;
				}
				else if(item.blesscount){
					conditionOption = 2;
				}
				else if(item.amountlimit){
					conditionOption = 3;
				}

				var shippingOptions = [];
				if(item.isbranchaddress == 2){
					shippingOptions.push('store');
				}

				var conditionEditable = item.status == 0;
				var shippingEditable = item.status == 0;
				var form = {templateID:item.tempid, name: item.title, productName:item.productName, remark:item.remark,
					review:item.review, guidelines:item.guidelines, QRCodeURL:item.tempcodeurl, logoURL:item.logourl,
					pendingContent:item.tempcodesm, submitOption:0, submitDelay:0, limitOption:limitOption, limitCount:item.limitCount || 0,
					standardOption:standardOption, standardHumanCount:item.maxcompletecount || 0, standardMinHumanCount:item.completecount || 0,
				conditionOption:conditionOption, wishCount:Math.max(item.blesscount || 0, 1), conditionEditable:conditionEditable,
				tipCount:item.amountlimit || 0, maxTipCount:item.agentprice || 0, shippingOptions:shippingOptions, shippingEditable:shippingEditable};

				this.addForm = form;

				this.baseInfoChanged = false;
				this.conditionInfoChanged = false;
				this.pendingInfoChanged = false;
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('停用模板并删除记录，确认删除模板？(不影响已报名的客户和订单)', '提示', {
					type: 'warning'
				}).then(() => {
					this.deleting = true;
					NProgress.start();
					yiya.removeTemplate(row.templateID).then(res =>{
						this.templatesFetch();
						this.deleting = false;
						NProgress.done();
						this.$notify({ title: '成功', message: '删除成功', type: 'success' });
					}).catch(error => {
						this.deleting = false;
						this.$notify({ title: '错误', message: error.message || "删除失败", type: 'error' });
					});

				}).catch(() => {
					console.log("取消按钮");
				});
			},
			//显示新增界面
			handleAdd: function () {
				this.uploaders.forEach(item =>{
					item.imageURL = "";
	                item.previewImageURL = "";
				});

				this.addFormActive = 0;
				this.addFormVisible = true;
				var form = {name: '', remark:'', review:false, guidelines:'', QRCodeURL:'', logoURL:'', pendingContent:'',
				submitOption:0, submitDelay:0, limitOption:0, limitCount:0, standardOption:0, standardHumanCount:0,
				conditionOption:1, wishCount:1, tipCount:0, maxTipCount:33, shippingOptions:[]};

				var firstProduct = this.products[0];
				form.productID = firstProduct ? firstProduct.value : "";
				var firstStyle = this.styles[0];
				form.styleID = firstStyle ? firstStyle.value : "";
				this.addForm = form;
			},
			getImageURLFromUploader:function(name){
				var item = this.uploaders.filter(item =>{return item.name == name})[0];
	            if(item && item.imageURL){
	                return item.imageURL;
	            }
				return "";
			},
			addSubmitBtnClicked:function(){
				// var name = "addForm" + this.addFormActive;
				// this.$refs[name].validate((valid) => {
				// 	console.log('valid:', valid)
	            //     if (valid) {
				// 		if(this.addFormActive < 2){
				// 			this.addFormActive += 1;
				// 		}else{
				// 			this.addSubmit();
				// 		}
	            //     } else {
	            //         console.log('error submit!!', this.addForm);
	            //         return false;
	            //     }
	            // });

				var form = this.addForm;
				var name = StringUtil.trim(this.addForm.name);
				if(!name) {
					this.$notify({ title: '错误', message:"请输入名称", type: 'error' });
					return;
				}

				if(form.conditionOption == 2 && form.wishCount <= 0){
					this.$notify({ title: '错误', message: "祝福条数不能小于0", type: 'error' });
					return;
				}

				if(this.addFormActive < 2){
					this.addFormActive += 1;
					return;
				}

				if(form.review && !form.guidelines){
					this.$notify({ title: '错误', message:"请填写活动须知", type: 'error' });
					return;
				}

				this.addSubmit();
			},
			//新增
			addSubmit: function () {

				console.log('提交');
				var form = this.addForm;
				var name = StringUtil.trim(this.addForm.name);
				var productID = this.addForm.productID;
				var styleID = this.addForm.styleID;
				var remark = this.addForm.remark;
				var templateID = this.addForm.templateID;
				var submitOption = parseInt(this.addForm.submitOption);
				var submitDelay = this.addForm.submitDelay;
				var guidelines = this.addForm.guidelines;
				var isbranchaddress = (this.addForm.shippingOptions || []).indexOf('store') != -1 ? 2 : 1;
				var pendingContent = this.addForm.pendingContent || "";
				if(pendingContent.length > this.pendingContentMaxChars){
					this.$notify({ title: '错误', message: "不能超过" + this.pendingContentMaxChars + "字", type: 'error' });
					return;
				}

				var params = {};
				params.title = name;
				params.remark = remark;
				params.productid = productID;
				params.styleId = styleID;
				params.needverifer = this.addForm.review ? 1 : 0;
				params.discription = guidelines;
				params.codeurl = this.getImageURLFromUploader('qrcode') || '';
				params.codesm = pendingContent;
				params.logourl = this.getImageURLFromUploader('logo') || '';
				params.applycount = form.limitOption > 0 ? form.limitCount : 0;
				params.maxcompletecount = form.standardOption == 1 ? form.standardHumanCount : 0;
				params.needshared = form.conditionOption == 1 ? 1 : 0;
				params.blesscount = form.conditionOption == 2 ? form.wishCount : 0;
				params.amountlimit = form.conditionOption == 3 ? form.tipCount : 0;
				params.isbranchaddress = isbranchaddress;


				this.addLoading = true;
				var func = yiya.createTemplate(params);
				func.then(response =>{
					this.templatesFetch();
					this.addFormVisible = false;
					this.addLoading = false;
					var message = "";
					if(templateID) {
						message = "修改成功";
					}
					else{
						message = "模板创建添加，请添加照片";
						var workID = response.myProductID;
						if (workID) {
							this.$router.push({ path: '/template/edit', query: { id: workID}});
						}
					}
					this.$notify({ title: '成功', message: message, type: 'success' });

				}).catch(error => {
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "添加失败", type: 'error' });
				});
			},
			settingSubmitBtnClicked:function(){
				var form = this.addForm;
				if(form.review && !form.guidelines){
					this.selectedTab = 'third';
					this.$notify({ title: '错误', message:"请填写活动须知", type: 'error' });
					return;
				}

				this.settingSubmit();
			},
			async settingSubmit(){
				//没有修改的
				if(!(this.baseInfoChanged || this.conditionInfoChanged || this.pendingInfoChanged)){
					this.settingFormVisible = false;
					return;
				}


				var form = this.addForm;
				var templateID = form.templateID;

				if(form.conditionOption == 2 && form.wishCount <= 0){
					this.$notify({ title: '错误', message: "祝福条数不能小于0", type: 'error' });
					return;
				}

				this.addLoading = true;

				var errorHandler = (error)=>{
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
				}
				if(this.baseInfoChanged){
					var params = {};
					params.tempid = templateID;
					params.title = form.name;
					params.remark = form.remark;
					try{
						await yiya.modifyTemplate(params)
					}catch(error){
						errorHandler(error);
						return;
					}
				}

				if(this.conditionInfoChanged){
					var review = form.review ? 1 : 0;
					var limitCount = form.limitOption > 0 ? form.limitCount : 0;
					var humanCount = form.standardOption == 1 ? form.standardHumanCount : 0;
					var forceShare = form.conditionOption == 1 ? 1 : 0;
					var wishCount = form.conditionOption == 2 ? form.wishCount : 0;
					var tipCount = form.conditionOption == 3 ? form.tipCount : 0;
					var isbranchaddress = (form.shippingOptions || []).indexOf('store') != -1 ? 2 : 1;

					try{
						await yiya.templateFinishConditionSetting(templateID, review, limitCount, humanCount, forceShare, wishCount, tipCount, isbranchaddress)
					}catch(error){
						errorHandler(error);
						return;
					}
				}

				if(this.pendingInfoChanged){
					var pendingContent = form.pendingContent || "";
					if(pendingContent.length > this.pendingContentMaxChars){
						this.$notify({ title: '错误', message: "不能超过" + this.pendingContentMaxChars + "字", type: 'error' });
						return;
					}

					var logoURL = this.getImageURLFromUploader('logo') || '';
					var QRCodeURL = this.getImageURLFromUploader('qrcode') || '';
					var guidelines = form.guidelines;

					try{
						await yiya.templateApplicationPendingSetting(templateID, QRCodeURL, pendingContent, guidelines, logoURL)
					}catch(error){
						errorHandler(error);
						return;
					}

				}


				this.addLoading = false;
				this.settingFormVisible = false;
				this.templatesFetch();
				this.$notify({ title: '成功', message: "修改成功", type: 'success' });
			},
			addBaseInfoSubmit:function(){
				var templateID = this.addBaseForm.templateID;
				var pendingContent = this.addBaseForm.pendingContent || "";
				if(pendingContent.length > this.pendingContentMaxChars){
					this.$notify({ title: '错误', message: "不能超过" + this.pendingContentMaxChars + "字", type: 'error' });
					return;
				}


				var params = {};
				params.tempid = templateID;
				params.title = this.addBaseForm.name;
				params.remark = this.addBaseForm.remark;
				params.needverifer = this.addBaseForm.review ? 1 : 0;
				params.discription = this.addBaseForm.guidelines;
				params.codeurl = this.getImageURLFromUploader('qrcode') || '';
				params.codesm = pendingContent;
				params.logourl = this.getImageURLFromUploader('logo') || '';
				// params.isAutoOrder = 0;
				// params.orderHours = 48;

				this.addBaseLoading = true;
				yiya.modifyTemplate(params).then(response =>{
					this.templatesFetch();
					this.addBaseFormVisible = false;
					this.addBaseLoading = false;
					this.$notify({ title: '成功', message: "修改成功", type: 'success' });
				}).catch(error => {
					this.addBaseLoading = false;
					this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
				});
			},
			pendingTextareaBlur:function(content){
				if((content || '').length > this.pendingContentMaxChars){
					this.$notify({ title: '错误', message: "不能超过" + this.pendingContentMaxChars + "字", type: 'error' });
				}
			},
			pendingInfoSubmit:function(){
				var templateID = this.settingForm.templateID;
				var content = this.settingForm.content;
				var QRCodeURL = this.settingForm.QRCodeURL;

				this.setting = true;
				yiya.templateApplicationPendingSetting(templateID, QRCodeURL, content).then(response =>{
					this.templatesFetch();
					this.settingFormVisible = false;
					this.setting = false;
					this.$notify({ title: '成功', message: "修改成功", type: 'success' });
				}).catch(error => {
					this.setting = false;
					this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
				});
			},
			changeStatusBtnClicked:function(item){
				var status = item.status || 0;
				if(status >= 3){
					return;
				}
				var message;
				var targetStatus = 0;
				var alert = false;
				if(status == 0){
					targetStatus = 1;
					// message = "活动开启后不能暂停，是否开启？";
				}else if(status == 1){
					targetStatus = 3;
					alert = true;
					message = "后续客户将再也无法扫码参与，确定要结束该活动吗？";
				}

				if(alert){
					this.$alert(message, '活动', { confirmButtonText: '确定',
				          callback: action => {
				            	if(action == "confirm"){
					          		this.changeStatus(item, targetStatus);
					          	}
				          }
				    });
				}else{
					this.changeStatus(item, targetStatus);
				}


			},
			changeStatus:function(item, status){
				item.statusChanging = true;
				yiya.templateStatusSetting(item.templateID, status).then((response) => {
					item.status = status;
					item.statusChanging = false;
					this.templatesFetch();
					this.$notify({ title: '成功', message: "成功", type: 'success' });
				}).catch(error => {
					item.statusChanging = false;
					this.$notify({ title: '错误', message: error.message || "失败", type: 'error' });
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
					this.pendingInfoChanged = true;
	            }
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
		    showMembers:function(){
		    	this.membersFormVisible = true;
		    },
			remarkBtnClicked:function(item){
				this.remarkForm = {templateID:item.templateID, remark:''};
				this.remarkFormVisible = true;
			},
			remarkSubmit:function(){
				this.addLoading = true;
				yiya.ibs.templateRemarkModify(this.remarkForm.templateID, this.remarkForm.remark).then(response =>{
					this.templatesFetch();
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
			this.templatesFetch();
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

.text-underline{
	text-decoration: underline;
}

</style>
