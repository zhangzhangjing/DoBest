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
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="username" label="客户昵称" width="120"> </el-table-column>
			<el-table-column prop="birthdaystr" label="宝宝生日" width="120"> </el-table-column>
			<el-table-column prop="isDue" label="预产期" width="80"> </el-table-column>
			<el-table-column prop="mobilephone" label="客户手机" width="140"> </el-table-column>
			<el-table-column prop="adress" label="收货地址" min-width="100"> </el-table-column>
			<el-table-column prop="createtimestr" label="报名时间" width="240"> </el-table-column>
			<el-table-column label="审核" width="180" fixed="right">
				<template scope="scope">
					<el-button size="small" :loading="reviewing" @click="applicationReview(scope.row.tempapplyid, true)">通过</el-button>
					<el-button size="small" :loading="reviewing" @click="applicationReview(scope.row.tempapplyid, false)">拒绝</el-button>
				</template>
			</el-table-column>
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
				list: [],
				total: 0,
				page: 1,
				pageSize:0,
				listLoading: false,
				reviewing:false

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
				yiya.templateUsersFetch(this.templateID, this.page).then((response) => {
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						item.present = (item.count || 0) + "/12";
						item.customerName = item.userName || item.author || item.userid;
						item.inviter = item.userName || item.userid;
						item.isDue = item.isdue ? "是" : "否";
						
						
						item.productID = item.productid;
						item.workID = item.cartid;
						if(item.inviteModel)
						{
							item.invitee = item.invitedName || "";
							item.inviteePhone = item.inviteModel.invitephone || "";
						}

						item.orderNoList = item.orderNoList || [];
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
			applicationReview:function(applicationID, enable){
				this.reviewing = true;
				NProgress.start();
				yiya.userTemplateApplicationReview(applicationID, enable).then((response) => {
					this.getUsers();
					this.reviewing = false;
					NProgress.done();
					this.$notify({ title: '成功', message: '已处理', type: 'success' });
				}).catch(error =>{
					this.reviewing = false;
					NProgress.done();
					this.$notify({ title: '错误', message: error.message || "处理失败，请重试", type: 'error' });
				});
			},
			viewWork:function(index, item)
			{
				var workID = item.cartid;
				if (workID)
				{
					this.$router.push({ name: 'WorkDetail', query: { workID: workID}});
				}
			}


		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			var templateID = this.$route.query.id;
			if(templateID)
			{
				this.templateID = templateID;
				this.getUsers();
			}
			
		}
	}

</script>

<style scoped>

</style>