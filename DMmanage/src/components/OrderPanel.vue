<template>
    <div>
        <!--下单购买界面-->
		<el-dialog title="下单购买" v-model="i_addFormVisible" ref="buydialog" :close-on-click-modal="false" @open="openHandler"  @close="closeHandler">
			<el-form :model="addForm" label-width="80px" ref="addForm">
                <el-form-item label="款式">
					<el-select v-model="addForm.styleID" placeholder="请选择" style="min-width: 280px;">
    					<el-option v-for="item in styles" :label="item.label" :value="item.value"></el-option>
  					</el-select>
				</el-form-item>

				<el-form-item label="数量">
					<el-input-number v-model="addForm.count" size="small" :min="1" :max="99"></el-input-number>
				</el-form-item>

				<el-form-item label="收货地址">
					<el-select v-model="addressIndex" placeholder="请选择" style="width: 100%;" @change="addressIndexChange">
    					<el-option v-for="item in addressesGroup" :label="item.label" :value="item.value"></el-option>
    					<el-option label="自定义" value="999"></el-option>
  					</el-select>
				</el-form-item>

				<el-form-item label="">
					<el-input  v-model="addForm.receiver" placeholder="收件人" style="width: 30%;"></el-input>
					<el-input  v-model="addForm.phone" placeholder="收件人电话" style="width: 60%;"></el-input>
				</el-form-item>

				<el-form-item label="">
					<template v-if="addressIndex == 999">
						<!-- <el-select v-model="addForm.province" placeholder="请选择" style="width: 30%;" @change="provinceSelectorChanged">
	    					<el-option v-for="item in provinces" :label="item.label" :value="item.value"></el-option>
	  					</el-select>
	  					<el-select v-model="addForm.city" placeholder="请选择" style="width: 30%;" @change="citySelectorChanged">
	    					<el-option v-for="item in cities" :label="item.label" :value="item.value"></el-option>
	  					</el-select>
	  					<el-select v-model="addForm.district" placeholder="请选择" style="width: 30%;">
	    					<el-option v-for="item in districts" :label="item.label" :value="item.value"></el-option>
	  					</el-select> -->
                        <AddressSelector :province="addForm.province" :city="addForm.city" @change="addressSelectorChanged"/>
					</template>
					<template v-else>
						<el-input :disabled="true" v-model="addForm.provinceName" placeholder="省" style="width: 30%;"></el-input>
						<el-input :disabled="true" v-model="addForm.cityName" placeholder="市" style="width: 30%;"></el-input>
						<el-input :disabled="true" v-model="addForm.districtName" placeholder="区" style="width: 30%;"></el-input>
					</template>

				</el-form-item>

				<el-form-item label="">
					<el-input type="textarea" v-model="addForm.block" placeholder="街道地址"></el-input>
				</el-form-item>

				<el-form-item label="备注">
					<el-input type="textarea" v-model="addForm.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="$refs['buydialog'].close()">取消</el-button>
				<el-button type="primary" @click.native="submit" :loading="i_submitting">提交订单</el-button>
			</div>
		</el-dialog>
    </div>
</template>

<script>
import yiya from 'src/api/yiya';
import AddressSelector from 'src/components/AddressSelector';

export default {
  props: {
    productID: {
        type: String,
        required: true
    },
    styleID: {
        type: String,
        default: ''
    },
    workID: {
        type: String,
        required: true
    },
    visible: {
        type: Boolean,
        default: false
    },
    submitting: {
        type: Boolean,
        default: false
    },



  },
  data () {
    return {
      i_addFormVisible: false,
      i_submitting: false,
      addressIndex:0,
      addressesGroup:[],
      addresses:[],
      styles:[],
      addForm:{}
    }
  },
  watch: {
      visible(value){
          this.i_addFormVisible = value;
      },
      submitting(value){
          this.i_submitting = value;
      }

  },
  created () {

  },
  methods: {
      closeHandler:function(){
          this.$emit('close');
      },
      submit:function(){
          this.addForm.workID = this.workID;
          this.addForm.productID = this.productID;
          this.$emit('submit', this.addForm);
      },
      openHandler:function(){
          this.addForm = {styleID:this.styleID || '', count:1, remark:'', province:0, city:0, district:0};
          if(this.workID){
              this.addressesFetch(this.workID);
          }
          if(this.productID){
              this.stylesFetch(this.productID);
          }

      },
      stylesFetch:function(productID){
          yiya.stylesFetch(productID).then(response => {
              var list = response.styleslist || [];
              this.styles = list.map(item =>{
                  return {label:item.propertyStr + "  ￥" + item.price, value:item.styleId + ''};
              });

              if(!this.addForm.styleID && this.styles.length > 0)
              {
                  var firstItem = this.styles[0];
                  var form = Object.assign({}, this.addForm);
                  form.styleID = firstItem ? firstItem.value : "";
                  this.addForm = form;
              }
          })
      },
      addressesFetch:function(workID){
          yiya.workAddressesFetch(workID).then(response => {
              var list = response || [];
              this.addresses = list;
              var addressesGroup = [];
              for (var i = 0; i < list.length; i++) {
                  var item = list[i];
                  if(item.addressType == 0){
                      addressesGroup.push({label:"影楼地址", value:i, type:item.addressType});
                  }
                  else if(item.addressType == 1){
                      addressesGroup.push({label:"用户地址", value:i, type:item.addressType});
                  }
                  else if(item.addressType == 2){
                      addressesGroup.push({label:"自选门店地址", value:i, type:item.addressType});
                  }
                  else{
                      addressesGroup.push({label:"其他地址", value:i, type:item.addressType});
                  }
              }
              var storeIndex = addressesGroup.findIndex(item => {return item.type == 2});
              var addressIndex = storeIndex == -1 ? 0 : storeIndex;
              this.addressesGroup = addressesGroup;
              this.addForm = this.selectAddress(this.addForm, addressIndex);
          }).catch(error =>{});
      },
      selectAddress:function(aform, index){
          if(this.addresses.length > 0)
          {
              var firstItem = this.addresses[index];
              if(firstItem){
                  this.addressIndex = index;
                  var form = Object.assign({}, aform);
                  form.uid = firstItem.userid;
                  form.receiver = firstItem.reciver;
                  form.phone = firstItem.phone;
                  form.province = firstItem.province;
                  form.provinceName = firstItem.provinceName;
                  form.city = firstItem.city;
                  form.cityName = firstItem.cityName;
                  form.district = firstItem.district;
                  form.districtName = firstItem.districtName;
                  form.block = firstItem.streetdetail;
              }
              return form;
          }
      },
      addressSelectorChanged:function(province, city, district){
            var form = Object.assign({}, this.addForm);
            form.province = province || 0;
            form.city = city || 0;
            form.district = district || 0;
            this.addForm = form;
      },
      addressIndexChange:function(index){
          if(index >= 0 && index < this.addresses.length){
              var form = this.selectAddress(this.addForm, index);
              this.addForm = form;
          }else{
              //this.addressIndex = index;
              var form = Object.assign({}, this.addForm);
              this.addressIndex = index;
              form.receiver = "";
              form.phone = "";
              form.province = 0;
              form.provinceName = "";
              form.city = 0;
              form.cityName = "";
              form.district = 0;
              form.districtName = "";
              form.block = "";
              this.addForm = form;
          }
      }


  },
  beforeDestroy () {
    //   console.log("beforeDestroy OrderPanel")
  },
  components: {
      AddressSelector
  }
}
</script>

<style lang="scss" scoped>

</style>
