<template>
    <div class="main-content">
      <el-input v-model="input" placeholder="接下來需要做的事項" @keyup.enter.native="addList"></el-input>
      <el-checkbox-group v-model="checkList" class='form-group'>
        <el-checkbox
        v-for="(item,index) of filterlists"
        :index='item.id'
        :label='item.content'
        :key='item.id' class='flex'
        @change="selectTocomplete(item.id)"
        :disabled='item.iscompleted'>
        </el-checkbox>
      </el-checkbox-group>
       <div class='radio' style="margin-top: 20px;text-align: left;">
        <el-radio
          v-for='item of selects'
          v-model='currentradio'
          :label="item.label"
          :index='item.label'
          :key="item.label"
          @change='selectLists(item.label)'
           border size="medium">{{item.content}}</el-radio>
        <el-col :span='4' class='total'><span class='color-light'>{{total}}</span>条工作事项</el-col>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      input: '',
      checkList: [],
      worklists: [],
      filterlists:[],
      currentradio:1,
      id: 0,
      total:0,
      selects: [
        {label:1,content:'全部',idselected:true},
        {label:2,content:'未完成',idselected:false},
        {label:3,content:'已完成',idselected:false}
      ]
    }
  },
  methods: {
    addList(){
      var flag =0
      this.worklists.forEach(item =>{
        if(item.content === this.input.trim()){
          flag = 1
        }
      })
      if(flag == 1){
        return
      }
      if(this.input.trim() == ''){
        return
      }
      var obj ={
        id:this.id ++,
        content:this.input.trim(),
        iscompleted:false
      }
      this.worklists.unshift(obj)
      this.filterlists = this.worklists
      this.input = ''
      this.total = this.filterlists.length
      this.currentradio = 1
    },
    selectTocomplete(listid){
      var that = this
      this.worklists.forEach(item =>{
        if(item.id == listid){
          item.iscompleted = true
        }
      })
    },
    selectLists(curselectid){
      if(curselectid ===1){
          this.filterlists = this.worklists
      }
      if(curselectid ===2){
         this.filterlists =  this.worklists.filter(item =>{
            return item.iscompleted ==false
         })
      }
      if(curselectid ===3){
        this.filterlists = this.worklists.filter(item =>{
          return item.iscompleted == true
        })
      }
       this.total = this.filterlists.length
    },
  }
}
</script>

<style scoped lang="stylus">
.main-content
  width 80%
  padding 20px
  min-height 500px
  margin 0 auto
  background #fff
  margin-top 80px
.form-group
  text-align left
  margin-top 15px
  height 400px
  overflow auto
.flex
  display block
  height 30px
.el-checkbox
  margin-left 0
.el-radio__input
  display none
.total
  color #666
  float right
  text-align right
  font-size 13px
.color-light
  color #d03438
  margin-right 5px

</style>
