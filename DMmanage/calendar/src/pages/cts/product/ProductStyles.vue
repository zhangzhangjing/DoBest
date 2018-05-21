<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="addBtnClicked()">添加款式</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="description" label="款式名称" min-width="200" > </el-table-column>
			<el-table-column prop="styleid" label="款式ID" width="140"> </el-table-column>
			<!-- 后端接口 -->
			<el-table-column prop="" label="企业售价"> </el-table-column>
			<el-table-column prop="styleid" label="零售价"> </el-table-column>
			<!-- 来源于该款式模板设置的合成坐标的数量。这个数字也为C端需要上传的照片数 -->
			<el-table-column prop="styleid" label="DIY图片"> </el-table-column>
			<el-table-column prop="imgcount" label="实物广告页数"min-width="140"> </el-table-column>
			<el-table-column prop="" label="宽"> </el-table-column>
			<el-table-column prop="" label="高"> </el-table-column>
<!-- 			<el-table-column prop="imgcount" label="页数" width="100"> </el-table-column>
			<el-table-column prop="price" label="原价" width="120"> </el-table-column>
			<el-table-column prop="promoterprice" label="优惠价" width="120"> </el-table-column> -->
			<el-table-column label="操作" width="200" fixed="right">
				<template scope="scope">
					<el-button size="small" @click="editBtnClicked(scope.$index, scope.row)">编辑属性</el-button>
					<el-button size="small" @click="viewTemplate(scope.$index, scope.row)">编辑模板</el-button>
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
		<el-dialog :title="changeTitle" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<!-- 后端接口 -->
				<el-form-item label="款式名称" prop="description">
					<el-input type="text" :rows="5" ></el-input>
				</el-form-item>
				<el-form-item label="企业价格" prop="">
					<div class="demo-input-suffix">
						<span>生产成本：</span>
						<el-input style="width:70px;">
						</el-input>
					</div>
					<div class="demo-input-suffix">
						<span>平台基本利润：</span>
						<el-input style="width:70px;">
						</el-input>
					</div>
					<div class="demo-input-suffix">
						<span> 邮费分摊：</span>
						<el-input style="width:70px;">
						</el-input>
					</div>
					<div class="demo-input-suffix">
						<span>代理商分利：</span>
						<el-input style="width:70px;">
						</el-input>
					</div>
				</el-form-item>
				<el-form-item label="零售价格" prop="description">
					<div class="demo-input-suffix">
						<span>生产成本：</span>
						<el-input style="width:70px;">
						</el-input>
					</div>
					<div class="demo-input-suffix">
						<span>平台基本利润：</span>
						<el-input style="width:70px;">
						</el-input>
					</div>
					<div class="demo-input-suffix">
						<span> 邮费分摊：</span>
						<el-input style="width:70px;">
						</el-input>
					</div>
					<div class="demo-input-suffix">
						<span>代理商分利：</span>
						<el-input style="width:70px;">
						</el-input>
					</div>
					<div class="demo-input-suffix">
						<span>商户让利：</span>
						<el-input style="width:70px;">
						</el-input>
					</div>
					<div class="demo-input-suffix">
						<span>平台分利：</span>
						<el-input style="width:70px;">
						</el-input>
					</div>
				</el-form-item>
				<!-- <el-form-item label="描述" prop="description">
					<el-input type="textarea" :rows="5" v-model="addForm.description"></el-input>
				</el-form-item> -->
<!-- 
				<el-form-item label="价格">
					<el-input v-model="addForm.price"></el-input>
				</el-form-item>

				<el-form-item label="优惠价">
					<el-input v-model="addForm.promoterprice"></el-input>
				</el-form-item>

				<el-form-item label="页数">
					<el-input v-model="addForm.imgcount"></el-input>
				</el-form-item>

				<el-form-item label="宽">
					<el-input v-model="addForm.width"></el-input>
				</el-form-item>

				<el-form-item label="高">
					<el-input v-model="addForm.hight"></el-input>
				</el-form-item>
 -->
 				<el-form-item label="引导文案" prop="">
					<el-input type="text" :rows="5" ></el-input>
				</el-form-item>
				<el-form-item label="款式图">
					<el-upload class="image-uploader"
						action="https://up.qbox.me"
						:show-file-list="false"
						:data="uploadForm"
						:on-success="uploadSuccess"
						:on-error="uploadFail"
						:before-upload="beforeUpload">
						<div v-if="addForm.defaultimg">
							<img :src="addForm.defaultimg" class="upload-image">
							<i v-if="uploading" class="el-icon-loading image-uploading-icon"></i>
						</div>

						<i v-else class="el-icon-plus image-uploader-icon"></i>
					</el-upload>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="submitBtnTapped" :loading="addLoading">提交</el-button>
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
				productID:'',
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				pageSize:10,

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				uploading:false,
				uploadForm:{},
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: { },
				changeTitle: ''
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.stylesFetch();
			},
			//获取用户列表
			stylesFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				api.cts.stylesFetch(this.productID, this.page).then(response => {
					var list = response || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						// item.title = item.description;
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
			addBtnClicked:function(){
				this.addFormVisible = true;
				this.changeTitle = '添加款式';
				this.addForm = { "productid": this.productID, "description": "", "defaultimg": "", "price":0,
								 "promoterprice": 0, "imgcount": 0, "width": 0, "hight": 0};
			},
			viewTemplate:function(index, item)
			{
				var styleID = item.styleid;
				if(styleID)
				{
					this.$router.push({ name: 'TemplateEditor', query: { style_id: styleID}});
					
				}
			},
			editBtnClicked:function(index, item)
			{
				this.addFormVisible = true;
				this.changeTitle = '编辑属性';
				var form = Object.assign({}, item);
				this.addForm = form;
			},
			submitBtnTapped(){
				this.addForm.styleid ? this.editStyle() : this.addStyle()
			},
			addStyle(){
				this.addLoading = true;
				api.cts.addStyle(this.addForm).then(response =>{
					this.stylesFetch();
					this.addFormVisible = false;
					this.addLoading = false;
					this.$notify({ title: '成功', message: '添加成功', type: 'success' });
				}).catch(error => {
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "添加失败", type: 'error' });
				});
			},
			editStyle:function(){
				this.addLoading = true;
				api.cts.editStyle(this.addForm).then(response =>{
					this.stylesFetch();
					this.addFormVisible = false;
					this.addLoading = false;
					this.$notify({ title: '成功', message: '修改成功', type: 'success' });
				}).catch(error => {
					this.addLoading = false;
					this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
				});
			},
			beforeUpload:function(file){
				this.uploading = true;
				var key = api.general.qiniuUploadKeyGenerate()
				return api.general.uploadTokenFetch().then(response => {
					var token = response.upToken;
					this.uploadForm = {key:key, token:token};
				})
			},
			uploadFail:function(err, file){
				this.uploading = false;
			},
			uploadSuccess(response, file) {
				this.uploading = false;
				if (response.key)
				{
					var form = this.addForm;
					form.defaultimg = "http://pic.bbyiya.com/" + response.key;
					this.addForm = form;
				}
		    }
		},
		mounted() {
			var productID = this.$route.query.product_id;
			if(productID)
			{
				this.productID = productID;
				this.stylesFetch();
			}
		}
	}

</script>

<style scoped>
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
.demo-input-suffix{
	margin-bottom: 8px;
}
.demo-input-suffix:first-child{
	margin-top: 20px;
}
.demo-input-suffix span{
	display: inline-block;
	width: 100px;
	text-align: left;
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
