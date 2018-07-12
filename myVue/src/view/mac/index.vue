<template>
  <div class="list">
    <main-header message="MacBook Detail" returnbtn="true"></main-header>
    <div class="main-content hello">
      <div class="piccontent">
        <img src="../../images/mac/macbook.jpg" alt="商品图片">
      </div>
      <div class="detailcontent">
        <div class="title">Apple MacBook Air 13.3英寸笔记本电脑 银色 {{product.name}}</div>
        <div>
          <div class="bg6">
            <div class="left-title">价&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;格</div>
            <div class="right-content">
              <span class="price">￥{{currentPrice}}</span>
            </div>
          </div>
        </div>
        <div>
          <div class="content">
            <div class="left-title m_top_12">选&nbsp;择&nbsp;版&nbsp;本</div>
            <div class="right-content">
              <ul class="ul_item">
                <li class="li_item"
                    v-bind:class="{ select: item==currentYear,none: noProduct }"
                    v-for="item in typeAll"
                    @click="selectYear(item)">{{item}}</li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <div class="content">
            <div class="left-title m_top_12">选择内存配置</div>
            <div class="right-content">
              <ul class="ul_item">
                <li class="li_item"
                    v-for="item in memoryHas"
                    v-bind:class="{ select: item==currentMemory,none: item == noMemory }"
                    @click="selectMemory(item)">
                 {{item}}
                </li>
                <li class="li_item none"
                    v-for="item in noMemory">{{item}}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <div class="content">
            <div class="left-title m_top_12">选择CPU配置</div>
            <div class="right-content">
              <ul class="ul_item">
                <li class="li_item"
                    v-for="item1 in cpuHas"
                    v-bind:class="{ select: item1==currentCpu,none: item1 == noCpu }"
                    @click="selectCpu(item1)">
                 {{item1}}</li>
                <li  class="li_item none" v-for="key in noCpu">
                  {{key}}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <div class="content">
            <div class="m_top_12 flex">
              <el-input-number v-model="num" @change="handleChange" :min="1" :max="10" style="width: 120px;"></el-input-number>
            </div>
            <div class="flex m_l_20">
              <el-button type="warning" :disabled="canNotBuy">加入购物车</el-button>
              <el-button type="danger" :disabled="canNotBuy" @click="btnBuy()">立即购买</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sectionPro">
      <div class="titles">
        <div class="title_item"
            v-for="item in selectItem"
            v-bind:class="{ select: item==currentItem }"
            @click="selectItembtn(item)">
          {{item}}</div>
      </div>
      <div class="titler">
        <div class="h1">产品详情</div>
        <div class="content11">你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。
        </div>
        <div class="imgList">
          <img src="../../images/pic/cha.jpg" class="" alt="">
          <img src="../../images/pic/dangao.jpg" class="" alt="">
          <img src="../../images/pic/2.jpg" class="" alt="">
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import MainHeader from '@/components/header.vue'
export default {
  name: "index",
  components: {
    MainHeader,
  },
  data(){
     return{
       product: {
         name: "mac book pro",
         type: [
           {year:"2016版", memory: "4G", cpu:"i5",price:10000},
           {year:"2016版", memory: "8G", cpu:"i5", price:12000},
           {year:"2017版", memory: "8G", cpu:"i5",price:14000},
           {year:"2017版", memory: "8G", cpu:"i7",price:16000},
           {year:"2017版", memory: "16G", cpu:"i7",price:18000},
         ],
         picture: 'macbook.jpg'
       },
       typeAll:['2016版','2017版'],
       memoryAll:['4G','8G','16G'],
       cpuAll:['i5','i6','i7'],
       typeHas:[],
       memoryHas:[],
       cpuHas:[],
       isSelect:true,
       currentYear:'',
       currentMemory:'',
       currentCpu:'',
       currentPrice:'',
       noCpu:[],
       noMemory:[],
       noProduct:false,
       canNotBuy:true,
       none:true,
       num: 1,
       select:true,
       selectItem:['产品详情','产品评价'],
       currentItem:'产品详情'
     }
  },
  created:function () {
    var currentPro = this.product.type[0]
    this.currentYear = currentPro.year
    this.currentMemory = currentPro.memory
    this.currentCpu = currentPro.cpu
    this.currentPrice = currentPro.price
    this.canNotBuy = false
  },
  mounted(){
    this.hasMemoryList('2016版')
    this.hasCpuList('2016版','4G')
  },
  methods:{
    selectYear(item){
      //选择版本年限，选中一个之后，默认选择当前版本的第一个型号电脑
      this.currentYear = item
      this.hasMemoryList(item)
      this.currentMemory = ''
      this.currentCpu = ''
      this.canNotBuy = true
    },
    selectMemory(item){
      this.currentMemory = item
      this.hasCpuList(this.currentYear,item)
      this.currentCpu = ''
      this.canNotBuy = true
    },
    selectCpu(item){
      var that = this
      this.currentCpu = item
      var productList = this.product.type
      var flag = 0
      productList.forEach(index =>{
        if(index.year === that.currentYear && index.memory === that.currentMemory && index.cpu === item){
          that.currentPrice = index.price
          flag=1
        }
      })
      if(flag == 1){
        that.canNotBuy = false
      }else{
        that.canNotBuy = true
      }
    },
    handleChange(value) {
      //选择商品的数量
      console.log(value);
    },
    btnBuy(){
      if(!this.noProduct){
        this.$notify({ title: '成功', message: '下单成功！', type: 'success' })
      }
    },
    hasMemoryList(year){
      if(year == '2016版'){
        this.memoryHas  = ['4G','8G']
      }
      if(year == '2017版'){
        this.memoryHas  = ['8G','16G']
      }
      //判断不相同的值
      var result = [];
      for(var i = 0; i < this.memoryAll.length; i++){
        var value1 = this.memoryAll[i];
        var isExist = false;
        for(var j = 0; j < this.memoryHas.length; j++){
          var value2 = this.memoryHas[j];
          if(value1 == value2){
            isExist = true;
            break;
          }
        }
        if(!isExist){
          result.push(value1);
        }
      }
      this.noMemory = result
      console.log('noMemory    '+this.noMemory)
    },
    hasCpuList(year,memory){
      year = this.currentYear
      memory = this.currentMemory
      if(year == '2016版' && memory =='4G'){
        this.cpuHas = ['i5']
      }
      else if(year == '2016版' && memory =='8G'){
        this.cpuHas = ['i5']
      }
      else if(year == '2017版' && memory =='16G'){
        this.cpuHas = ['i7']
      }
      else if(year == '2017版' && memory =='8G'){
        this.cpuHas = ['i5','i7']
      }
      //判断不相同的值
      var noCpu = [];
      for(var i = 0; i < this.cpuAll.length; i++){
        var value3 = this.cpuAll[i];
        var isHas = false;
        for(var j = 0; j < this.cpuHas.length; j++){
          var value4 = this.cpuHas[j];
          if(value3 == value4){
            isHas = true;
            break;
          }
        }
        if(!isHas){
          noCpu.push(value3);
        }
      }
      this.noCpu = noCpu
      console.log("noCpu   "+this.noCpu)
    },
    selectItembtn(item){
      this.currentItem = item
    }
  }
}
</script>

