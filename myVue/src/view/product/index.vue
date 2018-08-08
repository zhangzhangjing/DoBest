<template>
  <div  class="list">
    <main-header message="产品管理" returnbtn="true"></main-header>
    <div class="main-content">
      <div class="sousuo" :class="{fixed: scroll}">
        <div class="ss_content">
          <div class="kuang">
            <div class="ico_width width90" v-if="!edit">
              <i class="el-icon-search"></i>
              <span class="span_col">{{search}}</span>
            </div>
            <div class="width10 suosuobtn" @click="searchBtn">搜索</div>

            <input class="width90 inpute" type="text" v-model="searchContent" placeholder="" @input="searchInput">
          </div>
        </div>
      </div>
      <el-row>
        <el-col :span="5" v-for="(item, index) in product" :key="item.id" :offset="index%4==0 ? 0 : 1">
          <el-card :body-style="{ padding: '0px' }" class="card" style="">
            <img v-bind:src='item.productImg' class="image">
            <div style="padding: 18px;">
              <div class="bottom clearfix">
                <span>{{item.name}}</span>
                <el-row class="price">￥{{item.price}}</el-row>
              </div>
            </div>
            <div class="meng">
              <div class="item_title"  @click="productDetail(item.proId)">{{item.name}}</div>
              <div class="jieshao"><p>{{item.productDes}}</p></div>
              <div class="priceh">￥{{item.price}}</div>
              <div class="view_btn1">
                <button class="view_btn" @click="productDetail(item.proId)">了解详情</button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
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
  export default {
    name: "index",
    components: {
      MainHeader,
    },
    data(){
      return{
        scroll:false,
        progress: 0,
        page: 1,
        tableData:[],
        tableData1:[],
        listLoading: false,
        listLoading1: false,
        edit:false,
        searchContent:'',
        search:'美味蛋挞',
        product: [
          {
            id:0,
            proId:201801,
            name:"慕斯小蛋糕",
            productDes:'你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。',
            price:16.66,
            productImg:'http://www.lenuse.cn/gas/images/ee.jpg'
          },
          {
            id:1,
            proId:2018012,
            name:"芒果蛋糕",
            productDes:'你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。',
            price:12.88,
            productImg:'http://www.lenuse.cn/gas/images/rr.jpg'
          },
          {
            id:2,
            proId:2018201,
            name:"美味蛋挞",
            productDes:'你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。',
            price:29.99,
            productImg:'http://www.lenuse.cn/gas/images/tt.jpg'
          },
          {
            id:3,
            proId:201851,
            name:"草莓新地",
            productDes:'你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。',
            price:18.88,
            productImg:'http://www.lenuse.cn/gas/images/ww.jpg'
          },
          {
            id:4,
            proId:201806,
            name:"美味蛋挞",
            productDes:'你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。',
            price:16.66,
            productImg:'http://www.lenuse.cn/gas/images/dangao.jpg'
          },
          {
            id:5,
            proId:202801,
            name:"慕斯小蛋糕",
            productDes:'你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。',
            price:16.66,
            productImg:'http://www.lenuse.cn/gas/images/ww.jpg'
          },
          {
            id:6,
            proId:221801,
            name:"慕斯小蛋糕",
            productDes:'你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。',
            price:16.66,
            productImg:'http://www.lenuse.cn/gas/images/ee.jpg'
          },
          {
            id:7,
            proId:301801,
            name:"慕斯小蛋糕",
            productDes:'你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。',
            price:16.66,
            productImg:'http://www.lenuse.cn/gas/images/rr.jpg'
          },
          {
            id:8,
            proId:201809,
            name:"慕斯小蛋糕",
            productDes:'你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。',
            price:16.66,
            productImg:'http://www.lenuse.cn/gas/images/yy.jpg'
          }
        ]
      }
    },
    methods:{
      searchInput(){
        if(this.searchContent){
          this.edit = true
        }else{
          this.edit = false
        }
      },
      searchBtn(){
        var search = ''
        if(this.searchContent){
          search = this.searchContent
        }else{
          search = this.search
        }
        console.log(search)
      },
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
        // axios.get( 'http://192.168.2.118:8888/cts/cts/ti_product/getTiproductsByPage?isAll=1&index=1&size=10',
        //   {headers: {'ticket':'YYc687579f-de31-4155-ad4c-f811c6cd7817'} }).then((response) => {
        //     this.tableData1 = response.data.BaseModle.list || [];
        //     this.listLoading1 = false;
        //   }
        // ).catch((err) => {
        //     console.log(err);
        //   }
        // );
        this.$ajax({
          method: 'get',
          url: 'http://192.168.2.118:8888/cts/cts/ti_product/getTiproductsByPage',
          data: {
            isAll:1,
            index:1,
            size:10
          }
        }).then(function(res){
          this.tableData1 = res.data.BaseModle.list || [];
          this.listLoading1 = false;
        })
          .catch(function(err){
            console.log(err)
          })
      },
      productDetail(id){
        this.$router.push({path: '/productdetail', query: { pid:id}})
      },
      handleScroll () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if(scrollTop>=120){
          this.scroll = true
        }else{
          this.scroll = false
        }
      },
    },
    mounted(){
      this.getProductList()
      this.getMsg()
      window.addEventListener('scroll', this.handleScroll)
    },
  }
</script>

<style scoped lang="stylus">

  .main-content
    text-align left
  .time {
    font-size: 13px;
    color: #999;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
.card
  margin-bottom: 40px;
  position: relative;

  .price {
    padding: 0;
    float: right;
    color #ffa200
  }
  .image {
    width: 100%;
    height 300px
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
.meng
  position absolute
  width 100%
  left 0
  top 100%
  /*bottom 100%*/
  background rgba(255, 255, 255, 0.9)
  text-align center
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
.card :hover .meng
  top 0
  bottom 0
  background rgba(255, 255, 255, 0.9)
.item_title
  color #ffa200
  font-size 20px
  margin-top 30px
  cursor pointer
.jieshao
  width 80%
  height 200px
  margin 0 auto
  line-height 24px
  font-size 14px
.priceh
  width 80%
  margin 0 auto
  font-size 16px
  color #454545
  text-align right
.view_btn1
  width 100%
  position absolute
  bottom 15px
  text-align center
.view_btn
  background #ffa200
  padding: 6px 20px;
  border: none;
  border-radius: 3px;
  color: #fff;
  font-size: 16px;
  webkit-box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.3);
  cursor pointer
  margin 0 auto
.sousuo
  min-height 50px
.fixed
  width: 80%;
  background: #fff;
  position: fixed;
  z-index: 999;
  top: 30px;
.ss_content
  width 60%
  margin 0 auto
  margin-bottom 30px
.ico_width
  width 85%
  display inline-block
.width90
  width 90%
  float left
.width10
  width 10%
  float left
.suosuobtn
  width: 8%;
  float: left;
  height: 40px;
  background: #ff5000;
  position: absolute;
  right: -3px;
  border-radius: 0px 20px 20px 0px;
  top: -2px;
  line-height 40px
  padding-left 20px
  color: #fff;
  font-size 20px
  cursor pointer
.kuang
  width 100%
  height 16px
  border-radius 20px
  border 2px solid #ff5000
  position relative
  padding 10px 20px
.span_col
  display inline-block
  height 16px
  line-height 16px
  color #666666
  font-size 12px
  margin-left 10px
  vertical-align: text-top;
.inpute
  width calc(90% - 40px)
  outline none
  position absolute
  left 0
  background none
  padding-left 20px
  border none

</style>
