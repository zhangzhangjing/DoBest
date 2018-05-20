<template>
	<section>
		<el-row>
			<el-col :span="24" class="toolbar">
				<el-form>
					<el-form-item>
						<span><b>业务目标</b>：让广告主赠送的每一个产品里，都有自己的广告，成为黏在客户身边的广告</br></span>
						<span><b>如何使用</b>：为各类产品，上传符合要求的广告图，之后每个销售（赠送）的产品即可带有该广告</span>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">
					<el-form-item>
						<el-select v-model="selectIndex" placeholder="请选择" @change="selectorChanged">
							<el-option v-for="item in products" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<el-col :span="24" class="main">
      <div class="red-text"  v-show="selectIndex===7 ">
        <el-form :inline="true">
          <el-form-item >
            <el-input v-model="advertContent" :maxlength="12"  placeholder="广告图配文如DM+祝新年快乐"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button  type="primary" @click="changeContent">提交文案</el-button>
          </el-form-item>
        </el-form>
      </div>
			<div class="container">
				<el-card v-for="(item,index) in uploaders" :body-style="{ padding: '0px' }" style="" class="card">
					<!--  背景图片 -->
					<!--<img :src="item.backgroundURL" class="background-image">-->
					<el-upload class="image-uploader"
						action="https://up.qbox.me"
						:show-file-list="false"
						:data="item.uploadForm"
						:on-success="item.uploadSuccess"
						:on-error="item.uploadFail"
						:before-upload="item.beforeUpload">
						<div v-if="item.imageURL">
							<img :src="item.imageURL" class="upload-image">
						</div>
						<i v-if="item.uploading" class="el-icon-loading image-uploading-icon"></i>
						<i class="el-icon-plus image-uploader-icon"></i>
						<el-button type="text" v-if="item.imageURL" icon="delete" class="delete-button" @click.stop="clearItem(item,index)">删除</el-button>
					</el-upload>
				</el-card>
				<div class="previewImg" v-if="selectIndex==0 || selectIndex==1 || selectIndex==2 || selectIndex==3 || selectIndex==7">
					<img v-if="selectIndex==0" src="../../../assets/1.jpg">
					<img v-else-if="selectIndex==1" src="../../../assets/2.jpg">
					<img v-else-if="selectIndex==2" src="../../../assets/3.jpg">
					<img v-else-if="selectIndex==3" src="../../../assets/4.jpg">
          <img v-else-if="selectIndex==7" src="../../../assets/7.jpg">
				</div>
				<div class="previewImg2" v-else>
					<img v-if="selectIndex==4" src="../../../assets/5.jpg">
					<img v-else-if="selectIndex==5" src="../../../assets/6.jpg">
				</div>
				<div style="margin-left: 80px;" v-if="selectIndex==0 || selectIndex==1 || selectIndex==2 || selectIndex==3">
					使用建议：<br />
					<p>挂历封面广告位置图片大小30*30mm分辨率300</p>
					<p>台历广告页图片大小112*112mm分辨率300</p>
				</div>

				<div style="margin-left: 20px;" v-else>
					使用建议：<br />
					<p>挂历封面广告位置图片大小30*30mm分辨率300</p>
					<p>台历广告页图片大小112*112mm分辨率300</p>
          <p v-if="selectIndex==7">
            红包二维码图片大小16*16mm,分辨率300
          </p>
				</div>
			</div>
		</el-col>
	</section>
