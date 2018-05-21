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

			<el-table-column label="能否邀请" width="100">
				<template scope="scope">
					<el-switch v-model="scope.row.enable" on-text="能" off-text="否" @change="switchChanged(scope.$index, scope.row)"> </el-switch>
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
	import api from 'src/api/api';

	export default {
		data() {
			return {
				campaignID:'',
				workID:'',
				list: [],
				total: 0,
				page: 1,
				pageSize:0,
				listLoading: false,
				downloading:false


			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.stuffsFetch();
			},
			//获取用户列表
			stuffsFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				api.ibs.campaignStuffsFetch(this.campaignID, this.page).then((response) => {
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
				api.ibs.campaignStuffEnableSetting(this.campaignID, item.uid, enable).then((response) => {
					this.stuffsFetch();
				}).catch(error => {
					item.enable = !item.enable;
				});
			}
		},
		mounted() {
			this.pageSize = api.CountPerPage;
			var query = this.$route.query;
			var campaignID = query.id;
			var workID = query.work_id;
			this.workID = workID;
			if(campaignID)
			{
				this.campaignID = campaignID;
				this.stuffsFetch();
			}

		}
	}

</script>

<style scoped>

</style>
