<template>
	<section>
		<el-row>
			<el-col :span="24" class="toolbar">
				<el-form>
					<el-form-item>
						<span><b>业务目标</b>：让用户的分享携带自己的广告，新增广告时开启用户报名功能即可获得用户资料，点击“已报名的用户”按钮即可查看跟进，形成业务转化</br></span>
						<span><b>如何使用</b>：1 点击新增广告   2 设计并上传广告图  3 开启DM活动并挂钩广告   4 在此处查看广告效果</span>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<el-row style="float:right" v-if="selectedTab=='first'">
			<el-col :span="24" class="toolbar" >
				<el-form :inline="true">					
					<el-form-item>
						<el-input v-model="keyword" placeholder="活动名称" ></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="search" @click="search()">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<el-row style="float:left" v-else-if="selectedTab=='second'">
			<el-col :span="24" class="toolbar" >
				<el-form :inline="true">					
					<el-form-item>
						<el-button type="primary" @click="AdvertisingSet2()">新增广告</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<br/>	
		<br/>
    <!-- 新增广告 -->
    <el-dialog title="新增广告" :visible.sync="addActive" width="70%":close-on-click-modal="false">
      <template style="width:1000px;">
        <el-form :model="addForm" label-width="180px" label-position="left" >
          <el-form-item label="广告主题">
            <el-input v-model="addForm.description" placeholder="客户可见，建议示例“广告活动描述，点击立即查看”"  :maxlength="12"  style="width:80%;"></el-input>
          </el-form-item>
          <el-form-item label="开启用户报名">
            <el-switch v-model="addForm.open"></el-switch>
            <span>（用户需要填写姓名，电话，地址等信息报名广告里的活动）</span>
          </el-form-item>

         <!--  <el-form-item label="新活动默认使用该广告配置">
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
        <div  class="dialog-footer" style="height: 60px;">
            <el-button type="primary" :loading="setting" @click="saveBtnClicked" style="float:right;margin-right:20px;">保存</el-button>
        </div>
      </template>
    </el-dialog>
		<el-tabs v-model="selectedTab" style="padding:20px; margin-top: 20px;" @tab-click="handleClick">
			<!-- <el-tab-pane label="设置活动广告" name="first">				
				<el-table :data="list" v-loading="listLoading" style="width: 100%;" key="orders">
					<el-table-column type="index" width="60"></el-table-column>
					<el-table-column prop="title" label="活动名称"> </el-table-column>
					<el-table-column prop="productName" label="产品名称" > </el-table-column>
					<el-table-column prop="createTimestr" label="创建时间" > </el-table-column>
					<el-table-column  prop="options" label="广告配置" >							
						<template scope="scope">									
							<el-select v-model="scope.row.adverttitle" placeholder="请选择" @visible-change="selectok" @change="selectorChanged(scope.row,scope.row.adverttitle)">
								<el-option
								v-for="item in scope.row.options"
								:key="item.advertid"
								:label="item.description"
								:value="item.advertid">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
				</el-table> -->
				<!-- <el-col :span="24" class="toolbar">				
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total" style="float:right;">
					</el-pagination>
					<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total}}</span>
				</el-col> -->
			</el-tab-pane>
			<!--<el-tab-pane label="" name="second">-->
				<el-table :data="list2" v-loading="listLoading" style="width: 100%;" key="orders">
					<el-table-column type="index" width="60"></el-table-column>
					<el-table-column prop="description" label="广告主题"> </el-table-column>	
					<el-table-column prop="viewcount" label="广告浏览量"> </el-table-column>
					<el-table-column prop="viewpersoncount" label="广告送达人数"> 
						<template scope="scope" >
							<el-button type="text"  @click="golook(scope.row)">{{scope.row.viewpersoncount}}</el-button>
							<!--<span>{{scope.row.viewpersoncount}}</span>-->
						</template>
					</el-table-column>
					<el-table-column prop="readcount" label="广告点击量"> </el-table-column>
					<el-table-column prop="openapplication" label="用户报名" >
						<template scope="scope" >
							<span v-if="scope.row.openapplication==1">是</span>
							<span v-else>否</span>
						</template>
					</el-table-column>
					<el-table-column prop="updatetimestr" label="创建时间" > </el-table-column>
					<el-table-column  prop="status" label="操作" width="400" >
						<template scope="scope" >
							<el-button size="small"  @click="AdvertisingSet(scope.row)">编辑配置</el-button>
							<!-- <el-button size="small"  @click="Setdefault(scope.row)" :type="types" >
								<span v-if="scope.row.isdefault==1">已默认</span>
								<span v-else-if="scope.row.isdefault==0">设置默认</span>
								<span v-else>设置默认</span>
							</el-button> -->
							<el-button size="small"  @click="AlreadySignUp(scope.row)" >已报名用户</el-button>
							<el-button size="small" @click="DelAdvertising(scope.row)">删除广告</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-col :span="24" class="toolbar">				
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange2" :current-page="page2" :page-size="pageSize2" :total="total2" style="float:right;">
					</el-pagination>
					<span style="float:right;color:#475669;line-height:28px;margin-right:15px;">数量:{{total2}}</span>
				</el-col>
			<!--</el-tab-pane>-->
		</el-tabs>
	</section>
