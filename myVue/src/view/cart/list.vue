<template>
  <!-- list.vue -->
  <div>
    <ul class="main">
      <li class="item font12">
        <div class="width10">
          <input type="checkbox" value="" id="selectAll" @change='selectAllBtn'  v-model="selectAll">
          <label for="selectAll">全选</label>
        </div>
        <div class="width37">
          <div class="pro-name">商品信息</div>
        </div>
        <div class="proDescription">
        </div>
        <div class="priceMsg">
          <div class="pricrNum">单价</div>
        </div>
        <div class="selectNum">
          数量
        </div>
        <div class="priceMsg">
          <div class="pricrNum total">总价</div>
        </div>
        <div class="caozuo">
          <div class="btn">操作</div>
        </div>
      </li>
      <li class="item" v-for="item in commonList" :key="item.id">
        <span @click="addToShopCart($event, item.proId)" style="display: none;"><i class="el-icon-circle-plus"></i></span>
        <div class="cart-checkbox">
          <input type="checkbox" value="item.proId" id="item.proId" v-model="item.selectOne" @change="selectOneBtn(item.proId)">
          <label for="item.proId"></label>
        </div>
        <div class="pro-name-pic">
          <img :src="item.productImg" alt="商品图片" class="pro-img">
          <div class="pro-name">{{item.name}}</div>
        </div>
        <div class="proDescription">
          <div class="des">口味：{{item.proDes.taste}}</div>
          <div class="des">大小型号：{{item.proDes.size}}</div>
          <div class="des">样式：{{item.proDes.foodModel}}</div>
        </div>
        <div class="priceMsg">
          <div class="pricrNum">￥{{item.price}}</div>
        </div>
        <div class="selectNum">
          <el-input-number v-model="item.num" @change="oneProNumberChange(item.proId,item.num)" :min="1" :max="10" style="width: 120px;"></el-input-number>
        </div>
        <div class="priceMsg">
          <div class="pricrNum total">￥{{item.tolPrice}}</div>
        </div>
        <div class="caozuo">
          <div class="btn" @click=deleteCartProduct(item.proId)>删除</div>
        </div>
      </li>
      <li class="item margin_b60"></li>
      <li class="totol_boot">
        <div class="width10">
          <input type="checkbox" value="" id="total" @change='selectAllBtn' v-model="selectAll">
          <label for="total">全选</label>
        </div>
        <div class="width37 textleft">
          <div class="btn" @click = deleteAllCartProduct>删除</div>
        </div>
        <div class="proDescription">
        </div>
        <div class="priceMsg">
          <div class="pricrNum">
            已选商品
            <span class="total paddinglr">{{totalProductNumber}}</span>件
          </div>
        </div>
        <div class="selectNum textright">
          合计（不含运费）：
        </div>
        <div class="priceMsg textleft">
          <div class="pricrNum total">￥{{totalProductPrice}}</div>
        </div>
        <div class="caozuo">
          <div class="btn btncolor" @click="payMoney">结算</div>
        </div>
      </li>
    </ul>
  </div>

</template>

