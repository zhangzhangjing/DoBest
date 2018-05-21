<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<!-- <el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="uid" label="咿呀号" width="80"> </el-table-column>
			<el-table-column prop="name" label="名称" min-width="100"> </el-table-column>
			<el-table-column prop="phone" label="电话" width="130"> </el-table-column>

			<el-table-column  label="专属拓客二维码" width="200">
				<template scope="scope">
			        <el-popover trigger="click" placement="top">
						<img :src="scope.row.codeurl" class="QRimage">
						<el-button type="text" class="QR-text" :loading="downloading"  @click="downloadQRImage(scope.row)">点击下载二维码</el-button>
			          	<el-button type="text" slot="reference" :disabled="!scope.row.codeurl"> 查看 </el-button>
			        </el-popover>
			    </template>
			</el-table-column>

			<el-table-column label="是否拓客" width="100">
				<template scope="scope">
					<el-switch v-model="scope.row.enable" on-text="是" off-text="否" @change="switchChanged(scope.$index, scope.row)"> </el-switch>
				</template>
			</el-table-column>

			<template v-if="review">
				<el-table-column label="审核权限" width="100">
					<template scope="scope">
						<el-switch v-model="scope.row.privilege" on-text="有" off-text="无" @change="privilegeSwitchChanged(scope.$index, scope.row)"> </el-switch>
					</template>
				</el-table-column>
			</template>

		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>


	</section>
</template>

<script>
	import util from 'common/js/util'
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';

	export default {
		data() {
			return {
				templateID:'',
				workID:'',
				list: [],
				total: 0,
				page: 1,
				pageSize:0,
				listLoading: false,
				downloading:false,
				review:false


			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.templateStuffsFetch(this.templateID, this.page).then((response) => {
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						item.enable = item.status == 1;
						item.privilege = item.verfiystatus == 1;
						item.uid = item.userid;
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
			switchChanged:function(index, item)
			{
				var enable = item.enable;
				yiya.templateEnable4StuffSetting(this.templateID, item.uid, enable).then((response) => {
					this.getUsers();
				}).catch(error => {
					item.enable = !item.enable;
				});
			},
			privilegeSwitchChanged:function(index, item)
			{
				var privilege = item.privilege;
				yiya.templatePrivilege4StuffSetting(this.templateID, item.uid, privilege).then((response) => {
					this.getUsers();
				}).catch(error => {
					item.privilege = !item.privilege;
				});
			},
			downloadQRImage:function(item){
				this.downloading = true;
				yiya.templateQRImageDownloadURLFetch(this.workID, item.uid).then(relativePath =>{
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
			}
		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			var query = this.$route.query;
			var templateID = query.id;
			var workID = query.work_id;
			this.review = query.review == true;
			this.workID = workID;
			if(templateID)
			{
				this.templateID = templateID;
				this.getUsers();
			}

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
</style>
