<template>
  <div >
    <main-header message="钱包入账明细"  returnbtn="true"></main-header>
    <div class="main-content hello">
      <el-input type="number" v-model="num" style="width: 60%;margin-right: 20px;" placeholder="请输入金额"/>
      <el-button @click="clickBtn()">添加</el-button>
      <div class="record-list">
        <template>
          <el-table
            :data="tableData"
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
            <el-table-column
              prop="mark"
              label="备注">
            </el-table-column>
            <el-table-column label="操作"   width="140" fixed="right">
              <template scope="scope">
                <el-button size="small" @click="editItem(scope.row)">修改信息</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>

        <el-dialog title="修改信息" :visible.sync="editFormVisible">
          <el-form :model="addForm" label-width="40px" :rules="addFormRules" ref="addForm">
            <el-form-item label="金额" prop="title">
              <el-input v-model="addForm.title"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="description">
              <el-input type="textarea" :rows="5" v-model="addForm.description"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editWageSubmit">提交</el-button>
          </div>
        </el-dialog>

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
      id:1,
      tableData:[],
      currentWage:0,
      editFormVisible:false,
      addForm:{},
      addFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      addLoading: false,
      loading:false,
    }
  },
  components: {
    MainHeader
  },
  methods: {
    clickBtn () {
      if(this.num*1){
        this.currentWage += this.num * 1
        var date = new Date();
        var nowtime = date.getFullYear()+"/"+(date.getMonth()+1)*1+"/"+date.getDate()+"  "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
        var record = {
          id: this.id ++,
          date: nowtime,
          wage: (this.num*1).toFixed(2),
          total: (this.currentWage*1).toFixed(2)
        }
        this.tableData.push(record)
      }
      this.num = ''
    },
    getDataList(){
      var List = [
        {
          id: 220,
          date: '2018/2/23 18:0:48',
          wage: 200.00,
          total: 0,
          mark: '淘宝入账'
        },
        {
          id: 221,
          date:  '2018/2/23 18:0:48',
          wage: 120.00,
          total: 0,
          mark: '2月份兼职工资'
        },
        {
          id: 222,
          date:  '2018/2/23 18:0:48',
          wage: 20.00,
          total: 0,
          mark: '抢红包'
        },
        {
          id: 223,
          date:  '2018/2/23 18:0:48',
          wage: 100.00,
          total: 0,
          mark: '竞猜中奖'
        }
      ]
      this.tableData = List
      List[0].total = 0
      List.forEach((item,index) =>{
        this.currentWage += item.wage
        for(var i=0;i<=index;i++){
          List[index].total += List[i].wage
        }
      })
    },
    editItem(){
      this.editFormVisible = true
    },
    editWageSubmit(){
      this.editFormVisible = false
    }
  },
  mounted(){
    this.getDataList()
  },
}
</script>

<style lang="stylus" scoped>
.hello
  font-size 22px
  color #222
  text-align left
.record-list
  text-align left
.v-modal
  z-index 0
</style>
