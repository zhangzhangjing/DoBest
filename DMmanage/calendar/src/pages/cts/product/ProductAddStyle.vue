<template>
  <section style="padding-left: 50px;box-sizing: border-box">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item style="display: flex;justify-content:flex-end ">
          <el-button type="primary" @click="afterBtnClicked">上一步</el-button>
          <el-button type="primary" @click="nextBtnClicked">完成</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col class="productWrap">
      <div class="producttitle">制作模块</div>
      <el-select v-model="makingValue" placeholder="请选择" @change="makingChange">
        <el-option
            v-for="item in makingList"
            :key="item.label"
            :label="item.label"
            :value="item.label">
        </el-option>
      </el-select>
    </el-col>
    <el-col class="productWrap">
      <div class="sizeTitle" style="margin-left: 70px">高</div>
      <el-input style="width: 60px;margin-left: 20px;margin-right: 20px" v-model="height" placeholder=""></el-input>
      <div class="sizeTitle">宽</div>
      <el-input style="width: 60px;margin-left: 20px;margin-right: 20px" v-model="width" placeholder=""></el-input>
    </el-col>

    <el-col :span="12">
      <div class="productWrap">
        <div class="producttitle">展示模块</div>
        <el-radio v-model="radio" label="1">
          <el-select v-model="showModule" placeholder="请选择" style="width: 120px">
            <el-option
                v-for="item in showModuleList"
                :key="item.label"
                :label="item.label"
                :value="item.label">
            </el-option>
          </el-select>
        </el-radio>
        <el-radio v-model="radio" label="2">GIF图片</el-radio>
        <el-radio v-model="radio" label="3">视频</el-radio>
      </div>


      <div style="margin-left: 70px;margin-bottom: 20px">产品图</div>
      <el-upload style="margin-left: 70px"
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
    <el-col :span="12" class="productWrap" v-if="showDiy">
      <div class="diytitle">DIY展示方式</div>
      <el-select v-model="diy" placeholder="请选择">
        <el-option
            v-for="item in showModuleList"
            :key="item.label"
            :label="item.label"
            :value="item.label">
        </el-option>
      </el-select>
    </el-col>
  </section>
</template>

<script>
  import NProgress from 'nprogress'
  import api from 'src/api/api';

  export default {
    data() {
      return {
        makingList: [{
          value: '选项1',
          label: '图片'
        }, {
          value: '选项2',
          label: '无'
        }],
        showModuleList: [{
          value: '选项1',
          label: '图片翻页'
        }, {
          value: '选项2',
          label: '图片轮播'
        }, {
          value: '选项3',
          label: '图片旋转'
        }],
        makingValue: '图片',
        showModule: '图片翻页',
        height: '',
        width: '',
        radio: '1',
        diy: '',
        dialogImageUrl: '',
        dialogVisible: false,
        showDiy: true
      }
    },
    methods: {
      makingChange () {
        if (this.makingValue === '无') {
          this.showDiy = false
        } else {
          this.showDiy = true
        }
      },
      afterBtnClicked () {
        console.log()
      },
      nextBtnClicked () {

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
    margin-bottom: 20px;
  }
  .producttitle{
    width: 70px;
  }
  .sizeTitle{
    text-align: center;
  }
  .diytitle{
    margin-right: 20px;
  }
</style>
