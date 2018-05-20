<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item>
            <el-button @click="schematicDiagram">模板示意图</el-button>
          </el-form-item>

          <el-form-item>
            <el-button @click="addBtnTapped">添加广告模板</el-button>
          </el-form-item>
        </el-form>
      </el-col>

    </el-row>

    <el-col :span="24" class="main">
      <div class="container">
        <!--列表-->
        <template v-for="(item,index) in photos">
          <el-card :body-style="{ padding: '0px' }" style="" class="card">
            <img v-if="item.layerimgpreview" v-bind:src="item.layerimgpreview" class="image" @click="orginBtnTapped(item)">
            <img v-else src="../../../assets/addphoto.jpeg" class="add-image" @click="addBtnTapped()">

            <div class="bottom clearfix">
              <el-button type="text" class="button" @click="editBtnTapped(item)">编辑</el-button>
              <el-button type="text" class="button" @click="clearItem(item)">删除</el-button>
            </div>
          </el-card>
        </template>

        <el-card :body-style="{ padding: '0px' }" style="" class="card">
          <img src="../../../assets/addphoto.jpeg" class="add-image-large"  @click="addBtnTapped">
        </el-card>
      </div>
    </el-col>

    <!--新增界面-->
    <el-dialog title="添加广告模板" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">

      <!--   <el-form-item label="顺序编号">
          <el-input v-model="addForm.sort"></el-input>
        </el-form-item> -->
        <!-- 后端接口 -->
        <el-form-item label="模板命名">
          <!-- v-model="" -->
          <el-input ></el-input>
        </el-form-item>
        <div style="display: flex">
          <el-form-item label="高">
            <el-input v-model="addForm.height" placeholder="" style="width: 100px"></el-input>
          </el-form-item>
          <el-form-item label="宽">
            <el-input v-model="addForm.width" placeholder="" style="width: 100px"></el-input>
        </el-form-item>
        </div>


        <el-form-item label="圆形">
          <el-switch v-model="addForm.isround"></el-switch>
        </el-form-item>

        <el-form-item v-for="item in uploaders" :label="item.label">
          <el-upload class="image-uploader"
                     action="https://up.qbox.me"
                     :show-file-list="false"
                     :data="item.uploadForm"
                     :on-success="item.uploadSuccess"
                     :on-error="item.uploadFail"
                     :before-upload="item.beforeUpload">
            <div v-if="item.previewImageURL">
              <img :src="item.previewImageURL" class="upload-image">
              <i v-if="item.uploading" class="el-icon-loading image-uploading-icon"></i>
            </div>
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <div  style="display: flex">
          <el-form-item label="广告图坐标设置">
            <el-input v-model="addForm.up" size="small"  style="width: 70px;margin-right:10px"></el-input>
            <el-input v-model="addForm.down" size="small" style="width: 70px;margin-right:10px"></el-input>
            <el-input v-model="addForm.left" size="small" style="width: 70px;margin-right:10px"></el-input>
            <el-input v-model="addForm.right" size="small" style="width: 70px;margin-right:10px"></el-input>
          </el-form-item>
        </div>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="submitBtnTapped" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

    <!--模版示意图-->
    <el-dialog title="商户示意设置" :visible.sync="sketchFormVisible" :close-on-click-modal="false">
      <el-form :model="sketchForm" label-width="120px" :rules="addFormRules" ref="addForm">


        <el-form-item v-for="item in sketchuploaders" :label="item.label">
          <el-upload class="image-uploader"
                     action="https://up.qbox.me"
                     :show-file-list="false"
                     :data="item.uploadForm"
                     :on-success="item.uploadSuccess"
                     :on-error="item.uploadFail"
                     :before-upload="item.beforeUpload">
            <div v-if="item.previewImageURL">
              <img :src="item.previewImageURL" class="upload-image">
              <i v-if="item.uploading" class="el-icon-loading image-uploading-icon"></i>
            </div>
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <div  style="display: flex">
          <el-form-item label="文字示意">
            <el-input v-model="sketchForm.font" style="width: 500px"></el-input>
          </el-form-item>
        </div>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="sketchFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="submitBtnTapped" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="originImageDialogVisible" size="full">
      <img width="100%" :src="originImageURL" alt="">
    </el-dialog>


  </section>