</template>
<script>
import api from "src/api/api";
import NProgress from "nprogress";
export default {
  data() {
    return {
      loading: false,
      selectedTab: JSON.parse(sessionStorage.getItem("TabName")) || "second",
      detailImageList: [],
      total: 0,
      page: 1,
      listLoading: false,
      pageSize: 10,
      list: [],
      list2: [],
      addActive: false,
      addForm: {
        open: false,
        updatetime: "",
        description: "",
        defaultimg: "",
        imglist: []
      },
      resetting: false,
      setting: false,
      uploadForm: {},
      coverUploadForm: {},
      type: "",
      keyword: "",
      page2: 1,
      keyword2: "",
      total2: 0,
      type2: 10,
      pageSize2: 10,
      // SetDefault: "设为默认",
      types: "",

      advertid: "", //广告id

      options: [],

      selecttrue: true //控制选择配置新广告
    };
  },
  methods: {
    //点击选择框
    selectok() {
      this.selecttrue = true;
    },
    //广告送达
	golook(item){
		//console.log(item.advertid)
		this.$router.push({ name: 'Userdetails',query:{id:item.advertid}})
		
	},
    //选择配置新广告
    selectorChanged(item, item2) {
      if (this.selecttrue) {
        api.ibs.setActsShareAdvert(item.actid, item2).then(res => {});
      }
    },
    //切换tab
    handleClick(tab, event) {
      sessionStorage.setItem("TabName", JSON.stringify(tab.name));

      if (tab.index == 0) {
        this.campaignsFetch();
      } else {
        this.getActivityList();
      }
    },
    //设置默认
    // Setdefault(item) {
    //   var that = this;
    //   var isdefault = "";
    //   if (item.isdefault == 1) {
    //     isdefault = 0;
    //   } else {
    //     isdefault = 1;
    //   }

    //   api.ibs.setDefaultAdverte(item.advertid, isdefault).then(res => {
    //     that.getActivityList();
    //   });
    // },

    //删除广告
    DelAdvertising(item) {
      var that = this;
      this.$confirm("将删除该广告以及报名用户信息，并重置关联的活动的广告设置，操作不可恢复。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api.ibs.deleteAdvertInfo(item.advertid).then(res => {
          that.getActivityList();
        });
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },

    // * 新增广告
    AdvertisingSet2() {
      this.addActive = true
      // this.$router.push({ name: "AdvertisingSet" });
    },
    //编辑广告
    AdvertisingSet(item) {
      this.$router.push({
        name: "AdvertisingSet",
        query: { advertid: item.advertid }
      });
    },
    //查看报名
    AlreadySignUp(item) {
      // api.ibs.joinedCustomersFetch(this.page,this.pageSize,item.advertid).then((response) => {
      // 	var list = response.list || [];
      // 	this.list = list;
      // 	if(response.list.length>0){
      this.$router.push({
        name: "AlreadySignUp",
        query: { advertid: item.advertid }
      });
      // 	}
      // }).catch(error =>{
      // 	this.listLoading = false;
      // })
    },

    //搜索
    search() {
      this.campaignsFetch();
    },

    //获取列表
    campaignsFetch: function() {
      var that = this;
      this.listLoading = true;
      NProgress.start();

      api.ibs.getShareAdvertList(this.page2, 99, this.keyword)
        .then(response => {
          var list = response.list || [];
          that.options = list;
        });

      api.ibs
        .getCalendarActivityList(this.page, this.type, this.keyword)
        .then(response => {
          var list = response.list || [];
          that.list = list;
          that.total = response.total;
          // that.options.unshift({advertid:'000',description:'配置新广告'})
          for (let i = 0; i < list.length; i++) {
            list[i].options = that.options;
          }

          NProgress.done();
          that.listLoading = false;
        })
        .catch(error => {
          that.listLoading = false;
          NProgress.done();
        });
    },

    // 广告设置列表
    getActivityList: function() {
      var that = this;
      this.listLoading = true;
      NProgress.start();

      api.ibs
        .getShareAdvertList(this.page2, this.type2, this.keyword2)
        .then(response => {
          var list = response.list || [];

          that.list2 = list;
          that.total2 = response.total;

          NProgress.done();
          that.listLoading = false;
        })
        .catch(error => {
          that.listLoading = false;
          NProgress.done();
        });
    },

    shareADInfoFetch() {
      NProgress.start();
      api.ibs
        .shareADInfoFetch()
        .then(response => {
          this.addForm.description = response.description;
          this.addForm.defaultimg = response.defaultimg;
          this.addForm.open = response.openapplication == 1;
          this.addForm.updatetime = response.updatetimestr;
          this.detailImageList = (response.imglist || []).map(item => {
            return { url: item.imgurl, status: "finished" };
          });

          NProgress.done();
        })
        .catch(error => {
          NProgress.done();
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
      var detailImages = this.detailImageList.map(item => {
        return { url: item.url };
      });
      var form = this.addForm;
      var open = form.open ? 1 : 0;
      var info = {
        defaultimg: form.defaultimg,
        description: form.description,
        openapplication: open
      };
      this.setting = true;
      api.ibs
        .shareADSetting(info, detailImages)
        .then(response => {
          this.setting = false;
          this.addActive = false;
          this.$notify({ title: "成功", message: "已保存", type: "success" });
          this.getActivityList();
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
      this.selecttrue = false;
      this.page = val;
      // this.customersFetch();
      this.campaignsFetch();
    },
    handleCurrentChange2(val) {
      this.page2 = val;
      // this.customersFetch();
      this.getActivityList();
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
    // this.customersFetch();
    // this.shareADInfoFetch();
    this.campaignsFetch();
    this.getActivityList();
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
