<template>
	<section>
		<div class="clientPreviewPage">

		    <div class="clientPreviewHeader">
		      <span class="clientID">咿呀号：{{storeID}}</span>
		      <p>{{statusString}}</p>
		    </div>

		    <div class="infor">

		    	<!-- essentialInfo -->
		      <div class="essentialInfo">
		        <ul class="essentialInfoList">
		          <li>
		            <span class="infoTitle">企业名称：</span>
		            <span>{{entityName}}</span>
		          </li>
		          <template v-if="headquarters">
		              <li>
		                <span class="infoTitle">法人名称：</span>
		                <span>{{chairmanName}}</span>
		              </li>
		          </template>
		          <template v-else>
		              <li>
		                <span class="infoTitle">总店咿呀号：</span>
		                <span>{{headquartersID}}</span>
		              </li>
		          </template>
		          <li>
		            <span class="infoTitle">运营者姓名：</span>
		            <span>{{managerName}}</span>
		          </li>
		          <li>
		            <span class="infoTitle">运营者电话：</span>
		            <span>{{managerPhone}}</span>
		          </li>
				  <li>
		            <span class="infoTitle">代理区域：</span>
		            <span>{{businessRegionString}}</span>
		          </li>

		        </ul>
		      </div>

		      <!-- areaInfo -->
		      <div class="areaInfo">
		        <ul class="areaInfoList">
		          <li>
		            <span>所在地区：</span>
		            <span>{{province}}{{city}}{{district}}</span>
		          </li>
		          <li>
		            <span>详细收件地址：</span>
		            <span>{{block}}</span>
		          </li>
		        </ul>
		      </div>

		      <div class="clientStatus">
		        <ul class="clientStatusList">
		          <li>
		            <span>经营范围：</span>
		            <span>{{businessScope}}</span>
		          </li>
		          <li>
		            <span>营业执照：</span>
		            <img v-bind:src="licenceImageURL" v-on:click="imageClicked(licenceImageURL)"/>
		          </li>
		          <li>
		            <span>门店照片：</span>
		            <img v-bind:src="storeImageURL" v-on:click="imageClicked(storeImageURL)"/>
		          </li>
		          <li>
		            <span>团队照片：</span>
		            <img v-bind:src="teamImageURL" v-on:click="imageClicked(teamImageURL)"/>
		          </li>
		        </ul>
		        <div class="additionalInfor">
		          <span>附加信息：</span>
		          <div class="addCont">{{remark}}</div>
				  <div class="addCont">审核时间:{{reviewTime}}</div>
				  <div class="addCont">审核备注:{{reviewRemark}}</div>
		        </div>
		      </div>

		      <div class="submit">
			      	<template v-if="status == 0 || status == 4">
			      		<el-button type="warning" size="large" :loading="reviewing" class="submit-button" @click="reviewBtnTapped(2)">拒绝</el-button>
			      		<el-button type="success" size="large" :loading="reviewing" class="submit-button" @click="reviewBtnTapped(1)">通过</el-button>
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
		    storeID:'',
		    headquarters: true,
		    statusString:'',
		    status:0,
		    entityName:'',
		    chairmanName:'',
		    chairmanID:'',
		    headquartersID:'',
		    managerName:'',
		    managerPhone:'',
		    province:'',
		    city:'',
		    district:'',
		    block:'',
		    businessRegionString:'',
		    businessScope:'',
		    licenceImageURL:'',
		    teamImageURL:'',
		    storeImageURL:'',
		    remark:'',
				reviewTime:'',
				reviewing:false,
				reviewRemark:''
      	}
    },
    methods: {
      //获取用户列表
      applicationDetailFetch:function(headquarters, storeID){
        var that = this;
        this.listLoading = true;
        NProgress.start();

        yiya.applicationDetailFetch(headquarters, storeID).then((response) => {
          that.statusString = response.msg;
          var info = response.applyInfo;
          if(info)
          {
              if (headquarters)
              {
                  that.entityName = info.agentcompanyname;
                  that.chairmanName = info.username;
                  that.chairmanID = info.idcard;

              }
              else
              {
                  that.entityName = info.branchcompanyname;
                  that.headquartersID = info.agentuserid;
              }
              that.status = response.status || 0;
			  this.reviewTime = info.processtime || "";
			  this.reviewRemark = info.reason || "无";
              that.managerPhone = info.phone;
              that.managerName = info.contactname;
              that.businessScope = info.businessscope;
              that.remark = info.remark;
              that.province = info.proviceName;
              that.city = info.cityName;
              that.district = info.areaName;
              that.block = info.streetdetail;
              that.licenceImageURL = info.businesslicense;
              that.teamImageURL = info.teamimg;
              that.storeImageURL = info.shopimg;
              var businessRegion = info.agentArealist || [];
              that.businessRegionString = businessRegion.join(" ");
              //that.businessRegionString = "安阳县水冶镇亲亲宝贝照相馆安阳县水冶镇亲亲宝贝照相馆安阳县水冶镇亲亲宝贝照相馆安阳县水冶镇亲亲宝贝照相馆安阳县水冶镇亲亲宝贝照相馆安阳县水冶镇亲亲宝贝照相馆安阳县水冶镇亲亲宝贝照相馆";
          }

          this.listLoading = false;
          NProgress.done();
        }).catch(error =>{
          that.listLoading = false;
          NProgress.done();
        });

      },
      reviewBtnTapped:function(action)
      {
					if(action == 2){
						this.$prompt('请填写不通过原因', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', }).then(({value}) => {
				          	this.applicationReview(action, value || "")
				        }).catch(() => { });
					}else{
						this.applicationReview(action, "")
					}
      },
		applicationReview:function(action, remark){
			var headquarters = this.headquarters;
			var storeID = this.storeID;
			var entity = this.entity;
			var that = this;
			this.reviewing = true;
			yiya.cts.applicationReview(headquarters, storeID, action, remark).then(response => {
					this.reviewing = false;
					this.$notify({ title: '成功', message: '已处理', type: 'success' });
				  window.history.go(-1);
			}).catch(error => {
				  this.reviewing = false;
				  this.$notify({ title: '错误', message: error.message || "处理失败，请重试", type: 'error' });
			});
		},
      imageClicked:function(url)
      {
      		//this.$route.push("/review");
      		window.open(url, "_blanck");
      }


    },//end methods
    mounted:function(){

    	var storeID = this.$route.query.storeID;
    	this.storeID = storeID;
    	var headquarters = this.$route.query.headquarters == 1;
		this.headquarters = headquarters;
    	if (storeID)
    	{
    		this.applicationDetailFetch(headquarters, storeID);
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
		/*height: 100px;*/
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
