<template>
	<section>
		<!-- <el-row>
			<el-col :span="24" class="toolbar">
				<el-form>
					<el-form-item>
						<span><b>业务目标</b>：让用户的分享带上自己的广告，推广自己的活动，用户可以报名参与，客服跟进客户形成转化</br></span>
						<span><b>如何使用</b>：1 设计并上传广告图   2举办活动，扩散广告   3 处理报名广告活动的客户</span>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row> -->
				<br/><br/><br/>
			<div style="margin-left:19px;">
				<el-form :model="addForm" label-width="180px" label-position="left" >
					<el-form-item label="广告主题">
						<el-input v-model="addForm.description" placeholder="客户可见，建议示例“广告活动描述，点击立即查看”"  :maxlength="12"  style="width:80%;"></el-input>
					</el-form-item>
					<el-form-item label="开启用户报名">
						<el-switch v-model="addForm.open"></el-switch>
						<span>（用户需要填写姓名，电话，地址等信息报名广告里的活动）</span>
					</el-form-item>
<!-- 
					<el-form-item label="新活动默认使用该广告配置">
						<el-checkbox v-model="addForm.checked"></el-checkbox>
					</el-form-item> -->

					<el-form-item label="上次提交时间">
						<span>{{addForm.updatetime}}</span>
					</el-form-item>
					<el-form-item label="顶部广告图(750x260)">
						<el-upload class="image-uploader"
							action="https://up.qbox.me"
							:show-file-list="false"
							:data="coverUploadForm"
							:on-success="coverUploadSuccess"
							:on-error="coverUploadFail"
							:before-upload="coverBeforeUpload">
							<div v-if="addForm.defaultimg">
								<img :src="addForm.defaultimg" class="upload-image">
							</div>
							<!-- <i v-if="item.uploading" class="el-icon-loading image-uploading-icon"></i> -->
							<i class="el-icon-plus image-uploader-icon"></i>
						</el-upload>
					</el-form-item>

					<el-form-item label="详情图">
						<span>（限宽640。长图裁切分块按顺序上传，页面体验更佳）</span>
						<el-upload
							action="https://up.qbox.me"
							list-type="picture-card"
							:show-file-list="true"
							:file-list="detailImageList"
							:data="uploadForm"
							:on-remove="detailFileRemove"
							:on-change="detailUploaderChanged"
							:on-success="detailUploadSuccess"
							:before-upload="detailBeforeUpload">
							<i class="el-icon-plus"></i>
						</el-upload>
					</el-form-item>
				</el-form>
			</div>
				<!-- <el-button type="primary" :loading="resetting" @click="resetBtnClicked" style="float:right;">清除</el-button> -->
				<el-button type="primary" :loading="setting" @click="saveBtnClicked" style="float:right;margin-right:20px;">保存</el-button>

	</section>
