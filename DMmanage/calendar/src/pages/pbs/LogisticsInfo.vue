<template>
	<el-row>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新建运单</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
   <!--  <el-dialog title="填写物流信息" :visible.sync="shippingFormVisible" :close-on-click-modal="false">
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
    </el-dialog> -->

    <!--列表-->
    <!-- <el-table :data="templates" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column prop="title" label="活动名称" width="160"></el-table-column>
      <el-table-column prop="productName" label="产品名称" min-width="200"> </el-table-column>
    </el-table> -->
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
      templates: [],
      listLoading: false,
      shippingFormVisible: false,
      shippingFormRules: {
        shippingNo: [{ required: true, message: "请输入运单号", trigger: "blur" }],
        carriage: [{ required: true, message: "请输入运费", trigger: "blur" }]
      },
       //新增界面数据
      shippingForm: {
      },
      tiNeedPayPost: ""
    }
  },
  methods: {
    //新增
    // handleAdd: function() {
    //       var orderID = this.shippingForm.orderID;
    //   var carrierName = this.shippingForm.carrier.label;
    //   var carrierID = this.shippingForm.carrier.value;
    //   var shippingNo = this.shippingForm.shippingNo;
    //   var carriage = this.shippingForm.carriage;
    //   var orderType = this.shippingForm.ordertype;
    //   var orderIDs = this.shippingForm.orderIDs || [];
    //   var pack = orderIDs.length > 0;

    //   if (!shippingNo) {
    //     this.$notify({ title: "错误", message: "请输入运单号", type: "error" });
    //     return;
    //   }
    //   if (this.tiNeedPayPost == 1) {
    //     if (!carriage) {
    //       this.$notify({ title: "错误", message: "请输入运费", type: "error" });
    //       return;
    //     }
    //   }

    //   this.shippingLoading = true;

    //   if (pack) {
    //     api.pbs
    //       .packOrdersAndShipping(
    //         orderType,
    //         orderIDs,
    //         carrierName,
    //         carrierID,
    //         shippingNo,
    //         carriage
    //       )
    //       .then(response => {
    //         this.shippingFormVisible = false;
    //         this.shippingLoading = false;
    //         this.ordersListFetch();
    //         this.$notify({ title: "成功", message: "成功", type: "success" });
    //       })
    //       .catch(error => {
    //         this.shippingLoading = false;
    //         this.$notify({
    //           title: "错误",
    //           message: error.message || "失败",
    //           type: "error"
    //         });
    //       });
    //   } else {
    //     api.pbs
    //       .editShippingInfo(orderID, carrierName, carrierID, shippingNo)
    //       .then(response => {
    //         if (carriage > 0) {
    //           return api.pbs.payCarriage(orderID, carriage);
    //         } else {
    //           this.ordersListFetch();
    //           return api.successDefaultPromise();
    //         }
    //       })
    //       .then(response => {
    //         this.shippingFormVisible = false;
    //         this.shippingLoading = false;
    //         this.ordersListFetch();
    //         this.$notify({ title: "成功", message: "成功", type: "success" });
    //       })
    //       .catch(error => {
    //         this.shippingLoading = false;
    //         this.$notify({
    //           title: "错误",
    //           message: error.message || "失败",
    //           type: "error"
    //         });
    //       });
    //   }
    // }
  },
  mounted() {
  }
}
</script>

<style scoped>
</style>
