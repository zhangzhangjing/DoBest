<template>
	<section>
		<div class="clientPreviewPage">

		    <div class="clientPreviewHeader">
		      <span class="clientID">咿呀号：{{uid}}</span>
		      <p>{{statusString}}</p>
		    </div>

		      <div class="clientStatus">
		        <ul class="businessStatusList">

		            <li>
		                <span class="informationTitle">您的称呼：{{name}}</span>
		            </li>

		            <li>
		                <span>粉丝量截图：</span>
		                <img v-bind:src="licenceImagePreviewURL" id="licenceBrowse" @click="imageClicked(licenceImageURL)"/>
		            </li>
		        </ul>
		        <div class="additionalInfor">
		          <span>附加信息：</span>
		          <div class="addCont">{{remark}}</div>
		        </div>
		      </div>

		      <div class="submit">
			      	<template v-if="status == 0">
			      		<el-button type="warning" size="large" :loading="handling" class="submit-button" @click="reviewBtnTapped(2)">拒绝</el-button>
			      		<el-button type="success" size="large" :loading="handling" class="submit-button" @click="reviewBtnTapped(1)">通过</el-button>
			        </template>
			        <template v-else>
			            <div class="submit-status">{{statusString}}</div>
			        </template>
		      </div>


		    </div>

		  </div>

	</section>
</template>

<script>
  import NProgress from 'nprogress'
  import yiya from '../../api/yiya';

  export default {
    data() {
      return {
        	entity:'',
		    uid:'',
		    name:'',
		    phone:'',
		    handling:false,

		    licenceImageURL:'',
		    licenceImagePreviewURL:'',
		    licenceImageUploading:false,
		    remark:'',

		    statusString:'',
		    status:1
      	}
    },
    methods: {
      //获取用户列表
      	applicationDetailFetch:function(headquarters, uid){
        	var that = this;

	        yiya.trafficsourcesApplicationDetailFetch(this.uid).then(function(response){
		        that.statusString = response.msg;
		        var info = response.list[0];
		        if(info)
		        {
		        	var status = info.status || 0;
		            that.phone = info.mobilephone;
	                that.name = info.name;
		            that.remark = info.remark;
		            that.licenceImageURL = info.certificateimg;
		            that.licenceImagePreviewURL = info.certificateimg + '?imageView2/2/w/200/q/80';
                	that.status = status;
                	that.statusString = yiya.applicationStatusDescFecth(status);
		        }
		    }).catch(function(error){});

      },
      reviewBtnTapped:function(action)
      {
	        var uid = this.uid;
	        var that = this;
	        this.handling = true;
	        yiya.trafficsourcesApplicationReview(uid, action).then(response => {
	            this.handling = false;
	            that.$notify({ title: '成功', message: '已处理', type: 'success' });
      			window.history.go(-1);
	        }).catch(function(error){
	        	this.handling = false;
	            that.$notify({ title: '错误', message: error.message || "处理失败，请重试", type: 'error' });
	        });
      },
      imageClicked:function(url)
      {
      		//this.$route.push("/review");
      		window.open(url, "_blanck");
      }


    },//end methods
    mounted:function(){

    	var uid = this.$route.query.uid;
    	if (uid)
    	{
    		this.uid = uid;
    		this.applicationDetailFetch();
    	}
      	
    }
  }

</script>

<style scoped>

	body,div,li,p{
		margin: 0;
		padding: 0;
		list-style: none;
	}
	input,select{
		outline: none;
	}

	.clientPreviewPage .clientPreviewHeader{
		width: 100%;
		text-align: center;
	  padding-bottom: 26px;
	}
	.clientPreviewPage .clientPreviewHeader img{
		width: 76px;
		display: block;
		margin: 80px auto 0;
	}
	.clientPreviewPage .clientPreviewHeader .clientID{
		font-size: 28px;
		color: #4c4c4c;
		line-height: 118px;
		
	}
	.clientPreviewPage .clientPreviewHeader p{
		font-size: 24px;
		text-align: center;
		color:#4c4c4c;
		line-height: 40px;
		margin:0 30px;
	}
	.clientPreviewPage .info .essentialInfo{
		padding: 15px 0;
		background: #eee;
	}

	.clientPreviewPage .info .essentialInfo .essentialInfoList{
		padding: 0 30px;
		background: #fff;
	}

	.clientPreviewPage .infor .essentialInfo .essentialInfoList li{
		height: 100px;
		line-height: 100px;
		font-size: 28px;
		color: #4c4c4c;
	}       
	.clientPreviewPage .areaInfo{
		padding: 15px 0;
		background: #eee;
	}

	.clientPreviewPage .areaInfo .areaInfoList{
		padding: 0 30px;
		background: #fff;
	}

	.clientPreviewPage .areaInfo .areaInfoList li{
		min-height: 100px;
		line-height: 100px;
		font-size: 28px;
		color: #4c4c4c;
		position: relative;
	}
	.areaActive span{
		display: inline-block;

	}
	.areaActive span:last-child{
		width:76%;
		line-height: 30px;
		margin:30px 0;
		vertical-align: top;
	}
	.clientPreviewPage select{
		font-size: 28px;
		color: #4c4c4c;
		border: none;
	}
	.clientStatus{
		padding: 15px 0 115px 0;
	}
	.clientStatus .clientStatusList{
		padding: 0 30px;
	}
	.clientStatus .clientStatusList li{
		min-height: 100px;
		line-height: 100px;
		font-size: 28px;
		color: #4c4c4c;
	}
	.clientStatus .clientStatusList li img{
		width: 227px;
		vertical-align: middle;
		margin:20px 0;
	}
	.clientStatus .additionalInfor{
		padding: 0 30px;
		font-size: 28px;
		line-height: 85px;
	}
	.additionalInfor .addCont{
		font-size: 28px;
		min-height:100px;
		line-height:36px;
		color: #4c4c4c;
	}

	.businessStatus{
	padding: 15px 0 15px 0;
}

.businessStatus .businessStatusList{
	padding: 0 30px;
}

.businessStatusList li{
	height: 100px;
	border-bottom: 1px solid #d4d4d4;
	line-height: 100px;
	font-size: 28px;
	color: #4c4c4c;
}

.businessStatusList li img{
	width: 84px;
	vertical-align: middle;
	
}

.businessStatusList li input{
	font-size: 28px;
	color: #4c4c4c;
	border: none;
	background: none;
	width: 500px;
	text-align: left;
}

.businessStatus .additionalInformation{
	padding: 0 30px;
	font-size: 28px;
	line-height: 85px;
}

.businessStatus .additionalInformation textarea{
	width: 100%;
	min-height: 100px;
	border: 1px solid #d4d4d4;
	border-radius: 10px;
	resize: none;
}

.remark{
	font-size: 32px;
}

	.submit{
		left: 0;
		width: 100%;
		height: 100px;
		color: #fff;
		text-align: center;
		line-height: 100px;
		font-size: 32px;
	}

	.submit{
		display: flex;
		flex-direction: row;
	}

	.submit-button{
		flex: 1;
		color: #fff;
		height: 100%;
		line-height: 100px;
		text-align: center;
		font-size: 30px;
	}

	.submit-status
	{
		width: 100%;
		text-align: center;
		background-color: #f4b5ca;
	}

	.submit-deny{
		background: #cc0000;
	}

	.submit-accept{
		background: #f4b5ca;
	}

</style>