<template>
    <div class="main-content">
      <el-input v-model="input" placeholder="接下來需要做的事項" @keyup.enter.native="addList"></el-input>
      <el-checkbox-group v-model="checkList" class='form-group'>
        <el-checkbox v-for="(item,index) of worklists" :label="item" :index='index' :key="index" class='flex'></el-checkbox>
        <el-checkbox label="选中且禁用" disabled class='flex'></el-checkbox>
      </el-checkbox-group>
       <div class='radio' style="margin-top: 20px;text-align: left;">
        <el-radio label="1" v-model="currentradio" border size="medium">全部</el-radio>
        <el-radio label="2" v-model="currentradio" border size="medium">未完成</el-radio>
        <el-radio label="3" v-model="currentradio" border size="medium">已完成</el-radio>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      input: '',
      checkList: ['选中且禁用'],
      worklists: [],
      currentradio:'1'
    }
  },
  methods: {
    addList(){
      this.worklists.unshift(this.input)
      this.input = ''
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
.form-group
  text-align left
  margin-top 15px
  max-height 650px
  overflow auto
.flex
  display block
  height 30px
.el-checkbox
  margin-left 0
.el-radio__input
  display none

</style>