<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<span style="float:right;">财务总金额：{{headquarterBalance}}</span>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="16" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" >
					<el-form-item>
						<el-radio-group v-model="entityType" style="display: block;" @change="radioGroupChanged">
							<el-radio-button :label="EntityType.Agency.value">{{EntityType.Agency.name}}</el-radio-button>
							<el-radio-button :label="EntityType.Trafficsource.value">{{EntityType.Trafficsource.name}}</el-radio-button>
							<el-radio-button :label="EntityType.Producer.value">{{EntityType.Producer.name}}</el-radio-button>
							<el-radio-button :label="EntityType.Yiya.value||EntityType.OperatingCenter.value">{{EntityType.Yiya.name}}</el-radio-button>
							<!-- 后端接口 -->
							<el-radio-button :label="EntityType.youfeiPrice.value">{{EntityType.youfeiPrice.name}}</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item>
						<el-input v-model="keyword" placeholder="账号/公司/负责人"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="search">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="5" >
			</el-col>
			<el-col :span="8" class="toolbar" style="padding-bottom: 0px;">
				<template v-if="entityType == EntityType.Yiya.value || entityType == EntityType.OperatingCenter.value">
					<el-button @click="withdrawBtnTapped" style="float:right;">提现</el-button>
					<span style="float:right;margin-right:60px;line-height:36px;">{{entityType == EntityType.Yiya.value ? '平台系统盈利' : '运营中心盈利'}}：{{yiyaBalance}}</span>
				</template>
			</el-col>
		</el-row>
		<!--列表-->
		<template v-if="entityType == EntityType.Trafficsource.value || entityType == EntityType.Agency.value || entityType == EntityType.Producer.value">
			<el-table :data="users" v-loading="listLoading" style="width: 100%;" key="partner">
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="companyname" label="企业名称" min-width="200"> </el-table-column>
				<el-table-column prop="uid" label="账号" width="100"> </el-table-column>
				<el-table-column prop="contacts" label="负责人" width="120"> </el-table-column>
				<!-- 后端 -->
				<el-table-column prop="" label="绑定手机号" width="120"> </el-table-column>
				<el-table-column prop="" label="联系人手机号" width="120"> </el-table-column>
				<el-table-column prop="availableAmount" label="余额" width="100"> </el-table-column>
				<el-table-column label="操作" width="240" fixed="right">
					<template scope="scope">
						<template v-if="entityType == EntityType.Trafficsource.value">
							<el-button size="small" @click="rechargeBtnClicked(scope.row)">充值</el-button>
						</template>
						<el-button size="small" @click="withdrawBtnClicked(scope.row)">提现</el-button>
						<el-button size="small" @click="recordBtnClicked(scope.row)">历史记录</el-button>
					</template>
				</el-table-column>
			</el-table>
		</template>
		<template v-if="entityType == EntityType.Yiya.value || entityType == EntityType.OperatingCenter.value">
			<el-table :data="users" v-loading="listLoading" style="width: 100%;" key="finance">
				<el-table-column prop="orderid" label="交易单号" min-width="120"> </el-table-column>
				<el-table-column prop="userid" label="操作员" width="120"> </el-table-column>
				<el-table-column prop="amount" label="金额" width="100"> </el-table-column>
				<el-table-column prop="createtimestr" label="交易时间" width="240"> </el-table-column>
				<!-- 新增 后端配合修改 -->
				<el-table-column label="操作" width="240" fixed="right">
					<template scope="scope">
						<el-button size="small" @click="withdrawBtnClicked(scope.row)">提现</el-button>
						<el-button size="small" @click="recordBtnClicked(scope.row)">历史记录</el-button>
					</template>
				</el-table-column>
			</el-table>
		</template>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>
        <!--充值界面-->
        <el-dialog :title="rechargeForm.dialogTitle" :visible.sync="rechargeFormVisible" :close-on-click-modal="false">
            <el-form :model="rechargeForm" label-width="80px">
                <el-form-item label="金额">
                    <el-input v-model="rechargeForm.amount"></el-input>
                </el-form-item>
                <el-form-item label="备注">
					<el-input
						type="textarea"
						:autosize="{ minRows: 2, maxRows: 4}"
						placeholder="请输入内容"
						v-model="textareaDe">
					</el-input>
				</el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="rechargeFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="recharge" :loading="recharging">确定</el-button>
            </div>
        </el-dialog>
		<!--新增界面-->
		<el-dialog title="提现" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="金额">
					<el-input v-model="addForm.amount"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="withdrawSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from 'common/js/util'
	import {EntityType,TransactionType,ApplicationReviewStatus} from 'common/js/BaseModel';
	import NProgress from 'nprogress'
	import api from 'src/api/api';
	import StringUtil from 'common/js/StringUtil.js';
	export default {
		data() {
			return {
				EntityType:EntityType,
				TransactionType:TransactionType,
				filters:{orderNo:'',ordertype:0,status:0,startTimeStr:'', endTimeStr:'', agentUserId:0},
				users: [],
				entityType:EntityType.Producer.value,
				keyword:'',
				total: 0,
				page: 1,
				pageSize:0,
				headquarterBalance:0,
				yiyaBalance:0,
				listLoading: false,
				deleting:false,
				textareaDe: '',

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: { },

	            rechargeFormVisible: false,
	            recharging: false,
	            rechargeForm: { }

			}
		},
		methods: {

			search(){
				this.partnersFetch()
				
			},

			handleCurrentChange(val) {
				this.page = val;
				this.dataFetch();
			},
			//获取用户列表
			partnersFetch:function(){
				this.listLoading = true;
				NProgress.start();
				api.cts.partnersFetch(this.entityType, this.keyword, this.page).then((response) => {
					var list = response.list || [];
	                var total = response.total;
	                for(var i = 0;i<list.length;i++)
	                {
	                    var item = list[i];
	                    var uid = 0;
	                    if(this.entityType == EntityType.Producer.value){
	                        uid = item.produceruserid || 0;
	                    }
	                    else if (this.entityType == EntityType.Agency.value) {
	                        uid = item.agentuserid || 0;
	                    }
	                    else if (this.entityType == EntityType.Trafficsource.value) {
	                        uid = item.promoteruserid || 0;
	                    }
	                    item.uid = uid;
	                    item.entityName = item.companyname;
	                    item.streetdetail = item.streetdetail || item.streetdetails;
	                    item.createtime = item.createtime || item.creattime;
	                    item.agencyID = item.agentuserid;

	                }

					this.users = list;
					this.total = response.total;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					this.listLoading = false;
					NProgress.done();
				});

			},
			transactionRecordFetch(){
				this.listLoading = true;
				NProgress.start();

				var uid = 0;
				if(this.entityType == EntityType.Yiya.value){
					uid = 1;
				}
				else if(this.entityType == EntityType.OperatingCenter.value){
					uid = 2;
				}

				api.cts.transactionRecordFetch(uid, TransactionType.Withdraw.value, this.page).then((response) => {
					var list = response.list || [];
	                var total = response.total;
	                for(var i = 0;i<list.length;i++)
	                {
	                    var item = list[i];
	                    var uid = 0;
	                    if(this.entityType == EntityType.Producer.value){
	                        uid = item.produceruserid || 0;
	                    }
	                    else if (this.entityType == EntityType.Agency.value) {
	                        uid = item.agentuserid || 0;
	                    }
	                    else if (this.entityType == EntityType.Trafficsource.value) {
	                        uid = item.promoteruserid || 0;
	                    }
	                    item.uid = uid;
	                    item.createtime = item.createtime || item.creattime;

	                }

					this.users = list;
					this.total = response.total;
					this.listLoading = false;
					NProgress.done();
				}).catch(error =>{
					this.listLoading = false;
					NProgress.done();
				});
			},
			headquartersAccountFetch(){
				api.cts.headquartersAccountFetch().then(response =>{
					this.headquarterBalance = response.availableamount || 0;
				}).catch(error =>{})
			},
			dataFetch(){
				var partnerTypes = [EntityType.Trafficsource.value, EntityType.Agency.value, EntityType.Producer.value];
				if(partnerTypes.indexOf(this.entityType) == -1){
					this.transactionRecordFetch();
				}
				else{
					this.partnersFetch();
				}
			},
			entityAccountBalanceFetch(id){
				api.cts.entityAccountBalanceFetch(id).then(response =>{
					this.yiyaBalance = response.availableamount || 0;
				}).catch(error =>{})
			},
			radioGroupChanged:function(value)
	        {
				this.dataFetch();
				if(this.entityType == EntityType.Yiya.value){
					this.entityAccountBalanceFetch(1);
				}
				else if(this.entityType == EntityType.OperatingCenter.value){
					this.entityAccountBalanceFetch(2);
				}
	        },
			rechargeBtnClicked:function(item){
				var dialogTitle = '充值(' + item.entityName + ')';
	            this.rechargeForm = {uid:item.uid, amount:0, action:1, dialogTitle:dialogTitle};
	            this.rechargeFormVisible = true;
	        },
			withdrawBtnClicked:function(item){
				var dialogTitle = '提现(' + item.entityName + ')';
	            this.rechargeForm = {uid:item.uid, amount:0, action:2, dialogTitle:dialogTitle};
	            this.rechargeFormVisible = true;
	        },
	        recharge: function () {
	            var uid = this.rechargeForm.uid;
	            var amount = this.rechargeForm.amount || 0;
				var action = this.rechargeForm.action;
				var actionTitle = action == 1 ? '充值' : '提现';
	            if(!uid){
	                return;
	            }
	            if(amount <= 0){
	                this.$notify({ title: '错误', message: "请输入有效金额", type: 'error' });
	                return;
	            }

	            this.recharging = true;
				var func = action == 1 ? api.cts.recharge(uid, amount) : api.cts.withdraw(uid, amount);
	            func.then(response =>{
	                this.rechargeFormVisible = false;
	                this.recharging = false;
					var message = actionTitle + "成功";
	                this.$notify({ title: '成功', message: message, type: 'success' });
	                this.dataFetch();
	            }).catch(error => {
	                this.recharging = false;
					var message = actionTitle + "失败";
	                this.$notify({ title: '错误', message: error.message || message, type: 'error' });
	            });
	        },
			recordBtnClicked(item){
				var uid = item.uid;
				console.log('item.uid', item.uid)
				if(uid >= 0){
					this.$router.push({ name: 'TransactionRecord', query: { uid:uid, entity:this.entityType}});
				}
			},
			withdrawBtnTapped(){
				this.addForm = {amount:0, remark:''};
				this.addFormVisible = true;
			},
			withdrawSubmit(){
				var form = this.addForm;
				this.addLoading = true;
				var uid = 0;
				if(this.entityType == EntityType.Yiya.value){
					uid = 1;
				}
				else if(this.entityType == EntityType.OperatingCenter.value){
					uid = 2;
				}

                api.cts.withdraw(uid, form.amount).then(response => {
                    this.addLoading = false;
                    this.$notify({ title: '成功', message: "提现已提交", type: 'success' });
										 this.addFormVisible = false;
                }).catch(error =>{
                    this.addLoading = false;
                    this.$notify({ title: '错误', message: error.message || "提现失败", type: 'error' });
                });
			}



		},
		mounted() {
			this.pageSize = api.CountPerPage;
			this.dataFetch();
			this.headquartersAccountFetch();
		}
	}

</script>

<style scoped>

</style>
