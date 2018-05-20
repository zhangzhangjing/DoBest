<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar">
				<el-form>
					<el-form-item>
						<span><b>业务目标：</b>在温情回馈客户的同时，让品牌在当地微信群、朋友圈集中曝光，让广告在当地人圈子里口耳相传。</br></span>
						<span><b>如何使用：</b>新增完活动后，点击“业务链接”按钮扫码进入活动首页，分享活动首页给员工、亲友、客户让其大规模扩散，初始扩散人数每多1倍，传播结果对应好3倍。</span>						
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	<!-- 	<el-row>
			<el-col :span="24" class="toolbar">
				<el-form>
					<el-form-item>
						<div class="workbenchimgBox">
							<img v-if="isProduction" class="Workbenchimg" src="../../../assets/Workbench.png">
							<img v-if="isDev" class="Workbenchimg" src="../../../assets/test.png">
							<p style="padding:0px;margin:0px;margin-top: -10px;">扫码即可发出活动邀请</p>
						</div>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row> -->
		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">
					<!-- <el-form-item>
						<el-radio-group v-model="status" style="display: block;" @change="radioGroupChanged">
				    		<el-radio-button label="-1">全部活动</el-radio-button>
						    <el-radio-button label="0">未开启</el-radio-button>
						    <el-radio-button label="1">进行中</el-radio-button>
						    <el-radio-button label="3">已结束</el-radio-button>
					    </el-radio-group>
					</el-form-item> -->
					<el-form-item>
						<el-radio-group v-model="type" style="display: block;" @change="radioGroupChanged">
				    		<el-radio-button :label="0">公开</el-radio-button>
						    <!-- <el-radio-button :label="1">一对一</el-radio-button> -->
							<el-radio-button :label="2">兑换码</el-radio-button>
					    </el-radio-group>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleAdd">新增DM活动</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<!--列表-->
		<el-table :data="templates" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="40"></el-table-column>
			<el-table-column prop="title" label="活动名称" width="160"></el-table-column>
			<el-table-column prop="productName" label="产品名称" min-width="200"> </el-table-column>			
			<!-- <el-table-column label="未分享/未完成" width="140">
				<template scope="scope">
					<p type="text">  {{scope.row.notsharecount + '/' + scope.row.notsubmitcount}}  </p>
			    </template>
			</el-table-column> -->
			<el-table-column label="已赠送/已参与" width="140">
				<template scope="scope">
					<p type="text">  {{(scope.row.completecount || 0) + '/' + (scope.row.applycount || 0)}}  </p>
			    </template>
			</el-table-column>
			<!--<el-table-column label="已邀请/总数量" width="140">
				<template scope="scope">
					<span> {{scope.row.limitHumanCount == 0 ? '-' : scope.row.yaoqingcount + '/' + scope.row.freecount}} </span>
			    </template>
			</el-table-column>-->
			<el-table-column v-if="type == 0 || type == 2" prop="remark" label="活动链接" width="100">
				<!-- <template scope="scope">
					<el-button type="text" :loading="scope.row.downloading" @click="downloadBtnClicked(scope.row)">{{scope.row.actimg ? '下载' : '重新合成'}}</el-button>
				</template> -->
			<template scope="scope">
		        <el-popover trigger="click" placement="top">
					<img :src="scope.row.codeurl" class="QRimage">
					<el-button type="text" class="QR-text" :loading="downloading" @click="downloadQRImage(scope.row)">&ensp;点击下载二维码</el-button>
		          	<el-button type="text" slot="reference"> 查看 </el-button>
		       </el-popover>
			</template>
			</el-table-column>
			<el-table-column prop="acttype" label="活动类型" width="100" :formatter="Formatter.campaignPresentTypeFormat"></el-table-column>
			<el-table-column prop="createTimestr" label="创建时间" width="120"> </el-table-column>
			<el-table-column prop="remark" label="备注" min-width="220">
				<template scope="scope">
					<span>{{scope.row.remark}}</span>
					<el-button type="text" @click="remarkBtnClicked(scope.row)">编辑</el-button>
				</template>
			</el-table-column>			
			<el-table-column label="操作"   width="370" fixed="right">
				<template scope="scope">
					<el-button size="small" @click="viewWorks(scope.row)">活动进展</el-button>
					<el-button size="small" v-show="type==2" @click="RedeemCode(scope.row)">兑换码下载</el-button>
					<el-button size="small" @click="baseEditBtnTapped(scope.$index, scope.row)">活动设置</el-button>
					<el-button size="small" @click="viewStuffs(scope.row)">邀请权限</el-button> 
					<!-- <el-button type="text" size="small" :loading="deleting" v-if="scope.row.status == 0" class="popover-button" @click="handleDel(scope.$index, scope.row)">删除模板</el-button> -->
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
		<el-dialog title="新增活动" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<template>
				<el-form :model="addForm" label-width="120px" label-position="left" :rules="addFormRules" ref="addForm0">
					<el-form-item label="赠送方式" >
					    <el-radio-group v-model="addForm.presentOption" @change="changeOption(addForm.presentOption)" >					      	
					      	<el-radio :label="0">公开赠送（推荐：所有人均可通过活动链接参与）</el-radio>
					      	<!-- :label="1" >一对一发送模式 -->
							<div style="margin-top:10px;">
								<el-radio :label="2" >兑换码赠送（给客户兑换码才能参与）</el-radio>
							</div>
					    </el-radio-group>
					</el-form-item>
					<el-form-item label="选择产品">
						<el-select v-model="addForm.productID" placeholder="请选择" style="width: 290px;" @change="selectActive(addForm.productID)">
							<el-option v-for="item in products" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				    <!-- 一对一活动剔除掉了 -->
					<div v-if="addForm.presentOption == 0">
						<el-form-item label="赠送数量" >						
							<!-- <el-input-number v-model="addForm.shareCount" :min="5" :max="99" style="top:10px;"></el-input-number> -->
							<el-radio-group v-model="addForm.shareCountX2">
								<el-radio :label="0"><el-input v-model="addForm.applylimitcount" :disabled="addForm.shareCountX2 != 0" style="width: 60px; text-align:center"></el-input><span>人能获赠产品</span></el-radio>
								<el-radio :label="1">无限制</el-radio>
							 </el-radio-group>						
						</el-form-item>
					</div>
					<el-form-item label="获赠条件" >
						<el-radio-group v-model="addForm.shareCountX">、
							<el-radio :label="1"><span>需要集赞</span><el-input v-model="addForm.shareCount" :disabled="addForm.shareCountX != 1" style="width: 40px; text-align:center"></el-input><span>个</span></el-radio>
							<el-radio :label="0">无条件</el-radio>							
						 </el-radio-group>						
					</el-form-item>
					<!-- 新增二次传播 -->
					<div >
						<el-form-item label="二次传播">
						    <el-radio-group v-model="addForm.zanType" v-if="addForm.presentOption == 0">					      	
								<el-radio  :label="0" >无限传播<span style="font-size:11px;">（点赞人能参加活动）</span></el-radio>
								<el-radio :label="1" >引导消费<span style="font-size:11px;">（点赞人赠送优惠券）</span></el-radio>
						    </el-radio-group>
						    <el-radio v-model="addForm.zanType" :label="0" v-if="addForm.presentOption ==2" >引导消费<span style="font-size:11px;">（点赞人赠送优惠券）</span></el-radio>
						</el-form-item>
					</div>
					<el-form-item label="广告挂钩*" >
						<el-select v-model="selectvalue" placeholder="请选择"  @change="selectorChanged(selectvalue)">
							<el-option
							v-for="item in ShareAdvertList"							
							:key="item.advertid"
							:label="item.description"
							:value="item.advertid">
							</el-option>
						</el-select>
					</el-form-item>
					<!-- 后端 -->
					<el-form-item label="地址选项" >
						<el-select v-model="selectvalue" placeholder="请选择"  @change="selectorChanged(selectvalue)">
							<el-option
							v-for="item in ShareAdvertList"							
							:key="item.advertid"
							:label="item.description"
							:value="item.advertid">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="活动标题" >
						<el-input v-model="addForm.name" :maxlength="25"></el-input>
					</el-form-item>
					<el-form-item label="活动说明">
						<textarea :rows="7" v-model="addForm.guidelines" :maxlength="130" class="inputtext"></textarea>
	                </el-form-item>
	                <!-- 后端 -->
	                <el-form-item label="用户分享文案(可选)">
						<el-input  :maxlength="25"></el-input>
						<el-input  :maxlength="28" style="margin-top:10px;"></el-input>
					</el-form-item>
	                <!--二维码上传-->
	                <el-form-item :label="redCodeDesc">
						<el-upload 
							class="avatar-uploader"
							action="https://up.qbox.me"
							:show-file-list="false"
							:data="coverUploadForm"
							:on-success="coverUploadSuccess"
							:before-upload="coverBeforeUpload">
							<img v-if="addForm.defaultimg" :src="addForm.defaultimg" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							<i v-if="uploading" class="el-icon-loading image-uploading-icon"></i>			
						</el-upload>
						<el-input  class="inpText" style="margin-top: 10px;" v-model="addForm.titletext" placeholder="输入二维码说明，例如：关注公众号，参与更多优惠活动">
						</el-input>
					</el-form-item>				
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button  @click.native="addFormVisible = false">取消</el-button>
					<el-button type="primary" @click.native="addSubmitBtnClicked" :loading="addLoading">创建</el-button>
				</div>
			</template>
		</el-dialog>
		<!-- 编辑活动 -->
		<el-dialog title="编辑活动" :visible.sync="settingFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" label-position="left" :rules="addFormRules" ref="addForm0">
                <div v-if="type==0">
					<el-form-item label="赠送数量" >						
						<el-radio-group v-model="addForm.shareCountX2">
							<el-radio :label="0"><el-input v-model="addForm.applylimitcount" :disabled="addForm.shareCountX2 != 0" style="width: 60px; text-align:center"></el-input><span>人能获赠产品</span></el-radio>
							<el-radio :label="1">无限制</el-radio>
						</el-radio-group>						
					</el-form-item>
				</div>
				<!-- 编辑二次传播 -->
				<el-form-item label="二次传播">
					<el-radio-group v-model="addForm.zantype"  v-if="addForm.presentOption==0">
					   <el-radio :label="0">无限传播<span style="font-size:11px;">（点赞人能参加活动）</span></el-radio>
					   <el-radio :label="1">引导消费<span style="font-size:11px;">（点赞人赠送优惠券）</span></el-radio>
					</el-radio-group>
					<el-radio v-model="addForm.zanType" :label="0" v-if="addForm.presentOption ==2" >引导消费<span style="font-size:11px;">（点赞人赠送优惠券）</span></el-radio>
				</el-form-item>
				<!-- 广告配置 -->
				<el-form-item label="广告挂钩*" >
					<el-select v-model="selectvalue" placeholder="请选择"  @change="selectorChanged(selectvalue)">
						<el-option
						v-for="item in ShareAdvertList"							
						:key="item.advertid"
						:label="item.description"
						:value="item.advertid">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="活动名称" prop="name">
					<el-input v-model="addForm.name" :maxlength="25"></el-input>
				</el-form-item>
				<el-form-item label="活动说明">
					<textarea v-model="addForm.guidelines" :rows="7" maxlength="130" class="inputtext"></textarea>
				</el-form-item>
				<!-- 后端 -->
                <el-form-item label="用户分享文案(可选)">
					<el-input  :maxlength="25"></el-input>
					<el-input  :maxlength="28" style="margin-top:10px;"></el-input>
				</el-form-item>
				 <!--二维码上传-->
                <el-form-item :label="redCodeDesc" >
					<el-upload class="image-uploader"
						action="https://up.qbox.me"
						:show-file-list="false"
						:data="coverUploadForm"
						:on-success="coverUploadSuccess"
						:before-upload="coverBeforeUpload">
						<img v-if="addForm.defaultimg" :src="addForm.defaultimg" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						<i v-if="uploading" class="el-icon-loading image-uploading-icon"></i>			
					</el-upload>	
					<el-input  class="inpText" style="margin-top: 10px;" v-model="addForm.titletext" placeholder="输入二维码说明，例如：关注公众号，参与更多优惠活动"></el-input>					
				</el-form-item>
				<!-- <el-form-item  label-width="190px" label="活动礼品只能寄往本店地址">
					<el-switch v-model="switchs"></el-switch>
				</el-form-item> -->
			<!-- 	<span style="color: red; margin-top: -25px; float: left;">(修改此项会导致部分达标作品无法自动下单，请手动为其下单)</span> -->
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button  @click.native="settingFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="settingSubmitBtnClicked" :loading="addLoading">确定</el-button>
			</div>
		</el-dialog>


		<!-- 编辑备注 -->
		<el-dialog title="编辑备注" :visible.sync="remarkFormVisible" :close-on-click-modal="false">
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

		<canvas id="adCanvas" :width="canvasWidth" :height="canvasHeight" class="canvas" >Canvas</canvas>


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
	

	export default {
		data() {
			return {
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
				type:0,
				keyword:'',
				downloading:false,
				canvasWidth:0,
				canvasHeight:0,
				generateReady:false,

				addFormVisible: false,//新增界面是否显示
				// addFormActive:0,
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					guidelines: [
						{ required: true, message: '请输入活动详情', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: { },
				selectedTab:'first',
				pendingContentMaxChars:120,

				addBaseFormVisible:false,
				addBaseLoading: false,
				addBaseForm: { },

				baseInfoChanged:false,
				conditionInfoChanged:false,
				pendingInfoChanged:false,

				remarkFormVisible:false,
				remarkForm: { },

				isdisabled:false,	//选一对一禁止

				settingFormVisible: false,
				setting:false,
				settingForm: { },

				// switchs:false,

				isProduction:false,
				isDev:false,
				isTest:false,

				ShareAdvertList:'', 	//广告
				selectvalue:"无广告",		//选中
				advertid:'',
				
				//二维码上传
				coverUploadForm: {},
				redUploadForm: {},
				uploading:false,
				// 广告图上传
				uploadingb:false,
				redCodeDesc: '推荐关注二维码(可选)'

			}
		},
		methods: {
			coverBeforeUpload(file) {
				this.uploading = true;
				var key = api.general.qiniuUploadKeyGenerate();
				return api.general.uploadTokenFetch().then(response => {
					var token = response.upToken;
					this.coverUploadForm = { key: key, token: token };
				});
			},
			// 上传红包广告图
			redBeforeUpload(file) {
				this.uploadingb = true;
				var key = api.general.qiniuUploadKeyGenerate();
				return api.general.uploadTokenFetch().then(response => {
					var token = response.upToken;
					this.redUploadForm = { key: key, token: token };
				});
			},
			// 改变红包的提示语
			selectActive (id) {
				if (id === 2801) {
					// this.redCodeDesc = '广告主二维码(红包背面实体图)'
					this.addForm.name = '厌倦了年年一个样儿的红包？今年红包自己写祝福！！';
					this.addForm.guidelines = '今年红包可以自己写上祝福，送你12个红包，送长辈，送孩子更有范儿。快来领取吧！'
				} else {
					this.addForm.name = '扫码领取精美DIY挂历用最爱的人的照片陪伴我一整年'
					this.addForm.guidelines = '有一份礼物免费赠送给你。 \n只需要用手机上传你自己的照片，\n就可以获得精美台历/挂历一份。\n用自己的影像，演绎每一天的精彩，\n让你们的家庭故事，在2018继续幸福延续。'
				}
			},
			//二维码
			coverUploadSuccess(response, file, fileList) {
				if (response.key) {
					var imageURL = "http://pic.bbyiya.com/" + response.key;
					var form = this.addForm;
					form.defaultimg = imageURL;
					this.addForm = form;
					this.uploading = false;
				}
			},
			// 红包广告图
			redUploadSuccess(response, file, fileList) {
				if (response.key) {
					var imageURL = "http://pic.bbyiya.com/" + response.key;
					var form = this.addForm;
					form.qrcode = imageURL;
					this.addForm = form;
					this.uploadingb = false;
				}
			},
			//配置广告的id
			selectorChanged(item) {			
				this.advertid = item;			
			},
			// changeOption(value){
			// 	if(value==2){
			// 		this.addForm.limitOption = 1;
			// 	}
			// },
			RedeemCode(value){
				api.ibs.exchenageCodeExportExcel(value.actid).then(response => {
					
					var relativePath = response;
					if (relativePath) {
						var url = api.ibs.getAPIBasePath() + "/pbs/order/download?path=" + encodeURIComponent(relativePath);
						this.$alert("Excel生成完成", "成功", {
						confirmButtonText: "下载",
						callback: action => {
							window.open(url);
						}
						});
					}
				}).catch(error => {
					// this.excelDownloading = false;
					this.$notify({
						title: "错误",
						message: error.message || "下载失败",
						type: "error"
					});
				});
				
			},
			handleCurrentChange(val) {
				this.page = val;
				this.campaignsFetch();
			},
			productsFetch:function(){
				api.cts.productsFetch(1).then((response) => {
					var list = response || [];
					this.products = list.map(item =>{
						return {label:item.title + '成本'+  "  ￥" + item.price/4, value:item.productid};
					});
					var firstItem = this.products[0];
					if(firstItem )
					{
						// this.stylesFetch(firstItem.value);
					}
				})
			},
			stylesFetch:function(productID){
				api.stylesFetch(productID).then(response => {
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
			// 下载二维码
			downloadQRImage:function(item){
				this.downloading = true;
				var url = item.codeurl 
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
			},
			//获取模板列表
			campaignsFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();

				var keyword2 = ''
				api.ibs.getShareAdvertList(1, 200, keyword2).then(response => {				
					var list = response.list || [];
					this.ShareAdvertList = list;
				}).catch(error => {
						console.log(error)				
				});


				api.ibs.campaignsFetch(this.page, this.type, this.keyword).then((response) => {
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						item.name = item.title;
						item.campaignID = item.actid;
						item.guidelines = item.description || "";
						item.productID = item.productid;
						item.presentOption = item.acttype;
						item.workID = item.cartid;
					}
					that.templates = list;
					that.total = response.total;
					this.listLoading = false;
					NProgress.done();
					//先预取，提高成功率
					var firstItem = list[0];
					if(!this.generateReady && firstItem){
						this.generateReady = true;
						this.adImageGenerate(firstItem.campaignID, firstItem.title, firstItem.guidelines, true);
					}
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
				this.campaignsFetch();
			},
			viewUsers:function(item){
				var templateID = item.templateID;
				if(templateID) {
					this.$router.push({ name: 'TemplateUsers', query: { id: templateID}});
				}
			},
			viewWorks:function(item){
				var campaignID = item.campaignID;
				if(campaignID) {
					this.$router.push({ name: 'CampaignWorks', query: { id:campaignID, page:1}});
				}
			},
			viewStuffs:function(item){
				var campaignID = item.campaignID;
				if(campaignID) {
					this.$router.push({ name: 'CampaignStaffs', query: { id: campaignID}});
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
				// if(item.autoaddress==1){
				// 	this.switchs = true;
				// }else{
				// 	this.switchs = false;
				// };
				// if (item.productID === 2801) {
				// 	this.redCodeDesc = '广告主二维码(红包实体背面图)'
				// } else {
				// 	this.redCodeDesc = '广告主二维码'
				// }
				// var limitOption = item.limitHumanCount > 0 ? 1 : 0;
				
				if(this.type==0){
					var shareCountX2 = item.applylimitcount > 0 ? 0 : 1;
				}				
				var form = Object.assign({}, item);
				// form.limitOption = limitOption;
				form.shareCountX2 = shareCountX2;
				// form.zanType = form.zantype
				this.addForm = form;
				//二维码
				this.addForm.defaultimg = this.addForm.qrcode;
				this.addForm.titletext = this.addForm.qrcodedesc;
				// before广告图配文
				// this.addForm.companyname = this.addForm.companyname;
				
				//赠送
//				if(this.addForm.applylimitcount>0){
//					this.addForm.shareCountX2 = 0
//					
//				}else {
//					this.addForm.shareCountX2 = 1
//				}			
				//广告设置		
				if(this.addForm.advertid){
					this.selectvalue = this.addForm.advertid;
					this.advertid = this.addForm.advertid;			
				}else{
					this.selectvalue = '无广告';
					this.advertid = '无广告';
				};

				this.settingFormVisible = true;
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('停用模板并删除记录，确认删除模板？(不影响已报名的客户和订单)', '提示', {
					type: 'warning'
				}).then(() => {
					this.deleting = true;
					NProgress.start();
					api.removeTemplate(row.templateID).then(res =>{
						this.campaignsFetch();
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

				var name = '扫码领取精美DIY挂历用最爱的人的照片陪伴我一整年'
				var guidelines = '有一份礼物免费赠送给你。 \n只需要用手机上传你自己的照片，\n就可以获得精美台历/挂历一份。\n用自己的影像，演绎每一天的精彩，\n让你们的家庭故事，在2018继续幸福延续。'
				// 最少分享数
				// this.switchs = false;
				var shareMinCount = 18;
				var shareMinCount2 = 100;
				var hoursMinEffective = 24;
				// this.addFormActive = 0;limitOption:0, limitHumanCount:0,
				this.addFormVisible = true;
				var form = {name: name, productID:'', styleID:'',guidelines:guidelines, presentOption:this.type,shareCountX:1,shareCountX2:0,applylimitcount:shareMinCount2,shareCount:shareMinCount, zanType: 0};
				var firstProduct = this.products[0];
				form.productID = firstProduct ? firstProduct.value : "";
				var firstStyle = this.styles[0];
				form.styleID = firstStyle ? firstStyle.value : "";
				this.addForm = form;
			},
			
			//下一步
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
				//二维码判断
				if((!this.addForm.defaultimg && !this.addForm.titletext) || (this.addForm.defaultimg && this.addForm.titletext) ){
					
				}else{
					this.$notify({ title: '错误', message:"请填写二维码信息", type: 'error' });					
					return;
				}
				// 实物图判断
				// if((!this.addForm.qrcode && !this.addForm.qrcodeDesc) || (this.addForm.qrcode && this.addForm.qrcodeDesc) ){
					
				// }else{
				// 	this.$notify({ title: '错误', message:"请填写广告图描述", type: 'error' });					
				// 	return;
				// }
				var form = this.addForm;
//				var name = StringUtil.trim(this.addForm.name);
				if(!this.addForm.name) {
					this.$notify({ title: '错误', message:"请输入名称", type: 'error' });
					return;
				}

				// if(this.addFormActive < 1){
				// 	this.addFormActive += 1;
				// 	return;
				// }

				if(!form.guidelines){
					this.$notify({ title: '错误', message:"请填写活动详情", type: 'error' });
					return;
				}

				this.addSubmit();
			},
			//新增
			addSubmit: function () {
				var form = this.addForm;
				var name = StringUtil.trim(this.addForm.name);
				var guidelines = form.guidelines;
				var styleID = this.addForm.styleID;
				var params = {};
				// if(this.switchs){
				// 	params.autoaddress = 1;
				// }else{
				// 	params.autoaddress = 0;
				// };
				// if (this.addForm.companyname) {
				// 	params.companyname = this.addForm.companyname
				// }
				if(this.addForm.presentOption==2){
					if(this.addForm.limitHumanCount<=0){
						this.$notify({ title: '错误', message:"邀请数量不能为0!", type: 'error' });
						return;
					}
				}
				//二维码 
				if(this.addForm.defaultimg && this.addForm.titletext){
					
					params.qrcodeDesc = this.addForm.titletext;	
					params.qrcode = this.addForm.defaultimg;	
				}
				// if(this.addForm.qrcode && this.addForm.qrcodeDesc){
					
				// 	params.qrcodeDesc = this.addForm.qrcode;	
				// 	params.qrcode = this.addForm.qrcodeDesc;	
				// }
				params.title = name;
				params.productid = form.productID;
				// params.styleId = styleID;
				params.description = form.guidelines;
				params.acttype = form.presentOption;
				// params.freecount = form.limitOption == 1 ? form.limitHumanCount : 0;
				params.freecount  = 0;
					//广告配置
				if(this.advertid>0){
					params.advertid = this.advertid;
				};
				
				//是否为公开活动
				if(this.addForm.presentOption==0){
					params.zanType = form.zanType
					//赠送
					if(	this.addForm.shareCountX2 == 1){
						params.applylimitcount = 0;
					}else{					
						params.applylimitcount = form.applylimitcount;				
					};
				} else {
					this.addForm.hoursEffective = '';
				}
				if(	this.addForm.shareCountX == 0){
					params.extCount = 0;
				}else{
//					if(form.shareCount<18){
//						this.$notify({ title: '错误', message:"完成条件的分享数必须大于等于18个!", type: 'error' });
//						return;
//					}else{
						params.extCount = form.shareCount;
//					};					
				};
				this.addLoading = true;
				api.ibs.createCampaign(params).then(response =>{
					this.addFormVisible = false;
					this.addLoading = false;
					var message = "添加成功";
					this.$notify({ title: '成功', message: message, type: 'success' });
					var campaignID = response.actid;
					// 公开活动才生成广告图
					if(campaignID && params.acttype == 0){
						this.templates.push({campaignID:campaignID, name:name, guidelines:guidelines});
						// this.adImageGenerate(campaignID, name, guidelines, false);
						// downloading:false, push中keletest生成广告图
						// this.campaignQRCodeFetch(campaignID).then(response =>{
						// 	return this.imageFetch(response)
						// }).then(image =>{
						// 	QRCodeImage = image;
						// })
					}
					this.campaignsFetch();
				}).catch(error => {
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "添加失败", type: 'error' });
				});
			},
			
			//修改
			settingSubmitBtnClicked:function(){
				var form = this.addForm;
				var campaignID = form.campaignID;
				if(!form.name){
					this.$notify({ title: '错误', message:"请填写活动名称", type: 'error' });
					return;
				}

				if(!form.guidelines){
					this.$notify({ title: '错误', message:"请填写活动详情", type: 'error' });
					return;
				}

				var title = form.name;
				var guidelines = form.guidelines;
				var params = {};
				// if(this.switchs){
				// 	params.autoaddress = 1;
				// }else{
				// 	params.autoaddress = 0;
				// };
				params.activityid = campaignID;
				params.title = title;
				params.description = guidelines;
				params.freecount = 0;
				if (form.presentOption === 0) {
					params.zanType = form.zantype
				}
				if(form.applylimitcount){
					params.applylimitcount = form.shareCountX2 == 0 ? form.applylimitcount : 0;
				}
				// params.acttype = form.acttype;
				// params.extCount = form.extCount;
				// params.productid = form.productID;
				// params.styleId = '123';
				
				//广告配置
				if(this.advertid>0){
					params.advertid = this.advertid;
				};

				this.addLoading = true;
				api.ibs.modifyCampaign(params).then(response =>{
					this.campaignsFetch();
					this.settingFormVisible = false;
					this.addLoading = false;
					this.$notify({ title: '成功', message: "修改成功", type: 'success' });
					// leletest生成广告图
					// this.adImageGenerate(campaignID, title, guidelines, true);
				}).catch(error => {
					this.addLoading = false;
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
				api.templateApplicationPendingSetting(templateID, QRCodeURL, content).then(response =>{
					this.campaignsFetch();
					this.settingFormVisible = false;
					this.setting = false;
					this.$notify({ title: '成功', message: "修改成功", type: 'success' });
				}).catch(error => {
					this.setting = false;
					this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
				});
			},
			remarkBtnClicked:function(item){
				this.remarkForm = {actid:item.actid, remark:''};
				this.remarkFormVisible = true;
			},
			remarkSubmit:function(){
				this.addLoading = true;
				api.ibs.campaignRemarkModify(this.remarkForm.actid, this.remarkForm.remark).then(response =>{
					this.campaignsFetch();
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
			this.pageSize = api.CountPerPage;
			this.productsFetch();
			this.campaignsFetch();
			this.isDev = process.env.NODE_ENV === 'development'		//开发
			// console.log(process.env.NODE_ENV)
			
			this.isProduction = process.env.NODE_ENV === 'production' //正式
			// console.log(this.isProduction)
			
		}
	}

</script>

<style scoped>

.Workbenchimg{
	width:120px;
	height:120px;
	margin-left:10px;
}
.workbenchimgBox{
    position: absolute;
    right: 10px;
    top: -73px;
	z-index: 2;
}

.inputtext{
	width: 80%;
	height: 120px;
	border: 1px solid #6666;
	border-radius: 5px;
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


.image-uploading-icon {
  position: absolute;
  top: 35px;
  left: 45px;
}
.image-uploader {
  position: relative;;
 
}


 .avatar-uploader .el-upload {
    border: 1px dashed #666;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
	border: 1px dashed #666;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
	border: 1px solid #666;
  }

.QRimage{
	display: block;
	width: 145px;
	height: 145px;
}
/*查看活动链接*/
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
.QR-text{
	width: 145px;
	text-align: center;
}
</style>
