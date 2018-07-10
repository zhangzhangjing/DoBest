<template>
  <div  class="list">
    <main-header message="产品管理" returnbtn="true"></main-header>
    <div class="main-content">
      <template>
        <el-table  border  style="width: 100%;margin-top: 20px;"
          :data="tableData"
          v-loading="listLoading"
         >
          <el-table-column
            prop="productid"
            label="产品ID">
          </el-table-column>
          <el-table-column
            prop="title"
            label="产品名称">
          </el-table-column>
          <el-table-column
            prop="promoterprice"
            label="企业价">
          </el-table-column>
          <el-table-column
            prop="price"
            label="零售价">
          </el-table-column>
          <el-table-column
            prop="createtime"
            label="创建时间">
          </el-table-column>
          <el-table-column label="操作"   width="140" fixed="right">
            <template scope="scope">
              <el-button size="small" @click="editProduct(scope.row)">修改信息</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template>
        <el-table  border  style="width: 100%;margin-top: 20px;"
                   :data="tableData1"
                   v-loading="listLoading1"
        >
          <el-table-column
            prop="productid"
            label="产品ID">
          </el-table-column>
          <el-table-column
            prop="title"
            label="产品名称">
          </el-table-column>
          <el-table-column
            prop="promoterprice"
            label="企业价">
          </el-table-column>
          <el-table-column
            prop="price"
            label="零售价">
          </el-table-column>
          <el-table-column
            prop="createtime"
            label="创建时间">
          </el-table-column>
          <el-table-column label="操作"   width="140" fixed="right">
            <template scope="scope">
              <el-button size="small" @click="editProduct(scope.row)">修改信息</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

    </div>
  </div>
</template>

<script>
  var $ = require("jquery");
  import MainHeader from '@/components/header.vue'
  import cts from '@/fun/cts.js'
  import {Promise} from 'core-js';
  import axios from 'axios';
  export default {
    name: "index",
    components: {
      MainHeader,
    },
    data(){
      return{
        progress: 0,
        page: 1,
        tableData:[],
        tableData1:[],
        listLoading: false,
        listLoading1: false,
      }
    },
    methods:{
      getProductList(){
        this.listLoading = true;
        cts.getProductList().then((response) => {
          var list = response.list || [];
          this.tableData = list
          this.listLoading = false;
        }).catch(error =>{
          console.log(error)
        })
      },
      editProduct(item){
        console.log(item)
      },
      getMsg(){
        this.listLoading1 = true;
        axios.get( 'http://192.168.2.118:8888/cts/cts/ti_product/getTiproductsByPage?isAll=1&index=1&size=10',
          {headers: {'ticket':'YYc687579f-de31-4155-ad4c-f811c6cd7817'} }).then((response) => {
            this.tableData1 = response.data.BaseModle.list || [];
            this.listLoading1 = false;
          }
        ).catch((err) => {
            console.log(err);
          }
        );
      }
    },
    mounted(){
      this.getProductList()
      this.getMsg()
    },
  }
</script>

<style scoped lang="stylus">


</style>
