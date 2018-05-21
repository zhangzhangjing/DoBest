<template>
	<section style="background-color: #f1f2f7">

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px; font-size: 30px;">{{entityName}}</span>
            <span style="line-height: 36px; font-size: 16px;float: right;">咿呀号：{{storeID}}</span>
          </div>

          <!-- areaInfo -->
            <ul class="areaInfoList">
                <li>
                    <el-input placeholder="请输入收件人电话" :disabled="true" v-model="areaName">
                        <template slot="prepend">所在地区：</template>
                    </el-input>
                </li>

                <li>
                    <span class="areaInfo-title">代理区域：</span>
                    <el-tag v-for="item in businessRegion" style="margin-right: 10px;margin-top: 10px;">{{item}}</el-tag>
                </li>

                <li>
                    <el-input placeholder="请输入收件人" v-model="receiver">
                        <template slot="prepend">收件人：</template>
                    </el-input>
                </li>

                <li >
                    <el-input placeholder="请输入收件人电话" v-model="phone">
                        <template slot="prepend">收件人电话：</template>
                    </el-input>
                </li>

                <li>
                    <el-input placeholder="请输入地址" v-model="block">
                        <template slot="prepend">详细收件地址：</template>
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
	import yiya from '../../api/yiya';
    import StringUtil from 'common/js/StringUtil.js';

	export default {
		data() {
			return {
                storeID:0,
                entityName:'',
                province:'',
                city:'',
                district:'',
                receiver:'',
                phone:'',
                block:'',
                areaName:'',
                businessRegion:[],
                businessRegionString:'',
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
				yiya.cooperativeInfoFetch().then(response => {
					that.statusString = response.msg;
                    var info = response;
                    if(info)
                    {
                        that.storeID = info.agentuserid || info.branchuserid || 0;
                        that.entityName = info.agentcompanyname || info.branchcompanyname || '';
                        that.status = response.status || 0;
                        that.province = info.proviceName;
                        that.city = info.cityName;
                        that.district = info.areaName;
                        that.areaName = that.province + that.city + that.district;
                        that.block = info.streetdetail;
                        that.phone = info.phone;
                        that.receiver = info.contactname;
                        var businessRegion = info.agentArealist || [];
                        that.businessRegion = businessRegion;
                        that.businessRegionString = businessRegion.join(" ");
                    }
                    NProgress.done();
				}).catch(error =>{
					that.listLoading = false;
					NProgress.done();
				});

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
                yiya.cooperativeAddressModify(name, phone, block).then(response => {
                    this.editing = false;
                    this.$notify({ title: '成功', message: "收件人信息已修改", type: 'success' });
                }).catch(error =>{
                    this.editing = false;
                    this.$notify({ title: '错误', message: error.message || "修改失败", type: 'error' });
                });
            }


		},
		mounted() {
			this.accountInfoFetch();
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
