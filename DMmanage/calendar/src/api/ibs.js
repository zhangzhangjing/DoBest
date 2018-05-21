import {createRequestPromise, CountPerPage} from 'common/js/api_base.js'
import {EntityType} from 'common/js/BaseModel';

var APIBasePath = '';
var newAPIBasePath = '';

var exports = {
    init:function(aAPIBasePath, anewAPIBasePath) {
        APIBasePath = aAPIBasePath;
        newAPIBasePath = anewAPIBasePath;
    },
    campaignsFetch(page, type, keyword){
        var url = newAPIBasePath + '/calendar/act/getCalendarActivityList';
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{index:page, size:CountPerPage, type:type, keywords:keyword}
    	});
    },
    campaignFetch(id){
        var url = newAPIBasePath + '/calendar/act/composeActImg';
    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data:{actid:id}
    	});
    },
    createCampaign(info){
        var url = newAPIBasePath + '/calendar/act/addCalendarActivity';
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{activityJson:JSON.stringify(info)}
    	});
    },
    
    
    getAPIBasePath(newAPIPriority){
		return newAPIPriority ? newAPIBasePath : APIBasePath;
	},
    
    
    
    addWorkForCustomer(activityJson,addressJson)
    {
    	
    	var url = newAPIBasePath + "/calendar/act/addWorkForCustomer";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {activityJson:JSON.stringify(activityJson),addressJson:JSON.stringify(addressJson)}
    	});
    },
	
	

	reviewWorkForCustomer(activityJson)
	{
		var url = newAPIBasePath + "/calendar/act/reviewWorkForCustomer";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {activityJson:JSON.stringify(activityJson)}
    	});


	},
	getCalendarActivityList(page, type, keyword)
	{
		var url = newAPIBasePath + '/calendar/act/getCalendarActivityList'
		return createRequestPromise({
			url: url,
			method:"POST",
			data:{index:page, size:CountPerPage, type:type, keywords:keyword}
		});

	},

	getGroupActivityList(page,size,keyword,status)
	{
		var url = newAPIBasePath + '/ti_groupact/getGroupActivityList'
		return createRequestPromise({
			url: url,
			method:"POST",
			data:{index:page, size:size, keywords:keyword, status:status}
		});

	},

	getSumPostAgeByGactid(gactid)
	{
		var url = newAPIBasePath + '/ti_groupact/getSumPostAgeByGactid'
		return createRequestPromise({
			url: url,
			method:"POST",
			data:{gactid:gactid}
		});

	},
	
	addorEditGroupActivity(activityJson)
	{
		var url = newAPIBasePath + '/ti_groupact/addorEditGroupActivity'
		return createRequestPromise({
			url: url,
			method:"POST",
			data:{activityJson:JSON.stringify(activityJson)}
		});
	},
	downWorkForGroupRQcode(workId)
	{
		var url = newAPIBasePath + '/ti_groupact/downWorkForGroupRQcode'
		return createRequestPromise({
			url: url,
			method:"POST",
			data:{workId:workId}
		});
	},
	getGroupActivityByGactid(gactid)
	{
		var url = newAPIBasePath + '/ti_groupact/getGroupActivityByGactid'
		return createRequestPromise({
			url: url,
			method:"POST",
			data:{gactid:gactid}
		});
	},
	
	exchenageCodeExportExcel(actid)
	{
		var url = newAPIBasePath + '/calendar/act/exchenageCodeExportExcel'
		return createRequestPromise({
			url: url,
			method:"POST",
			data:{actid:actid}
		});
	},
	
	getShareAdvertViewLogs(advertId,index,size)
	{
		var url = newAPIBasePath + '/ti_advertshare/getShareAdvertViewLogs'
		return createRequestPromise({
			url: url,
			method:"POST",
			data:{advertId:advertId,index:index,size:size}
		});
	},
		



	getGroupActWorkListByGactid(page,size,gactid, type, keyword)
	{
		var url = newAPIBasePath + '/ti_groupact/getGroupActWorkListByGactid'
		return createRequestPromise({
			url: url,
			method:"POST",
			data:{index:page, size:size,gactid:gactid, addresstype:type, keywords:keyword}
		});

	},

	setGActsShareAdvert(gactid,advertid)
	{
		var url = newAPIBasePath + '/ti_groupact/setGActsShareAdvert'
		return createRequestPromise({
			url: url,
			method:"POST",
			data:{gactid:gactid,advertid:advertid}
		});

	},



	

    
    ibsSubmitTiCustomerHandOrder(productJsonStr,addressJsonStr)
    {    	
    	var url = newAPIBasePath + "/ibs/ti_order/ibsSubmitTiCustomerHandOrder";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {productJsonStr:JSON.stringify(productJsonStr),addressJsonStr:JSON.stringify(addressJsonStr)}
    	});
    },
    
    getTiCustomerSubmitAddressList(workId){
    	
    	var url = newAPIBasePath + "/ibs/ti_order/getTiCustomerSubmitAddressList";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {workId:workId}
    	});
    },
    
    downWorkForCusRQcode(workId){
    	
    	var url = newAPIBasePath + "/calendar/act/downWorkForCusRQcode";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {workId:workId}
    	});
    },
    
	
	setDefaultAdverte(advertid,isdefault){
    	
    	var url = newAPIBasePath + "/ti_advertshare/setDefaultAdvert";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {advertid:advertid,isdefault:isdefault}
    	});
	},

	setActsShareAdvert(actid,advertid){
    	
    	var url = newAPIBasePath + "/ti_advertshare/setActsShareAdvert";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {actid:actid,advertid:advertid}
    	});
	},
	




	deleteAdvertInfo(advertid){    	
    	var url = newAPIBasePath + "/ti_advertshare/deleteAdvertInfo";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {advertid:advertid}
    	});
	},
	
	getPromoterShareAdvertById(advertid){
		var url = newAPIBasePath + "/ti_advertshare/getPromoterShareAdvertById";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {advertid:advertid}
    	});
	},
	
	


    
    
    workForCustomerList(index,size,keywords)
    {   	
    	var url = newAPIBasePath + "/calendar/act/workForCustomerList";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {index:index,size:size,keywords:keywords}
    	});
    },
    
	getShareAdvertList(index,size,keywords){
        var url = newAPIBasePath + '/ti_advertshare/getShareAdvertList';
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{index:index,size:size,keywords:keywords}
    	});
	},
   
    
    campaignRemarkModify(id, remark){
        var url = newAPIBasePath + '/calendar/act/editActRemark';
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{actid:id, remark:remark}
    	});
    },
    // 保存广告图
    campaignADImageModify(id, imageURL){
        var url = newAPIBasePath + '/calendar/act/savecomposeActImg';
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{actid:id, actimg:imageURL}
    	});
    },
    // 编辑活动
    modifyCampaign(info){
        var url = newAPIBasePath + '/calendar/act/editCalendarActivity';
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{activityJson:JSON.stringify(info)}
    	});
    },
    campaignStuffsFetch(id, page)
    {
    	var url = newAPIBasePath + "/calendar/act/findActivityoffList";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: { size:CountPerPage, index:page, actid:id}
    	});
    },
    campaignStuffEnableSetting(id, uid, enable)
    {
    	var url = newAPIBasePath + "/calendar/act/setUserActPermission";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {actid:id, userId:uid, status:enable ? 1 : 0}
    	});
    },
    campaignWorksFetch(id, status, keyword, page)
    {
    	var url = newAPIBasePath + "/calendar/act/getActWorkListByActId";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: { size:CountPerPage, index:page, actid:id, keywords:keyword, status:status}
    	});
    },
    // 失效
    orderInvalid(id){
        var url = newAPIBasePath + "/calendar/act/failActivityWork";
        // var data = {workId:id};
        return createRequestPromise({
            url: url,
            method:"POST",
            data: {workId: id}
        });
    },
    // 激活
    orderActive(id){
        var url = newAPIBasePath + "/calendar/act/invokeActivityWorkStatus";
        var data = {workId:id};
        return createRequestPromise({
            url: url,
            method:"POST",
            data: {workId: id}
        });
    },
    productsFetch()
    {
    	var url = APIBasePath + "/ti_product/prolist";
    	return createRequestPromise({
    		url: url,
    		method:"GET"
    	});
    },
    stylesFetch(productID)
    {
    	var url = newAPIBasePath + "/product/pro";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: {pid:productID}
    	});
    },
    // workAddressesFetch(id)
    // {
    // 	var url = newAPIBasePath + "/ibs/order/getMyProductAddressList";
    // 	return createRequestPromise({
    // 		url: url,
    // 		method:"GET",
    // 		data: {cartid:id}
    // 	});
    // },
    stuffAccountsFetch(page)
    {
    	var url = newAPIBasePath + '/tiemployee/employeelist';
    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data: { size:CountPerPage, index:page}
    	});
    },
    stuffAccountAdd(name, phone)
    {
    	var url = newAPIBasePath + '/tiemployee/addEmployee';
    	var data = {name:name, phone:phone};
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {"memberJson": JSON.stringify(data)}
    	});
    },
    stuffAccountDelete(uid)
    {
    	var url = newAPIBasePath + '/tiemployee/delEmployee';
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {"userId": uid}
    	});
    },
    mineOrdersListFetch(status, page, keyword)
    {
    	var url = newAPIBasePath + "/ibs/ti_order/myTiOrderlist";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: {size:CountPerPage, index:page, status:status, keywords:keyword || ""}
    	});
    },
    getMyCustomerBuylist(status, page, keyword)
    {
        var url = newAPIBasePath + "/ibs/ti_order/getMyCustomerBuylist";
        return createRequestPromise({
            url: url,
            method:"GET",
            data: {size:CountPerPage, index:page, status:status, keywords:keyword || ""}
        });
    },
    partnerAccountInfoFetch(entity){
        var url = newAPIBasePath;
        if (entity == EntityType.Agency.value){
            url += '/calendar/agent/getTiAgentsInfo';
        }
        else if (entity == EntityType.Trafficsource.value) {
            url += '/calendar/agent/getTiPromoterInfo';
        }
        return createRequestPromise({
    		url: url,
    		method:"GET"
    	});
    },
    partnerAccountInfoModify(entity, name, phone, block)
    {
        var url = newAPIBasePath;
        if (entity == EntityType.Agency.value){
            url += '/calendar/agent/editTiAgentsAddress';
        }
        else if (entity == EntityType.Trafficsource.value) {
            url += '/calendar/agent/editTiPromotersAddress';
        }
    	return createRequestPromise({
    		url: url,
    		method:"POST",
    		data: {name:name, phone:phone, streetdetail:block}
    	});
    },
    productPresetADsFetch(productID)
    {
    	var url = newAPIBasePath + "/ti_advert/getAdvertimgsByIds";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data: {productid:productID}
    	});
    },
    productPresetADsSetting(productID, images, advertContent){
        var url = newAPIBasePath + "/ti_advert/addorEditAdvertimgs";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data: {productid:productID, advertImgJson:JSON.stringify(images), advertContent: advertContent}
    	});
    },
    workPreorderInfoFetch(workID)
    {
    	var url = newAPIBasePath + "/ibs/ti_order/getIbsTiSubmitAddressList";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
            data: {workId:workID}
    	});
    },
    submitOrder(order){
        var url = newAPIBasePath + "/ibs/ti_order/ibsSubmitTiOrder";
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data: {productJsonStr:JSON.stringify(order)}
    	});
    },
    accountInfoFetch(){
        var url = APIBasePath + "/user/account/info";
    	return createRequestPromise({
    		url: url,
    		method:"GET"
    	});
    },
    transactionRecordsFetch(category, page, keyword)
	{
		//category 1:货款消费 2:充值 3:运费消耗
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/ibs/account/accountLog";
		return createRequestPromise({
			url: url,
			method:"GET",
			data: {type:category, size:CountPerPage, index:page, keywords:keyword}
		});
	},
	
	
	productStyleList(id)
    {
    	var url = APIBasePath + "/ti_product/productStyleList";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: {productId:id}
    	});
    },
	
	getCoordinates(id)
    {
    	var url = APIBasePath + "/ti_style/getCoordinates";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: {styleId:id}
    	});
    },
	
	
	
	

	
	
	
	
    orderDetailFetch(id)
    {
    	var url = APIBasePath + "/ibs/order/getOrderDetail";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: {userOrderId:id || ''}
    	});
    },
    
    getUploadToken(){
		var url = APIBasePath + "/upload/getUploadToken";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: {}
    	});
		
	},

    
    
    shippingInfoFetch(carrier, shippingNo)
    {
    	var url = APIBasePath + '/post/getlogistics';
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: {expressCode: carrier, expressCom: shippingNo}
    	});
    },
    promotershareUrlFetch()
    {
    	var url = newAPIBasePath + '/ibs/user/info/getTishareUrl';
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: {}
    	});
    },
    shareADInfoFetch(){
        var url = newAPIBasePath + '/ti_advertshare/getPromoterShareAdvert';
    	return createRequestPromise({
    		url: url,
    		method:"GET"
    	});
    },
    shareADReset(){
        var url = newAPIBasePath + '/ti_advertshare/resetAdvertInfo';
    	return createRequestPromise({
    		url: url,
    		method:"POST"
    	});
    },
    shareADSetting(info, detailImages){
        var url = newAPIBasePath + '/ti_advertshare/addOrEditShareAdvert';
        var images = {imglist:detailImages};
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{advertinfoJson:JSON.stringify(info), advertImgsJson:JSON.stringify(images)}
    	});
	},


    joinedCustomersFetch(page,CountPerPage,advertid)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/ti_advertshare/getcoustomerlist";
		return createRequestPromise({
			url: url,
			method:"POST",
			data: { index:page, size:CountPerPage, advertid:advertid}
		});
	},





}

module.exports = exports
