<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-popover ref="popoverTime" placement="top" width="160"  v-model="visibleTime">
						<p>有效期设置</p>
						<!-- 作废掉之前的全部优惠券，使其无法使用优惠券仅在商城页面下单时有效 -->
						<el-input v-model="reduceTime" placeholder="请输入内容">
							<span slot="append">天</span>
						</el-input>
						<div style="text-align: right; margin: 10px 0px 0px 0px">
							<el-button size="mini" type="text" @click="visibleTime = false">取消</el-button>
							<el-button type="primary" size="mini" @click="visibleTime = false">确定</el-button>
						</div>
					</el-popover>
					<el-button type="primary"  v-popover:popoverTime @click="addBtnClicked">有效期设置</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-table :data="list" v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="title" label="产品名称" min-width="120" > </el-table-column>
			<el-table-column prop="index" label="企业售价" width="140"> </el-table-column>
			<el-table-column prop="createtime" label="零售价" width="240"> </el-table-column>
			<el-table-column prop="price" label="优惠券抵扣金额" width="80"> </el-table-column>
			<el-table-column label="操作" width="400" fixed="right">
				<template scope="scope">
					<el-popover ref="popoverSet" placement="top" width="160"  v-model="visibleSet">
						<p>优惠券减免金额</p>
						<!-- 金额范围最高为此产品的零售价不能高于产品内零售价最低的款式 -->
						<el-input v-model="reduceMon" placeholder="请输入内容"></el-input>
						<div style="text-align: right; margin: 0">
							<el-button size="mini" type="text" @click="visibleSet = false">取消</el-button>
							<el-button type="primary" size="mini" @click="visibleSet = false">确定</el-button>
						</div>
					</el-popover>	
					<el-button size="small" v-popover:popoverSet @click="baseEditBtnTapped(scope.$index, scope.row)">设置优惠券金额</el-button>
				</template>
			</el-table-column>
		</el-table>
	</section>
</template>
<script>
	// import NProgress from 'nprogress'
	// import api from 'src/api/api';
	export default {
		data() {
			return {
				listLoading: false,
				list: [],
				reduceTime: '',
				reduceMon: '',
				visibleTime: false,
				visibleSet: false
			}
		},
		methods: {
			addBtnClicked () {
			},
			baseEditBtnTapped () {
			}
		},
		mounted() {
		}
	}
</script>
<style scoped>
</style>
