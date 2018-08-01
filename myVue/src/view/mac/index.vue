<template>
  <div class="list">
    <main-header message="MacBook Detail" returnbtn="true"></main-header>
    <div class="main-content hello">
      <div class="piccontent">
        <img v-bind:src="product.picture" alt="商品图片">
      </div>
      <div class="detailcontent">
        <div class="title">香 甜 奶 油 味 好 吃 不 腻 不 长 胖 {{product.name}}</div>
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
            <div class="left-title">选&nbsp;择&nbsp;口&nbsp;味</div>
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
            <div class="left-title">选择大小型号</div>
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
            <div class="left-title">选择食品样式</div>
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
              <el-button type="warning" :disabled="canNotBuy" @click="addCart()">加入购物车</el-button>
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
      <div class="titler" v-if="currentItem=='产品详情'">
        <div class="h1">产品详情</div>
        <div class="content11">你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。你会遇见一些人，也会不停的和一些人说再见，从陌生到熟悉，再从熟悉回到陌生，从臭味相投到分道扬镳，从相见恨晚到不如不见。
        </div>
        <div class="imgList">
          <img v-for="item in imgList"  v-bind:src="item" :key="item" class="" alt="商品图片">
        </div>
      </div>
      <div class="titler" v-if="currentItem=='产品评价'">
        <div>累计评价<span class="color ma_l_10">{{commentList.totalNumber}}</span></div>
        <div class="zongtiComment">
          <div class="width10 textcenter">
            <div class="titlln">总体评分</div>
            <div class="commentGrade">{{commentList.gradeScore}}</div>
            <div class="starGrade">
              <el-rate
                v-model="commentList.gradeScore"
                disabled
                show-score
                text-color="#ff9900"
                score-template="">
              </el-rate>
            </div>
          </div>
          <div class="width90">11</div>
        </div>
        <div class="selectItem">222</div>
        <div class="commentList">
          <ul class="conment_ul">
            <li class="conment_li" v-for="item in commentList.list" :key="item.commentId">
              <div class="width60">
                <div class="conmentFont">{{item.comment}}</div>
                <div class="conmentPic">
                  <div class="conmentPic_item" v-for="itemPic in item.commentImgList" :key="itemPic">
                    <img v-bind:src="itemPic" alt="" >
                  </div>
                </div>
                <div class="conmentTime">{{item.commentTime}}</div>
              </div>
              <div class="width30 proDescription">
                <div class="des">口味：{{item.selectDescription.taste}}</div>
                <div class="des">大小型号：{{item.selectDescription.size}}</div>
                <div class="des">样式：{{item.selectDescription.foodModel}}</div>
              </div>
              <div class="width10 conmentName">{{item.commentUserName}}(匿名)</div>
            </li>
          </ul>
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
         name: "慕斯小蛋糕",
         type: [
           {year:"抹茶味", memory: "小袋", cpu:"小方多层",price:29.99},
           {year:"抹茶味", memory: "中袋", cpu:"小方多层", price:49.99},
           {year:"草莓味", memory: "中袋", cpu:"小方多层",price:69.99},
           {year:"草莓味", memory: "中袋", cpu:"圆多层",price:89.99},
           {year:"草莓味", memory: "大袋", cpu:"圆多层",price:109.99},
         ],
         picture: 'http://www.lenuse.cn/gas/images/rr.jpg'
       },
       typeAll:['抹茶味','草莓味'],
       memoryAll:['小袋','中袋','大袋'],
       cpuAll:['小方多层','蛋糕','圆多层'],
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
       currentItem:'产品详情',
       imgList:
         ['http://www.lenuse.cn/gas/images/ww.jpg',
         'http://www.lenuse.cn/gas/images/dangao.jpg',
         'http://www.lenuse.cn/gas/images/ee.jpg',
         'http://www.lenuse.cn/gas/images/rr.jpg',
         'http://www.lenuse.cn/gas/images/cha.jpg'],
       commentList:{
         proId:13,
         totalNumber:423,
         gradeScore:4.8,
         list:[
           {
             commentId:123,
             comment:'口味棒极了，而且吃起来不腻。下次再来！',
             time:'2018-12-20',
             commentUserName:'smile******1',
             selectDescription:{
               size:'中袋',
               taste:'抹茶味',
               foodModel:'圆多层'
             },
             commentImgList:[],
             commentTime:'2018-12-23',
           },
           {
             commentId:176,
             comment:'口味棒极了，而且吃起来不腻。下次再来！',
             time:'2018-12-20',
             commentUserName:'smile******1',
             selectDescription:{
               size:'中袋',
               taste:'抹茶味',
               foodModel:'圆多层'
             },
             commentImgList:['http://www.lenuse.cn/gas/images/ww.jpg',
               'http://www.lenuse.cn/gas/images/dangao.jpg',
              ],
             commentTime:'2018-12-23',
           },
           {
             commentId:145,
             comment:'口味棒极了，而且吃起来不腻。下次再来！',
             time:'2018-12-20',
             commentUserName:'smile******1',
             selectDescription:{
               size:'中袋',
               taste:'抹茶味',
               foodModel:'圆多层'
             },
             commentImgList:[
               'http://www.lenuse.cn/gas/images/ee.jpg',
               'http://www.lenuse.cn/gas/images/rr.jpg',
               'http://www.lenuse.cn/gas/images/cha.jpg'],
             commentTime:'2018-12-23',
           },
           {
             commentId:177,
             comment:'口味棒极了，而且吃起来不腻。下次再来！',
             time:'2018-12-20',
             commentUserName:'smile******1',
             selectDescription:{
               size:'中袋',
               taste:'抹茶味',
               foodModel:'圆多层'
             },
             commentImgList:[
               'http://www.lenuse.cn/gas/images/ee.jpg',
               'http://www.lenuse.cn/gas/images/rr.jpg',
               ],
             commentTime:'2018-12-23',
           }
         ]
       }
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
    this.hasMemoryList('抹茶味')
    this.hasCpuList('抹茶味','小袋')
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
    addCart(){
      var userInfo = sessionStorage.getItem('userInfo')
      if(userInfo){
        console.log("加入购物车")
      }else{
        this.$router.push({path: '/login'})
      }
    },
    hasMemoryList(year){
      if(year == '抹茶味'){
        this.memoryHas  = ['小袋','中袋']
      }
      if(year == '草莓味'){
        this.memoryHas  = ['中袋','大袋']
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
    },
    hasCpuList(year,memory){
      year = this.currentYear
      memory = this.currentMemory
      if(year == '抹茶味' && memory =='小袋'){
        this.cpuHas = ['小方多层']
      }
      else if(year == '抹茶味' && memory =='中袋'){
        this.cpuHas = ['小方多层']
      }
      else if(year == '草莓味' && memory =='大袋'){
        this.cpuHas = ['圆多层']
      }
      else if(year == '草莓味' && memory =='中袋'){
        this.cpuHas = ['小方多层','圆多层']
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
  width 30%
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
  margin-left 40px
  text-align left
  width calc(70% - 42px)
.title
  font: 700 16px Arial,"microsoft yahei"
  color #666
  padding-top 10px
  line-height 28px
  margin-bottom 5px
.content
  padding 15px 10px
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
.ma_l_10
  margin-left 10px
.conment_ul
  margin-bottom 80px
  float left
  width 100%
.conment_li
  width 100%
  float left
  list-style none
  border-bottom 1px solid #e3e3e3
  padding-bottom 15px
  padding-top 15px
  text-align left
.width60
  width 60%
  float left
.width30
  width 30%
  float left
.width10
  width 10%
  float left
.proDescription
  text-align left
  font-size 12px
  width 15%
  float left
.des
  color #9c9c9c
  line-height 20px
.conmentFont
  line-height 20px
  font-size 12px
  color #333
  width calc(100% - 20px)
.conmentPic
  margin-top 15px
  width 100%
.conmentPic_item
  width 44px
  height 44px
  border 2px solid #f2f2f2
  margin-right 8px
  display inline-block
.conmentPic_item img
  width 40px
  height 40px
  max-width 40px
  margin 2px 2px
.conmentTime
  font-size 12px
  color #ccc
  margin-top 15px
.conmentName
  min-height 60px
  line-height 60px
  font-size 12px
  color #666
.zongtiComment
  background #ffffff
  border 1px solid #c8c8c8
  padding 20px 20px
  width calc(100% - 40px)
  margin-top 20px
  float left
.width90
  width 90%
  float left
.titlln
  color: #404040;
  font-size: 12px;
  font-weight: 100;
.commentGrade
  color: #f60;
  font-family: arial;
  font-size: 32px;
  line-height: 32px;
  margin: 5px 2px;
.textcenter
  text-align center
</style>
