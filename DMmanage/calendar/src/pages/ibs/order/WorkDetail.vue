<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<!-- <el-form-item>
					<el-button type="text" :loading="imageDownloading" :disabled="!orderID" v-on:click="imageDownload">下载原图</el-button>
				</el-form-item> -->
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

					    <img v-if="item.imageURL" v-bind:src="item.imageURL" class="cell-image"/>

					</div>
				</template>
			</div>

		</el-col>

	</section>
</template>
<script>
	import api from 'src/api/api';
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
					api.pbs.orderWorkDetailFetch(this.orderID).then(response =>{

			            this.loading = false;
						NProgress.done();
						var photos = response.imgLayList || [];
						for(var i = 0; i < photos.length; i++)
						{
							var photo = photos[i];
							var imageURL = photo.workImgUrl;
							photo.imageURL = imageURL;
						}
						this.photos = photos;

					}).catch(error =>{

						this.loading = false;
						NProgress.done();
					});
				}
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
