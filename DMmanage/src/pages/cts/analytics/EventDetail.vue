<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="16" class="toolbar" style="padding-bottom: 0px;">
				<!-- <el-form :inline="true">
					<el-form-item>

					</el-form-item>
				</el-form> -->
			</el-col>
			<el-col :span="8" class="toolbar">
				<div style="font-size:14px;">
					<span>报名人数:<b>{{info.applycount || 0}}</b></span>
					<span style="margin-left:30px;">完成人数:<b>{{info.completecount || 0}}</b></span>
				</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="18" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">
					<el-form-item>
						<el-date-picker v-if="unitType == 0" v-model="dateRange" type="daterange" align="right" placeholder="选择日期范围"
						:picker-options="pickerOptions" @change="datePickerChanged"> </el-date-picker>
						<el-date-picker v-if="unitType == 1" v-model="date" type="date" placeholder="选择日期" @change="datePickerChanged"> </el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-radio-group style="display: block;" v-model="chartType">
					      	<el-radio-button :label="1">折线视图</el-radio-button>
					      	<el-radio-button :label="2">表视图</el-radio-button>
					    </el-radio-group>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="6" class="toolbar">
				<el-radio-group v-model="unitType" style="display: block;float:right;" @change="unitTypeChanged">
					<el-radio-button :label="0">天</el-radio-button>
					<el-radio-button :label="1">小时</el-radio-button>
				</el-radio-group>
			</el-col>
		</el-row>

		<div id="chartLine" v-show="chartType == 1" style="width:100%; height:400px; margin-top:30px;"></div>
		<el-table v-show="chartType == 2" :data="list" v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="dateTime" label="时间" min-width="200" > </el-table-column>
			<el-table-column prop="applyCount" label="报名人数" width="140"> </el-table-column>
			<el-table-column prop="completeCount" label="完成人数" width="140"> </el-table-column>
		</el-table>

	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import yiya from 'src/api/yiya';
	import Config from 'common/js/Config'
	import util from 'common/js/util'
	import echarts from 'echarts'
	var moment = require('moment');

	export default {
		data() {
			return {
				chartType:1,
				unitType:0,
				info:{},
				list: [],
				total: 0,
				listLoading: false,
				keyword:'',
				templateID:'',

				createDate:'',
				chartLine:'',
				date:'',
				dateRange:[],
				startDateString:'',
				endDateString:'',
				pickerOptions:Config.pickerOptions

			}
		},
		methods: {
			//获取用户列表
			listFetch:function(){
				var that = this;
				if(!this.startDateString || !this.endDateString){
					return;
				}

				this.listLoading = true;
				NProgress.start();
				yiya.cts.eventDetailFetch(this.templateID, this.startDateString, this.endDateString, this.unitType).then(response => {


					this.info = response.tempinfo;
					this.list = response.tabledata;

					var series = response.jsons.data.map(item =>{
						return {name:item.name, type: 'line',  data:item.data}
					})

					var legend = series.map(item =>{
						return item.name
					})

					this.chartLine.setOption({
						tooltip: {
							trigger: 'axis'
						},
						legend: {
		                    data: legend
		                },
						xAxis: {
							type: 'category',
							boundaryGap: false,
							data: response.jsons.xcontent
						},
						yAxis: {
							type: 'value'
						},
						series: series
					});

					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					this.$notify({ title: '错误', message: error.message || "失败", type: 'error' });
					that.listLoading = false;
					NProgress.done();
				});

			},
			datePickerChanged:function(){


				this.startDateString = "";
				this.endDateString = "";
				if(this.unitType == 0){
					var dateRange = this.dateRange;
					if(dateRange && dateRange.length == 2)
					{
						var start = dateRange[0];
						var end = dateRange[1];
						if (start && end)
						{
							this.startDateString = util.formatDate.format(start, 'yyyy-MM-dd');
							this.endDateString = util.formatDate.format(end, 'yyyy-MM-dd');
						}
					}
				}
				else{
					if(this.date){
						var dateString = util.formatDate.format(this.date, 'yyyy-MM-dd');
						this.startDateString = dateString;
						this.endDateString = dateString;
					}
				}


				this.listFetch();
			},
			unitTypeChanged(){
				var dateChanged = false;
				const start = this.createDate;
				if(this.unitType == 1){
					dateChanged = !moment(this.date).isSame(start, 'day');
					this.date = start;
				}else{
					// 创建时间之后的21天,但不能超过今天
					var afterDay = moment(start).add(21, 'day');
					const end = moment.min(afterDay, moment()).toDate()
					if(this.dateRange.length == 2){
						dateChanged = !(moment(this.dateRange[0]).isSame(start, 'day') && moment(this.dateRange[1]).isSame(end, 'day'))
					}
					this.dateRange = [start, end]
				}

				if(!dateChanged){
					this.datePickerChanged();
				}
			}


		},
		mounted() {
			var templateID = this.$route.query.id;
			this.templateID = templateID;
			this.chartLine = echarts.init(document.getElementById('chartLine'));
			this.createDate = new Date();
			if(this.$route.query.date){
				this.createDate = moment(this.$route.query.date).toDate();
			}
			this.unitTypeChanged();
		}
	}

</script>

<style scoped>

</style>
