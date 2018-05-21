<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">
					
					<el-form-item>
						<el-button @click="addBtnTapped">新增模板</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>


	<!--列表-->
		<el-table :data="ProductShowTempList" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="tempname" label="模板名称" ></el-table-column>
			
			<el-table-column label="操作"   width="140" fixed="right">
				<template scope="scope">
					<el-button size="small" @click="modifyTemplate(scope.row)">修改模板</el-button>				
				</template>
			</el-table-column>





		</el-table>
			<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"  :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>


	</section>
</template>
<script>
	import api from 'src/api/api';
	import ImageUtil from 'common/js/ImageUtil.js';
	import ViewUtil from 'common/js/ViewUtil.js';
	import YiyaUtil from 'common/js/YiyaUtil.js';
	import StringUtil from 'common/js/StringUtil.js';
	import NProgress from 'nprogress'
	var $ = require("jquery");
	export default {
		data() {
			return {
			
				index:1,
				size:10,
				ProductShowTempList:[],
				total:1,
				pageSize:'',
				listLoading:'',
			

			}
		},
		methods: {
			handleCurrentChange(val){
				this.index = val;
				this.getProductShowTempList();
			},
			modifyTemplate(item){
				
				this.$store.commit('setData', item)
				console.log(item)
				this.$router.push({name:'Uploadphotos',query:{id:item.tempid}});
			},

			addBtnTapped(){
				var item = ''
				this.$store.commit('setData', item)
				this.$router.push({name:'Uploadphotos'});
				
			},
			getProductShowTempList(){
				api.cts.getProductShowTempList(this.index,this.size).then((item)=>{
					this.ProductShowTempList = item.list
					// console.log(this.ProductShowTempList)
					// console.log(item)
					this.total = item.total
					this.pageSize = item.pageSize

				});
				
			},

		},
		mounted() {
		 	this.getProductShowTempList()
		}
		
	};

</script>

<style scoped>


</style>