<script>

  export default {
    name: 'list',
    data () {
      return {
        selectAll:false,
        totalProductNumber:0,
        totalProductPrice:0,
        commonList:[
          {
            selectOne:false,
            id:0,
            proId:'201801',
            name:"慕斯小蛋糕",
            num:1,
            price:16.66,
            tolPrice:16.66,
            productImg:'http://www.lenuse.cn/gas/images/ee.jpg',
            proDes:{
              size:'中袋',
              taste:'抹茶味',
              foodModel:'小方多层'
            }
          },
          {
            selectOne:false,
            id:1,
            proId:'2018012',
            name:"芒果蛋糕",
            num:1,
            price:12.88,
            tolPrice:12.88,
            productImg:'http://www.lenuse.cn/gas/images/rr.jpg',
            proDes:{
              size:'小袋',
              taste:'草莓味',
              foodModel:'圆多层'
            }
          },
          {
            selectOne:false,
            id:2,
            proId:'2018201',
            name:"美味蛋挞",
            num:1,
            price:29.99,
            tolPrice:29.99,
            productImg:'http://www.lenuse.cn/gas/images/tt.jpg',
            proDes:{
              size:'中袋',
              taste:'抹茶味',
              foodModel:'蛋糕'
            }
          },
          {
            selectOne:false,
            id:3,
            proId:'201851',
            name:"草莓新地",
            num:1,
            price:18.88,
            tolPrice:18.88,
            productImg:'http://www.lenuse.cn/gas/images/ww.jpg',
            proDes:{
              size:'大袋',
              taste:'抹茶味',
              foodModel:'小方多层'
            }
          },
          {
            selectOne:false,
            id:4,
            proId:'201809',
            name:"慕斯小蛋糕",
            num:1,
            price:16.66,
            tolPrice:16.66,
            productImg:'http://www.lenuse.cn/gas/images/yy.jpg',
            proDes:{
              size:'中袋',
              taste:'抹茶味',
              foodModel:'圆多层'
            }
          }
          ]
      }
    },
    methods: {
      addToShopCart(){
        this.$emit('add-to-cart', event.target)
      },
      //全选
      selectAllBtn(){
        this.totalProductNumber = 0
        this.totalProductPrice = 0
        var proList = this.commonList || []
        proList.forEach(item =>{
          item.selectOne = this.selectAll
          if(this.selectAll){
            this.totalProductNumber += item.num
            this.totalProductPrice += item.num * item.price
            this.totalProductPrice = Math.floor(this.totalProductPrice * 100)/100
          }else{
            this.totalProductNumber = 0
            this.totalProductPrice = 0
          }
        })
      },
      //单选
      selectOneBtn(){
        this.totalProductNumber = 0
        this.totalProductPrice = 0
        var proList = this.commonList || []
        proList.forEach(item =>{
          if(item.selectOne){
            this.totalProductNumber += item.num
            this.totalProductPrice += item.num * item.price
            this.totalProductPrice = Math.floor(this.totalProductPrice * 100)/100
          }
        })
      },
      oneProNumberChange(id,num){
        var proList = this.commonList || []
        proList.forEach(item =>{
          if(item.proId === id){
            item.tolPrice = item.price * num
            item.tolPrice = Math.floor(item.tolPrice*100)/100
          }
        })
        this.selectOneBtn()
      },
      //删除购物车
      deleteCartProduct(id){
        var proList = this.commonList || []
        for(var i=0;i<proList.length;i++){
          if(proList[i].proId == id){
            this.commonList.splice(i,1)
          }
        }
        this.selectOneBtn()
      },
      //多个一起删除
      deleteAllCartProduct(){
        var proList = this.commonList || []
        var selectList = []
        proList.forEach(item =>{
          if(item.selectOne){
            selectList.push(item.proId)
          }
        })
        for(var i=0;i<selectList.length;i++){
          this.deleteCartProduct(selectList[i])
        }
        this.selectOneBtn()
      },
      payMoney(){
        //结算
        var proList = this.commonList || []
        var selectList = []
        proList.forEach(item =>{
          if(item.selectOne){
            selectList.push(item)
          }
        })
        var totalnum = this.totalProductNumber
        var totalmon = this.totalProductPrice
        console.log("购买列表"+selectList+';       购买数量'+totalnum+';        支付总金额'+totalmon)

      },
      pageListMsg(){
        //获取购物车列表
        this.commonList = this.commonList
      },


    },
    mounted() {
      this.pageListMsg();
    }
  }

</script>


<style scoped lang="stylus">
.main
  border 1px solid #e7e7e7
  float left
  width 100%
  position relative
.totol_boot
  position fixed
  bottom 43px
  height 30px
  width 80%
  padding-top 20px
  background #e5e5e5
  z-index 9999
  list-style none
  font-size 12px
.font12
  font-size 12px
.textright
  text-align right
.textleft
  text-align left
.paddinglr
  padding 0 5px
.item
  width 100%
  min-height 45px
  margin-top 20px
  padding-bottom 20px
  list-style none
  float left
  border-bottom 1px solid #e7e7e7
  &:last-child
    margin-bottom 60px
.margin_b60
  margin-bottom 60px
.item:last-child
  margin-bottom 60px
.width37
  width 37%
  float left
.width10
  width 10%
  float left
.cart-checkbox
  float left
  width 2%
.pro-name-pic
  width 30%
  float left
.pro-img
  width 80px
  height 80px
  float left
.pro-name
  display inline-block
  text-align left
  margin-left 20px
  width calc(100% - 150px)
  margin-right 50px
  font-size 12px
  line-height 24px
.proDescription
  text-align left
  font-size 12px
  width 15%
  float left
.des
  color #9c9c9c
  line-height 24px
.priceMsg
  width 10%
  float left
  color #3c3c3c
  font-weight 700
.selectNum
  width 20%
  float left
.total
  color #f40
.caozuo
  width 10%
  float right
  font-size 12px
.btn
  cursor pointer
.btncolor
  background #f40
  height 50px
  line-height 50px
  color #ffffff
  margin-top -20px
  padding 0px 30px
  font-size 16px
  font-weight 700
  float right
</style>
