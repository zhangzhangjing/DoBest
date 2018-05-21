<template>
	<section style="background-color: #f1f2f7">

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px; font-size: 30px;">{{entityName}}</span>
            <span style="line-height: 36px; font-size: 16px;float: right;">咿呀号：{{storeID}}</span>
          </div>

          <!-- areaInfo -->
            <ul class="areaInfoList">
<!--                 <li v-if="entity == EntityType.Trafficsource.value">
                	<el-input placeholder="推广链接" :disabled="true" v-model="shareurl">
                			<template slot="prepend">推广链接：</template>
                	</el-input>
                </li>

				<li v-if="entity == EntityType.Trafficsource.value">
                    <el-input placeholder="代理商名称" :disabled="true" v-model="agentName">
                        <template slot="prepend">推广代理商：</template>
                    </el-input> 
                </li>
                <li>
                    <el-input placeholder="请输入收件人电话" :disabled="true" v-model="areaName">
                        <template slot="prepend">所在地区：</template>
                    </el-input>
                </li> -->
                <li>
                    <el-input placeholder="请输入地址" v-model="block">
                        <template slot="prepend">详细地址：</template>
                    </el-input>
                </li>
                <li>
                    <el-input placeholder="请输入收件人" v-model="receiver">
                        <template slot="prepend">负责人：</template>
                    </el-input>
                </li>
                <li >
                    <el-input placeholder="请输入收件人电话" v-model="phone">
                        <template slot="prepend">联系电话：</template>
                    </el-input>
                </li>
                <li>
                    <el-button icon="edit" @click="addressSubmit" :loading="editing" style="float: right">修改</el-button>
                </li>
            </ul>

        </el-card>


	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import api from 'src/api/api';
    import StringUtil from 'common/js/StringUtil.js';
    import Role from 'common/js/role.js';
	import {EntityType} from 'common/js/BaseModel';

	export default {
		data() {
			return {
                EntityType:EntityType,
                storeID:0,
				entity:0,
                entityName:'',
				agentName:'',
                province:'',
                city:'',
                district:'',
                receiver:'',
                phone:'',
                block:'',
                areaName:'',
								shareurl:'',
				listLoading:false,
                editing:false

			}
		},
		methods: {
			//获取用户列表
							accountInfoFetch:function(){
								var that = this;
								this.listLoading = true;
								NProgress.start();
								var isAgency = this.entity == EntityType.Agency.value;
								api.ibs.partnerAccountInfoFetch(this.entity).then(response => {
									that.statusString = response.msg;
				                    var info = response;
				                    if(info)
				                    {
				                        that.storeID = (isAgency ? info.agentuserid : info.promoteruserid) || 0;
				                        that.entityName = info.companyname || '';
				                        that.status = response.status || 0;
				                        that.province = info.proviceName;
				                        that.city = info.cityName;
				                        that.district = info.areaName;
										that.areaName = (info.provinceName || '') + (info.cityName || '') + (info.areaName || '');
				                        that.block = info.streetdetail || info.streetdetails;
				                        that.phone = info.mobilephone;
				                        that.receiver = info.contacts;
										that.agentName = info.agentName;
				                    }
				                    NProgress.done();
								}).catch(error =>{
									that.listLoading = false;
									NProgress.done();
								});

							},
							shareURLFetch(){
								api.ibs.promotershareUrlFetch().then(response =>{
									this.shareurl = response;
								}).catch(error =>{})
							},
            addressSubmit:function(){
                var name = StringUtil.trim(this.receiver);
                var phone = StringUtil.trim(this.phone);
                var block = StringUtil.trim(this.block);

                if (!name)
                {
                    this.$notify({ title: '错误', message: "请输入收件人姓名", type: 'error' });
                    return;
                }

                if (!phone)
                {
                    this.$notify({ title: '错误', message: "请输入收件人电话", type: 'error' });
                    return;
                }

                if (!block)
                {
                    this.$notify({ title: '错误', message: "请输入详情地址", type: 'error' });
                    return;
                }


                this.editing = true;
                api.ibs.partnerAccountInfoModify(this.entity, name, phone, block).then(response => {
                    this.editing = false;
                    this.$notify({ title: '成功', message: "收件人信息已修改", type: 'success' });
                }).catch(error =>{
                    this.editing = false;
                    this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
                });
            }


		},
		mounted() {
			var identity = parseInt(sessionStorage.getItem('identity'));
			var isAgency = Role.permitted(identity,Role.CalendarAgency)
			this.entity = isAgency ? EntityType.Agency.value : EntityType.Trafficsource.value;
			this.accountInfoFetch();
			this.shareURLFetch();
		}
	}

</script>

<style scoped>



.areaInfoList{
    list-style: none;
    padding: 20px 30px;
    background-color: #fff;
}

.areaInfo-title{
    display: block;
    font-size: 16px;
    color: #23282d;
    margin-top: 15px;
}

.areaInfo-content{
    color: #32373c;
    font-size: 13px;
}

.areaInfoList ul li{
    margin-top: 10px;
}

.areaInfoList li{
    margin-top: 10px;
}

.entity-name{
    font-size: 20px;
}

.clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }

  .box-card {
    width: 100%;
  }


</style>
