<template>
    <section>
        <!-- 由于ibs代理商和cts代理商公用一个页面，现在分离出来 -->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true">
                <el-form-item>
					<el-radio-group v-model="status" style="display: block;" @change="statusRadioGroupChanged">
			    		<!-- <el-radio-button label="">全部</el-radio-button> -->
                        <el-radio-button :label="1">已通过</el-radio-button>
			    		<el-radio-button :label="0">审核中</el-radio-button>
					    <el-radio-button :label="2">未通过</el-radio-button>
				    </el-radio-group>
				</el-form-item>
                <el-form-item v-if="isAgency">
                    <el-popover trigger="click" placement="top">
                        <!-- :src="scope.row.codeurl" -->
                        <!-- 后端 -->
                        <span>
                            客户扫码注册即可成为名下入驻企业
                        </span>
                        <img  class="QRimage">
                        <el-button type="text" class="QR-text">&ensp;点击下载二维码</el-button>
                        <el-button type="primary" slot="reference">发展企业入驻</el-button>
                    </el-popover>
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
            <el-table-column prop="companyname" label="企业名称" min-width="200"> </el-table-column>
            <el-table-column prop="uid" label="账号" width="100"> </el-table-column>
            <el-table-column prop="contacts" label="负责人" width="120"> </el-table-column>
            <!-- <el-table-column prop="agentuserid" label="代理商ID" width="100"> </el-table-column> -->
            <el-table-column prop="bindphone" label="绑定手机号" width="140"> </el-table-column>
            <el-table-column prop="mobilephone" label="联系人手机号" width="140"> </el-table-column>
            <!-- <el-table-column prop="status" label="审核状态" width="160" :formatter="Formatter.applicationReviewStatusFormat"> </el-table-column> -->
            <el-table-column prop="remark" label="附加信息" width="120"> </el-table-column>
            <el-table-column prop="createtime" label="提交时间" width="120"> </el-table-column>
            <!-- 后端接口 -->
            <el-table-column  v-if="status !== '' && status === ReviewStatus.Denied.value" prop="" label="驳回原因" width="120"> </el-table-column>
            <el-table-column label="操作" width="330" v-if="status !== '' && status !== ReviewStatus.Denied.value">
                <template scope="scope">
                    <template v-if="status !== '' && status == ReviewStatus.Reviewing.value">
                        <el-button size="small" :loading="reviewing" @click="reviewBtnClicked(scope.row, true)">通过</el-button>
                        <el-button size="small" :loading="reviewing" @click="reviewBtnClicked(scope.row, false)">驳回</el-button>
                    </template>
                    <el-button size="small" @click="editBtnClicked(scope.$index, scope.row)">编辑</el-button>
                    <template  v-if="status !== '' && status == ReviewStatus.Accept.value&& !isAgency">
                        <el-popover trigger="click" placement="bottom" class="popover">
                            <p>警告</p>
                            <p>
                                将彻底剥夺该用户的商户身份（请先财务结算修改关联设置）
                            </p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" >取消</el-button>
                                <el-button type="primary" size="mini" >确定</el-button>
                            </div>
                            <el-button size="small" slot="reference">注销账户</el-button>
                        </el-popover>
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <el-dialog :title="addForm.dialogTitle" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
                <el-form-item prop="uid" label="负责人账号">
                    <el-input v-model="addForm.uid" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item prop="uid" label="代理商账号">
                    <el-input v-model="addForm.agencyID" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item prop="entityName" label="企业名称">
                    <el-input v-model="addForm.entityName"></el-input>
                </el-form-item>

                <el-form-item prop="managerName" label="运营者姓名">
                    <el-input v-model="addForm.managerName"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="运营者手机">
                    <el-input v-model="addForm.phone"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="地区">
                    <AddressSelector :key="addForm.addressKey" :province="addForm.province" :city="addForm.city" :district="addForm.district" @change="addressSelectorChanged"/>
                </el-form-item>
                <el-form-item prop="block" label="影楼详情地址">
                    <el-input v-model="addForm.block"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-checkbox-group v-model="addForm.devices">
						<el-checkbox v-for="item in devices" :label="item.machineid">{{item.name}}</el-checkbox>
					</el-checkbox-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="addForm.remark"></el-input>
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
  import api from 'src/api/api';
  import {EntityType,ApplicationReviewStatus} from 'common/js/BaseModel';
  import Formatter from 'common/js/Formatter';
  import Role from 'common/js/role.js';
  import AddressSelector from 'src/components/AddressSelector';
  export default {
    data() {
      return {
            EntityType:EntityType,
            Formatter:Formatter,
            ReviewStatus:ApplicationReviewStatus,
            entityType:EntityType.Trafficsource.value,
            agencyID:0,
            devices:[],
            list: [],
            total: 0,
            page: 1,
            pageSize:0,
            listLoading: false,
            keyword:'',
            status: 1,
            deleting:false,
            reviewing:false,
            areaData:[],
            props: { label: 'name', children: 'zones' },
            producerDevices:[],
            uid:'',
            addFormVisible: false,//新增界面是否显示
            adding: false,
            //新增界面数据
            addForm: { },
            // 新增是ibs的企业商户管理还是cts的企业商户管理
            isAgency: false,
            cancelUser: false,
            addFormRules: {
                entityName: [
                    { required: true, message: '请输入企业名称', trigger: 'blur' }
                ],
                uid: [
                    { required: true, message: '请输入负责人账号', trigger: 'blur' }
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
            }
      }
    },
    methods: {
        //获取用户列表
        getApplicationList:function(){
            this.listLoading = true;
            NProgress.start();
            var func = api.cts.applicationsFetch(this.entityType, this.status, this.keyword, this.agencyID, this.page);
            func.then(response => {
                var list = response.list;
                var count = list.length || 0;
                var total = response.total;
                for(var i = 0;i<count;i++)
                {
                    var item = list[i];
                    var uid = 0;
                    if(this.entityType == EntityType.Producer.value){
                        uid = item.produceruserid || 0;
                    }
                    else if (this.entityType == EntityType.Agency.value) {
                        uid = item.agentuserid || 0;
                    }
                    else if (this.entityType == EntityType.Trafficsource.value) {
                        uid = item.promoteruserid || 0;
                    }
                    item.uid = uid;
                    item.streetdetail = item.streetdetail || item.streetdetails;
                    item.createtime = item.createtime || item.creattime;
                    item.agencyID = item.agentuserid;
                    if(item.machines){
                    }
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
        devicesFetch(){
            api.cts.devicesFetch().then((response) => {
                var list = response.list || [];
                this.devices = list;
            }).catch(error =>{})
        },
        producerDevicesFetch(uid){
            api.cts.producerDevicesFetch(uid).then((response) => {
                var list = response.list || [];
                list.forEach(item =>{
                    item.selectedProduct = '';
                    item.machineproduct = item.machineproduct || [];
                })
                this.producerDevices = list;
            }).catch(error =>{})
        },
        radioGroupChanged:function(value){
            this.getApplicationList();
        },
        statusRadioGroupChanged:function(value){
            this.getApplicationList();
        },
        reviewBtnClicked(item, enable){
            if(!enable){
                this.$prompt('请填写不通过原因', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', }).then(({value}) => {
                    this.applicationReview(this.entityType, item.uid, enable, value)
                }).catch(() => { });
            }else{
                this.applicationReview(this.entityType, item.uid, enable)
            }
        },
        applicationReview(entityType, uid, enable, message){
            this.reviewing = true;
            api.cts.applicationReview(entityType, uid, enable, message).then(response => {
                this.reviewing = false;
                this.getApplicationList();
                this.$notify({ title: '成功', message: "处理成功", type: 'success' });
            }).catch(error =>{
                this.reviewing = false;
                this.$notify({ title: '错误', message: error.message || "处理失败", type: 'error' });
            });
        },
        handleCheckChange(data, checked, indeterminate) {
            // console.log(data, checked, indeterminate);
        },
        editBtnClicked:function(index, item){
            var province = item.province;
            var city = item.city;
            var district = item.area;
            var dialogTitle = '编辑' + Formatter.entityTypeDesc(this.entityType);
            var form = {uid:item.uid + "",
                        dialogTitle:dialogTitle,
                        agencyID:item.agentuserid,
                        entityName:item.companyname,
                        managerName:item.contacts,
                        phone:item.mobilephone,
                        province:province,
                        city:city,
                        district:district,
                        addressKey:Date.now(),
                        block:item.streetdetail,
                        remark:item.remark};
            if(this.entityType == EntityType.Producer.value){
                if(this.devices.length == 0){
                    this.devicesFetch();
                }
                form.devices = (item.machines || []).map(item =>{return item.machineid})
            }
            this.addForm = form;
            this.addFormVisible = true;
        },
        addressSelectorChanged:function(province, city, district){
            var form = Object.assign({}, this.addForm);
            form.province = province || 0;
            form.city = city || 0;
            form.district = district || 0;
            this.addForm = form;
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
            var params = {};
            var appendParams = {};
            var form = this.addForm;
            params.companyname = form.entityName;
            params.contacts = form.managerName;
            params.mobilephone = form.phone;
            params.province = form.province;
            params.city = form.city;
            params.area = form.district;
            params.streetdetails = form.block;
            params.remark = this.addForm.remark;
            if(this.entityType == EntityType.Producer.value){
                var devices = [];
                (form.devices || []).forEach(deviceID =>{
                    var item = this.devices.filter(item =>{return item.machineid == deviceID})[0];
                    if(item){
                        devices.push({machineid:deviceID, name:item.name});
                    }
                })
                appendParams['machineList'] = devices;
            }
            else if(this.entityType == EntityType.Trafficsource.value){
                params['agentuserid'] = form.agencyID;
            }
            this.adding = true;
            api.cts.sumbitApplication(this.entityType, uid, params, appendParams).then(response =>{
                this.getApplicationList();
                this.addFormVisible = false;
                this.adding = false;
                this.$notify({ title: '成功', message: "添加成功", type: 'success' });
                // this.$router.push({ name: 'ApplicationDetail', query: { storeID:uid}});
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
        this.pageSize = api.CountPerPage;
        var agencyID = this.$route.query.agency;
        if(agencyID){
            this.agencyID = parseInt(agencyID);
            this.isAgency = false;
            console.log('IBS代理商isAgency', agencyID)
        }
        else{
            // CalendarAgency 台历挂历代理商 ibs isAgency true
            var identity = parseInt(sessionStorage.getItem('identity'));
            this.isAgency = Role.permitted(identity,Role.CalendarAgency)
            var uid = sessionStorage.getItem('uid');
            console.log('代理商isAgency', this.isAgency)
            if(this.isAgency && uid){
                this.agencyID = parseInt(uid);
            }
        }
        this.getApplicationList();
    },
    components: {
        AddressSelector
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
</style>