<style scoped lang="stylus">
.m_top_12
  margin-top 12px
.m_l_20
  margin-left 20px
.flex
  display inline-block
.piccontent
  width 450px
  height 450px
  border 1px solid #eee
  display inline-block
  float left
.piccontent img
  width 100%
  vertical-align middle
  border 0
.detailcontent
  float left
  display inline-block
  margin-left 20px
  text-align left
  width calc(100% - 480px)
.title
  font: 700 16px Arial,"microsoft yahei"
  color #666
  padding-top 10px
  line-height 28px
  margin-bottom 5px
.content
  padding 0px 10px
  font-size 12px
.bg6
  background #f3f3f3
  padding 10px 10px
  font-size 12px
.left-title
  vertical-align top
  padding-top 6px
  width 120px
  display inline-block
  -webkit-font-smoothing: antialiased;
.right-content
  display inline-block
  width calc(100% - 160px)
.price
  color #e4393c
  font-size 22px
.ul_item
  list-style none
  padding 0
.ul_item .li_item
  border: 1px solid #ccc
  padding: 0 18px
  margin-left 7px
  min-width: 22px;
  text-align: center;
  margin-bottom 4px
  height 30px
  line-height 30px
  cursor pointer
  display inline-block
.li_item span
  width 100%
  height 30px
  display block
.ul_item .select
  border 1px solid #e3393c
.ul_item .none
  border 1px dashed #ccc
  cursor inherit
.sectionPro
  width 80%
  margin 0 auto
.titles
  width 100%
  display block
  text-align left
  border-bottom 1px solid #dadfe3
.title_item
  height 50px
  line-height 50px
  padding 0 30px
  display inline-block
  color #6b6a6b
  font-size 18px
  font-weight normal
  cursor pointer
.select
  border-bottom 2px solid rgba(255,162,0,1.00)
  color rgba(255,162,0,1.00)
.titler
  width 100%
  text-align left
  padding-top 30px
.h1:after
  display: block;
  width: 80px;
  height: 2px;
  margin-top: 10px;
  background: #ececec;
  content: "";
.content11
  margin-top 20px
  font-size 14px
  line-height 26px
  margin-bottom 20px
.imgList
  width 100%
  text-align center
  display block
  margin-top 30px
.imgList img
  display block
  margin 20px auto
  max-width 80%
</style>
