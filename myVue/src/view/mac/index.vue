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
                <li class="li_item" v-bind:class="{ select: item==currentYear }" v-for="item in type" @click="selectYear(item)">{{item}}</li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <div class="content">
            <div class="left-title m_top_12">选择内存配置</div>
            <div class="right-content">
              <ul class="ul_item">
                <li class="li_item" v-for="item in memory"  v-bind:class="{ select: item==currentMemory }" @click="selectMemory(item)">{{item}}</li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <div class="content">
            <div class="left-title m_top_12">选择CPU配置</div>
            <div class="right-content">
              <ul class="ul_item">
                <li class="li_item" v-for="item in cpu"  v-bind:class="{ select: item==currentCpu }" @click="selectCpu(item)">{{item}}</li>
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
              <el-button type="danger" :disabled="noproduct" @click="btnBuy()">立即购买</el-button>
            </div>
          </div>
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
       type:['2016版','2017版'],
       memory:['4G','8G','16G'],
       cpu:['i5','i7'],
       isSelect:true,
       currentYear:'',
       currentMemory:'',
       currentCpu:'',
       currentPrice:'',
       noproduct:false,
       num: 1
     }
  },
  created:function () {
    var currentpro = this.product.type[0]
    this.currentYear = currentpro.year
    this.currentMemory = currentpro.memory
    this.currentCpu = currentpro.cpu
    this.currentPrice = currentpro.price
  },
  methods:{
    selectYear(item){
      this.currentYear = item
    },
    selectMemory(item){
      this.currentMemory = item
    },
    selectCpu(item){
      this.currentCpu = item
    },
    handleChange(value) {
      console.log(value);
    },
    btnBuy(){
      if(!this.noproduct){
        this.$notify({ title: '成功', message: '下单成功！', type: 'success' })
      }
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
  padding: 0 13px
  margin-left 7px
  margin-bottom 4px
  height 30px
  line-height 30px
  cursor pointer
  display inline-block
.ul_item .select
  border 1px solid #e3393c
.ul_item .none
  border 1px dashed #ccc
</style>