</template>
<script>
  import api from 'src/api/api';
  import ImageUtil from 'common/js/ImageUtil.js';
  import ViewUtil from 'common/js/ViewUtil.js';
  import YiyaUtil from 'common/js/YiyaUtil.js';
  import StringUtil from 'common/js/StringUtil.js';
  import NProgress from 'nprogress'
  var $ = require("jquery");
  export default {
    data() {
      return {
        loading: false,
        styleID:'',
        description:'',
        title:'',
        author:'',
        photos: [ ],
        fileValue:'',
        downloading:false,
        isCover:false,

        addFormVisible: false,//新增界面是否显示
        sketchFormVisible: false,
        addLoading: false,
        addFormRules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 0, max: 15, message: '不能超过15个字', trigger: 'blur' }
          ]
        },

        originImageDialogVisible: false,
        originImageURL:'',

        // settingFormVisible: false,
        settingFormImage: { },
        settingFormTag: { },
        settingFormFront: { },



        //新增界面数据
        addForm: { },
        uploadForm:{},
        uploading:false,
        uploaders:[{name:'compress', label:"打印模板", uploading:false, imageURL:'', previewImageURL:'', uploadForm:{},
          beforeUpload:file =>{return this.beforeUpload("compress", file)},
          uploadFail:(error,file)=>{this.uploadFail("compress", error, file);},
          uploadSuccess:(response,file)=>{this.uploadSuccess("compress", response, file);}}
        ],


        sketchForm: {},
        sketchuploaders:[{name:'compress', label:"实物广告示意图", uploading:false, imageURL:'', previewImageURL:'', uploadForm:{},
          beforeUpload:file =>{return this.beforeUpload("compress", file)},
          uploadFail:(error,file)=>{this.uploadFail("compress", error, file);},
          uploadSuccess:(response,file)=>{this.uploadSuccess("compress", response, file);}}
        ],


      }
    },
    methods: {
      //获取用户列表
      workDetailFetch: function () {
        var that = this;
        this.loading = true;
        NProgress.start();
        var workID = this.workID;
        api.cts.styleTemplateFetch(this.styleID).then(response =>{

          this.loading = false;
          NProgress.done();

          var photos = response.styleList || [];
          for(var i = 0; i < photos.length; i++)
          {
            var photo = photos[i];
            photo.pdid = photo.pdid || 0;
            photo.deleting = false;
            photo.omitTitle = (i + 1) + ".  " + YiyaUtil.omit(photo.title, 18);
            photo.omitDescription = YiyaUtil.omit(photo.description, 40);
            photo.omitContent = YiyaUtil.omit(photo.content, 40);
          }

          this.photos = photos;
          this.settingFormImage=response.imgcoorddata || { "pointleft":0, "pointtop":0, "pointhight":0, "pointwidth":0};
          this.settingFormTag=response.printcoorddata || { "pointleft":0, "pointtop":0, "pointhight":0, "pointwidth":0};
          this.settingFormFront=response.fontimgcoorddata || { "pointleft":0, "pointtop":0, "pointhight":0, "pointwidth":0};
          this.settingFormTag.pointhight=this.settingFormTag.pointhight|| 0;
          this.settingFormTag.pointwidth=this.settingFormTag.pointwidth|| 0;
          this.description = response.description;
          this.title = response.title;
          this.author = response.author;

        }).catch(error =>{
          this.loading = false;
          NProgress.done();
        });
      },
      settingSubmitBtnTapped(){
        this.addLoading = true;
        var image = this.settingFormImage;
        var tag = this.settingFormTag;
        var front = this.settingFormFront;
        $.each(image, function(i, val) {
          if(!val){
            image[i]=0;
          }
        });
        $.each(tag, function(i, val) {
          if(!val){
            tag[i]=0;
          }
        });
        $.each(front, function(i, val) {
          if(!val){
            front[i]=0;
          }
        });
        api.cts.modifyStyleTemplateCoordinate(this.styleID, image, tag, front).then(response =>{
          // this.settingFormVisible = false;
          this.addLoading = false;
          this.$notify({ title: '成功', message: '修改成功', type: 'success' });
        }).catch(error =>{
          this.addLoading = false;
          this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
        })
      },
      //显示新增界面
      addBtnTapped: function () {
        this.setUploaderImageURL('compress', '');
        this.setUploaderImageURL('origin', '');
        var form = {sort:0, isround:false, layerimg:"", layerimgpreview:""};
        this.addForm = form;
        this.addFormVisible = true;
      },
      schematicDiagram: function () {
        this.setUploaderImageURL('compress', '');
        this.setUploaderImageURL('origin', '');
        var form = {img:'', font: ''};
        this.sketchForm = form;
        this.sketchFormVisible = true;
      },
      editBtnTapped:function(item)
      {
        var form = Object.assign({}, item);
        form.isround = item.isround == 1;
        this.setUploaderImageURL('compress', item.layerimgpreview);
        this.setUploaderImageURL('origin', item.layerimg);
        this.addForm = form;
        this.addFormVisible = true;
      },
      orginBtnTapped(item){
        this.originImageDialogVisible = true;
        this.originImageURL = item.layerimg;
      },
      clearItem:function(item)
      {
        this.$confirm('确认删除该照片吗?', '提示', { type: 'warning' }).then(() => {
          item.deleting = true;
          NProgress.start();
          api.cts.removeStyleTemplatePhoto(item.id).then(res =>{
            this.workDetailFetch();
            item.deleting = false;
            NProgress.done();
            this.$notify({ title: '成功', message: '删除成功', type: 'success' });
          }).catch(error => {
            item.deleting = false;
            this.$notify({ title: '错误', message: error.message || "删除失败", type: 'error' });
          });

        }).catch(() => {
          console.log("取消按钮");
        });
      },
      submitBtnTapped(){
        console.log(this.addForm.id)
        var id = this.addForm.id;
        var modify = id ? true : false;
        modify ? this.modifyStyleTemplatePhoto() : this.addStyleTemplatePhoto();
      },
      addStyleTemplatePhoto(){
        var form = Object.assign({}, this.addForm);
        form.styleid = this.styleID;
        form.isround = form.isround ? 1 : 0;
        this.addLoading = true;
        api.cts.addStyleTemplatePhoto(form).then(response =>{
          this.workDetailFetch();
          this.addFormVisible = false;
          this.addLoading = false;
          this.$notify({ title: '成功', message: '添加成功', type: 'success' });
        }).catch(error =>{
          this.addLoading = false;
          this.$notify({ title: '错误', message: error.message || "失败", type: 'error' });
        })
      },
      modifyStyleTemplatePhoto(){
        var form = Object.assign({}, this.addForm);
        form.isround = form.isround ? 1 : 0;
        var parmas = { "id": '2001', "layerimg":form.layerimg,"layerimgpreview":form.layerimgpreview,
          "sort":form.sort, "isround":form.isround};
        this.addLoading = true;
        // api.cts.modifyStyleTemplatePhoto(parmas).then(response =>{
        //   this.workDetailFetch();
        //   this.addFormVisible = false;
        //   this.addLoading = false;
        //   this.$notify({ title: '成功', message: '添加成功', type: 'success' });
        // }).catch(error =>{
        //   this.addLoading = false;
        //   this.$notify({ title: '错误', message: error.message || "失败", type: 'error' });
        // })
      },
      beforeUpload:function(name, file){
        var item = this.uploaders.filter(item =>{return item.name == name})[0];
        if(item){
          item.uploading = true;
          var key = api.general.qiniuUploadKeyGenerate("cts")
          return api.general.uploadTokenFetch().then(response => {
            var token = response.upToken;
            item.uploadForm = {key:key, token:token};
          })
        }
        return false;
      },
      uploadFail:function(name, err, file){
        var item = this.uploaders.filter(item =>{return item.name == name})[0];
        if(item){
          item.uploading = false;
        }
      },
      uploadSuccess(name, response, file) {

        if (response.key) {
          var imageURL = "http://pic.bbyiya.com/" + response.key;
          var item = this.setUploaderImageURL(name, imageURL);
          if(item){
            item.uploading = false;
          }

          if (name == 'compress'){
            var form = this.addForm;
            form.layerimgpreview = imageURL;
            this.addForm = form;
          }else if (name == 'origin'){
            var form = this.addForm;
            form.layerimg = imageURL;
            this.addForm = form;
          }
        }
        console.log(imageURL)
      },
      setUploaderImageURL:function(name, imageURL){
        if (!name){
          return;
        }
        imageURL = imageURL || "";
        var item = this.uploaders.filter(item =>{return item.name == name})[0];
        if(item){
          var previewImageURL = imageURL ? imageURL + '?imageView2/2/w/200/q/80' : ''
          item.previewImageURL = previewImageURL;
          return item;
        }
        return null;
      }


    },
    mounted() {
      var styleID = this.$route.query.style_id;
      if(styleID)
      {
        this.styleID = parseInt(styleID);
        this.workDetailFetch();
      }



    }//end mounted
  };

