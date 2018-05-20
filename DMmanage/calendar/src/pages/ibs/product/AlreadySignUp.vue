<template>
	<section>
		<!-- <el-row>
			<el-col :span="24" class="toolbar">
				<el-form>
					<el-form-item>
						<span><b>业务目标</b>：让用户的分享带上自己的广告，推广自己的活动，用户可以报名参与，客服跟进客户形成转化</br></span>
						<span><b>如何使用</b>：1 设计并上传广告图   2举办活动，扩散广告   3 处理报名广告活动的客户</span>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row> -->

		
			
				<el-table :data="list" v-loading="listLoading" style="width: 100%;" key="orders">
					<el-table-column type="index" width="60"></el-table-column>
					<el-table-column prop="name" label="姓名" > </el-table-column>
					<el-table-column prop="mobilephone" label="联系方式"> </el-table-column>
					<el-table-column prop="address" label="地址" > </el-table-column>
					<el-table-column prop="createtime" label="报名时间"> </el-table-column>

				</el-table>

				<el-col :span="24" class="toolbar">
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
					</el-pagination>
					<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
				</el-col>



	</section>
</template>
<script>
	import api from 'src/api/api';
	import NProgress from 'nprogress'
	export default {
		data() {
			return {
				loading: false,
				selectedTab:'first',
				detailImageList:[],
				total: 0,
				page: 1,
				listLoading: false,
				pageSize:10,
				list:[],
				addForm:{open:false,updatetime:'',description:'',defaultimg:'',imglist:[]},
				resetting:false,
				setting:false,
				uploadForm: { },
				coverUploadForm: { },
				advertid:this.$route.query.advertid || null,


			}
		},
		methods: {
			shareADInfoFetch(){
				NProgress.start();
				api.ibs.shareADInfoFetch().then((response) => {
					this.addForm.description = response.description;
					this.addForm.defaultimg = response.defaultimg;
					this.addForm.open = response.openapplication == 1;
					this.addForm.updatetime= response.updatetimestr;
					this.detailImageList = (response.imglist || []).map(item =>{
						return {url:item.imgurl, status: 'finished'}
					})

					NProgress.done();
				}).catch(error =>{
					NProgress.done();
				})
			},
			//获取列表
			customersFetch:function(){
				this.listLoading = true;
				api.ibs.joinedCustomersFetch(this.page,this.pageSize,this.advertid).then((response) => {
					var list = response.list || [];		
				
					this.list = list;
					this.total = response.total;
					this.listLoading = false;
				}).catch(error =>{
					this.listLoading = false;
				})
			},
			resetBtnClicked(){
				this.resetting = true;
				api.ibs.shareADReset().then(response => {
					this.resetting = false;
					this.addForm.description = '';
					this.addForm.defaultimg = '';
					this.addForm.open = false;
					this.detailImageList = [];
					this.$notify({ title: '成功', message: '已清除', type: 'success' });
				}).catch(error =>{
					this.resetting = false;
					this.$notify({ title: '错误', message: error.message || "清除失败", type: 'error' });
				})
			},
			saveBtnClicked(){
				var detailImages = this.detailImageList.map(item =>{
					return {url:item.url}
				})
				var form = this.addForm;
				var open = form.open ? 1 : 0;
				var info = {defaultimg:form.defaultimg, description:form.description, openapplication:open};
				this.setting = true;
				api.ibs.shareADSetting(info, detailImages).then(response => {
					this.setting = false;
					this.$notify({ title: '成功', message: '已保存', type: 'success' });
				}).catch(error =>{
					this.setting = false;
					this.$notify({ title: '错误', message: error.message || "保存失败", type: 'error' });
				})
			},


			handleCurrentChange(val) {
				this.page = val;
				this.customersFetch();
			},
			coverBeforeUpload:function(file){
				var key = api.general.qiniuUploadKeyGenerate()
				return api.general.uploadTokenFetch().then(response => {
					var token = response.upToken;
					this.coverUploadForm = {key:key, token:token};
				})
			},
			coverUploadFail:function(error, file){
				// item.uploading = false;
			},
			coverUploadSuccess(response, file, fileList) {
				if (response.key) {
					var imageURL = "http://pic.bbyiya.com/" + response.key;
					var form = this.addForm;
					form.defaultimg = imageURL;
					this.addForm = form;
				}
		    },
			detailBeforeUpload:function(file){
				var key = api.general.qiniuUploadKeyGenerate()
				return api.general.uploadTokenFetch().then(response => {
					var token = response.upToken;
					this.uploadForm = {key:key, token:token};
				})
			},
			detailUploadSuccess(response, file, fileList) {
				if (response.key) {
					var imageURL = "http://pic.bbyiya.com/" + response.key;
					file.url = imageURL;
				}
				this.detailImageList = fileList;
				console.log('detailUploadSuccess', fileList.length);
		    },
			detailFileRemove(file, fileList){
				this.detailImageList = fileList;
				console.log('detailFileRemove', fileList.length);
			},
			detailUploaderChanged(file, fileList){
				this.detailImageList = fileList;
			}
		},



		mounted() {
			this.customersFetch();
			this.shareADInfoFetch();
		}
	};

</script>

<style scoped>

.image-uploader {
	width: 750px;
	height: 260px;
	top:30%;
	left: 20%;
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
	width: 750px;
	height: 260px;
	line-height: 260px;
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
	border: 1px dashed #d9d9d9;
	left: 0px;
	top: 0px;
	width: 750px;
	height: 260px;
}



</style>
