<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="text" :loading="imageDownloading" :disabled="!orderID" v-on:click="imageDownload">下载原图</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<el-col :span="24" class="main">
			<div class="container">
				<p class="meta-title">{{title}}</p>
				<p class="meta-summary">{{summary}}</p>
		      	<p class="meta-author">{{author}}</p>

				<!--列表-->
				<template v-for="item in photos">
					<div class="cell">
					    <img v-if="item.imgurl" v-bind:src="item.imgurl" class="cell-image"/>
					    <template v-if="item.sceneTitle">
					      	<p class="cell-text">{{item.sceneTitle}}</p>
					    </template>
					    <p class="cell-text">{{item.sceneDescription}} </p>
					    <p class="cell-text">{{item.content}} </p>
					</div>
				</template>
			</div>
			
		</el-col>
		
	</section>
</template>
<script>
	import yiya from '../../api/yiya';
	import NProgress from 'nprogress'
	export default {
		data() {
			return {
				loading: false,
				workID:'',
				orderID:'',
				summary:'',
				title:'',
				author:'',
				imageDownloading:false,
				photos: [ ]
			}
		},
		methods: {
			//获取用户列表
			workDetailFetch: function () {

				if(!(this.workID || this.orderID)){
					return;
				}

				this.loading = true;
				NProgress.start();

				if(this.orderID){
					yiya.orderWorkDetailFetch(this.orderID).then(response =>{
						
			            this.loading = false;
						NProgress.done();

						var photos = response.photos || [];
						for(var i = 0; i < photos.length; i++)
						{
							var photo = photos[i];
							var imageURL = photo.imgurl;
							if (imageURL && imageURL.indexOf("http://") == -1)
			                {
			                    photo.imgurl = "http://pic.bbyiya.com/" + imageURL;
			                }

			                photo.sceneTitle = photo.title || "";
			                photo.sceneDescription = photo.senendes || "";
						}

						this.photos = photos;

					}).catch(error =>{

						this.loading = false;
						NProgress.done();
					});
				}
				else{
					yiya.workDetail4EditFetch(this.workID).then(response =>{
						
			            this.loading = false;
						NProgress.done();

						var photos = response.detailslist || [];
						for(var i = 0; i < photos.length; i++)
						{
							var photo = photos[i];
							var imageURL = photo.imgurl
							if (imageURL && imageURL.indexOf("http://") == -1)
			                {
			                    photo.imgurl = "http://pic.bbyiya.com/" + imageURL;
			                }
						}

						this.photos = photos;
						this.author = response.author;
						this.summary = response.description;
						this.title = response.title;
						this.author = response.author;

					}).catch(error =>{

						this.loading = false;
						NProgress.done();
					});
				}
			},
			imageDownload:function(){
				if(!this.orderID)
				{
					return;
				}

				this.imageDownloading = true;
				yiya.workOriginImagesZipURLFetch(this.orderID).then(response =>{
					this.imageDownloading = false;
					var relativePath = response;
					if (relativePath)
					{
						var url = yiya.getAPIBasePath() + "/pbs/order/download?path=" + encodeURIComponent(relativePath);
						
						this.$alert('图片生成完成', '成功', {
				          confirmButtonText: '下载',
				          callback: action => {
				            window.open(url);
				          }
				        });
					}
				}).catch(error => {
					this.imageDownloading = false;
					this.$notify({ title: '错误', message: error.message || "下载失败", type: 'error' });
				});
			}
		},
		mounted() {
			var workID = this.$route.query.workID || "";
			var orderID = this.$route.query.orderID || "";
			this.orderID = orderID;
			this.workID = workID;
			if(workID || orderID)
			{
				this.workDetailFetch();
			}
		}
	};

</script>

<style scoped>


.container{
	padding-top: 30px;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 0px;
    background-color: #fff;
}

.meta-title{
	text-align: center;
	font-size: 25px;
	color: #585757;
}

.meta-author{
	text-align: right;
	margin-bottom: 30px;
}

.cell{
	padding: 30px 18px 70px 18px;
	margin: 0px 30px 40px 30px;
	box-shadow: 0px 0px 25px #aaa;
}

.cell-text{
    display: block;
    color: #bcbcbc;
}

.cell-image-wrapper{
	width: 100%;
}

.cell-image{
    /*position: absolute;*/

    width: 100%;
    /*height: 100%;*/
}

</style>