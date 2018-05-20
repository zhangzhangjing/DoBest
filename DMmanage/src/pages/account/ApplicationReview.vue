<template>
    <section>

        <el-col :span="24" class="toolbar">
            <el-form :inline="true">
                <el-form-item>
                    <el-radio-group v-model="headquarters" style="display: block;" @change="radioGroupChanged">
                        <el-radio-button label="1">主店</el-radio-button>
                        <el-radio-button label="0">分店</el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
        					<el-radio-group v-model="status" style="display: block;" @change="statusRadioGroupChanged">
        			    		<el-radio-button label="-1">全部</el-radio-button>
        			    		<el-radio-button label="0">审核中</el-radio-button>
        					    <el-radio-button label="1">已通过</el-radio-button>
        					    <el-radio-button label="2">未通过</el-radio-button>
        				    </el-radio-group>
        				</el-form-item>

                <el-form-item>
                    <el-button @click="addBtnTapped()">添加影楼</el-button>
                </el-form-item>

                <el-form-item>
                    <el-input v-model="keyword" placeholder="影楼名称/负责人名称/手机号" style="min-width:270px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column type="index" width="60"> </el-table-column>
            <el-table-column prop="entityName" label="公司" min-width="200"> </el-table-column>
            <el-table-column prop="name" label="负责人" width="120"> </el-table-column>
            <el-table-column prop="uid" label="咿呀号" width="100"> </el-table-column>
            <el-table-column prop="phone" label="联系人手机号" width="140"> </el-table-column>
            <el-table-column prop="bindphone" label="绑定手机号" width="130"> </el-table-column>
            <el-table-column prop="statusString" label="审核状态" width="160"> </el-table-column>
            <el-table-column prop="goodsAmount" label="账户余额" width="120"> </el-table-column>
            <el-table-column label="操作" width="360">
                <template scope="scope">
                    <el-button size="small" @click="review(scope.$index, scope.row)">查看</el-button>
                    <el-button size="small" @click="editBtnClicked(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" @click="rechargeBtnClicked(scope.row)">充值</el-button>
                    <el-button size="small" v-if="headquarters == 1" @click="quitBtnClicked(scope.row)">退驻</el-button>
                    <el-button size="small" v-if="status == 1" :loading="upgrading" @click="upgradeBtnClicked(scope.row)">升挂历</el-button>
                    <!-- <el-popover trigger="click" placement="top" class="popover">
        			        	<el-button type="text" class="order-button" @click="rechargeBtnClicked(scope.row, 1)">货款充值</el-button>
        			        	<el-button type="text" class="order-button" @click="rechargeBtnClicked(scope.row, 2)">邮费充值</el-button>
        			          <el-button size="small" slot="reference">充值</el-button>
      			        </el-popover> -->
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--充值界面-->
        <el-dialog :title="'充值(' + rechargeForm.entityName + ')' " v-model="rechargeFormVisible" :close-on-click-modal="false">
            <el-form :model="rechargeForm" label-width="80px">
                <el-form-item label="金额">
                    <el-input v-model="rechargeForm.amount"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="rechargeFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="recharge" :loading="recharging">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="addForm.dialogTitle" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">


                <el-form-item prop="uid" label="负责人咿呀号">
                    <el-input v-model="addForm.uid"></el-input>
                </el-form-item>

                <template v-if="!addForm.headquarters">
                    <el-form-item prop="uid" label="总店咿呀号">
                        <el-input v-model="addForm.parentid"></el-input>
                    </el-form-item>
                </template>


                <el-form-item prop="entityName" label="企业名称">
                    <el-input v-model="addForm.entityName"></el-input>
                </el-form-item>

                <template v-if="addForm.headquarters">
                    <el-form-item prop="chairmanName" label="法人名称">
                        <el-input v-model="addForm.chairmanName"></el-input>
                    </el-form-item>
                </template>

                <el-form-item prop="managerName" label="运营者姓名">
                    <el-input v-model="addForm.managerName"></el-input>
                </el-form-item>

                <el-form-item prop="phone" label="运营者手机">
                    <el-input v-model="addForm.phone"></el-input>
                </el-form-item>

                <el-form-item v-if="addForm.headquarters" v-for="(area,index) in addForm.areas" :key="area.key" :label="'影楼所在地区' + (index + 1)">

                    <el-select v-model="area.province" placeholder="请选择" style="width: 22%;" @change="provinceSelectorChanged(area)">
                        <el-option v-for="item in provinces" :label="item.label" :value="item.value"></el-option>
                    </el-select>

                    <el-select v-model="area.city" placeholder="请选择" style="width: 22%;" @change="citySelectorChanged(area)">
                        <el-option v-for="item in area.cities" :label="item.label" :value="item.value"></el-option>
                    </el-select>

                    <el-select v-model="area.district" placeholder="请选择" style="width: 22%;" @change="districtSelectorChanged(area)">
                        <el-option v-for="item in area.districts" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-button size="small" @click="addArea" style="margin-left:12px;">增加</el-button>
                    <el-button size="small" @click.prevent="removeArea(area)">删除</el-button>

                </el-form-item>

                <el-form-item prop="block" label="影楼详情地址">
                    <el-input v-model="addForm.block"></el-input>
                </el-form-item>

                <el-form-item label="影楼经营范围">
                    <el-input v-model="addForm.businessScope"></el-input>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input type="textarea" v-model="addForm.remark"></el-input>
                </el-form-item>

                <el-form-item v-for="item in uploaders" :label="item.label">
                    <el-upload class="image-uploader"
                        action="https://up.qbox.me"
                        :show-file-list="false"
                        :data="item.uploadForm"
                        :on-success="item.uploadSuccess"
                        :on-error="item.uploadFail"
                        :before-upload="item.beforeUpload">
                        <div v-if="item.imageURL">
                            <img :src="item.previewImageURL" class="upload-image">
                            <i v-if="item.uploading" class="el-icon-loading image-uploading-icon"></i>
                        </div>

                        <i v-else class="el-icon-plus image-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="submitBtnTapped" :loading="adding">确定</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
  import NProgress from 'nprogress'
  import yiya from '../../api/yiya';

  export default {
    data() {
      return {
            headquarters:1,
            list: [],
            total: 0,
            page: 1,
            pageSize:0,
            listLoading: false,
            keyword:'',
            status:-1,
            deleting:false,
            upgrading:false,

            addFormVisible: false,//新增界面是否显示
            adding: false,
            //新增界面数据
            addForm: { },
            addFormRules: {
                entityName: [
                    { required: true, message: '请输入企业名称', trigger: 'blur' }
                ],
                uid: [
                    { required: true, message: '请输入负责人咿呀号', trigger: 'blur' }
                ],
                chairmanName: [
                    { required: true, message: '请输入法人姓名', trigger: 'blur' }
                ],
                managerName: [
                    { required: true, message: '请输入运营者姓名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入负责人手机', trigger: 'blur' }
                ],
                // district: [
                //     { required: true, message: '请输入影楼所在地区', trigger: 'blur' }
                // ],
                block: [
                    { required: true, message: '请输入影楼详情地址', trigger: 'blur' }
                ]
            },
            provinces:[],
            cities:[],
            districts:[],

            uploadForm:{},
            uploading:false,
            uploaders:[{name:'licence', label:"营业执照", uploading:false, imageURL:'', previewImageURL:'', uploadForm:{},
                              beforeUpload:this.beforeUpload_licence, uploadFail:this.uploadFail_licence,uploadSuccess:this.uploadSuccess_licence},
                      {name:'store', label:"门店照片", uploading:false, imageURL:'', previewImageURL:'', uploadForm:{},
                            beforeUpload:this.beforeUpload_store, uploadFail:this.uploadFail_store,uploadSuccess:this.uploadSuccess_store},
                      {name:'team', label:"团队照片", uploading:false, imageURL:'', previewImageURL:'', uploadForm:{},
                            beforeUpload:this.beforeUpload_team, uploadFail:this.uploadFail_team,uploadSuccess:this.uploadSuccess_team}
            ],



            rechargeFormVisible: false,//新增界面是否显示
            recharging: false,
            //新增界面数据
            rechargeForm: { }
      }
    },
    methods: {
        //获取用户列表
        getApplicationList:function(){
            this.listLoading = true;
            NProgress.start();
            var headquarters = this.headquarters == 1;
            var func = headquarters ? yiya.cts.headquartersApplicationListFetch(this.page, this.status, this.keyword) : yiya.cts.applicationListFetch(this.page, this.status, this.keyword);
            func.then(response => {
                var list = response.list;
                var count = list.length || 0;
                var total = response.total;
                for(var i = 0;i<count;i++)
                {
                    var item = list[i];
                    item.statusString = yiya.applicationStatusDescFecth(item.status || 0);
                    item.uid = headquarters ? item.agentuserid : item.branchuserid;
                    item.entityName = headquarters ? item.agentcompanyname : item.branchcompanyname;
                    item.name = headquarters ? item.contactname : item.username;
                    item.transAmount = item.transAmount || 0;
                    item.goodsAmount = item.goodsAmount || 0;

                    item.areas = (item.agentapplyArealist || []).map(item =>{
                        return {province:item.provincecode, city:item.citycode, district:item.areacode, key: parseInt(Math.random() * Date.now())};
                    });

                }
                this.list = list;
                this.total = total;
                this.listLoading = false;
                NProgress.done();
            }).catch(error =>{
                this.listLoading = false;
                NProgress.done();
            });

        },
        radioGroupChanged:function(value)
        {
            this.getApplicationList();
        },
        statusRadioGroupChanged:function(value)
        {
            this.getApplicationList();
        },
        review:function(index, item){
            this.$router.push({ name: 'ApplicationDetail', query: { headquarters: this.headquarters, storeID:item.uid}});
        },
        editBtnClicked:function(index, item){

            var province = item.province;
            var city = item.city;
            var district = item.area;
            //Object.assign属于浅拷贝
            var areas = (item.areas || []).map(area =>{
                area.key = parseInt(Math.random() * Date.now());
                return Object.assign({}, area);
            })

            if(areas.length == 0){
                areas.push(this.createAreaModel());
            }
            var headquarters = this.headquarters == 1;
            var dialogTitle = '编辑' + (headquarters ? '总店' : '分店');
            var form = {uid:item.uid + "",
                        parentid:item.agentuserid + "",
                        dialogTitle:dialogTitle,
                        headquarters:headquarters,
                        entityName:item.entityName,
                        chairmanName:item.username,
                        managerName:item.contactname,
                        phone:item.phone,
                        block:item.streetdetail,
                        businessScope:item.businessscope,
                        areas:areas,
                        remark:item.remark};
            this.addForm = form;

            var licenceImageURL = item.businesslicense;
            var teamImageURL = item.teamimg;
            var storeImageURL = item.shopimg;
            if(licenceImageURL){
                this.setUploaderImageURL("licence", licenceImageURL);
            }
            if(teamImageURL){
                this.setUploaderImageURL("team", teamImageURL);
            }
            if(storeImageURL){
                this.setUploaderImageURL("store", storeImageURL);
            }

            this.addFormVisible = true;
            if(this.provinces.length == 0) {
                this.provinceFetch();
            }

            areas.forEach(area =>{
                if(area.province){
                    this.cityFetch(area.province, area);
                }

                var city = area.city;
                var district = area.district;
                if(area.city){
                    this.districtFetch(area.city, area);

                    //程序设置省份selector选中会触发change事件，导致 city district 为空，所以需要延迟设置
                    setTimeout(()=>{
                        area.city = city;
                        var form = Object.assign({}, this.addForm);
                        this.addForm = form;
                    },100)
                }

                if(district){
                    setTimeout(()=>{
                        area.district = district;
                        var form = Object.assign({}, this.addForm);
                        this.addForm = form;
                    },200)
                }

            })
        },
        rechargeBtnClicked:function(item, type){
            this.rechargeForm = {uid:item.uid, amount:0, type:type, entityName:item.entityName};
            this.rechargeFormVisible = true;
        },
        quitBtnClicked:function(item){
            this.$confirm('确认是否退驻吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.deleting = true;
                yiya.cts.cooperativeTermination(item.uid).then(res =>{
                    this.getApplicationList();
                    this.deleting = false;
                    this.$notify({ title: '成功', message: '已成功退驻', type: 'success' });
                }).catch(error => {
                    this.deleting = false;
                    this.$notify({ title: '错误', message: error.message || "退驻失败", type: 'error' });
                });

            }).catch(() => { });
        },
        upgradeBtnClicked(item){
            this.upgrading = true;
            yiya.cts.cooperatorUpgrade(item.uid).then(res =>{
                this.getApplicationList();
                this.upgrading = false;
                this.$notify({ title: '成功', message: '升级成功', type: 'success' });
            }).catch(error => {
                this.upgrading = false;
                this.$notify({ title: '错误', message: error.message || "升级失败", type: 'error' });
            });
        },
        recharge: function () {
            var uid = this.rechargeForm.uid;
            var amount = this.rechargeForm.amount || 0;
            var type = this.rechargeForm.type;
            if(!uid){
                return;
            }
            if(amount <= 0){
                this.$notify({ title: '错误', message: "请输入有效充值金额", type: 'error' });
                return;
            }

            this.recharging = true;

            // var promiseFunc = type == 1 ? yiya.cts.recharge(uid, amount) : yiya.cts.carriageRecharge(uid, amount);
            var promiseFunc = yiya.cts.recharge(uid, amount);
            promiseFunc.then(response =>{
                this.rechargeFormVisible = false;
                this.recharging = false;
                this.$notify({ title: '成功', message: "充值成功", type: 'success' });
                this.getApplicationList();
            }).catch(error => {
                this.recharging = false;
                this.$notify({ title: '错误', message: error.message || "充值失败", type: 'error' });
            });
        },
        createAreaModel:function(){
            return {province:"", city:"", district:"",key: Date.now()}
        },
        addBtnTapped:function(){

            for (var i = 0; i < this.uploaders.length; i++) {
                var item = this.uploaders[i];
                item.imageURL = "";
                item.previewImageURL = "";
            }
            var headquarters = this.headquarters == 1
            var dialogTitle = '添加' + (headquarters ? '总店' : '分店');
            this.addForm = {uid:"", headquarters:headquarters, dialogTitle:dialogTitle, entityName:"", chairmanName:"", managerName:"", phone:"", areas:[this.createAreaModel()], province:"", city:"", district:"", block:"", businessScope:"", remark:""};
            this.addFormVisible = true;

            if(this.provinces.length == 0) {
                this.provinceFetch();
            }
            this.cities = [];
            this.districts = [];
        },
        provinceFetch:function(){
            yiya.provinceFetch().then(list => {
                var aList = list.map(item =>{
                    return {label:item.province, value:item.code};
                });
                this.provinces = aList;

                var form = Object.assign({}, this.addForm);
                this.addForm = form;
            });
        },
        cityFetch:function(province, area){
            yiya.cityFetch(province).then(list => {
                var aList = list.map(item =>{
                    return {label:item.city, value:item.code};
                });
                // this.cities = aList;
                area.cities = aList;

                var form = Object.assign({}, this.addForm);
                this.addForm = form;
            });
        },
        districtFetch:function(city, area){
            yiya.districtFetch(city).then(list => {
                var aList = list.map(item =>{
                    return {label:item.area, value:item.code};
                });
                // this.districts = aList;
                area.districts = aList;

                var form = Object.assign({}, this.addForm);
                this.addForm = form;
            });
        },
        provinceSelectorChanged:function(area){
            console.log('provinceSelectorChanged:', area);
            var code = area.province;
            // this.cities = [];
            // this.districts = [];
            // var form = Object.assign({}, this.addForm);
            // form.city = '';
            // form.district = '';
            // form.businessRegionString = '请选择代理区域';
            // this.addForm = form;

            area.cities = [];
            area.districts = [];
            area.city = '';
            area.district = '';
            var form = Object.assign({}, this.addForm);
            this.addForm = form;

            if (code)
            {
                this.cityFetch(code, area);
            }
        },

        citySelectorChanged:function(area){
            var code = area.city;
            // this.districts = [];
            // var form = Object.assign({}, this.addForm);
            // form.district = '';
            // form.businessRegionString = '请选择代理区域';
            // this.addForm = form;

            area.districts = [];
            area.district = '';
            var form = Object.assign({}, this.addForm);
            this.addForm = form;

            if (code)
            {
                this.districtFetch(code, area);
            }
        },
        districtSelectorChanged:function(area){
          var code = area.district;
          if(code){
            yiya.cts.businessRegionAvailableCheck(code, this.addForm.uid).then(response => {
                    this.$notify({ title: '成功', message: "该区域可以代理", type: 'success' });
      			}).catch(error => {
      				this.$notify({ title: '错误', message: error.message || "失败", type: 'error' });
      			});
          }
        },
        addArea:function(){
            var form = Object.assign({}, this.addForm);
            form.areas.push(this.createAreaModel());
            this.addForm = form;
        },
        removeArea:function(area){
            var areas = this.addForm.areas || [];
            if(areas.length <= 1){
                this.$notify({ title: '错误', message:"数量至少一个", type: 'error' });
                return;
            }
            var index = areas.findIndex(item => {return item.key == area.key});
            if(index >= 0 && index < areas.length){
                areas.splice(index, 1);
            }
            var form = Object.assign({}, this.addForm);
            //form.areas = areas;
            this.addForm = form;
        },
        beforeUpload_licence:function(file){
            return this.beforeUpload("licence", file);
        },
        beforeUpload_store:function(file){
            return this.beforeUpload("store", file);
        },
        beforeUpload_team:function(file){
            return this.beforeUpload("team", file);
        },
        beforeUpload:function(name, file){
            var item = this.uploaders.filter(item =>{return item.name == name})[0];
            if(item){
                item.uploading = true;
                var key = yiya.qiniuUploadKeyGenerate("review")
                return yiya.uploadTokenFetch().then(token => {
                    item.uploadForm = {key:key, token:token};
                })
            }
            return false;
        },
        uploadFail_licence:function(error, file){
            this.uploadFail("licence", error, file);
        },
        uploadFail_store:function(error, file){
            this.uploadFail("store", error, file);
        },
        uploadFail_team:function(error, file){
            this.uploadFail("team", error, file);
        },
        uploadFail:function(name, err, file){
            var item = this.uploaders.filter(item =>{return item.name == name})[0];
            if(item){
                item.uploading = false;
            }
        },
        uploadSuccess_licence:function(response, file){
            this.uploadSuccess("licence", response, file);
        },
        uploadSuccess_store:function(response, file){
            this.uploadSuccess("store", response, file);
        },
        uploadSuccess_team:function(response, file){
            this.uploadSuccess("team", response, file);
        },
        uploadSuccess(name, response, file) {
            if (response.key) {
                var imageURL = "http://pic.bbyiya.com/" + response.key;
                var item = this.setUploaderImageURL(name, imageURL);
                if(item){
                    item.uploading = false;
                }
            }
        },
        setUploaderImageURL:function(name, imageURL){
            var item = this.uploaders.filter(item =>{return item.name == name})[0];
            if(item){
                item.imageURL = imageURL
                item.previewImageURL = imageURL + '?imageView2/2/w/200/q/80';
                return item;
            }
            return null;
        },
        submitBtnTapped:function(){
            this.$refs["addForm"].validate((valid) => {
                if (valid) {
                    this.submit();
                } else {
                    console.log('error submit!!', this.addForm);
                    return false;
                }
            });
        },
        submit:function(){
            var uid = this.addForm.uid;
            if(!uid){
                this.$notify({ title: '错误', message: "失败", type: 'error' });
                return;
            }

            var licenceImageURL = "";
            var licenceItem = this.uploaders.filter(item =>{return item.name == "licence"})[0];
            if(licenceItem && licenceItem.imageURL){
                licenceImageURL = licenceItem.imageURL
            }

            var storeImageURL = "";
            var storeItem = this.uploaders.filter(item =>{return item.name == "store"})[0];
            if(storeItem && storeItem.imageURL){
                storeImageURL = storeItem.imageURL;
            }

            var teamImageURL = "";
            var teamItem = this.uploaders.filter(item =>{return item.name == "team"})[0];
            if(teamItem && teamItem.imageURL){
                teamImageURL = teamItem.imageURL;
            }

            var headquarters = this.addForm.headquarters;
            var params = {};

            if (headquarters){
                params.agentcompanyname = this.addForm.entityName;
                params.idcard = '';
            }else{
                params.branchcompanyname = this.addForm.entityName;
                params.agentuserid = this.addForm.parentid;
            }

            params.username = this.addForm.chairmanName;
            params.contactname = this.addForm.managerName;
            params.phone = this.addForm.phone;
            params.streetdetail = this.addForm.block;
            params.businessscope = this.addForm.businessScope;
            params.businesslicense = licenceImageURL;
            params.teamimg = teamImageURL;
            params.shopimg = storeImageURL;
            params.remark = this.addForm.remark;

            var areas = this.addForm.areas.map(item =>{
                return {provincecode:item.province, citycode:item.city, areacode:item.district};
            });

            this.adding = true;
            var headquarters = this.headquarters == 1;
            yiya.cts.sumbitApplication(headquarters, uid, params, areas).then(response =>{
                this.getApplicationList();
                this.addFormVisible = false;
                this.adding = false;
                this.$notify({ title: '成功', message: "添加成功", type: 'success' });
                this.$router.push({ name: 'ApplicationDetail', query: { headquarters: this.headquarters, storeID:uid}});
            }).catch(error => {
                this.adding = false;
                this.$notify({ title: '错误', message: error.message || "添加失败", type: 'error' });
            });
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getApplicationList();
        },
        search:function(){
            this.getApplicationList();
        }


    },
    mounted() {
        this.pageSize = yiya.CountPerPage;
        this.getApplicationList();
    }
  }

</script>

<style scoped>
.order-button{
	display: block;
}

.order-button:first-child{
	margin-left: 10px;
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

    object-position: center;
    object-fit: cover;
    overflow: hidden;
    /*display: block;*/
}
</style>