</template>
<script>
import api from "src/api/api";
import NProgress from "nprogress";
export default {
  data() {
    return {
      loading: false,
      selectedTab: "first",
      detailImageList: [],
      total: 0,
      page: 1,
      listLoading: false,
      pageSize: 10,
      list: [],
      addForm: {
        open: false,
        updatetime: "",
        description: "",
        defaultimg: "",
        imglist: []
        // checked: false
      },
      resetting: false,
      setting: false,
      uploadForm: {},
      coverUploadForm: {},

      advertid: this.$route.query.advertid || null
    };
  },
  methods: {
    shareADInfoFetch() {
      NProgress.start();
      api.ibs.getPromoterShareAdvertById(this.advertid).then(response => {
          this.addForm.description = response.description;
          this.addForm.defaultimg = response.defaultimg;
          this.addForm.updatetime = response.updatetimestr;

          if (response.isdefault == 0) {
            this.addForm.checked = false;
          } else if (response.isdefault == 1) {
            this.addForm.checked = true;
          }
          if (response.openapplication == 0) {
            this.addForm.open = false;
          } else {
            this.addForm.open = true;
          }

          this.detailImageList = (response.imglist || []).map(item => {
            return { url: item.imgurl, status: "finished" };
          });
          NProgress.done();
        })
        .catch(error => {
          NProgress.done();
        });
    },

    customersFetch: function() {
      this.listLoading = true;
      api.ibs
        .joinedCustomersFetch(this.page)
        .then(response => {
          var list = response.list || [];
          this.list = list;
          this.total = response.total;
          this.listLoading = false;
        })
        .catch(error => {
          this.listLoading = false;
        });
    },
    resetBtnClicked() {
      this.resetting = true;
      api.ibs
        .shareADReset()
        .then(response => {
          this.resetting = false;
          this.addForm.description = "";
          this.addForm.defaultimg = "";
          this.addForm.open = false;
          this.addForm.checked = false;
          this.detailImageList = [];
          this.$notify({ title: "成功", message: "已清除", type: "success" });
        })
        .catch(error => {
          this.resetting = false;
          this.$notify({
            title: "错误",
            message: error.message || "清除失败",
            type: "error"
          });
        });
    },

    saveBtnClicked() {
      var isdefault = "";
      if (this.addForm.checked == true) {
        isdefault = 1;
      } else {
        isdefault = 0;
      }

      var detailImages = this.detailImageList.map(item => {
        return { url: item.url };
      });

      var form = this.addForm;
      var open = form.open ? 1 : 0;
      var info = {
        advertid: this.advertid,
        defaultimg: form.defaultimg,
        description: form.description,
        openapplication: open,
        isdefault: isdefault
      };

      this.setting = true;
      api.ibs
        .shareADSetting(info, detailImages)
        .then(response => {
          this.setting = false;
          this.$notify({ title: "成功", message: "已保存", type: "success" });
        })
        .catch(error => {
          this.setting = false;
          this.$notify({
            title: "错误",
            message: error.message || "保存失败",
            type: "error"
          });
        });
    },

    handleCurrentChange(val) {
      this.page = val;
      this.customersFetch();
    },
    coverBeforeUpload: function(file) {
      var key = api.general.qiniuUploadKeyGenerate();
      return api.general.uploadTokenFetch().then(response => {
        var token = response.upToken;
        this.coverUploadForm = { key: key, token: token };
      });
    },
    coverUploadFail: function(error, file) {
      // item.uploading = false;
    },
    coverUploadSuccess(response, file, fileList) {
      if (response.key) {
        var imageURL = "http://pic.bbyiya.com/" + response.key;
        var form = this.addForm;
        form.defaultimg = imageURL;
        this.addForm = form;
      }
    },
    detailBeforeUpload: function(file) {
      var key = api.general.qiniuUploadKeyGenerate();
      return api.general.uploadTokenFetch().then(response => {
        var token = response.upToken;
        this.uploadForm = { key: key, token: token };
      });
    },
    detailUploadSuccess(response, file, fileList) {
      if (response.key) {
        var imageURL = "http://pic.bbyiya.com/" + response.key;
        file.url = imageURL;
      }
      this.detailImageList = fileList;
      console.log("detailUploadSuccess", fileList.length);
    },
    detailFileRemove(file, fileList) {
      this.detailImageList = fileList;
      console.log("detailFileRemove", fileList.length);
    },
    detailUploaderChanged(file, fileList) {
      this.detailImageList = fileList;
    }
  },
  mounted() {
    this.customersFetch();
    this.shareADInfoFetch();
  }
};
</script>

<style scoped>
.image-uploader {
  width: 750px;
  height: 260px;
  top: 30%;
  left: 20%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
}

.image-uploader:hover {
  border-color: #20a0ff;
}

.image-uploader-icon {
  position: absolute;
  font-size: 28px;
  color: #8c939d;
  width: 750px;
  height: 260px;
  line-height: 260px;
  text-align: center;
}

.image-uploading-icon {
  position: absolute;
  top: 15px;
  left: 50%;
}

.upload-image {
  position: absolute;
  border: 1px dashed #d9d9d9;
  left: 0px;
  top: 0px;
  width: 750px;
  height: 260px;
}
</style>
