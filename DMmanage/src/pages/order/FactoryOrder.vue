<template>
	<section>

		<el-row>
            <el-col :span="20" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-input v-model="filters.selectedInputValue" clearable placeholder="请输入" style="max-width: 260px;">
							<el-select v-model="filters.selectedField" slot="prepend" placeholder="请选择" style="min-width: 110px;">
						        <el-option label="订单号/手机号" value="orderNo"></el-option>
						        <el-option label="商户ID号" value="agentUserId"></el-option>
						    </el-select>
						</el-input>
					</el-form-item>

					<el-form-item>
						<el-radio-group class="radio-group" v-model="filters.status" style="display: block;" @change="radioGroupChanged">
				    		<el-radio-button label="0">未支付</el-radio-button>
						    <el-radio-button label="1">已支付</el-radio-button>
						    <el-radio-button label="2">等待发货</el-radio-button>
						    <el-radio-button label="3">已发货</el-radio-button>
						    <el-radio-button label="4">已签收</el-radio-button>
					    </el-radio-group>
					</el-form-item>

					<el-form-item>
						<el-date-picker v-model="filters.dateRange" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions"> </el-date-picker>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" v-on:click="search">查询</el-button>
					</el-form-item>

				</el-form>
			</el-col>

            <el-col :span="4" class="toolbar button-container">
            	<el-button type="primary" :loading="excelDownloading" class="download-button" @click="excelDownload">下载Excel</el-button>
            	<!-- <el-button type="primary" :loading="imageBatchDownloading" class="download-button" @click="imageBatchDownload">批量下载图片</el-button> -->
            </el-col>
        </el-row>

		<!--列表-->
		<template>
			<el-table :data="list" highlight-current-row v-loading="loading" @selection-change="selsChange" style="width: 100%;">
				<el-table-column type="selection" width="60"></el-table-column>
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="orderID" label="订单号" width="200"> </el-table-column>
				<el-table-column prop="userid" label="用户ID号" width="120" sortable> </el-table-column>
				<el-table-column prop="cartid" label="作品ID号" width="120" sortable> </el-table-column>
				<el-table-column prop="printIndex" label="编号" width="120" sortable> </el-table-column>
				<el-table-column prop="storeID" label="商户ID号" width="120" sortable> </el-table-column>
				<el-table-column prop="shippingNo" label="运单号" width="100" sortable> </el-table-column>
				<el-table-column prop="carriageString" label="运费" width="80"> </el-table-column>
				<el-table-column prop="product" label="产品" width="200"> </el-table-column>
				<el-table-column prop="orderDate" label="时间" width="240" sortable> </el-table-column>
				<el-table-column prop="receiver" label="姓名" width="120"> </el-table-column>
				<el-table-column prop="phone" label="电话" width="120"> </el-table-column>
				<el-table-column prop="addressDetail" label="地址" min-width="180"></el-table-column>
				<el-table-column prop="count" label="份数" width="60"> </el-table-column>
				<el-table-column prop="price" label="实付" width="80"> </el-table-column>


				<el-table-column label="操作" width="220" fixed="right">
					<template scope="scope">
						<el-button size="small" :disabled="filters.status == 0 || filters.status == 4" @click="showShippingEditForm(scope.$index, scope.row, $event)">物流</el-button>
						<!-- <el-button size="small" :loading="imageDownloading" @click="imageDownload(scope.$index, scope.row, $event)">下载</el-button> -->
						<el-button size="small" @click="viewWork(scope.$index, scope.row)">查看</el-button>
						<el-tag v-if="scope.row.order.ordertype == 1" type="gray">影楼</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</template>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="primary" v-on:click="pack" :disabled="sels.length < 2" :loading="preprocessing">合单发货</el-button>
			<el-pagination layout="prev, pager, next" @current-change="pageChanged" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
			<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
		</el-col>

		<!--物流界面-->
		<el-dialog title="填写物流信息" v-model="shippingFormVisible" :close-on-click-modal="false">
			<el-form :model="shippingForm" label-width="100px" :rules="shippingFormRules" ref="shippingForm">
				<el-form-item label="物流公司">
					<el-select v-model="shippingForm.carrier" placeholder="请选择">
    					<el-option v-for="item in carriers" :label="item.label" :value="item"></el-option>
  					</el-select>
				</el-form-item>

				<el-form-item label="运单号" prop="shippingNo">
					<el-input v-model="shippingForm.shippingNo" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="运费" prop="carriage" v-if="shippingForm.ordertype == 1">
					<el-input v-model="shippingForm.carriage" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="shippingFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editShippingInfo" :loading="shippingLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>
