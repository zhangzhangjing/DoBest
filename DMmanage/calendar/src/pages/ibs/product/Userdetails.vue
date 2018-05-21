<template>
	<section>
		
		

			<!--列表-->
		
			<el-table :data="list" v-loading="listLoading" style="width: 100%;" key="orders">
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="nickname" label="昵称"> </el-table-column>
				<el-table-column prop="viewcount" label="浏览次数"> </el-table-column>
				

				<!--<el-table-column prop="logid" label="咿呀号"> </el-table-column>-->
				<el-table-column prop="amount" label="头像" >
					<template scope="scope">
				        <img v-bind:src="scope.row.headimg" class="avatar">
				    </template>
				</el-table-column>					
				<el-table-column prop="viewtimeStr" label="最近浏览时间" > </el-table-column>			
			</el-table>
			<el-col :span="24" class="toolbar">				
				<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="index" :page-size="page" :total="total" style="float:right;">
				</el-pagination>
				<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
			</el-col>
				
			
		
	</section>	
</template>

<script>
	
	import NProgress from 'nprogress'
	import api from "src/api/api";

	export default {
		data() {
			return {
				page:10,
				index:1,
				advertId:this.$route.query.id,
				list:'',
				total:0,
				listLoading:false,
			}
		},
		methods: {
			
			//获取列表数据
			getShareAdvertViewLogs(){
				this.listLoading = true;
     			NProgress.start();
				api.ibs.getShareAdvertViewLogs(this.advertId,this.index,this.page,).then(res =>{
					this.list = res.list
					console.log(this.list)
					this.total = res.total
					this.listLoading = false
					NProgress.done();

				})
			},	
			handleCurrentChange(val){
		      this.index = val;
		     
		      this.getShareAdvertViewLogs();
		    },
				

		},
		mounted() {

			this.getShareAdvertViewLogs()
		}
	}

</script>

<style scoped>
.avatar{
	width: 60px;
	height: 60px;
	margin-top: 10px;
	border-radius: 50%;
}
</style>
