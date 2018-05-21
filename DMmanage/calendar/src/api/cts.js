import {createRequestPromise, CountPerPage} from 'common/js/api_base.js'
import {EntityType,ApplicationReviewStatus} from 'common/js/BaseModel.js'

var APIBasePath = '';
var newAPIBasePath = '';

var exports = {
    init:function(aAPIBasePath, anewAPIBasePath) {
        APIBasePath = aAPIBasePath;
        newAPIBasePath = anewAPIBasePath;
    },
    applicationsFetch(entity, status, keyword, agencyID, page){
        var url = newAPIBasePath;
        if (entity == EntityType.Agency.value){
            url += '/calendar/agent/findAgentApplylist';
        }
        else if (entity == EntityType.Trafficsource.value) {
            url += '/calendar/agent/findPromoterApplylist';
        }
        else if (entity == EntityType.Producer.value) {
            url += '/calendar/agent/findProducersApplylist';
        }

    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data:{index:page, size:CountPerPage, status:status, keywords:keyword, agentUserId:agencyID || ''}
    	});
    },
    sumbitApplication(entity, uid, info, appendInfo){
        var url = newAPIBasePath;
        var data = {};
        var infoJSONString = JSON.stringify(info)
        if (entity == EntityType.Agency.value){
            url += '/calendar/agent/cts_tiagentApply';
            data['agentUserId'] = uid;
            data['agentJson'] = infoJSONString;
        }
        else if (entity == EntityType.Trafficsource.value) {
            url += '/calendar/agent/ibs_promoterApply';
            data['promoterUserId'] = uid;
            data['promoterJson'] = infoJSONString;
        }
        else if (entity == EntityType.Producer.value) {
            url += '/calendar/agent/cts_producersApply';
            data['producersUserId'] = uid;
            data['producersJson'] = infoJSONString;
            data['machineJson'] = JSON.stringify(appendInfo);
        }

        return createRequestPromise({
    		url: url,
    		method:"POST",
            data:data
    	});
    },
    applicationReview(entity, uid, enable, message){
        var url = newAPIBasePath;
        var data = {};
        if (entity == EntityType.Agency.value){
            url += '/calendar/agent/audit_AgentApply';
            data['agentUserId'] = uid;
        }
        else if (entity == EntityType.Trafficsource.value) {
            url += '/calendar/agent/audit_PromoterApply';
            data['promoterUserId'] = uid;
        }
        else if (entity == EntityType.Producer.value) {
            url += '/calendar/agent/audit_ProducersApply';
            data['producersUserId'] = uid;
        }
        // 状态：1：审核通过，2：拒绝
        data['status'] = enable ? 1 : 2;
        data['message'] = message || '';

        return createRequestPromise({
    		url: url,
    		method:"POST",
            data:data
    	});
    },
    devicesFetch(){
        // var url = APIBasePath + "/calendar/agent/findMachinemodelList";
        var url = newAPIBasePath + "/calendar/agent/findMachinemodelList";
    	return createRequestPromise({
    		url: url,
    		method:"GET"
    	});
    },
    producerRightsDistribute(producerID, areas, productID){
        var url = newAPIBasePath + "/calendar/agent/setProducerProductAera";
        var areasJSONString = JSON.stringify({areacodelist:areas});
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{producerUserId:producerID, areacodeJson:areasJSONString, productId:productID}
    	});
    },
    producerDevicesFetch(producerID){
        var url = newAPIBasePath + "/calendar/agent/findMachineListByProducerUserId";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data:{producerUserId:producerID}
    	});
    },
    ordersFetch(page, filters){
        var url = newAPIBasePath + "/cts/order/getCtsOrderList";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data:{index:page, size:CountPerPage, myproductJson:JSON.stringify(filters || {})}
    	});
    },
    partnersFetch(entity, keyword, page){
        var url = newAPIBasePath;
        if (entity == EntityType.Agency.value){
            url += '/calendar/agent/findAgentApplylist';
        }
        else if (entity == EntityType.Trafficsource.value) {
            url += '/calendar/agent/findPromoterApplylist';
        }
        else if (entity == EntityType.Producer.value) {
            url += '/calendar/agent/findProducersApplylist';
        }

        var status = ApplicationReviewStatus.Accept.value;
    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data:{index:page, size:CountPerPage, status:status, keywords:keyword}
    	});
    },
    recharge(uid, amount)
    {
    	var url = newAPIBasePath + "/cts/account/chongzhi";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {branchuserid:uid,amount:amount}
    	});
    },
    withdraw(uid, amount)
    {
    	var url = newAPIBasePath + "/cts/account/tixian";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {branchuserid:uid,amount:amount}
    	});
    },
    transactionRecordFetch(uid, type, page)
    {
    	var url = newAPIBasePath + "/cts/account/cts_accountLog";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {userid:uid, type:type, index:page, size:CountPerPage}
    	});
    },
    productsFetch(type){
        var url = newAPIBasePath + "/cts/ti_product/tiprolist";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data: {isAll: type}
    	});
    },
    editProduct(info, images){
        var url = newAPIBasePath + "/cts/ti_product/editTiproduct";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{productJson:JSON.stringify(info), imgJson:JSON.stringify({imglist:images})}
    	});
    },
    editProductDetailImages(productID, images){
        var url = newAPIBasePath + "/cts/ti_product/editDescriptionImglist";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{productid:productID, imgJson:JSON.stringify({imglist:images})}
    	});
    },
    stylesFetch(productID){
        var url = newAPIBasePath + "/cts/ti_product/tiStyleList";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data:{productid:productID}
    	});
    },
    addStyle(info){
        var url = newAPIBasePath + "/cts/ti_product/addTiStyle";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{styleJson:JSON.stringify(info)}
    	});
    },
    editStyle(info){
        var url = newAPIBasePath + "/cts/ti_product/editTiStyle";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{styleJson:JSON.stringify(info)}
    	});
    },
    styleTemplateFetch(styleID){
        var url = newAPIBasePath + "/cts/ti_product/tiStylesLayersList";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data:{styleid:styleID}
    	});
    },
    addStyleTemplatePhoto(info){
        var url = newAPIBasePath + "/cts/ti_product/addTiStylesLayers";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{styleJson:JSON.stringify(info)}
    	});
    },
    modifyStyleTemplatePhoto(info){
        var url = newAPIBasePath + "/cts/ti_product/editTiStylesLayers";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{styleJson:JSON.stringify(info)}
    	});
    },
    removeStyleTemplatePhoto(id){
        var url = newAPIBasePath + "/cts/ti_product/delTiStylesLayers";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{layerid:id}
    	});
    },
    modifyStyleTemplateCoordinate(styleID, image, tag, front){
        var url = newAPIBasePath + "/cts/ti_product/setStyleCoordinate";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{styleid:styleID, imgcoordJson:JSON.stringify(image),
                  printcoordJson:JSON.stringify(tag),
                  fontimgcoordJson:JSON.stringify(front)}
    	});
    },
    headquartersAccountFetch(){
        var url = newAPIBasePath + "/cts/account/getLastTiAccount";
    	return createRequestPromise({
    		url: url,
    		method:"GET"
    	});
    },
    entityAccountBalanceFetch(id){
        var url = newAPIBasePath + "/cts/account/info";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data:{userid:id}
    	});
    },
    getProductShowTempList(index,size){
        var url = newAPIBasePath + "/cts/ti_product/getProductShowTempList";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data:{index:index,size:size}
    	});
    },
    getproductshowstyles(){
        var url = newAPIBasePath + "/cts/ti_product/getproductshowstyles";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data:{}
    	});
    },


    addOrEditProductPageturn(productJson){
        var url = newAPIBasePath + "/cts/ti_product/addOrEditProductPageturn";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{productJson: JSON.stringify(productJson)}
    	});
    },
   
    productShowInfo(tempid){
        var url = newAPIBasePath + "/cts/ti_product/productShowInfo";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data:{tempid:tempid}
    	});
    }

    













}

module.exports = exports