<script>
	import yiya from '../../api/yiya';
	import util from 'common/js/util'
	import Config from 'common/js/Config'
	import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: '',
					orderID:'',
					status:1,
					selectedField:'orderNo',
					selectedInputValue:'',
					merchantName:'',
					merchantPhone:'',
					customerName:'',
					customerPhone:'',
					dateRange:''

				},
				loading: false,
				total: 0,
				page: 1,
				pageSize:20,
				list: [ ],
				sels: [],//列表选中列
				carriers:[],
				shippingFormVisible:false,
				shippingLoading: false,
				shippingFormRules: {
					shippingNo: [
						{ required: true, message: '请输入运单号', trigger: 'blur' }
					]
				},
				//新增界面数据
				shippingForm: {
					orderID:'',
					carrierName: '',
					carrierID: '',
					shippingNo: '',
					carriage: 0,
					ordertype:0
				},
				preprocessing:false,
				excelDownloading:false,
				imageBatchDownloading:false,
				imageDownloading:false,
				pickerOptions: Config.pickerOptions
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			pageChanged(val) {
				this.page = val;
				this.ordersListFetch();
			},
			selsChange: function (sels) {
				this.sels = sels;
				var ids = sels.map(item =>{return item.orderID});
			},
			carriersFetch:function(){
				yiya.carriersFetch().then(response =>{
					var list = response.list || [];
					this.carriers = list.map(item =>{return {label:item.name,value:item.code}});
				});
			},
			//获取订单列表
			ordersListFetch: function () {
				this.loading = true;
				NProgress.start();
				var filters = this.getFilters();

				yiya.factoryOrdersListFetch(this.page, this.pageSize, filters).then(response =>{
					var list = response.list || [];
					for(var i = 0;i < list.length; i++)
					{
						var item = list[i];
						item.receiver = item.reciver;
						item.phone = item.buyerPhone;
						item.addressDetail = (item.buyerprovince || "") + (item.buyercity || "") + (item.buyerdistrict || "") + (item.buyerstreetdetail || "");

						var order = item.order;
						var ordertype = 0;
						if (order)
						{
							ordertype = order.ordertype || 0;
							if (ordertype == 1)
							{
								item.receiver = item.branchesName + "  " + (item.branchesUserName || "");
								item.phone = item.branchesPhone;
								item.addressDetail = (item.branchesprovince || "") + (item.branchesrcity || "") + (item.branchesdistrict || "") + (item.branchesAddress || "");

							}

							item.statusString = yiya.orderStatusDescFecth(order.status);
							item.shippingNo = order.expressorder;
							item.carriage = order.postage || 0;
							item.userid = order.userid;
							item.storeID = order.agentuserid || order.branchuserid;
						}
						item.orderDate = item.payTimeStr;
						item.orderID = item.userorderid;
						item.product = (item.producttitle || '') + "-" + (item.propertystr || '');
						item.carriageString = item.carriage || (item.shippingNo ? "-" : "");
						item.ordertype = ordertype;
					}


					this.list = list;
					this.total = response.total;
					this.loading = false;
					NProgress.done();
				}).catch(error =>{
					this.loading = false;
					NProgress.done();
				});
			},
			search:function(){
				this.page = 1;
				this.ordersListFetch();
			},
			radioGroupChanged:function(statusValue)
			{
				this.page = 1;
				this.ordersListFetch();
			},
			rowClicked:function(item, event, column){
				var orderID = item.userorderid;
				if (orderID)
				{
					this.$router.push({ name: 'OrderDetail', query: { orderID: orderID}});
				}
			},
			//修改
			showShippingEditForm: function (index, item, event) {
				if(event && event.stopPropagation){
			        event.stopPropagation();
			    }else{
			        //IE浏览器
			        event.cancelBubble = true;
			    }
			    var defaultCarrier = this.carriers[0];
				this.shippingFormVisible = true;
				//this.shippingForm = Object.assign({}, item);
				var form = {};
				form.orderID = item.orderID;
				form.shippingNo = (item.order && item.order.expressorder) || "";
				form.carriage = 0;
				form.ordertype = item.ordertype || 0;
				if(defaultCarrier)
				{
					form.carrier = defaultCarrier;
				}
				if(item.order && item.order.expresscode)
				{
					var carrierID = item.order.expresscode;
					var index = this.carriers.findIndex(item => {return item.value == carrierID});
					form.carrier = this.carriers[index] || {label:item.order.expresscom, value:carrierID};
				}
				this.shippingForm = form;
			},
			//新增
			editShippingInfo: function () {
				var orderID = this.shippingForm.orderID;
				var carrierName = this.shippingForm.carrier.label;
				var carrierID = this.shippingForm.carrier.value;
				var shippingNo = this.shippingForm.shippingNo;
				var carriage = this.shippingForm.carriage;
				var orderType = this.shippingForm.ordertype;
				var orderIDs = this.shippingForm.orderIDs || [];
				var pack = orderIDs.length > 0;

				if(!shippingNo)
				{
					this.$notify({ title: '错误', message:"请输入运单号", type: 'error' });
					return;
				}



				this.shippingLoading = true;


				if (pack)
				{
					yiya.packOrdersAndShipping(orderType, orderIDs, carrierName, carrierID, shippingNo, carriage).then(response =>{
						this.shippingFormVisible = false;
						this.shippingLoading = false;
						this.ordersListFetch();
						this.$notify({ title: '成功', message: '成功', type: 'success' });
					}).catch(error => {
						this.shippingLoading = false;
						this.$notify({ title: '错误', message: error.message || "失败", type: 'error' });
					});
				}
				else
				{
					yiya.editShippingInfo(orderID, carrierName, carrierID, shippingNo).then(response =>{

						if(carriage > 0)
						{
							return yiya.payCarriage(orderID, carriage)
						}
						else{
							this.ordersListFetch();
							return yiya.successDefaultPromise();
						}

					}).then(response =>{

						this.shippingFormVisible = false;
						this.shippingLoading = false;
						this.ordersListFetch();
						this.$notify({ title: '成功', message: '成功', type: 'success' });

					}).catch(error => {
						this.shippingLoading = false;
						this.$notify({ title: '错误', message: error.message || "失败", type: 'error' });
					});

				}


			},
			getFilters:function(){
				var filters = {};
				filters.orderNo = this.filters.orderID;
				filters.status = this.filters.status;
				filters.startTimeStr = '';
				filters.endTimeStr = '';
				if(this.filters.selectedInputValue){
					filters[this.filters.selectedField] = this.filters.selectedInputValue;
				}

				var dateRange = this.filters.dateRange;
				if(dateRange && dateRange.length == 2)
				{
					var start = dateRange[0];
					var end = dateRange[1];
					if (start && end)
					{
						filters.startTimeStr = util.formatDate.format(start, 'yyyy-MM-dd');
						filters.endTimeStr = util.formatDate.format(end, 'yyyy-MM-dd');
					}
				}
				return filters;
			},
			viewWork:function(index, item)
			{
				/**
				var orderID = item.userorderid;
				if (orderID)
				{
					this.$router.push({ name: 'WorkDetail', query: { orderID: orderID}});
				}**/

				var workID = item.cartid;
				if (workID)
				{
					this.$router.push({ name: 'WorkEditor', query: { id: workID}});
				}


			},
			pack:function(){
				var ids = this.sels.map(item =>{return item.orderID});

				this.preprocessing = true;
				yiya.packEnableCheck(ids).then(response =>{
					var orderType = response.ordertype || 0;
					var form = {};
					form.orderIDs = ids;
					form.carriage = 0;
					form.ordertype = orderType;
					form.carrier = this.carriers[0];
					this.shippingForm = form;
					this.preprocessing = false;
					this.shippingFormVisible = true;
				}).catch(error =>{
					this.preprocessing = false;
					this.$notify({ title: '错误', message: error.message || "下载失败", type: 'error' });
				})
			},
			excelDownload:function()
			{
				var filters = this.getFilters();

				this.excelDownloading = true;
				yiya.excelURLFetch(filters).then(response =>{
					this.excelDownloading = false;
					var relativePath = response;
					if (relativePath)
					{
						var url = yiya.getAPIBasePath() + "/pbs/order/download?path=" + encodeURIComponent(relativePath);

						this.$alert('Excel生成完成', '成功', {
				          confirmButtonText: '下载',
				          callback: action => {
				            window.open(url);
				          }
				        });
					}
				}).catch(error => {
					this.excelDownloading = false;
					this.$notify({ title: '错误', message: error.message || "下载失败", type: 'error' });
				});
			},
			imageBatchDownload:function(){
				var filters = this.getFilters();
				this.imageBatchDownloading = true;
				yiya.imageBatchURLFetch(filters).then(response =>{
					this.imageBatchDownloading = false;
					var relativePath = response;
					if (relativePath)
					{
						var url = yiya.getAPIBasePath() + "/pbs/order/download?path=" + encodeURIComponent(relativePath);

						this.$alert('图片生成完成', '成功', {
				          confirmButtonText: '下载',
				          callback: action => {
				            window.open(url);
				          }
				        });
					}
				}).catch(error => {
					this.imageBatchDownloading = false;
					this.$notify({ title: '错误', message: error.message || "下载失败", type: 'error' });
				});
			},
			imageDownload:function(index, item, event){
				var orderID = item.orderID;
				if(!orderID)
				{
					return;
				}

				this.imageDownloading = true;
				yiya.imageURLFetch(orderID).then(response =>{
					this.imageDownloading = false;
					var relativePath = response;
					if (relativePath)
					{
						var url = yiya.getAPIBasePath() + "/pbs/order/download?path=" + encodeURIComponent(relativePath);

						this.$alert('图片生成完成', '成功', {
				          confirmButtonText: '下载',
				          callback: action => {
				            window.open(url);
				          }
				        });
					}
				}).catch(error => {
					this.imageDownloading = false;
					this.$notify({ title: '错误', message: error.message || "下载失败", type: 'error' });
				});
			}
		},
		mounted() {
			this.ordersListFetch();
			this.carriersFetch();
		}
	};

</script>

<style scoped>

.download-button{

}

.el-button+.el-button
{
    margin-left: 0px;
}

.button-container{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-self: center;
    height: 120px;
}

.radio-group{
	padding: 0px;
	margin: 0px;
}


</style>
