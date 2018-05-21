<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar">
				<el-form>
					<el-form-item>
						<span><b>业务目标</b>：以回馈客户的名义销售产品，客户购买后分享集赞即可额外获赠一份所购买的产品，以此达到广告传播效果（可自定义价格，相比赠送型广告成本更低，适合有较强销售能力和客户资源的广告主）；</br></span>
						<span><b>如何使用</b>：创建活动，设置好活动门槛（线下门店可设置到店自提引流），确定好产品价格（该价格决定广告成本支出）后，扫码生成的活动二维码，将打开的活动页面分享到客户群中；</span>
					</el-form-item>
					
					
				</el-form>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">
				
					<el-form-item>
						<el-button type="primary" @click="handleAdd">新增分销DM</el-button>
						
					</el-form-item>
					
					<div style="float:right; cursor: pointer; margin-top:20px; " @click="Doubt()"><img style="width: 15px;float: left;  margin-top: 2px;" src="http://pic.bbyiya.com/ibs/c5txn_1512014078231"/><span >如何达到最大广告效果</span></div>					
					<div style="float:right;  margin:10px 15px 10px 10px; font-size：13px;">
						<p style="margin:0px">分享完成率：购买中完成点赞目标的人数/总购买人数</p>
						<p style="margin:0px">销售转化率：购买的人数/看到活动的人数</p>
					</div>
				</el-form>
			</el-col>
		</el-row>


		<!-- 弹框 -->
		<el-dialog title="业务提示" :visible.sync="dialogTableVisible">
			
			
			<p class="redp">“活动浏览量”指标越高，广告效果越好</p>
			<p class="redp">本业务内，影响活动浏览量的2个关键点</p>
			<p class="redp">1 查看“销售转化率”：</p>
			<p>前提：产品价格越低，销售转化率越高，但一定预算下能触达的用户就越少</p>
			<p>判断标准：不追求过高“销售转化率”只要愿意付费购买的用户，其传播后，能使得该活动可持续。这样的参与率即可满足需求。</p>	
			<p>做法：根据“销售转化率”指标，转化率过高，可以适当提高产品销售价格，这样一来同样预算下，更多的用户覆盖</p>
			<br/>
			<p class="redp">2 查看“分享完成率”</p>
			<p>前提：活动设置的集赞门槛越高，能完成集赞的用户就越少。集赞数量和分享率的乘积越大，活动传播效果越好</p>
			<p>判断标准：适当的集赞门槛设置，使得集赞数量和“分享完成率”的乘积最大化</p>   
			<p>做法：观察“用户分享率”指标，分享率过高，可适当提高点赞门槛，追求乘积最大。</p>

		</el-dialog>







		<!--列表-->
		<el-table :data="templates" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="title" label="活动名称" ></el-table-column>

			<el-table-column  label="模式" >
				<template scope="scope">
					<p v-if="scope.row.type==1">广告模式</p>
					<p v-else>分销模式</p>	
			    </template>						
			</el-table-column>		

			<el-table-column label="已销售" >
				<template scope="scope">
					<p type="text">   {{scope.row.sellercount}}  </p> 
			    </template>		
			</el-table-column>

			<el-table-column label="活动浏览量" >
				<template scope="scope">
					<p type="text">  {{(scope.row.browsecount || 0)}}  </p>
			    </template>
			</el-table-column>

			<!--<el-table-column label="广告浏览量" >
				<template scope="scope">
					<p type="text">  {{(scope.row.advertbrowsecount || 0) }}  </p>
			    </template>
			</el-table-column>	-->

			<el-table-column label="分享完成率" >
				<template scope="scope">
					<p type="text">  {{(scope.row.shareratio || 0) }}%  </p>
			    </template>
			</el-table-column>

			<el-table-column label="销售转化率" >
				<template scope="scope">
					<p type="text">  {{(scope.row.sellratio || 0) }}%  </p>
			    </template>
			</el-table-column>	


			<el-table-column prop="createtimestr" label="创建时间" width="120"> </el-table-column>

			<el-table-column label="操作" width="250" fixed="right">
				<template scope="scope">		
					<el-button size="small" @click="viewWorks(scope.row)">销售进展</el-button>

					<el-popover trigger="click" placement="bottom">
						<div v-if="scope.row.linkurl">
							<img :src="scope.row.linkurl" class="QRimage">								
							<!-- <p style="text-align: center">二维码将页面分享给客户</p>	 -->
							<el-button type="text"  style="margin-left:15px" class="QR-text" :loading="downloading" @click="Downcode(scope.row)">&nbsp;下载二维码将页面<br/>分享给客户</el-button>												

						</div>
						<p style="text-align: center" v-else>暂无二维码</p>
						<el-button size="small"  slot="reference"   > 业务链接 </el-button>
					</el-popover> 							
					<el-button size="small" @click="baseEditBtnTapped(scope.$index, scope.row)">活动设置</el-button>													
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
			<el-steps :active="addFormActive" finish-status="success" style="margin-bottom:30px;">
				<el-step title="业务设置"></el-step>
				<el-step title="重要信息"></el-step>
			</el-steps>

			<template v-if="addFormActive == 0">
				<el-form :model="addForm" label-width="120px" label-position="left" :rules="addFormRules" ref="addForm0">					
					<el-form-item label="完成条件*"  >
					    <el-radio-group v-model="label"  @change="selslabel()">
					   <!--   	<el-radio :label="0" >分销模式（产品销售盈利）</el-radio><br/>-->
						
							<el-radio :label="1"  >
								需要集赞
								<el-input type="number" v-on:input="justint()" v-model="praisecount" style="width: 45px;"></el-input>个
									<!--<span>人另外再赠送1本。<br/>（ps：完成作品后3小时内未完成集赞数不另外送！）</span>-->
							</el-radio>

					    </el-radio-group>
					</el-form-item>
				</el-form>

				<el-form :model="addForm" label-width="120px" label-position="left" :rules="addFormRules" ref="addForm0">					
					<el-form-item label="活动奖品*" >

						<el-checkbox-group v-model="productlist">
							<div style="width:600px">
								<div v-for="(item,index) in products"   style="width:320px; float:left;">  <!--  style="width:300px; " -->
									<el-checkbox :label="item.value" style="width:95%;" >
										{{item.label}} 									
										 <el-form-item label="￥" :label-width="formLabelWidth2" style="float:right;" >  
												<el-input   type="number" v-on:input="justint(item.Price,index)" v-model="item.Price" style="width:75px;"></el-input>
										
										</el-form-item>									 						
									</el-checkbox>	
								</div>
							</div>

							<ul v-if="label==0">
								<li v-for="item in products2" >{{item.Price}}~{{item.Price*2}}</li>
							</ul>
							<ul v-else-if="label==1">
								<li v-for="item in products2" >0~{{item.Price*2}}</li>
							</ul>
					
						</el-checkbox-group>						
					</el-form-item>

					<el-form-item label="活动标题*"  >
						<!-- <el-input  :maxlength="24" placeholder="微信分享和活动页的大标题"></el-input> -->
						<div class="inpbox" :class="{Highlight:actives}">						
							<input type="text" @blur="blurText(1)" @focus="focusText(1)" v-model="addForm.title" :maxlength="24" class="inpText"  placeholder="最多24个字" />
							<!-- <span style="float:right; margin-right:15px;">{{addForm.title ||0}}/24</span> -->
						</div>						
					</el-form-item>
					<el-form-item label="活动说明*"   >
						<!-- <textarea  :rows="7" maxlength="130" class="inputtext" placeholder="活动规则和说明"></textarea> -->
						<div class="inpbox" :class="{Highlight:actives2}">
							<!-- <textarea  :rows="7" maxlength="130" class="inputtext" placeholder="活动规则和说明"></textarea>						 -->
							<textarea @blur="blurText(2)" @focus="focusText(2)" :maxlength="150" class="inputtext" v-model="addForm.description"  placeholder="活动规则和说明，最多150个字" /></textarea>
							<!-- <span style="float:right; margin-right:10px; margin-top:65px;">{{0}}/6</span> -->
						</div>
					</el-form-item>


					<el-form-item label="用户作品分享文案"  >				
							<el-input :maxlength="24" class="inpText" v-model="addForm.titleshare" placeholder="用户分享自己的作品时，分享出去的微信卡片大标题，最多24个字"></el-input>					
							<el-input :maxlength="28" class="inpText" v-model="addForm.titleminshare" style="margin-top:10px;" placeholder="用户分享自己的作品时，分享出去的微信卡片小字内容，最多28个字"></el-input>																				
					</el-form-item>
					
					
					<el-form-item label="公众号二维码（选填）" >

						<el-upload class="image-uploader"
							action="https://up.qbox.me"
							:show-file-list="false"
							:data="coverUploadForm2"
							:on-success="coverUploadSuccess2"
							:before-upload="coverBeforeUpload2">
							<img v-if="addForm.defaultimg2" :src="addForm.defaultimg2" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							<i v-if="uploading2" class="el-icon-loading image-uploading-icon"></i>			
						</el-upload>
						
						<el-input  class="inpText" style="margin-top: 10px;" v-model="addForm.titletext" placeholder="输入二维码说明，例如：关注公众号，参与更多优惠活动"></el-input>					

					</el-form-item>


				</el-form>

			</template>

			<!-- 下一步 -->
			<template v-if="addFormActive == 1">
				<el-form :model="addForm" label-width="120px" label-position="left" :rules="addFormRules" ref="addForm1">
					
					<el-form-item label="企业名称*" prop="name">
						<!-- <el-input :maxlength="6" placeholder="主办方名称"></el-input> -->

						<div class="inpbox" :class="{Highlight:actives3}">						
							<input type="text" @blur="blurText(3)" @focus="focusText(3)" :maxlength="6" v-model="addForm.companyname" class="inpText"  placeholder="主办方名称，最多6个字" />
							<!-- <span style="float:right; margin-right:15px;">0/6</span> -->
						</div>

					</el-form-item>

					<el-form-item label="企业LOGO*" >

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

					</el-form-item>

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



					<el-form-item label="翻页效果*" >
						<el-select v-model="selectvalue2" placeholder="请选择"  @change="selectorEffect(selectvalue2)">
							<el-option
							v-for="item in ProductShowTempList"							
							:key="item.tempid"
							:label="item.tempname"
							:value="item.tempid">
							</el-option>
						</el-select>
					</el-form-item>


					<el-form-item label="地址选项*" >
						<el-select v-model="selectvalue3" placeholder="请选择"  @change="selectorEffect(selectvalue2)">
							<el-option
							v-for="item in addresstypelist"							
							:label="item.name"
							:value="item.addresstype">
							</el-option>
						</el-select>
					</el-form-item>



					<el-form-item label="企业地址*"   >
						<!--收货地址新页面-->						
							<el-form :model="addForm" style="margin-bottom:15px;">
								<div style="margin-bottom:10px;">
									<el-form-item label="收货人姓名" :label-width="formLabelWidth"  :rules="{ required: true, message: '姓名不能为空', trigger: 'blur'}">
										<el-input v-model="addForm.reciver" auto-complete="off" style="width: 250px; " ></el-input>
									</el-form-item>
								</div>
								<div>
									<el-form-item label="联系方式" :label-width="formLabelWidth" :rules="{ required: true, message: '联系方式不能为空', trigger: 'blur'}">
										<el-input v-model="addForm.mobilephone" auto-complete="off" style="width: 250px;" :maxlength="11" @blur="BLUR()"></el-input>
									</el-form-item>
								</div>								
							</el-form>
										
							<AddressSelector    @change="addressSelectorChanged"/> 
							<el-input v-model="addForm.streetdetails" placeholder="详细地址" style="width: 380px;margin-top:10px;"></el-input>													
					</el-form-item>					
				</el-form>						
			</template>

			<div slot="footer" class="dialog-footer">
				<el-button v-if="addFormActive == 0" type="text" @click.native="addFormVisible = false">取消</el-button>
				<el-button v-if="addFormActive > 0" type="text" @click.native="addFormActive--">上一步</el-button>
				<el-button type="primary" @click.native="addSubmitBtnClicked" :loading="addLoading">{{addFormActive < 1 ? '下一步' : '确定'}}</el-button>
			</div>
		</el-dialog>





		<!-- 编辑活动 -->
		<el-dialog title="编辑活动" :visible.sync="settingFormVisible" :close-on-click-modal="false" v-loading="loading">
			


	

			<el-form :model="addForm" label-width="120px" label-position="left" :rules="addFormRules" ref="addForm0">

				<el-form-item label="业务形式*" v-if="label==1" >
					广告模式（广告传播）需分享集赞
					<el-input v-model="praisecount" style="width: 45px;"></el-input>
					<span>人</span>
				</el-form-item>



				<el-form-item label="活动奖品*">
					<el-checkbox-group v-model="productslist" v-if="ifproducts">

						<div style="width:600px" >
							<div v-for="item in Editproducts"   style="width:320px; float:left;"> 
								<el-checkbox :label="item.value" style="width:95%;" >
									{{item.label}} 									
									<el-form-item label="￥" :label-width="formLabelWidth2" style="float:right;" >  
										<el-input type="number" v-model="item.Price" style="width:75px;"></el-input>
									</el-form-item>									 						
								</el-checkbox>	
							</div>
						</div>

						<!-- <ul>
							<li v-for="item in products2" >{{item.Price}}~{{item.Price*2}}</li>
						</ul> -->

						<ul v-if="addForm.type==0">
							<li v-for="item in products2" >{{item.Price}}~{{item.Price*2}}</li>
						</ul>

						<ul v-else-if="addForm.type==1">
							<li v-for="item in products2" >0~{{item.Price}}</li>
						</ul>




					</el-checkbox-group>						
				</el-form-item>

				<el-form-item label="活动标题*" >
					<div class="inpbox" :class="{Highlight:actives}">						
						<input type="text" @blur="blurText(1)" @focus="focusText(1)"  v-model="addForm.title" maxlength="24" class="inpText"  placeholder="最多24个字" />
						<!-- <span style="float:right; margin-right:15px;">{{titlesize ||0}}/24</span> -->
					</div>						
				</el-form-item>
				
				<el-form-item label="活动说明*" >
					<div class="inpbox" :class="{Highlight:actives2}">											 
						<textarea @blur="blurText(2)" @focus="focusText(2)" :maxlength="150" class="inputtext" v-model="addForm.description"  placeholder="活动规则和说明，最多150个字" /></textarea>
						<!-- <span style="float:right; margin-right:10px; margin-top:65px;">{{0}}/6</span> -->
					</div>
				</el-form-item>

				
				<el-form-item label="用户作品分享文案"  >				
						<el-input :maxlength="24" class="inpText" v-model="addForm.titleshare" placeholder="用户分享自己的作品时，分享出去的微信卡片大标题，最多24个字"></el-input>					
						<el-input :maxlength="28" class="inpText" v-model="addForm.titleminshare" style="margin-top:10px;" placeholder="用户分享自己的作品时，分享出去的微信卡片小字内容，最多28个字"></el-input>																				
				</el-form-item>
				
				
				<el-form-item label="公众号二维码（选填）" >

					<el-upload class="image-uploader"
						action="https://up.qbox.me"
						:show-file-list="false"
						:data="coverUploadForm2"
						:on-success="coverUploadSuccess2"
						:before-upload="coverBeforeUpload2">
						<img v-if="addForm.defaultimg2" :src="addForm.defaultimg2" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						<i v-if="uploading2" class="el-icon-loading image-uploading-icon"></i>			
					</el-upload>
					
					<el-input  class="inpText" style="margin-top: 10px;" v-model="addForm.titletext" placeholder="输入二维码说明，例如：关注公众号，参与更多优惠活动"></el-input>					
				</el-form-item>


				<el-form-item label="企业名称*" >
			
					<div class="inpbox" :class="{Highlight:actives3}">						
						<input type="text" @blur="blurText(3)" @focus="focusText(3)" maxlength="6" v-model="addForm.companyname" class="inpText"  placeholder="主办方名称，最多6个字" />
						<!-- <span style="float:right; margin-right:15px;">0/6</span> -->
					</div>

				</el-form-item>

				<el-form-item label="企业LOGO*">
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
				</el-form-item>

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


				<el-form-item label="翻页效果*" >
					<el-select v-model="selectvalue2" placeholder="请选择"  @change="selectorEffect(selectvalue2)">
						<el-option
						v-for="item in ProductShowTempList"							
						:key="item.tempid"
						:label="item.tempname"
						:value="item.tempid">
						</el-option>
					</el-select>
				</el-form-item>


				<el-form-item label="地址选项*" >
					<el-select v-model="selectvalue3" placeholder="请选择"  @change="selectorEffect(selectvalue2)">
						<el-option
						v-for="item in addresstypelist"							
						:label="item.name"
						:value="item.addresstype">
						</el-option>
					</el-select>
				</el-form-item>


				<el-form-item label="企业地址*"   >
				<!--收货地址新页面-->						
					<el-form :model="addForm" style="margin-bottom:15px;">
						<div style="margin-bottom:10px;">
							<el-form-item label="收货人姓名" :label-width="formLabelWidth"  :rules="{ required: true, message: '姓名不能为空', trigger: 'blur'}">
								<el-input v-model="addForm.reciver" auto-complete="off" style="width: 250px; " ></el-input>
							</el-form-item>
						</div>
						<div>
							<el-form-item label="联系方式" :label-width="formLabelWidth" :rules="{ required: true, message: '联系方式不能为空', trigger: 'blur'}">
								<el-input v-model="addForm.mobilephone" auto-complete="off" style="width: 250px;" :maxlength="11"  @blur="BLUR()"></el-input>
							</el-form-item> 
						</div>								
					</el-form>
						
					<AddressSelector v-if="addressisok" :province="addForm.province" :city="addForm.city" :district="addForm.area"  @change="addressSelectorChanged"/> 
					
					<el-input v-model="addForm.streetdetails" placeholder="详细地址" style="width: 380px;margin-top:10px;"></el-input>													
				</el-form-item>					
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button  @click.native="settingFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="settingSubmitBtnClicked" :loading="addLoading">确定</el-button>
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
	import AddressSelector from '../../../components/AddressSelector';
	



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
				type:10,
				keyword:'',
				downloading:false,
				canvasWidth:0,
				canvasHeight:0,
				generateReady:false,

				addFormVisible: false,//新增界面是否显示
				addFormActive:0,
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

				switchs:false,
				// ____________________________
				actives0:false,
				actives:false,
				actives2:false,
				actives3:false,
				label:1,

				products2:[],
				
				imageUrl:'',
				ispreview:'',
				
				productlist:[],//产品多选
				productlist2:[],
				titlesize:'',
				ReceivingAddress:true,
				formLabelWidth: '92px',
				formLabelWidth2: '12px',
				detailedAddwidth:'100px',
				uploadForm:'',
			
				coverUploadForm: {},
				coverUploadForm2: {},
				
				uploading:false,
				uploading2:false,
				
				TelTrue:false,
				EditaddForm:{},//编辑活动数据
				addressisok:false,
				productslist:[],
				Editproducts:[],
				ifproducts:false,
				gactid:'',
				loading:false,
				ShareAdvertList:[],
				selectvalue:"无广告",
				advertid:'',
				count:0,
				oneclick:false,
				srcurl:'',
				dialogTableVisible:false,
				praisecount:12,
				ProductShowTempList:'',

				selectvalue2:'',
				tempid:'',
				titleminshare:'',
				titleshare:'',
				titletext:'',	//提示文字
				addresstypelist:[{name:'直邮到家+门店自提',addresstype:0},{name:'仅门店自提',addresstype:1},{name:'仅直邮到家',addresstype:2}],
				selectvalue3:0,
			}
		},
		components: {
			AddressSelector
		},

		methods: {

      justint(num,index){
				if(this.praisecount < 0){
				  this.praisecount = 0
				}
				if(num < 0){
          this.products[index].Price = 0
				}
      },
			//选择模式
			selslabel(){
				
				
				api.cts.productsFetch().then((response) => {				
					var list = response || [];
					if(this.label==1){

						this.products = list.map(item =>{
							return {label:item.title , value:item.productid,Price:(item.price/2)/2};
							// + "  ￥" + item.price
						});


					}else{
						this.products = list.map(item =>{
							return {label:item.title , value:item.productid,Price:item.price/2};
							// + "  ￥" + item.price
						});
					}

					this.products2 = list.map(item =>{
						return {label:item.title , value:item.productid,Price:item.price/2};
						// + "  ￥" + item.price
					});

				})
				
				
			},

		

			Doubt(){
				this.dialogTableVisible = true;
			},
			
			viewWorks(value){
				
				this.$router.push({name:'SalesStatistics',query:{gactid:value.gactid}})

			},

			coverBeforeUpload(file) {
				this.uploading = true;
				var key = api.general.qiniuUploadKeyGenerate();
				return api.general.uploadTokenFetch().then(response => {
					var token = response.upToken;
					this.coverUploadForm = { key: key, token: token };
				});
			},
			
		
			
			coverUploadSuccess(response, file, fileList) {
				if (response.key) {
					var imageURL = "http://pic.bbyiya.com/" + response.key;
					var form = this.addForm;
					form.defaultimg = imageURL;
					this.addForm = form;
					this.uploading = false;
				}
			},
			
			coverBeforeUpload2(file) {
				this.uploading2 = true;
				var key = api.general.qiniuUploadKeyGenerate();
				return api.general.uploadTokenFetch().then(response => {
					var token = response.upToken;
					this.coverUploadForm2 = { key: key, token: token };
				});
			},
			
			//二维码
			coverUploadSuccess2(response, file, fileList) {
				if (response.key) {
					var imageURL = "http://pic.bbyiya.com/" + response.key;
					var form = this.addForm;
					form.defaultimg2 = imageURL;
					this.addForm = form;
					this.uploading2 = false;
				}
			},

			BLUR(){
				if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.addForm.mobilephone))){ 
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

			blurText(value){
				if(value == 0){
					this.actives0 = false;					
				}else if(value==1){
					this.actives = false;
					this.titlesize=this.addForm.title.length
				}else if(value==2){
					this.actives2 = false;
				}else if(value==3){
					this.actives3 = false;
				}
			},
			focusText(value){
				if(value==0){
					this.actives0 = true;
				}else if(value==1){
					this.actives = true;
				}else if(value==2){
					this.actives2 = true;
				}else if(value==3){
					this.actives3 = true;
				}
			},

		addressSelectorChanged:function(province, city, district){
			this.addForm.province = province
			this.addForm.city = city
			this.addForm.area = district
			

        },	

			//下载二维码
		Downcode(item){		

			var url = item.linkurl

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
			}));




			// this.downloading = true;
			// api.ibs.downWorkForGroupRQcode(item.gactid).then(relativePath =>{
			// 	this.downloading = false;
			// 	if (relativePath){
			// 		var url = api.ibs.getAPIBasePath() + "/pbs/order/download?path=" + encodeURIComponent(relativePath);
			// 		this.$alert('下载二维码', '成功', {
			// 			confirmButtonText: '下载',
			// 			callback: action => {
			// 				if(action == "confirm"){
			// 					window.open(url);
			// 				}
			// 			}
			// 		});
			// 	}
			// }).catch(error =>{
			// 	this.downloading = false;
			// })
		},




		handleCurrentChange(val) {
			this.page = val;
			this.campaignsFetch();
		},

			


		//新增 显示产品列表
		productsFetch:function(){
			
			api.cts.productsFetch().then((response) => {
				
				var list = response || [];
				this.products = list.map(item =>{
					return {label:item.title , value:item.productid,Price:item.price/2};
					// + "  ￥" + item.price
				});
				this.products2 = list.map(item =>{
					return {label:item.title , value:item.productid,Price:item.price/2};
					// + "  ￥" + item.price
				});
				// this.$store.commit('setData', this.products2)
			})

			//广告列表
			var keyword2 = ''
			api.ibs.getShareAdvertList(1, 200, keyword2).then(response => {				
				var list = response.list || [];
				this.ShareAdvertList = list;
				// console.log(this.ShareAdvertList)
			}).catch(error => {
					console.log(error)				
			});
		},

			//获取模板列表
		campaignsFetch:function(){
			
			var that = this;
			this.listLoading = true;
			NProgress.start();

			api.ibs.getGroupActivityList(this.page, this.type, this.keyword).then((response) => {
				
				var list = response.list || [];
				
				that.templates = list;
				that.total = response.total;
				this.listLoading = false;
				NProgress.done();

			}).catch(error =>{
				that.listLoading = false;
				NProgress.done();
			});

			
			//翻翻效果
			api.cts.getProductShowTempList(1,99).then((item)=>{
				this.ProductShowTempList = item.list
				item.list.map((item)=>{
					if(item.tempname.indexOf('通用')!=-1){
						that.selectvalue2 = item.tempid
					}
				})
			});



		},

		//修改活动
		baseEditBtnTapped: function (index, item) {
			this.loading = true;
			var that = this;
			this.addressisok = false;
			this.ifproducts = false;
			var limitOption = item.limitHumanCount > 0 ? 1 : 0;
			var form = Object.assign({}, item);
			
			form.limitOption = limitOption;
			this.addForm = form;

			this.label = this.addForm.type;		//模式

			this.praisecount = this.addForm.praisecount

			// console.log(this.addForm)
			this.addForm.defaultimg = this.addForm.logo;
			
			//二维码
			this.addForm.defaultimg2 = this.addForm.qrcode;
			this.addForm.titletext = this.addForm.qrcodedesc
			
			
			//广告设置			
			if(this.addForm.advertid){
				this.selectvalue = this.addForm.advertid 
				this.advertid = this.addForm.advertid			
			}else{
				this.selectvalue = '无广告'
				this.advertid = '无广告'
			}

			//翻页效果配置
			if(this.addForm.tempid){
				this.selectvalue2 = this.addForm.tempid 
				this.tempid = this.addForm.tempid 
			}
			//地址选项
			this.selectvalue3 = this.addForm.addresstype;

			that.productslist = [];
			let products = [];
			that.settingFormVisible = true;

			this.gactid = item.gactid
			var getisok = false
			api.cts.productsFetch().then((response) => {				
				var list = response || [];
				this.Editproducts = list.map(item =>{
					return {label:item.title , value:item.productid,Price:item.price/2};
				});
				
			}).then((response)=>{

				//广告列表
				var keyword2 = ''
				api.ibs.getShareAdvertList(1, 200, keyword2).then(response => {					
					var list = response.list || [];
					that.ShareAdvertList = list;
				})
				
				api.ibs.getGroupActivityByGactid(item.gactid).then((respsonse) => {		
					that.EditaddForm.products =	respsonse.products;		
					products = respsonse.products
					// console.log(respsonse)
					respsonse.products.map((item2) =>{			//请求来的数据
						that.productslist.push(item2.productid)	//选中的 产品
						that.Editproducts.map((item,index)=>{	//之前未被修改的数据
							if(item2.productid==item.value){									
								that.Editproducts[index].Price = item2.price																	
							}
						});	
					});			
					
					return true

				}).then((respsonse)=>{
					that.ifproducts = respsonse;
					this.loading = false;
				}).catch(error => {			
					this.$notify({ title: '错误', message: error.message || "数据请求错误！", type: 'error' });
				});	
			});

				
			
			var t = setTimeout(function(){
				that.addressisok = true;
				clearTimeout(t);
			},200)			
			
			
		},

		//确定编辑活动
		settingSubmitBtnClicked:function(){
			this.addSubmitBtnClicked()
		},			



		//配置广告的id
		selectorChanged(item) {			
			this.advertid = item;		
		},
		//翻页效果
		selectorEffect(item){
			this.tempid = item;
		},




		
		//显示新增界面
		handleAdd: function () {
				
			this.selectvalue = '无广告';	
			this.addFormVisible = true;
		
			this.addFormActive = 0;		
			this.gactid = '';
			this.addForm =  {};
		},
		//新增分销下一步
		addSubmitBtnClicked:function(){
			// this.oneclick = true;
			// var t = setTimeout(function(){
			// 	this.oneclick = false;
			// 	clearTimeout(t)
			// },1000);
			

			var that = this
			var isok = true;
			this.productlist2=[]
			
			if(this.label==1){
				if(this.praisecount<5){
					that.$notify({ title: '错误', message:"集赞目标数量,不可小于5！", type: 'error' });
					return;
				}
			}
			
			// 判断价格

			if(this.gactid){
				if(this.productslist.length<=0){
					that.$notify({ title: '错误', message:"请选择产品！", type: 'error' });
					return;
				};

				// 判断价格
			
					this.Editproducts.map((item)=>{
						that.productslist.map((item3)=>{
							if(item.value==item3){
								that.products2.map((item2)=>{
									if(item3==item2.value){
										//是否为广告分销
										if(this.addForm.type==1){	
										
											if(item.Price>item2.Price*2 || item.Price<0){
												that.$notify({ title: '错误', message:"不在价格范围内！", type: 'error' });
												isok = false;
												return;										
											}else{									
												that.productlist2.push({productid:item3,price:item.Price})
											};
										}else{
											
											if(item.Price<item2.Price || item.Price>item2.Price*2){
												that.$notify({ title: '错误', message:"不在价格范围内！", type: 'error' });
												isok = false;
												return;										
											}else{									
												that.productlist2.push({productid:item3,price:item.Price})
											};
										}
									};
								});	
							};	
						});					
					});
				

			}else {

				if(this.productlist.length<=0){
					that.$notify({ title: '错误', message:"请选择产品！", type: 'error' });
					return;
				};

				
				this.products.map((item)=>{				//可以改变的价格
					that.productlist.map((item3)=>{		//选择的款式
						if(item.value==item3){
							that.products2.map((item2)=>{	//未改变的价格
								if(item3==item2.value){
									//判断是否为分销模式
									if(this.label==1){
											console.log(item2.Price)
										if(item.Price<0 || item.Price>item2.Price*2){
											that.$notify({ title: '错误', message:"不在价格范围内！", type: 'error' });
											isok = false;
											return;										
										}else{									
											that.productlist2.push({productid:item3,price:item.Price})
										};
									}else{
										if(item.Price<item2.Price || item.Price>item2.Price*2){
											that.$notify({ title: '错误', message:"不在价格范围内！", type: 'error' });
											isok = false;
											return;										
										}else{									
											that.productlist2.push({productid:item3,price:item.Price})
										};
									}	
								};
							});	
						}	
					});					
				});
				
			};
			
			//二维码判断
			if((!this.addForm.defaultimg2 && !this.addForm.titletext) || (this.addForm.defaultimg2 && this.addForm.titletext) ){
				
			}else{
				this.$notify({ title: '错误', message:"请填写二维码信息", type: 'error' });					
				return;
			}
			
			
			
			if(isok){
				if(!this.addForm.title){
					this.$notify({ title: '错误', message:"请填写活动标题", type: 'error' });					
					return;
				}
				if(!this.addForm.description){
					this.$notify({ title: '错误', message:"请填写活动说明", type: 'error' });
					return;
				}
				if(this.addFormActive < 1){
					this.addFormActive += 1;
					return;
				}										
				this.addSubmit(this.gactid);
			}

			
		},
		//提交新增
		addSubmit: function (value) {
			
		
			
			
			// this.advertid
			// api.ibs.setGActsShareAdvert(this.advertid).then((response)=>{
			// });		

			if(!this.addForm.companyname){
				this.$notify({ title: '错误', message:"请输入企业名称", type: 'error' });
				return;
			};
			if(!this.addForm.defaultimg){
				this.$notify({ title: '错误', message:"请上传企业LOGO", type: 'error' });
				return;
			};
			if(!this.addForm.reciver){
				this.$notify({ title: '错误', message:"请输入收货人", type: 'error' });
				return;
			};

			if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.addForm.mobilephone))){ 
				this.$notify.error({
					title: '输入有误！',
					message: '手机号码输入有误'
				});	
				this.TelTrue = false
				return false; 
			}else{
				this.TelTrue = true
			}

			if(!this.addForm.mobilephone || this.TelTrue==false){
				this.$notify({ title: '错误', message:"请输入正确的电话号码", type: 'error' });
				return;
			};
			if(!this.addForm.province || !this.addForm.city || !this.addForm.area){
				this.$notify({ title: '错误', message:"请选择收货地址", type: 'error' });
				return;
			}
			if(!this.addForm.streetdetails){
				this.$notify({ title: '错误', message:"请填写详细地址", type: 'error' });
				return;
			}			
			
			var activityJson = {};
			if(value){
				activityJson.gactid = value ? value:'';
			};

			//广告配置
			if(this.advertid>0){
				activityJson.advertid = this.advertid;
			};
			//翻页效果
			if(this.tempid>0){
				activityJson.tempid = this.tempid;
			};
			//文案
			if(this.addForm.titleminshare){
				activityJson.titleminshare = this.addForm.titleminshare;
			};
			if(this.addForm.titleminshare){
				activityJson.titleshare = this.addForm.titleshare;
			};	

			//分享数量
			if(this.label==1){
				activityJson.praisecount = this.praisecount;
			};

			//地址选择
			activityJson.addresstype = this.selectvalue3;


			activityJson.type = this.label;
					
			activityJson.title = this.addForm.title;
			activityJson.description = this.addForm.description;
			activityJson.companyname = this.addForm.companyname;
			activityJson.logo = this.addForm.defaultimg;
			activityJson.reciver = this.addForm.reciver;
			activityJson.province = this.addForm.province;		
			activityJson.city = this.addForm.city;	
			activityJson.area = this.addForm.area;	
			activityJson.mobilephone = this.addForm.mobilephone;
			activityJson.streetdetails = this.addForm.streetdetails;	
			
			//二维码 
			if(this.addForm.defaultimg2 && this.addForm.titletext){
				
				activityJson.qrcodedesc = this.addForm.titletext;	
				activityJson.qrcode = 	this.addForm.defaultimg2;	
			}
			
			
			
			
			// 清除重复的产品
            let newarr = []
			this.productlist2.map((item,index)=>{
				let temp = JSON.stringify(item)
				if(JSON.stringify(newarr).indexOf(temp)<0){
					newarr.push(item)
				}
			})

			activityJson.productlist = newarr;	
			

			
			this.addLoading = true;
			api.ibs.addorEditGroupActivity(activityJson).then(res=>{
				this.$notify.success({
					title: '添加成功！',
					message:res.StatusReson || '添加修改分销活动成功！',
					showClose: false
				});
				this.addFormVisible = false;
				this.campaignsFetch()
				this.settingFormVisible = false;
				this.addLoading = false;
			}).catch(error => {
				this.addLoading = false;
				this.$notify({ title: '错误', message: error.message || "添加失败", type: 'error' });
			});			
		},

	},
	mounted() {
		this.pageSize = api.CountPerPage;
	
		this.productsFetch();
		this.campaignsFetch();		
	}
}

</script>

<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none !important;
		margin: 0;
	}
</style>

<style scoped>
.redp{
	color: red;
	font-size: 14px;
}
ul{
	padding:0px;
}
li{
	list-style: none;
}
 .inpbox{
	 border:1px solid #bbbbbb;
	 width: 80%;
	 padding-left: 10px;
	 border-radius: 5px;
 }
 .Highlight{
	  border:1px solid #409EFF;

 }
 .inpText{
	width: 85%;
    height: 25px;
    border: none;
    outline: none;
 }

.inputtext{
	width: 85%;
    height: 81px;
    border-radius: 5px;
    resize: none;
    border: none;
    outline: none;
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
