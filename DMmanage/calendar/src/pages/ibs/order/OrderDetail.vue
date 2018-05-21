<template>
	<section>
		<el-col :span="24" class="main">
			<div class="base-info">
	            <span class="base-info-text">订单号:  {{orderID}}</span>
	            <span class="base-info-text">状态:  {{statusString}}</span>
	            <span class="base-info-text">下单时间:  {{createDateString}}</span>
	            <template v-if="status == 3 || status == 4">
		            <span class="base-info-text">物流公司:  {{carrier}}</span>
		            <span class="base-info-text">运单号:  {{shippingNo}}</span>
		            <span class="base-info-text">邮费:￥ {{carriage}}</span>
		            <el-collapse >
						<el-collapse-item :title="shippingRecords.length > 0 ? '物流信息' : '无物流信息'" name="1">
							<template v-if="shippingRecords.length > 0">
								<el-steps :space="40" direction="vertical" :active="0">
							  		<el-step v-for="item in shippingRecords" :title="item.time + item.context"></el-step>
								</el-steps>
							</template>
							<template v-else>
								<div>无物流信息!</div>
							</template>
						</el-collapse-item>
					</el-collapse>
	            </template>
	        </div>
	        <div class="addressee">
	        	<img src="../../../assets/poi.png" />
	            <div class="addressee-info">
	                <span>{{addressee.receiver}}  {{addressee.phone}}</span>
	                <span>{{addressee.address}}</span>
	            </div>
	        </div>

	        <div class="products">
	        	<template v-for="item in products">
	                <div class="product-cell">
	                    <div class="product-cell-middle">
	                    	<span class="base-info-text">名称:  {{item.producttitle}}</span>
	                    	<span class="base-info-text">款式:  {{item.propertystr}}</span>
	                    	<span class="base-info-text">价格:  {{item.price}}</span>
	                    </div>
	                </div>
	            </template>
	        </div>
	        <!-- <el-button size="large" @click="workDetailBtnTapped">查看作品</el-button> -->
		</el-col>
	</section>
</template>
<script>
	import api from 'src/api/api';
	import NProgress from 'nprogress'
	import Formatter from 'common/js/Formatter';

	export default {
		data() {
			return {
				loading: false,
				workID:'',
				orderID:'',
				totalPrice:0,
				carriage:0,
				carrier:0,
				shippingNo:0,
				discount:0,
        		status:0,
        		statusString:'',
        		products:[],
        		addressee:{},
        		shippingRecords:[],
        		createDateString:''
			}
		},
		methods: {
			//获取用户列表
			orderDetailFetch: function (id) {

				this.loading = true;
				NProgress.start();
				api.ibs.orderDetailFetch(id).then(response =>{
					const status = response.status || 0;
		            var addressRsp = response.address;
		            if (addressRsp)
		            {
		            	var addressee = {};
		                const province = addressRsp.province || "";
		                const city = addressRsp.city || "";
		                const district = addressRsp.district || "";
		                const block = addressRsp.streetdetail || "";
		                const addressString = province + city + district + block;
		                addressee['receiver'] = addressRsp.reciver || '';
		                addressee['phone'] = addressRsp.phone || '';
		                addressee['address'] = addressString;
		            }

		            var product = response.orderProduct;
		            if (product)
		            {
		            	this.workID = product.cartid;
		            	this.products = [product];
		            	this.totalPrice = product.price || 0;
		            }

		            this.carrier = response.expresscom || "";
		            this.carriage = response.postage || 0;
		            this.shippingNo = response.expressorder || "";


		            this.statusString = Formatter.orderStatusDesc(status);
		            this.totalPrice = response.totalprice || 0;
		            this.addressee = addressee;
		            this.status = status;
		            var carrierID = response.expresscode;
		            if(status >= 3){
		            	this.shippingInfoFetch(carrierID, this.shippingNo);
		            	// this.shippingInfoFetch("shunfeng", "602569721121");
		            }

		            this.createDateString = response.paytime;

		            this.loading = false;
					NProgress.done();
				}).catch(error =>{

					this.loading = false;
					NProgress.done();
				});
			},
			shippingInfoFetch:function(carrier, shippingNo){
				api.ibs.shippingInfoFetch(carrier, shippingNo).then(response =>{
					this.shippingRecords = response.data || [];
				}).catch(error =>{

				});
			},
			workDetailBtnTapped:function(){
				var orderID = this.orderID;
				if (orderID)
				{
					this.$router.push({ name: 'WorkDetail', query: { orderID: orderID}});
				}
			}
		},
		mounted() {

			var orderID = this.$route.query.orderID || "";
			this.orderID = orderID;
			this.orderDetailFetch(orderID);

		}
	};

</script>

<style scoped>

.main{
	background-color: #f1f2f7;
}

.base-info{
	background-color: white;
}

.base-info-text{
    display: block;
    color: #909090;
    border-bottom: solid #efefef 1px;
    height: 44px;
    line-height: 44px;
    padding-left: 15px;
    background-color: white;
}

.addressee{
    height: 80px;
    padding: 12px 15px;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    border-bottom: 2px solid transparent;
	border-image-source:url(../../../assets/addressee_border.png);
    border-image-slice:2 20;
    border-image-repeat:round;
}



.addressee-info{
    margin-left: 10px;
    margin-right: 10px;
}

.addressee-info span{
	display: block;
	color: #909090;
}

.products{
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: white;
    margin-bottom: 10px;
}

.product-cell{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.product-cell-middle{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #6b6b6b;
    width: 100%;
}

.product-cell-image{
    width: 100px;
    height: 100px;
}
</style>
