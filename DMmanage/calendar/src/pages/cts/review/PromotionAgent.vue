<template>
    <section>

        <el-col :span="24" class="toolbar">
            <el-form :inline="true">
               <!--  <el-form-item>
                    <el-radio-group v-model="entityType" style="display: block;" @change="radioGroupChanged">
                        <el-radio-button :label="EntityType.Agency.value">{{EntityType.Agency.name}}</el-radio-button>
                        <el-radio-button :label="EntityType.Producer.value">{{EntityType.Producer.name}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
 -->  
  <!-- EntityType.Agency.value  代理商-->
                <el-form-item>
					<el-radio-group v-model="status" style="display: block;" @change="statusRadioGroupChanged">
			    		<!-- <el-radio-button label="">全部</el-radio-button> -->
                        <el-radio-button :label="1">已通过</el-radio-button>
			    		<el-radio-button :label="0">审核中</el-radio-button>
					    <el-radio-button :label="2">未通过</el-radio-button>
				    </el-radio-group>
				</el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="addBtnTapped()">添加</el-button>
                </el-form-item>

                <el-form-item>
                    <el-input v-model="keyword" placeholder="影楼名称/负责人名称/联系人手机号" style="min-width:270px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" v-loading="listLoading" style="width: 100%;">
            <el-table-column type="index" width="60"> </el-table-column>
            <el-table-column prop="companyname" label="企业名称" min-width="200"> </el-table-column>
            <el-table-column prop="uid" label="账号" width="100"> </el-table-column>
            <el-table-column prop="contacts" label="负责人" width="120"> </el-table-column>
            <el-table-column prop="bindphone" label="绑定手机号" width="140"> </el-table-column>
            <el-table-column prop="mobilephone" label="联系人手机号" width="140"> </el-table-column>
            <el-table-column prop="createtime" label="提交时间" width="120"> </el-table-column>
            <el-table-column prop="remark" label="附加信息" width="120"> </el-table-column>
            <!-- "已审核"标签内，去掉此项目 -->
          <!--   <el-table-column prop="status"  label="审核状态" width="160" :formatter="Formatter.applicationReviewStatusFormat"> </el-table-column> -->
            <el-table-column label="操作" width="350" fixed="right" v-if="status!== 2">
                <template scope="scope">
                    <!-- <el-button size="small" @click="review(scope.$index, scope.row)">查看</el-button> -->
     <!--                <template v-if="status !== '' && status == ReviewStatus.Reviewing.value">
                        <el-button size="small" :loading="reviewing" @click="reviewBtnClicked(scope.row, true)">通过</el-button>
                        <el-button size="small" :loading="reviewing" @click="reviewBtnClicked(scope.row, false)">驳回</el-button>
                    </template>

                    <template v-if="entityType == EntityType.Producer.value">
                        <el-button size="small" :loading="loading" @click="showDistributionDialog(scope.row)">订单归属分配</el-button>
                    </template> -->
                    <template v-if="entityType == EntityType.Agency.value">
                        <el-button size="small" @click="showTrafficsource(scope.row)">名下入驻商户</el-button>
                    </template>
                    <el-button size="small" @click="editBtnClicked(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
             <el-table-column label="操作" width="驳回原因" fixed="right" v-if="status === 2">
                <template scope="scope">
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
                    <el-input v-model="addForm.uid" :disabled="addForm.edit"></el-input>
                </el-form-item>
                <el-form-item prop="entityName" label="企业名称">
                    <el-input v-model="addForm.entityName"></el-input>
                </el-form-item>
                <el-form-item prop="managerName" label="负责人姓名">
                    <el-input v-model="addForm.managerName"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="负责人手机">
                    <el-input v-model="addForm.phone"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="地区">
                    <AddressSelector :key="addForm.addressKey" :province="addForm.province" :city="addForm.city" :district="addForm.district" @change="addressSelectorChanged"/>
                </el-form-item>
                <el-form-item prop="block" label="企业详情地址">
                    <el-input v-model="addForm.block"></el-input>
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

        <!--  分配面板 -->
        <el-dialog title="订单归属分配" size="large" v-model="distributionFormVisible" :close-on-click-modal="false">
            <!-- <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">

            </el-form> -->
            <el-row>
                <el-col :span="8">
                    <el-table :data="producerDevices" v-loading="listLoading" :default-expand-all="true" style="width: 100%;">
                    	<el-table-column type="expand">
                            <template scope="props">
                                <el-radio-group v-model="selectedProductID" @change="productRadioGroupChanged">
                                    <div v-for="item in props.row.machineproduct" style="margin-top:10px;">
                                        <el-radio :label="item.productid">{{item.producttitle || ''}}</el-radio>
                                    </div>
                                </el-radio-group>
                            </template>
                        </el-table-column>
                    	<el-table-column prop="machinename" label="机器" min-width="120"> </el-table-column>
                    </el-table>
    			</el-col>
                <el-col :span="16">
                    <div style="max-height:500px;overflow: auto;">
                        <el-tree ref="tree" :key="treeKey" :data="areaData" :default-checked-keys="selectedAreas" :default-expanded-keys="expandedNodes" :props="props" node-key="code"
                         :load="loadNode"  lazy show-checkbox @check-change="handleCheckChange"> </el-tree>
                    </div>
    			</el-col>
            </el-row>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="distributionFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="distributeBtnTapped" :loading="adding">确定</el-button>
            </div>
        </el-dialog>


    </section>
</template>

<script>
  import NProgress from 'nprogress'
  import api from 'src/api/api';
  import {EntityType,ApplicationReviewStatus} from 'common/js/BaseModel';
  import Formatter from 'common/js/Formatter';
  import AddressSelector from 'src/components/AddressSelector';

  export default {
    data() {
      return {
            EntityType:EntityType,
            Formatter:Formatter,
            ReviewStatus:ApplicationReviewStatus,
            // 修改为生产商
            entityType:EntityType.Agency.value,
            devices:[],
            list: [],
            total: 0,
            page: 1,
            pageSize:0,
            listLoading: false,
            keyword:'',
            // status:'',
            status: 1,
            deleting:false,
            reviewing:false,
            treeKey:'',
            selectedProductID:0,
            selectedAreaMap:{},
            selectedAreas:[],
            expandedNodes:[],

            areaData:[],
            props: { label: 'name', children: 'zones' },

            loading:false,
            distributionFormVisible: false,
            producerDevices:[],
            uid:'',


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
            }





      }
    },
    watch: {
        selectedProductID(value){
            console.log('selectedProductID change:', value);
            var selectedAreas = [];
            var areas = this.selectedAreaMap[this.selectedProductID];
            if(areas){
                selectedAreas = areas.map(area =>{return area.areacode});
            }

            this.selectedAreas = selectedAreas;
            this.expandedNodes = this.getExpandedNodes();
            this.areaData = [];
            this.treeKey = Date.now();
        }
    },
    created(){
      this.devicesFetch()
    },
    methods: {
        //获取用户列表
        getApplicationList:function(){
            this.listLoading = true;
            NProgress.start();
            var func = api.cts.applicationsFetch(this.entityType, this.status, this.keyword, '', this.page);
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
            this.selectedAreaMap = {};
            this.selectedAreas = [];
            this.selectedProductID = 0;
            this.loading = true;
            api.cts.producerDevicesFetch(uid).then((response) => {
                this.loading = false;
                var list = response.list || [];

                list.forEach(item =>{
                    var products = item.machineproduct || [];
                    item.machineproduct = products;
                    products.forEach(product =>{
                        var productID = product.productid;
                        var areas = product.setedareas || [];
                        this.selectedAreaMap[productID] = areas;
                    })

                })

                this.producerDevices = list;

                // 选择第一个
                if(list.length > 0){
                    var products = list[0]['machineproduct'];
                    if(products.length > 0){
                        this.selectedProductID = products[0].productid;
                        // this.productRadioGroupChanged();
                    }
                }

                this.areaData = [];
                this.treeKey = Date.now();
                this.distributionFormVisible = true;

            }).catch(error =>{
                this.loading = false;
                this.$notify({ title: '错误', message: error.message || "失败", type: 'error' });
            })
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
            this.$router.push({ name: 'ApplicationDetail', query: { storeID:item.uid}});
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
        showDistributionDialog(item){
            this.uid = item.uid;
            this.producerDevicesFetch(item.uid);
        },
        loadNode(node, resolve) {
            if (node.level >= 3) return resolve([]);

            var zones = node.data.zones || [];
            if(zones.length > 0){
                return resolve(zones);
            }
            else{
                if(node.level == 0){
                    api.general.provinceFetch().then(response =>{
                        var list = response || [];
                        var items = list.map(item =>{return {name:item.province, code:item.code} });
                        node.data.zones = items;
                        return resolve(items);
                    }).catch(error=>{});
                }
                else if(node.level == 1){
                    var provinceCode = node.data.code;
                    api.general.cityFetch(provinceCode).then(response =>{
                        var list = response || [];
                        var items = list.map(item =>{return {name:item.city, code:item.code, provinceCode:provinceCode} });
                        node.data.zones = items;
                        return resolve(items);
                    }).catch(error=>{});
                }
                else if(node.level == 2){
                    var provinceCode = node.data.provinceCode;
                    var cityCode = node.data.code;
                    api.general.districtFetch(cityCode).then(response =>{
                        var list = response || [];
                        var items = list.map(item =>{return {name:item.area, code:item.code, provinceCode:provinceCode, cityCode:cityCode} });
                        node.data.zones = items;
                        return resolve(items);
                    }).catch(error=>{});
                }

                setTimeout(()=>{
                    var expandedNodes = this.getExpandedNodes();
                    this.expandedNodes = expandedNodes;
                },500);
            }
        },
        getExpandedNodes(){
            var nodeMap = {}
            var expandedNodes = [];
            var areas = this.selectedAreaMap[this.selectedProductID];
            if(areas){
                areas.forEach(area =>{
                    nodeMap[area.provincecode] = 1;
                    nodeMap[area.citycode] = 1;
                    nodeMap[area.areacode] = 1;
                })
            }

            for(var key in nodeMap){
                expandedNodes.push(key);
            }
            return expandedNodes;
        },
        productRadioGroupChanged(){


        },
        handleCheckChange(data, checked, indeterminate) {
            // console.log(data, checked, indeterminate);
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
        editBtnClicked:function(index, item){
            var province = item.province;
            var city = item.city;
            var district = item.area;
            var dialogTitle = '编辑' + Formatter.entityTypeDesc(this.entityType);
            var form = {uid:item.uid + "",
                        edit:true,
                        dialogTitle:dialogTitle,
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
        addBtnTapped:function(){
            var dialogTitle = '添加' + Formatter.entityTypeDesc(this.entityType);
            this.addForm = {uid:"", dialogTitle:dialogTitle, entityName:"", agencyID:'', managerName:"", phone:"",
                            province:0, city:0, district:0, block:"", devices:[], addressKey:Date.now(), remark:""};
            this.addFormVisible = true;
            if(this.entityType == EntityType.Producer.value && this.devices.length == 0){
                this.devicesFetch();
            }
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
            params.streetdetail = form.block;
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
        distributeBtnTapped(){
            var nodes = this.$refs["tree"].getCheckedNodes();
            var areas = nodes.map(item =>{
                return {provincecode:item.provinceCode, citycode:item.cityCode, areacode:item.code}
            })

            //if(areas.length == 0){
            //    this.$notify({ title: '错误', message: "请选择区域", type: 'error' });
            //    return;
            //}
            // var selectedProductID = '';
            // var selectedProduct = this.producerDevices.filter(item => {return item.selectedProduct})[0]
            // if(selectedProduct){
            //     selectedProductID = selectedProduct.selectedProduct;
            // }
            if(!this.selectedProductID){
                this.$notify({ title: '错误', message: "请选择产品", type: 'error' });
                return;
            }

            this.adding = true;
            api.cts.producerRightsDistribute(this.uid, areas, this.selectedProductID).then(response =>{
                this.getApplicationList();
                this.distributionFormVisible = false;
                this.adding = false;
                this.$notify({ title: '成功', message: "分配成功", type: 'success' });
                // this.$router.push({ name: 'ApplicationDetail', query: { storeID:uid}});
            }).catch(error => {
                this.adding = false;
                this.$notify({ title: '错误', message: error.message || "分配失败", type: 'error' });
            });
        },
        showTrafficsource(item){
            var agencyID = item.agentuserid;
            if(agencyID){
                this.$router.push({ name: 'Trafficsources', query: { agency:agencyID}});
            }
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
