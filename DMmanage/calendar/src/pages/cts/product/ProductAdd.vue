<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item style="display: flex;justify-content:flex-end ">
          <el-button type="primary" @click="nextBtnClicked">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :span="24" class="priceWrap">
      <div class="enterprises price">企业售价：￥{{enterprisesPrice}}</div>
      <div class="price">零售价：￥{{retaiPrice}}</div>
    </el-col>
    <el-table :data="list" v-loading="listLoading" style="width: 48%;float: left;margin-right: 4%">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="composition" label="组成售价的项目" min-width="120" > </el-table-column>
      <el-table-column prop="share" label="分利对象" width="140"> </el-table-column>
      <el-table-column prop="priority" label="分配优先级" width="140"> </el-table-column>
      <el-table-column  label="金额" width="200">
        <template scope="scope">
          <el-input type="number" @change="enterprisesChange" v-model="scope.row.input" placeholder="" size="small" style="width: 80%"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="retailList" v-loading="listLoading" style="width: 48%;float: left">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="composition" label="组成售价的项目" min-width="120" > </el-table-column>
      <el-table-column prop="share" label="分利对象" width="140"> </el-table-column>
      <el-table-column prop="priority" label="分配优先级" width="140"> </el-table-column>
      <el-table-column  label="金额" width="200">
        <template scope="scope">
          <el-input type="number" @change="retailChange"  v-model="scope.row.input" placeholder="" size="small" style="width: 80%"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
  import NProgress from 'nprogress'
  import api from 'src/api/api';

  export default {
    data() {
      return {
        enterprisesPrice: 0,
        retaiPrice: 0,
        listLoading: false,
        list: [
          {composition: '生产成本', share: '生产商', priority: '1', input: ''},
          {composition: '平台基本利润', share: '平台', priority: '2', input: ''},
          {composition: '邮费分摊', share: '平台', priority: '3', input: ''},
          {composition: '代理商分利', share: '代理商', priority: '4', input: ''}
        ],
        retailList: [
          {composition: '生产成本', share: '生产商', priority: '1', input: ''},
          {composition: '平台基本利润', share: '平台', priority: '2', input: ''},
          {composition: '邮费分摊', share: '平台', priority: '3', input: ''},
          {composition: '代理商分利', share: '代理商', priority: '4', input: ''},
          {composition: '商户分利', share: '商户', priority: '5', input: ''},
          {composition: '平台分利', share: '平台', priority: '6', input: ''}
        ],
      }
    },
    methods: {
      nextBtnClicked () {
        this.$router.push({ name: 'ProductAddImg'});
      },
      enterprisesChange () {
        var self = this
        self.enterprisesPrice = 0
        this.list.forEach((item,index) => {
          self.enterprisesPrice = item.input - 0 + self.enterprisesPrice
        })
      },
      retailChange () {
        var self = this
        self.retaiPrice = 0
        this.retailList.forEach((item,index) => {
          self.retaiPrice = item.input - 0 + self.retaiPrice
        })
      }
    },
    mounted() {
    }
  }

</script>

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
</style>
<style scoped>
  .priceWrap{
    display: flex;
  }
  .enterprises{
    width: 52%;
    padding-left: 10px;
    box-sizing: border-box;
  }
  .price{
    font-size: 18px;
  }
</style>
