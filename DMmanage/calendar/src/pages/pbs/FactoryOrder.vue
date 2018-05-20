<template>
	<section>
		<el-row>
      <el-col :span="20" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item>
            <el-select v-model="filters.status"   placeholder="请输入" @change="radioGroupChanged" style="max-width:110px;">
              <el-option label="未支付" value="0"></el-option>
              <el-option label="已支付" value="1"></el-option>
              <el-option label="等待发货" value="2"></el-option>
              <el-option label="已发货" value="3"></el-option>
              <el-option label="已签收" value="4"></el-option>
            </el-select>
					<!-- <el-radio-group class="radio-group" v-model="filters.status" style="display: block;" @change="radioGroupChanged">
			    		<el-radio-button label="0">未支付</el-radio-button>
					    <el-radio-button label="1">已支付</el-radio-button>
					    <el-radio-button label="2">等待发货</el-radio-button>
					    <el-radio-button label="3">已发货</el-radio-button>
					    <el-radio-button label="4">已签收</el-radio-button>
				    </el-radio-group> -->
					</el-form-item>
					<el-form-item>
            <el-date-picker v-model="filters.dateRange" type="datetimerange" align="right" placeholder="选择日期范围" range-separator="至" :picker-options="pickerOptions">     
            </el-date-picker>
					</el-form-item>
          <el-form-item>
            <el-input v-model="filters.selectedInputValue" clearable placeholder="请输入" style="max-width: 260px;">
              <el-select v-model="filters.selectedField" slot="prepend" placeholder="请选择" style="min-width: 110px;">
                <el-option label="订单号/手机号" value="orderNo"></el-option>
                <el-option label="用户账号" value="agentUserId"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="search">查询</el-button>
					</el-form-item>
          <!-- 后端 -->
          <el-form-item>
            <el-button type="primary">合并发货</el-button>
          </el-form-item>
           <el-form-item>
            <el-button icon="el-icon-download">文件下载工具</el-button>
          </el-form-item>
				</el-form>
			</el-col>
      <el-col :span="4" class="toolbar button-container">
      	<el-button type="primary" :loading="excelDownloading" class="download-button" @click="excelDownload">Excel列表下载</el-button>
      	<!-- <el-button type="primary" :loading="imageBatchDownloading" class="download-button" @click="imageBatchDownload">批量下载图片</el-button> -->
      </el-col>
    </el-row>
		<!--列表-->
		<template>
			<el-table :data="list" highlight-current-row v-loading="loading" @selection-change="selsChange" style="width: 100%; ">
				<!-- <el-table-column type="selection" width="60"></el-table-column>
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="orderID" label="订单号" width="200"> </el-table-column>
				<el-table-column prop="userid" label="用户ID号" width="120" sortable> </el-table-column>
				<el-table-column prop="cartid" label="作品ID号" width="120" sortable> </el-table-column>
				<el-table-column prop="printIndex" label="编号" width="120"> </el-table-column> -->
								<!-- <el-table-column prop="storeID" label="商户ID号" width="120" sortable> </el-table-column> -->
				<!-- <el-table-column prop="shippingNo" label="运单号" width="100" sortable> </el-table-column>
				<el-table-column label="运费" width="80">
					<template scope="scope">
						<el-button type="text" @click="viewTransaction(scope.row)">{{scope.row.carriageString}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="product" label="产品" width="200"> </el-table-column>
				<el-table-column prop="orderDate" label="时间" width="240" sortable> </el-table-column>
				<el-table-column prop="receiver" label="姓名" width="120"> </el-table-column>
				<el-table-column prop="phone" label="电话" width="125"> </el-table-column>
				<el-table-column prop="addressDetail" label="地址" min-width="180"></el-table-column>
				<el-table-column prop="count" label="份数" width="60"> </el-table-column>
				<el-table-column prop="price" label="实付" width="80"> </el-table-column> -->
				<el-table-column type="selection" width="60"></el-table-column>
				  <el-table-column type="expand">
  					<template scope="props">
  						<el-form label-position="left" inline class="demo-table-expand">
  						<el-form-item label="姓名">
  							<span>{{ props.row.receiver }}</span>
  						</el-form-item>
  						<el-form-item label="电话">
  							<span>{{ props.row.phone }}</span>
  						</el-form-item>
  						<!-- <el-form-item label="时间">
  							<span>{{ props.row.orderDate }}</span>
  						</el-form-item> -->			
  						<el-form-item label="运单号">
  							<span>{{ props.row.shippingNo }}</span>
  						</el-form-item>					
  						<el-form-item label="产品">
  							<span>{{ props.row.product }}</span>
  						</el-form-item>		
  						</el-form>
  					</template>
					</el-table-column>
          <el-table-column label="用户账号" prop="userid">
          </el-table-column>
					<el-table-column label="订单号" prop="orderID"width="200">
					</el-table-column>
					<el-table-column label="作品ID号" prop="cartid">
					</el-table-column>
					<el-table-column label="编号" prop="printIndex">
					</el-table-column>
					<el-table-column label="地址" prop="addressDetail" width="200">
					</el-table-column>
					<el-table-column label="时间"	prop="payTimeStr">
					</el-table-column>
  				<el-table-column label="操作" width="235" fixed="right">
  					<template scope="scope">
  						<!-- <el-button size="small" :disabled="filters.status == 0 || filters.status == 4" @click="showShippingEditForm(scope.$index, scope.row, $event)">物流</el-button> -->
              <el-button size="small" :disabled="filters.status == 0 || filters.status == 4" @click="showShippingEditForm(scope.$index, scope.row, $event)">发货</el-button>
  						<!--<el-button size="small" :loading="imageDownloading" @click="imageDownload(scope.$index, scope.row, $event)">下载</el-button>--> 
  						<el-button size="small" @click="viewWork(scope.$index, scope.row)">查看作品</el-button>
  						<el-tag v-if="scope.row.isBusinessOrder" type="gray">商家</el-tag>
  						<el-tag v-if="scope.row.tiNeedPayPost==1" type="gray">需付邮费</el-tag>
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
		<el-dialog title="填写物流信息" :visible.sync="shippingFormVisible" :close-on-click-modal="false">
			<el-form :model="shippingForm" label-width="100px" :rules="shippingFormRules" ref="shippingForm">
				<el-form-item label="物流公司">
					<el-select v-model="shippingForm.carrier" placeholder="请选择">
    					<el-option v-for="item in carriers" :label="item.label" :value="item"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="运单号" prop="shippingNo">
					<el-input v-model="shippingForm.shippingNo" auto-complete="off"></el-input>
				</el-form-item>			
				<el-form-item label="运费" prop="carriage" v-if="tiNeedPayPost==1">
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
import api from "../../api/api";
import util from "common/js/util";
import Config from "common/js/Config";
import Formatter from "common/js/Formatter";
import NProgress from "nprogress";
export default {
  data() {
    return {
      filters: {
        name: "",
        type: 1,
        orderID: "",
        status: "0",
        selectedField: "orderNo",
        selectedInputValue: "",
        merchantName: "",
        merchantPhone: "",
        customerName: "",
        customerPhone: "",
        dateRange: ""
      },
      loading: false,
      total: 0,
      page: 1,
      pageSize: 20,
      list: [],
      sels: [], //列表选中列
      carriers: [],
      shippingFormVisible: false,
      shippingLoading: false,
      shippingFormRules: {
        shippingNo: [{ required: true, message: "请输入运单号", trigger: "blur" }],
        carriage: [{ required: true, message: "请输入运费", trigger: "blur" }]
      },
      tiNeedPayPost: "", //是否需要付邮费
      //新增界面数据
      shippingForm: {
        orderID: "",
        carrierName: "",
        carrierID: "",
        shippingNo: "",
        carriage: "",
        ordertype: 0
      },
      preprocessing: false,
      excelDownloading: false,
      imageBatchDownloading: false,
      imageDownloading: false,
      pickerOptions: Config.pickerOptions
    };
  },
  methods: {
    pageChanged(val) {
      this.page = val;
      this.ordersListFetch();
    },
    selsChange: function(sels) {
      this.sels = sels;
      var ids = sels.map(item => {
        return item.orderID;
      });
    },
    carriersFetch: function() {
      api.pbs.carriersFetch().then(response => {
        var list = response.list || [];
        this.carriers = list.map(item => {
          return { label: item.name, value: item.code };
        });
      });
    },
    //获取订单列表
    ordersListFetch: function() {
      this.loading = true;
      NProgress.start();
      var filters = this.getFilters();
      api.pbs
        .factoryOrdersListFetch(this.page, this.pageSize, filters)
        .then(response => {
          var list = response.list || [];
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            item.receiver = item.reciver;
            item.phone = item.buyerPhone;
            item.addressDetail =
              (item.buyerprovince || "") +
              (item.buyercity || "") +
              (item.buyerdistrict || "") +
              (item.buyerstreetdetail || "");

            var order = item.order;
            var ordertype = 0;
            var orderStatus = 0;
            var isBusinessOrder = false;
            if (order) {
              ordertype = order.ordertype || 0;
              orderStatus = order.status || 0;

              if (ordertype == 1 || ordertype == 3) {
                isBusinessOrder = true;
                item.receiver =
                  item.branchesName + "  " + (item.branchesUserName || "");
              }
              item.phone = item.branchesPhone;
              item.addressDetail = item.branchesAddress || "";

              if (item.addressDetail == "") {
                // (item.buyerprovince || "") + (item.buyercity || "") + (item.buyerdistrict || "") +
                item.addressDetail = item.buyerstreetdetail || "";
                item.phone = item.buyerPhone;
                item.receiver =
                  (item.branchesName || "") + "  " + (item.reciver || "");
              }
              item.statusString = Formatter.orderStatusDesc(order.status);
              item.shippingNo = order.expressorder;
              item.carriage = order.postage || "";
              item.userid = order.userid;
              item.storeID = order.agentuserid || order.branchuserid;
            }
            item.orderDate = item.payTimeStr;
            item.orderID = item.userorderid;
            item.product =
              (item.producttitle || "") + "-" + (item.propertystr || "");
            // item.carriageString = item.carriage || (item.shippingNo ? "-" : "");
            item.carriageString = orderStatus == 4 ? "已到账" : "";
            item.ordertype = ordertype;
            item.isBusinessOrder = isBusinessOrder;
          }
          this.list = list;
          this.total = response.total;
          this.loading = false;
          NProgress.done();
        })
        .catch(error => {
          this.loading = false;
          NProgress.done();
        });
    },
    search: function() {
      this.page = 1;
      this.ordersListFetch();
    },
    radioGroupChanged: function(statusValue) {
      console.log("orderStatus", statusValue)
      this.page = 1;
      this.ordersListFetch();
    },
    rowClicked: function(item, event, column) {
      var orderID = item.userorderid;
      if (orderID) {
        this.$router.push({ name: "OrderDetail", query: { orderID: orderID } });
      }
    },
    //修改
    showShippingEditForm: function(index, item, event) {
      if (event && event.stopPropagation) {
        event.stopPropagation();
      } else {
        //IE浏览器
        event.cancelBubble = true;
      }
      this.tiNeedPayPost = item.tiNeedPayPost;
      //tiNeedPayPost	判断需要付邮费
      var defaultCarrier = this.carriers[0];
      this.shippingFormVisible = true;
      //this.shippingForm = Object.assign({}, item);
      var form = {};
      form.orderID = item.orderID;
      form.shippingNo = (item.order && item.order.expressorder) || "";
      form.carriage = "";
      form.ordertype = item.ordertype || 0;
      form.isBusinessOrder = item.isBusinessOrder;
      form.shippingFree = item.printIndex ? true : false;
      if (defaultCarrier) {
        form.carrier = defaultCarrier;
      }
      if (item.order && item.order.expresscode) {
        var carrierID = item.order.expresscode;
        var index = this.carriers.findIndex(item => {
          return item.value == carrierID;
        });
        form.carrier = this.carriers[index] || {
          label: item.order.expresscom,
          value: carrierID
        };
      }
      this.shippingForm = form;
    },
    //新增
    editShippingInfo: function() {
      var orderID = this.shippingForm.orderID;
      var carrierName = this.shippingForm.carrier.label;
      var carrierID = this.shippingForm.carrier.value;
      var shippingNo = this.shippingForm.shippingNo;
      var carriage = this.shippingForm.carriage;
      var orderType = this.shippingForm.ordertype;
      var orderIDs = this.shippingForm.orderIDs || [];
      var pack = orderIDs.length > 0;
      if (!shippingNo) {
        this.$notify({ title: "错误", message: "请输入运单号", type: "error" });
        return;
      }
      if (this.tiNeedPayPost == 1) {
        if (!carriage) {
          this.$notify({ title: "错误", message: "请输入运费", type: "error" });
          return;
        }
      }
      this.shippingLoading = true;
      if (pack) {
        api.pbs
          .packOrdersAndShipping(
            orderType,
            orderIDs,
            carrierName,
            carrierID,
            shippingNo,
            carriage
          )
          .then(response => {
            this.shippingFormVisible = false;
            this.shippingLoading = false;
            this.ordersListFetch();
            this.$notify({ title: "成功", message: "成功", type: "success" });
          })
          .catch(error => {
            this.shippingLoading = false;
            this.$notify({
              title: "错误",
              message: error.message || "失败",
              type: "error"
            });
          });
      } else {
        api.pbs
          .editShippingInfo(orderID, carrierName, carrierID, shippingNo)
          .then(response => {
            if (carriage > 0) {
              return api.pbs.payCarriage(orderID, carriage);
            } else {
              this.ordersListFetch();
              return api.successDefaultPromise();
            }
          })
          .then(response => {
            this.shippingFormVisible = false;
            this.shippingLoading = false;
            this.ordersListFetch();
            this.$notify({ title: "成功", message: "成功", type: "success" });
          })
          .catch(error => {
            this.shippingLoading = false;
            this.$notify({
              title: "错误",
              message: error.message || "失败",
              type: "error"
            });
          });
      }
    },
    getFilters: function() {
      var filters = {};
      filters.orderNo = this.filters.orderID;
      filters.status = this.filters.status;
      filters.startTimeStr = "";
      filters.endTimeStr = "";
      if (this.filters.selectedInputValue) {
        filters[this.filters.selectedField] = this.filters.selectedInputValue;
      }
      var dateRange = this.filters.dateRange;
      if (dateRange && dateRange.length == 2) {
        var start = dateRange[0];
        var end = dateRange[1];
        if (start && end) {
          filters.startTimeStr = util.formatDate.format(start, "yyyy-MM-dd");
          filters.endTimeStr = util.formatDate.format(end, "yyyy-MM-dd");
        }
      }
      return filters;
    },
    viewWork: function(index, item) {
      var orderID = item.userorderid;
      if (orderID) {
        this.$router.push({ name: "WorkDetail", query: { orderID: orderID } });
      }
      // var workID = item.cartid;
      // if (workID)
      // {
      // 	this.$router.push({ name: 'WorkEditor', query: { id: workID}});
      // }
    },
    viewTransaction(item) {
      var orderID = item.postlogrelationid;
      if (orderID) {
        this.$router.push({
          name: "TransactionRecord",
          query: { orderID: orderID }
        });
      }
    },
    pack: function() {
      var ids = this.sels.map(item => {
        return item.orderID;
      });
      this.preprocessing = true;
      this.tiNeedPayPost = 1;
      api.pbs
        .packEnableCheck(ids)
        .then(response => {
          var orderType = response.ordertype || 0;
          var form = {};
          form.orderIDs = ids;
          form.carriage = "";
          form.ordertype = orderType;
          form.carrier = this.carriers[0];
          form.isBusinessOrder = orderType == 1 || orderType == 3;
          form.shippingFree = true;
          this.shippingForm = form;
          this.preprocessing = false;
          this.shippingFormVisible = true;
        })
        .catch(error => {
          this.preprocessing = false;
          this.$notify({
            title: "错误",
            message: error.message || "下载失败",
            type: "error"
          });
        });
    },
    excelDownload: function() {
      var filters = this.getFilters();
      this.excelDownloading = true;
      api.pbs
        .excelURLFetch(filters)
        .then(response => {
          this.excelDownloading = false;
          var relativePath = response;
          if (relativePath) {
            var url =
              api.getAPIBasePath() +
              "/pbs/order/download?path=" +
              encodeURIComponent(relativePath);
            this.$alert("Excel生成完成", "成功", {
              confirmButtonText: "下载",
              callback: action => {
                window.open(url);
              }
            });
          }
        })
        .catch(error => {
          this.excelDownloading = false;
          this.$notify({
            title: "错误",
            message: error.message || "下载失败",
            type: "error"
          });
        });
    },
    imageBatchDownload: function() {
      var filters = this.getFilters();
      this.imageBatchDownloading = true;
      api.pbs
        .imageBatchURLFetch(filters)
        .then(response => {
          this.imageBatchDownloading = false;
          var relativePath = response;
          if (relativePath) {
            var url =
              api.getAPIBasePath() +
              "/pbs/order/download?path=" +
              encodeURIComponent(relativePath);

            this.$alert("图片生成完成", "成功", {
              confirmButtonText: "下载",
              callback: action => {
                window.open(url);
              }
            });
          }
        })
        .catch(error => {
          this.imageBatchDownloading = false;
          this.$notify({
            title: "错误",
            message: error.message || "下载失败",
            type: "error"
          });
        });
    },
    imageDownload: function(index, item, event) {
      var orderID = item.orderID;
      if (!orderID) {
        return;
      }

      this.imageDownloading = true;
      api.pbs
        .imageURLFetch(orderID)
        .then(response => {
          this.imageDownloading = false;
          var relativePath = response;
          if (relativePath) {
            var url =
              api.getAPIBasePath() +
              "/pbs/order/download?path=" +
              encodeURIComponent(relativePath);

            this.$alert("图片生成完成", "成功", {
              confirmButtonText: "下载",
              callback: action => {
                window.open(url);
              }
            });
          }
        })
        .catch(error => {
          this.imageDownloading = false;
          this.$notify({
            title: "错误",
            message: error.message || "下载失败",
            type: "error"
          });
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 38%;
  margin-left: 8%;
}

.download-button {
}

.el-button + .el-button {
  margin-left: 0px;
}

.button-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-self: center;
  height: 120px;
}

.radio-group {
  padding: 0px;
  margin: 0px;
}
</style>
