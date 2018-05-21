<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" v-loading="listLoading" style="width: 100%;">
			<el-table-column type="expand">
				<template scope="props">
					<div v-html="props.row.content"></div>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="通知" min-width="120"> </el-table-column>
			<el-table-column prop="createtime" label="时间" width="200"> </el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import yiya from '../../api/yiya';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				pageSize:10

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.presentRecordsFetch();
			},
			//获取用户列表
			presentRecordsFetch:function(){
				var that = this;
				this.listLoading = true;
				NProgress.start();
				yiya.notificationsFetch(this.page).then(response => {
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						item.content = (item.content || "").replace(/\n/g,"</br>");
					}

					that.list = list;
					that.total = response.total;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

			}


		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			this.presentRecordsFetch();
		}
	}

</script>

<style scoped>

</style>