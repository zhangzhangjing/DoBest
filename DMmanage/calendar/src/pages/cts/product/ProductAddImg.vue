<template>
  <section style="padding-left: 50px;box-sizing: border-box">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item style="display: flex;justify-content:flex-end ">
          <el-button type="primary" @click="afterBtnClicked">上一步</el-button>
          <el-button type="primary" @click="nextBtnClicked">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col class="productWrap">
      <div class="addimgtitle">产品名称</div>
      <el-input style="width: 200px;margin-left: 20px" v-model="productName" placeholder="请输入内容"></el-input>
    </el-col>
    <el-col class="productWrap">
      <div class="addimgtitle">商城封面图</div>
      <el-upload style="margin-left: 20px;"
          action="http://app.ttouch.com.cn/qzd/api/web/v1/index/upload"
          list-type="picture-card"
          class="upimg"
          :limit="1"
          :multiple="false"
          accept="image/*"
          :on-change="handleChange"
          :on-exceed="coverExceed"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-col>
    <el-col class="productWrap">
      <div class="addimgtitle">轮播图</div>
      <el-upload style="margin-left: 20px"
                 action="http://app.ttouch.com.cn/qzd/api/web/v1/index/upload"
                 list-type="picture-card"
                 class="upimg"
                 :limit="1"
                 :multiple="false"
                 accept="image/*"
                 :on-change="handleChange"
                 :on-exceed="coverExceed"
                 :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-col>
    <el-col class="productWrap">
      <div class="addimgtitle">详情图</div>
      <el-upload style="margin-left: 20px"
                 action="http://app.ttouch.com.cn/qzd/api/web/v1/index/upload"
                 list-type="picture-card"
                 class="upimg"
                 :limit="1"
                 :multiple="false"
                 accept="image/*"
                 :on-change="handleChange"
                 :on-exceed="coverExceed"
                 :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-col>
    <!--<div class="addimgtitle">商城封面图</div>-->
    <!--<el-upload-->
        <!--action="http://app.ttouch.com.cn/qzd/api/web/v1/index/upload"-->
        <!--:limit="10"-->
        <!--:multiple="true"-->
        <!--accept="image/*"-->
        <!--list-type="picture-card"-->
        <!--:on-preview="handlePictureCardPreview"-->
        <!--:on-change="handleChange"-->
        <!--:on-remove="handleRemove">-->
      <!--<i class="el-icon-plus"></i>-->
    <!--</el-upload>-->
    <!--<el-dialog :visible.sync="dialogVisible">-->
      <!--<img width="100%" :src="dialogImageUrl" alt="">-->
    <!--</el-dialog>-->
  </section>
</template>

<script>
  import NProgress from 'nprogress'
  import api from 'src/api/api';

  export default {
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        productName: ''
      }
    },
    methods: {
      afterBtnClicked () {
console.log()
      },
      nextBtnClicked () {
        this.$router.push({ name: 'ProductAddStyle'});
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleChange(file, fileList) {
        console.log(fileList);
      },
      coverExceed (files, fileList){
        this.$notify({
          title: '警告',
          message: '封面只能设置一张哟！',
          type: 'warning'
        });
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    },
    mounted() {
    }
  }

</script>

<style scoped>
  .productWrap{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 10px;
  }
  .addimgtitle{
    width: 70px;
  }
</style>