</script>

<style scoped>


  .container{
    padding-top: 30px;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 0px;
    background-color: #fff;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .card{
    width: 312px;
    height:400px;
    display: inline;
    margin-bottom: 20px;
    margin-left: 30px;
  }

  .card:first-child{
    /*margin-left: 0;*/
  }


  .bottom {
    /*line-height: 50px;*/
    position: relative;
    bottom: 0;

    padding: 0 10px;
  }

  .button {
    position: relative;
    right: 0px;
    padding: 0;
    float: right;
    margin-left: 15px;
  }



  .image {
    width: 100%;
    height: 370px;
    display: block;
    object-position: center;
    object-fit: contain;
    overflow: hidden;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }


  .browse-button{
    overflow: hidden;
  }

  .add-image{
    background-color: #ededed;
    width: 100%;
    height: 250px;
    display: block;
    object-position: center;
  }

  .add-image-large{
    width: 100%;
    height: 400px;
    object-fit: cover;
    object-position: center;

  }


  .image-uploader {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .image-uploader:hover {
    border-color: #20a0ff;
  }

  .image-uploader-icon
  {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .image-uploading-icon
  {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .upload-image
  {
    width: 178px;
    height: 178px;
    top: 0px;
    left: 0px;
    position: absolute;
    /*display: block;*/
  }

</style>