</template>
<script>
import api from "src/api/api";
import NProgress from "nprogress";
export default {
  data() {
    return {
      loading: false,
      productID: "",
      selectIndex: "",
      products: [],
      advertContent: "",
      uploaders: [
        {
          name: "0",
          uploading: false,
          imageURL: "",
          previewImageURL: "",
          uploadForm: {},
          beforeUpload: file => {
            return this.beforeUpload("0", file);
          },
          uploadFail: (error, file) => {
            this.uploadFail("0", error, file);
          },
          uploadSuccess: (response, file) => {
            this.uploadSuccess("0", response, file);
          }
        }
        // 	                      {name:'1', uploading:false, imageURL:'', previewImageURL:'', uploadForm:{},
        // 								  beforeUpload:file =>{return this.beforeUpload("1", file)},
        // 								  uploadFail:(error,file)=>{this.uploadFail("1", error, file);},
        // 								  uploadSuccess:(response,file)=>{this.uploadSuccess("1", response, file);}},
        // 						  {name:'2', uploading:false, imageURL:'', previewImageURL:'', uploadForm:{},
        //   								beforeUpload:file =>{return this.beforeUpload("2", file)},
        //   								uploadFail:(error,file)=>{this.uploadFail("2", error, file);},
        //   								uploadSuccess:(response,file)=>{this.uploadSuccess("2", response, file);}}
      ]
    };
  },
  methods: {
    productsFetch: function() {
      api.cts.productsFetch(1).then(response => {
          var list = response || [];
          var products = [];
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            //只显示台历
            if (item.cateid == 3) {
            }
            products.push({
              label: item.title,
              value: products.length,
              productID: item.productid,
              advertcount: item.advertcount
            });
          }

          this.products = products;

          // this.products.splice(6, 1);
          var firstItem = products[0];
          console.log('firstItem', this.products)
          if (firstItem) {
            this.selectIndex = 0;
            this.selectProduct(firstItem);
          }
        })
        .catch(error => {});
    },
    adsFetch(productID) {
      api.ibs
        .productPresetADsFetch(productID)
        .then(response => {
          var backgroundURLs = [];
          var imageURLs = [];
          //if(response.products){
          //	var urls = JSON.parse(response.products.imgjson || '[]');
          //	backgroundURLs = urls.map(item => { return item.url });
          //}
          if (response.advert) {
            this.advertContent = response.advert.advertcontent || '';
            var urls = JSON.parse(response.advert.advertimgjson || "[]");
            imageURLs = urls.map(item => {
              return item.url;
            });
          }
          for (var i = 0; i < this.uploaders.length; i++) {
            var uploader = this.uploaders[i];
            //uploader.backgroundURL = backgroundURLs[i] || '';
            uploader.imageURL = imageURLs[i] || "";
          }
        })
        .catch(error => {
          this.$notify({
            title: "错误",
            message: error.message || "失败",
            type: "error"
          });
        });
    },
    selectorChanged() {
      console.log(this.selectIndex);

      var item = this.products[this.selectIndex];
      console.log('item', this.products[6])
      if (item.advertcount == 3) {
        this.uploaders = [
          {
            name: "0",
            uploading: false,
            imageURL: "",
            previewImageURL: "",
            uploadForm: {},
            beforeUpload: file => {
              return this.beforeUpload("0", file);
            },
            uploadFail: (error, file) => {
              this.uploadFail("0", error, file);
            },
            uploadSuccess: (response, file) => {
              this.uploadSuccess("0", response, file);
            }
          },
          {
            name: "1",
            uploading: false,
            imageURL: "",
            previewImageURL: "",
            uploadForm: {},
            beforeUpload: file => {
              return this.beforeUpload("1", file);
            },
            uploadFail: (error, file) => {
              this.uploadFail("1", error, file);
            },
            uploadSuccess: (response, file) => {
              this.uploadSuccess("1", response, file);
            }
          },
          {
            name: "2",
            uploading: false,
            imageURL: "",
            previewImageURL: "",
            uploadForm: {},
            beforeUpload: file => {
              return this.beforeUpload("2", file);
            },
            uploadFail: (error, file) => {
              this.uploadFail("2", error, file);
            },
            uploadSuccess: (response, file) => {
              this.uploadSuccess("2", response, file);
            }
          }
        ];
      } else if (item.advertcount == 1) {
        this.uploaders = [
          {
            name: "0",
            uploading: false,
            imageURL: "",
            previewImageURL: "",
            uploadForm: {},
            beforeUpload: file => {
              return this.beforeUpload("0", file);
            },
            uploadFail: (error, file) => {
              this.uploadFail("0", error, file);
            },
            uploadSuccess: (response, file) => {
              this.uploadSuccess("0", response, file);
            }
          }
        ];
      }
      if (item) {
        this.selectProduct(item);
      }
    },

    selectProduct(item) {
      var productID = item.productID;
      if (productID) {
        this.adsFetch(productID);
        this.productID = productID;
      }
    },
    clearItem(item, index) {
      var images = this.uploaders.map(item => {
        return { url: item.imageURL };
      });
      images[index].url = "";

      images = images.filter(item => {
        return item.url;
      });
      let advertContent = this.advertContent
      api.ibs
        .productPresetADsSetting(this.productID, images, advertContent)
        .then(response => {
          item.imageURL = "";
          this.$notify({ title: "成功", message: "删除成功", type: "success" });
        })
        .catch(error => {
          this.$notify({
            title: "错误",
            message: error.message || "删除失败",
            type: "error"
          });
        });
    },
    beforeUpload: function(name, file) {
      var item = this.uploaders.filter(item => {
        return item.name == name;
      })[0];
      if (item) {
        item.uploading = true;
        var key = api.general.qiniuUploadKeyGenerate("ibs");
        return api.general.uploadTokenFetch().then(response => {
          var token = response.upToken;
          item.uploadForm = { key: key, token: token };
        });
      }
      return false;
    },
    uploadFail: function(name, err, file) {
      var item = this.uploaders.filter(item => {
        return item.name == name;
      })[0];
      if (item) {
        item.uploading = false;
      }
    },
    uploadSuccess(name, response, file) {
      if (response.key) {
        var imageURL = api.storageBasePath + response.key;

        var item = this.uploaders.filter(item => {
          return item.name == name;
        })[0];
        if (item) {
          item.uploading = false;
          item.imageURL = imageURL;
        }

        var images = this.uploaders.map(item => {
          return { url: item.imageURL };
        });

        images = images.filter(item => {
          return item.url;
        });
        let advertContent = this.advertContent
        api.ibs
          .productPresetADsSetting(this.productID, images, advertContent)
          .then(response => {
            this.$notify({ title: "成功", message: "添加成功", type: "success" });
          })
          .catch(error => {
            this.$notify({
              title: "错误",
              message: error.message || "添加失败",
              type: "error"
            });
          });
      }
    },
    changeContent () {
      var images = this.uploaders.map(item => {
        return { url: item.imageURL };
      });
      images = images.filter(item => {
        return item.url;
      });
      console.log('this.advertContent', this.advertContent)
      let advertContent = this.advertContent
      api.ibs.productPresetADsSetting(this.productID, images, advertContent).
      then(response => {
        this.$notify({ title: "成功", message: "添加成功", type: "success" });
      })
      .catch(error => {
        this.$notify({
          title: "错误",
          message: error.message || "添加失败",
          type: "error"
        });
      });
    }
  },
  mounted() {
    this.productsFetch();
    // this.adsFetch()
  }
};
</script>

<style scoped>
.previewImg {
  width: 200px;
  height: 100%;
  margin-left: 80px;
}

.previewImg2 {
  width: 350px;
  height: 100%;
  margin-left: 20px;
}
.previewImg2 img {
  width: 100%;
  height: 100%;
  border: 1px solid #6666;
}
.previewImg img {
  width: 100%;
  height: 100%;
}

.red-text{
  padding-left: 10px;
  padding-top: 10px;
  width: 400px;
  height: 40px;
}
.container {
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

.card {
  position: relative;
  width: 300px;
  height: 300px;
  display: inline;
  margin-bottom: 20px;
  margin-left: 30px;
}

.background-image {
  position: absolute;
  width: 300px;
  height: 300px;
  object-fit: cover;
  object-position: center;
}

.image-uploader {
  position: absolute;
  width: 178px;
  height: 178px;
  top: 20%;
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.image-uploading-icon {
  position: absolute;
  top: 15px;
  left: 50%;
}

.upload-image {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 178px;
  height: 178px;
}

.delete-button {
  position: absolute;
  top: 0px;
  right: 0px;
}
</style>
