import {createRequestPromise,CountPerPage} from 'common/js/api_base.js'

var APIBasePath = '';
var newAPIBasePath = '';

var exports = {
    init:function(aAPIBasePath, anewAPIBasePath) {
        APIBasePath = aAPIBasePath;
        newAPIBasePath = anewAPIBasePath;
    },
    carriersFetch()
    {
    	var url = APIBasePath + "/post/getPostInfo";
    	return createRequestPromise({
    		url: url,
    		method:"GET"
    	});
    },
    factoryOrdersListFetch(page, size, filters)
    {
        //type 0：咿呀12   1：挂历
    	var url = APIBasePath + "/pbs/order/getOrderList";
    	var data = {index:page, size:size, type:1};
    	if (filters){
    		data['myproductJson'] = JSON.stringify(filters);
    	}
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: data
    	});
    },
    //合并打包并支付运费
    packOrdersAndShipping(orderType, orderIDs, carrierName, carrierID, shippingNo, carriage)
    {
    	var url = APIBasePath + "/pbs/order/MergeOrderLogistic";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {ordertype:orderType, orderIds:orderIDs.join(','), expressCom:carrierName, expressCode:carrierID, expressOrder:shippingNo, postage:carriage}
    	});
    },
    //修改物流信息
    editShippingInfo(orderID, carrierName, carrierID, number)
    {
    	var url = APIBasePath + "/pbs/order/editLogistics";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {orderId:orderID, expressCom:carrierName, expressCode:carrierID, expressOrder:number}
    	});
    },
    //支付运费
    payCarriage(orderID, carriage)
    {
    	var url = APIBasePath + "/pbs/order/addPostAge";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {orderId:orderID, postage:carriage}
    	});
    },
    //检测是否可合并打包
    packEnableCheck(orderIDs)
    {
    	var url = APIBasePath + "/pbs/order/isCanMergeOrderLogistic";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {orderIds:orderIDs.join(',')}
    	});
    },
    //获取Excel下载链接
    excelURLFetch(filters)
    {
    	var url = APIBasePath + "/pbs/order/orderExportExcel";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {myproductJson:JSON.stringify(filters), type:1}
    	});
    },
    //图片批量下载
    imageBatchURLFetch(filters)
    {
    	var url = APIBasePath + "/pbs/order/batchDownLoadImage";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {myproductJson:JSON.stringify(filters),isDownload:1,fileDir:'C:\\Users\\kevin\\orderimg\\'}
    	});
    },
    accountInfoFetch()
    {
    	var url = newAPIBasePath + "/calendar/agent/getTiProducerInfo";
    	return createRequestPromise({
    		url: url,
    		method:"GET"
    	});
    },
    accountInfoModify(name, phone, block)
    {
    	var url = newAPIBasePath + "/calendar/agent/editTiProducerAddress";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {name:name, phone:phone, streetdetail:block}
    	});
    },
    orderWorkDetailFetch(orderID){
        var url = APIBasePath + "/ti_style/getOrderPhotoCoord";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: {userOrderId:orderID}
    	});
    }



}

module.exports = exports
