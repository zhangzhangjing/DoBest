<template>
  <div >
    <main-header message="vuex"  returnbtn="true"></main-header>
    <div class="main-content hello">
      <el-input type="number" v-model="num" style="width: 60%;margin-right: 20px;" placeholder="请输入数字"/>
      <el-button @click="clickme">添加</el-button>
      <!--<span>{{$store.state.count}}</span>-->
      <div class="record-list">
        <el-table
          :data="$store.state.tableData"
          border
          style="width: 100%;margin-top: 20px;">
          <el-table-column
            prop="id"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="date"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="wage"
            label="金额">
          </el-table-column>
          <el-table-column
            prop="total"
            label="共计">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from './header.vue'
export default {
  name: 'CountNum',
  data () {
    return {
      num: '',
    }
  },
  components: {
    MainHeader
  },
  methods: {
    clickme: function () {
      this.$store.commit('increment', this.num)
      this.num = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.hello
  font-size 22px
  color #222
  text-align left
.record-list
  text-align left
</style>
