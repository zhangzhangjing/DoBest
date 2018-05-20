<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">
					<el-form-item>
						<el-select v-model="agencyID" placeholder="请选择" style="min-width:500px;" @change="agencySelectorChanged">
	    					<el-option v-for="item in agencies" :label="item.label" :value="item.value"></el-option>
	  					</el-select>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="6" class="toolbar">
				<div>
					<div class="balance">总活动数量:{{info.allNum || 0}}</div>
					<div class="balance">进行中活动:{{info.goingNum || 0}}</div>
					<div class="balance">未开启活动:{{info.nostartNum || 0}}</div>
					<div class="balance">已结束活动:{{info.endingNum || 0}}</div>
				</div>
			</el-col>
			<el-col :span="6" class="toolbar">
				<div>
					<div class="balance">迄今总报名人数:{{info.applyNum || 0}}</div>
					<div class="balance">迄今总完成人数:{{info.completeNum || 0}}</div>
					<div class="balance">新客资总报名人数:{{info.xkzhdApplyNum || 0}}</div>
					<div class="balance">兑换码总报名人数:{{info.codeApplyNum || 0}}</div>
				</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">
					<el-form-item>
						<el-radio-group style="display: block;" v-model="status" @change="radioGroupChanged">
					      	<el-radio-button label="">全部</el-radio-button>
					      	<el-radio-button :label="EventStatus.Normal.value">{{EventStatus.Normal.name}}</el-radio-button>
					      	<el-radio-button :label="EventStatus.Running.value">{{EventStatus.Running.name}}</el-radio-button>
					      	<el-radio-button :label="EventStatus.Ended.value">{{EventStatus.Ended.name}}</el-radio-button>
					    </el-radio-group>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>

		<!--列表-->
		<el-table :data="list" v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="title" label="活动名称" min-width="200" > </el-table-column>
			<el-table-column prop="status" :formatter="Formatter.eventStatusFormat" label="状态" width="100"> </el-table-column>
			<el-table-column prop="type" :formatter="Formatter.eventTypeFormat" label="类型" width="100"> </el-table-column>
			<el-table-column prop="applycount" label="报名人数" width="100"> </el-table-column>
			<el-table-column prop="completecount" label="完成人数" width="100"> </el-table-column>
			<el-table-column prop="createtime" label="创建时间" width="240"> </el-table-column>
			<el-table-column label="操作" width="100" fixed="right">
				<template scope="scope">
					<el-button size="small" @click="viewDetail(scope.$index, scope.row)">查看详情</el-button>
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
	import Formatter from 'common/js/Formatter.js';
	import {EventStatus} from 'common/js/BaseModel.js';
	var moment = require('moment');

	export default {
		data() {
			return {
				EventStatus:EventStatus,
				Formatter:Formatter,
				info:{},
				list: [],
				agencies:[],
				total: 0,
				page: 1,
				status:EventStatus.Running.value,
				listLoading: false,
				pageSize:10,
				keyword:'',
				agencyID:''

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
				yiya.cts.allEventsFetch(this.agencyID, this.status, this.page).then(response => {
					var page = response.resultPage;
					var list = page.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						var status = item.status || 0;
						var type = item.type || '';
						item.statusString = status == 1 ? "进行中" : status == 3 ? "已结束" : "未开启";
						item.applycount = item.applycount || 0;
						item.completecount = item.completecount || 0;
					}

					this.info = response.countvo;
					this.list = list;
					this.total = page.total;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

			},
			allAgenciesFetch:function(){
				yiya.cts.allAgenciesFetch().then(response => {
					var list = response || [];
					this.agencies = list.map(item =>{
						return {label:item.agentcompanyname, value:item.agentuserid};
					});

				}).catch(error =>{ console.log(error)});
			},
			agencySelectorChanged:function(){
				this.listFetch();
			},
			radioGroupChanged(){
				this.listFetch();
			},
			viewDetail:function(index, item)
			{
				var templateID = item.tempid;
				if(templateID)
				{
					var date = moment(item.createtime, "YYYY-MM-DD");
					var dateString = date.format('YYYY-MM-DD');
					this.$router.push({ name: 'AnalyticsEventDetail', query: { id: templateID, date:dateString}});
				}
			}


		},
		mounted() {
			var agencyID = this.$route.query.agency_id;
			this.agencyID = parseInt(agencyID);
			this.pageSize = yiya.CountPerPage;
			this.allAgenciesFetch();
			this.listFetch();
		}
	}

</script>

<style scoped>

</style>
