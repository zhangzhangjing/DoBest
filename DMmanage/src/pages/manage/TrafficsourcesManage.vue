<template>
  <section>

    <!--列表-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true">
            <el-form-item>
                <el-radio-group v-model="status" style="display: block;" @change="radioGroupChanged">
                    <el-radio-button label="-1">全部</el-radio-button>
                    <el-radio-button label="1">审核通过</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-input v-model="name" placeholder="流量主名字"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="phone" placeholder="流量主电话"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="search" @click="search()"></el-button>
            </el-form-item>

        </el-form>
    </el-col>

    <el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column prop="name" label="名称" width="200"> </el-table-column>
        <el-table-column prop="mobilephone" label="电话" width="140"> </el-table-column>
        <el-table-column prop="uid" label="咿呀号" width="100"> </el-table-column>
        <el-table-column prop="statusString" label="审核状态" width="130"> </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="160"> </el-table-column>
        <el-table-column label="操作" width="200">
            <template scope="scope">
                <el-button size="small" @click="showDetail(scope.$index, scope.row)">审核</el-button>
                <el-button type="danger" size="small" @click="deleteHandle(scope.$index, scope.row)">删除</el-button>
                <el-button size="small" @click="showData(scope.$index, scope.row)">数据</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
      </el-pagination>
      <span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
    </el-col>


  </section>
</template>

<script>
  import NProgress from 'nprogress'
  import yiya from '../../api/yiya';

  export default {
    data() {
      return {
          status:-1,
          name:'',
          phone:'',
          list: [],
          total: 0,
          page: 1,
          pageSize:0,
          listLoading: false,
          deleting:false
      }
    },
    methods: {
      //获取用户列表
      getApplicationList:function(){
        this.listLoading = true;
        NProgress.start();
        var status = this.status == -1 ? "" : this.status;
        yiya.trafficsourcesApplicationsFetch(this.page, status, this.name, this.phone).then(response => {

          var list = response.list || [];
          var count = list.length || 0;
          for(var i = 0;i<count;i++)
          {
              var item = list[i];
              item.uid = item.userid;
              item.statusString = yiya.applicationStatusDescFecth(item.status || 0);
          }
          this.list = list;
          this.total = response.total;

          this.listLoading = false;
          NProgress.done();
        }).catch(error =>{
          this.listLoading = false;
          NProgress.done();
        });

      },
      showDetail:function(index, item){
            var uid = item.uid;
            if(uid){
                this.$router.push({ name: 'FreelanceApplicationDetail', query: { uid:uid}});
            }
      },
      showData:function(index, item){
            var uid = item.uid;
            if(uid){
                this.$router.push({ name: 'Trafficsources2', query: { uid:uid}});
            }
      },
      deleteHandle:function(index, item){

            this.$confirm('确认删吗?', '提示', { type: 'warning' }).then(() => {
                this.deleting = true;
                NProgress.start();
                yiya.removeTrafficsources(item.uid).then(res =>{
                    this.getApplicationList();
                    this.deleting = false;
                    NProgress.done();
                    this.$notify({ title: '成功', message: '删除成功', type: 'success' });
                }).catch(error => {
                    this.deleting = false;
                    this.$notify({ title: '错误', message: error.message || "删除失败", type: 'error' });
                });

            });
      },
      radioGroupChanged:function(value){
            this.getApplicationList();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getApplicationList();
      },
      search:function(){
        this.getApplicationList();
      }


    },
    mounted() {
      this.pageSize = yiya.CountPerPage;
      this.getApplicationList();
    }
  }

</script>

<style scoped>

</style>
