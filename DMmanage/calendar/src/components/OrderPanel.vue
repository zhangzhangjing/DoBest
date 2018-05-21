<template>
    <div>
        <!--下单购买界面-->
		<el-dialog title="下单购买" :visible.sync="i_addFormVisible" ref="buydialog" :close-on-click-modal="false" @open="openHandler"  @close="closeHandler">
			<el-form :model="addForm" label-width="80px" ref="addForm">
                <el-form-item label="产品款式">
                    <el-input v-model="addForm.style" :disabled="true"></el-input>
				</el-form-item>

				<el-form-item label="数量">
					<el-input-number v-model="addForm.count" size="small" :min="1" :max="99"></el-input-number>
				</el-form-item>

				<el-form-item label="收货地址">
					<el-input v-model="addForm.address" :disabled="true"></el-input>
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
import api from 'src/api/api';

export default {
  props: {
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
    }
  },
  data () {
    return {
      i_addFormVisible: false,
      i_submitting: false,
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
          this.addForm = {count:1, remark:'', address:'', style:''};
          if(this.workID){
              this.workPreorderInfoFetch(this.workID);
          }
      },
      workPreorderInfoFetch:function(workID){
          api.ibs.workPreorderInfoFetch(workID).then(response => {
              var address = response.address;
              if(address){
                  this.addForm.address = (address.provinceName || '') + (address.cityName || '') + (address.districtName || '') + (address.streetdetail || '');
              }
              this.addForm.style = (response.style || {}).description;
          }).catch(error =>{});
      }


  },
  beforeDestroy () {
    //   console.log("beforeDestroy OrderPanel")
  }
}
</script>

<style lang="scss" scoped>

</style>
