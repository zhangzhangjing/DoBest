<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="keyword" placeholder="影楼名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="searchBtnClicked">搜索</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" v-loading="listLoading" style="width: 100%;" @sort-change="tableSortChanged">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="agentCompanyName" label="影楼" min-width="200" sortable='custom'>
				<template scope="scope">
			        <el-button type="text" @click="viewDetail(scope.row)">{{scope.row.agentCompanyName}}</el-button>
			    </template>
			</el-table-column>

			<el-table-column prop="agentUserId" label="影楼ID" width="140"> </el-table-column>
			<el-table-column label="活动报名（总量和昨日新增）" prop="applyCount" width="200" sortable='custom'>
				<template scope="scope">
					<span>{{scope.row.applyCount || 0}}</span>
					<span>  </span>
					<span style="color:red;">+{{scope.row.applyCountNew || 0}}</span>
				</template>
			</el-table-column>

			<el-table-column label="活动完成（总量和昨日新增）" prop="completeCount" width="200" sortable='custom'>
				<template scope="scope">
					<span>{{scope.row.completeCount || 0}}</span>
					<span>  </span>
					<span style="color:red;">+{{scope.row.completeCountNew || 0}}</span>
				</template>
			</el-table-column>

			<el-table-column label="订单（总量和昨日新增）" prop="orderCount" width="200" sortable='custom'>
				<template scope="scope">
					<span>{{scope.row.orderCount || 0}}</span>
					<span>  </span>
					<span style="color:red;">+{{scope.row.orderCountNew || 0}}</span>
				</template>
			</el-table-column>

			<el-table-column label="作品（总量和昨日新增）" prop="cartCount" width="240" sortable='custom'>
				<template scope="scope">
					<span>{{scope.row.cartCount || 0}}</span>
					<span>  </span>
					<span style="color:red;">+{{scope.row.cartCountNew || 0}}</span>
				</template>
			</el-table-column>

			<el-table-column label="操作" width="100" fixed="right">
				<template scope="scope">
					<el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>



	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import yiya from 'src/api/yiya';

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
				pageSize:10,
				keyword:'',
				sortType:'',

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: { }

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
				yiya.cts.agenciesFetch(this.page, this.keyword, this.sortType).then(response => {
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
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
			searchBtnClicked:function(){
				this.page = 1;
				this.listFetch();
			},
			tableSortChanged:function({column, prop, order}){
				//1:参与人数降序
				//2参与人升序
				//3完成人降序
				//4完成人升序
				//5下单数降序
				//6下单数升序
				//7作品数降序
				//8作品数升序
				//9代理商userId降序
				//0代理商userid升序
				var sortTypes = {'applyCount-descending':1,
								 'applyCount-ascending':2,
								 'completeCount-descending':3,
								 'completeCount-ascending':4,
								 'orderCount-descending':5,
								 'orderCount-ascending':6,
								 'cartCount-descending':7,
								 'cartCount-ascending':8,
								 'agentCompanyName-descending':9,
								 'agentCompanyName-ascending':0
				}
				var key = prop + '-' + order;
				this.sortType = sortTypes[key] || ''
				this.listFetch();
			},
			viewDetail:function(item)
			{
				var agencyID = item.agentUserId;
				if(agencyID)
				{
					this.$router.push({ name: 'AnalyticsEvents', query: { agency_id: agencyID}});
				}
			}
		},
		mounted() {
			this.pageSize = yiya.CountPerPage;
			this.listFetch();
		}
	}

</script>

<style scoped>

</style>
