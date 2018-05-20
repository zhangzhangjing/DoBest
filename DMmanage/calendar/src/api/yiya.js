//var jq = require("jquery");
var $ = require("jquery");
var APIBasePath = 'https://mpic.bbyiya.com';
// var APIBasePath = 'https://api.bbyiya.com';
var newAPIBasePath = 'https://mpic.bbyiya.com';
import {Promise} from 'core-js';
import WxNotificationCenter from 'common/js/WxNotificationCenter';
import YiyaUtil from 'common/js/YiyaUtil';
import { base64Encode } from 'common/js/base64'
//import 'core-js/shim';

function init(config)
{
	APIBasePath = config.APIBasePath || APIBasePath;
	newAPIBasePath = config.newAPIBasePath || newAPIBasePath;
}
function successDefaultPromise(data){
	return new Promise(function(resolve, reject){resolve(data || {})});
}
function failDefaultPromise(){
	return new Promise(function(resolve, reject){reject({code:0, message:''})});
}
function createRequestPromise(options)
{
	if (!(options && options.url))
	{
		return failDefaultPromise();
	}

	var headers = {'ticket':getToken()};
	if(options.headers){
		headers = Object.assign({}, headers, options.headers);
	}

	return new Promise(function(resolve, reject){
		$.ajax({
		    url: options.url,
		    method:options.method || "POST",
		    data: options.data || {},
		    headers: headers,
		    dataType: 'json',
		    xhrFields: { withCredentials: true },
		    crossDomain: true,
		    success: function( response ) {
		    	responseBaseHandler(response, data => { resolve(data); }, error => { reject(error); })
		    },
		    error:function(error){ reject(error); }
		});
	});
}

function getAPIBasePath(newAPIPriority){
	return newAPIPriority ? newAPIBasePath : APIBasePath;
}

//申请状态
function applicationStatusDescFecth(status)
{
	if(status == 1)
	{
		return "审核已通过"
	}
	else if(status == 2)
	{
		return "审核未通过"
	}
	else if(status == 3)
	{
		return "审核通过，等待缴费"
	}
	else if(status == 4)
	{
		return "已退驻"
	}
	return "审核中"
}

//订单状态
function orderStatusDescFecth(status)
{
	if(status == 0)
	{
		return "未支付"
	}
	else if(status == 1)
	{
		return "已支付"
	}
	else if(status == 2)
	{
		return "等待发货"
	}
	else if(status == 3)
	{
		return "已发货"
	}
	else if(status == 4)
	{
		return "已签收"
	}
	return "未知"
}

//订单状态
function invitationStatusDescFecth(status)
{
	// 1 发送邀请中  3 制作中，4 完成制作  2忽略邀请
	if(status == 1)
	{
		return "发送邀请中"
	}
	else if(status == 2)
	{
		return "忽略邀请"
	}
	else if(status == 3)
	{
		return "制作中"
	}
	else if(status == 4)
	{
		return "完成制作"
	}
	return "未知"
}

function templateWorkStatusDescFecth(status)
{
	// 1制作中，3制作已完成 4作品不通过，5下单成功
	if(status == 1)
	{
		return "制作中"
	}
	else if(status == 2)
	{
		return "已拒绝"
	}
	else if(status == 3)
	{
		return "制作已完成"
	}
	else if(status == 4)
	{
		return "作品不通过"
	}
	else if(status == 5)
	{
		return "下单成功"
	}
	else if(status == 6)
	{
		return "活动已结束"
	}
	return "未知"
}

function workSourceDescFecth(source){
	//0活动作品  1客户一对一  2 兑换码作品  3 其它
	if(source == 0) {
		return "活动作品"
	}
	else if(source == 1) {
		return "影楼一对一"
	}
	else if(source == 2) {
		return "兑换码作品"
	}
	else if(source == 3) {
		return "其它"
	}
	else if(source == 4) {
		return "客户一对一"
	}
	return "未知"
}

//每页条数
const CountPerPage = 10;
function login(phone, password)
{
	var url = APIBasePath + '/login/loginPhone';
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {phone:phone, pwd:password}
	});
}

//获取验证码
function verifyCodeFetch(phone, type)
{
	//type: 1 绑定手机，2 找回密码，3 登录
	var url = APIBasePath + "/sms/sendMsg";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {phone:phone, type:type}
	});
}

//重置密码
function passwordReset(phone, password, code)
{
	var url = APIBasePath + "/user/info/updatePwd";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {phone:phone,vcode:code,pwd:password}
	});
}

//产品属性获取
function uploadTokenFetch()
{
	var url = APIBasePath + "/upload/getUploadToken";
	return new Promise(function(resolve, reject){
		$.ajax({
		    url: url,
		    method:"GET",
		    data: { },
		    headers: {'ticket':getToken()},
		    dataType: 'json',
		    xhrFields: { withCredentials: true },
		    crossDomain: true,
		    success: function( response ) {
		    	responseBaseHandler(response, data => {
		    		var uploadToken = data.upToken;
		    		if(uploadToken){
		    			resolve(uploadToken);}
		    		else{
		    			reject({code:101, message:"数据异常"});
		    		}
		    	}, error => { reject(error); })
		    },
		    error:function(error){ reject(error); }
		});
	});
}

function qiniuUploadKeyGenerate(bashPath, imageWidth, imageHeight){
	var key = "";
	if(bashPath){
		key = bashPath + "/";
	}
	key += YiyaUtil.getUniqid(5) + "_" + Date.now();
	if(imageWidth && imageHeight){
		key += "_" + imageWidth + "x" + imageHeight;
	}
	return key;
}

function uploadBase64ImageToQiniu(token, base64Data, imageWidth, imageHeight)
{
	var imageKey = qiniuUploadKeyGenerate("", imageWidth, imageHeight);
	console.log(imageKey);
	var url = 'http://upload.qiniu.com/putb64/-1/key/' + base64Encode(imageKey);
	if (base64Data.indexOf('base64') !== -1) {
          base64Data = base64Data.split(',')[1]
    }

    return new Promise(function(resolve, reject){
		$.ajax({
		    url: url,
		    method:"POST",
		    data: base64Data,
		    headers: {'Content-Type':'application/octet-stream','Authorization':'UpToken ' + token},
		    dataType: 'json',
		    success: function( response ) {
		    	if (response && response.key) {
		    		resolve(response.key);
		    	}
		    	else {
		    		reject({code:101, message:"数据异常"});
		    	}
		    },
		    error:function(error){ reject(error); }
		});
	});
}

function uploadBase64Image(image, imageWidth, imageHeight)
{
	return new Promise((resolve, reject) => {
        uploadTokenFetch().then(token => {
            return uploadBase64ImageToQiniu(token, image, imageWidth, imageHeight);
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });//end Promise
}


//获取省份
function provinceFetch()
{
	var url = APIBasePath + '/region/getlist';
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {code: '', 'type': 0}
	});
}

function cityFetch(province)
{
	var url = APIBasePath + '/region/getlist';
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {code: province, 'type': 1}
	});
}

function districtFetch(city)
{
	var url = APIBasePath + '/region/getlist';
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {code: city, 'type': 2}
	});
}

function shippingInfoFetch(carrier, shippingNo)
{
	var url = APIBasePath + '/post/getlogistics';
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {expressCode: carrier, expressCom: shippingNo}
	});
}

//内部账户列表
function stuffAccountsFetch()
{
	var url = APIBasePath + '/ibs/member/memberslist';
	return createRequestPromise({
		url: url,
		method:"GET"
	});
}

//删除内部账户
function stuffAccountDelete(uid)
{
	var url = APIBasePath + '/ibs/member/delMember';
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {"userId": uid}
	});
}

//添加内部账户
function stuffAccountAdd(name, phone)
{
	var url = APIBasePath + '/ibs/member/addMember';
	var data = {name:name, phone:phone};
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {"memberJson": JSON.stringify(data)}
	});
}

//获取专属推广链接
function specialAffiliateURLFetch()
{
	var url = APIBasePath + '/user/info/getshareUrl';
	return createRequestPromise({
		url: url,
		method:"GET"
	});
}

//申请详情
function applicationDetailFetch(headquarters, storeID)
{
	var url = APIBasePath + '/cts/agent/getApplyStatus';
	var type = headquarters == true ? 1 : 2;
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {"type": type, userId:storeID}
	})
}

//流量
function trafficsourcesApplicationDetailFetch(uid)
{
	var url = APIBasePath + "/cts/weiuser/findWeiUserApplylist";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {size:CountPerPage, index:1, userId:uid}
	})
}



//添加内部账户
function customerAdd(info)
{
	var url = APIBasePath + '/ibs/customer/addOrEdit';
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {customerJson:JSON.stringify(info)}
	});
}

//删除内部账户
function customerDelete(uid)
{
	var url = APIBasePath + '/ibs/customer/dele';
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {customerId:uid}
	});
}

//获取客户列表
function customersListFetch(page, keyword, startDate, endDate, type)
{
	var url = APIBasePath + '/ibs/customer/marketlist';
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {index:page,size:CountPerPage, keywords:keyword, starttime:startDate, endtime:endDate, sourcetype:type || ''}
	});
}

//潜在客户列表
function latentCustomersListFetch(page, keyword, startDate, endDate)
{
	var url = APIBasePath + '/ibs/customer/list';
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {index:page,size:CountPerPage, keywords:keyword, starttime:startDate, endtime:endDate}
	});
}

//外部引流客户
function mineReferralsCustomersFetch(category, page, startDate, endDate)
{
	var url = APIBasePath + '/user/ibs/getusers';
	if(category == 3){
		var basePath = newAPIBasePath || APIBasePath;
		url = basePath + "/ibs/user/getSourceUsers";
	}
	return createRequestPromise({
		url: url,
		method:"GET",
		data: { size:CountPerPage, index:page, startTime:startDate,endTime:endDate}
	})
}


function referralsCustomersFetch(uid, page, startDate, endDate)
{
	var url = APIBasePath + '/cts/weiuser/getWeiUserRecommendUser';
	return createRequestPromise({
		url: url,
		method:"GET",
		data: { userId:uid, size:CountPerPage, index:page, startTime:startDate,endTime:endDate}
	})
}

function getToken(){
	return sessionStorage.getItem('ticket')
}

//流量合作申请
function trafficsourcesApplicationsFetch(page, status, name, phone)
{
	var url = APIBasePath + "/cts/weiuser/findWeiUserApplylist";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {size:CountPerPage, index:page, status:status, name:name, phone:phone}
	})
}

//流量合作审核
function trafficsourcesApplicationReview(uid, action)
{
	//action 1:同意 2:拒绝
	var url = APIBasePath + '/cts/weiuser/audit_weiUserApply';

	return createRequestPromise({
		url: url,
		method:"POST",
		data: {weiUserId:uid, status:action}
	})
}

//解除流量合作
function removeTrafficsources(uid)
{
	var url = APIBasePath + "/cts/weiuser/delete_weiUserApply";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {weiUserId:uid}
	});
}

//订单详情
function orderDetailFetch(id)
{
	var url = APIBasePath + "/ibs/order/getOrderDetail";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {userOrderId:id || ''}
	});
}

//未分配订单列表
function unownedOrderListFetch()
{
	var url = APIBasePath + "/ibs/order/waitinglist";
	return createRequestPromise({
		url: url,
		method:"GET"
	});
}

//本店订单列表
function mineOrdersListFetch(status, page, keyword)
{
	var url = APIBasePath + "/ibs/order/myOrderlist";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {size:CountPerPage, index:page, status:status, keywords:keyword || ""}
	});
}

//捡便宜，别的店过来的订单
function bargainOrdersFetch(status, page, keyword)
{
	var basePath = newAPIBasePath || APIBasePath;
	var url = basePath + "/ibs/order/myBranchOrderlist";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {size:CountPerPage, index:page, keywords:keyword || ""}
	});
}


//客户订单列表
function customerOrdersListFetch(uid)
{
	var url = APIBasePath + "/ibs/customer/customerBuylist";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {userId:uid}
	});
}

//专属推广链接带来的订单
function mineSpecialAffiliateOrdersFetch(page, startDate, endDate)
{
	var basePath = newAPIBasePath || APIBasePath;
	var url = basePath + "/ibs/account/branchCommissionDetails";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {size:CountPerPage, index:page, startTime:startDate,endTime:endDate}
	});
	//
}

function specialAffiliateOrdersFetch(uid, page, startDate, endDate)
{
	var url = APIBasePath + "/cts/weiuser/getWeiUserRecommendOrder";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: { userId:uid, size:CountPerPage, index:page, startTime:startDate,endTime:endDate}
	});
}


//工厂订单列表
function factoryOrdersListFetch(page, size, filters)
{
	var url = APIBasePath + "/pbs/order/getOrderList";
	var data = {index:page, size:size};
	if (filters){
		data['myproductJson'] = JSON.stringify(filters);
	}

	return createRequestPromise({
		url: url,
		method:"GET",
		data: data
	});
}

//作品详情
function workDetailFetch(id)
{
	var url = APIBasePath + "/myProduct/sharedetails";

	return createRequestPromise({
		url: url,
		method:"GET",
		data: {cartId:id}
	});
}

//获取作品详情
function workDetail4EditFetch(id)
{
	var url = APIBasePath + "/myProduct/details";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {cartId:id}
	});
}

//订单作品详情
function orderWorkDetailFetch(id)
{
	var url = APIBasePath + "/pbs/order/getOrderProductInfoPhotos";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {userOrderId:id}
	});
}

//创建作品
function createWork(info)
{
	return workModify(info, true)
}

//修改作品
function workModify(info, create)
{
	var url = APIBasePath + (create ? "/myProduct/saveMyproduct" : "/myProduct/editMyproduct");
	var infoJSON = JSON.stringify(info);
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {myproductJson:infoJSON}
	});
}

//作品初始化，历史遗留问题导致一开始需要填充12张图片
function workInit(workID)
{
	var photos = [];
	for (var i = 0; i < 12; i++) {
		photos.push({imgurl:"", title:"", content:"",sort:i});
	}
	return workModify({cartid:workID,details:photos}, true);
}

//修改作者
function workAuthorModify(cartid, author)
{
    return workModify({cartid:cartid,author:author},false);
}

//修改作品标题
function workTitleModify(cartid, title)
{
    return workModify({cartid:cartid,title:title},false);
}

//修改封面
function workCoverModify(workID, pdid, imageURL, description)
{
    var item = {pdid:pdid, imgurl:imageURL, sceneid:0};
    return workModify({cartid:workID, description:description, details:[item]},false);
}

//修改单页
function workPageModify(workID, pdid, imageURL, title, content, description)
{
    var item = {pdid:pdid, imgurl:imageURL, title:title, content:content, description:description, sceneid:0};
    return workModify({cartid:workID,details:[item]},false);
}

//清空
function clearWorkPhoto(workID, pdid)
{
    var item = {pdid:pdid, imgurl:"", title:"", content:"", description:""};
    return workModify({cartid:workID,details:[item]},false);
}

//删除作品
function removeWorkPhoto(pid)
{
	var url = APIBasePath + "/myProduct/dele";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {pdid:pid}
	});
}

//通过作品ID获取收货地址
function workAddressesFetch(id)
{
	var url = APIBasePath + "/ibs/order/getMyProductAddressList";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {cartid:id}
	});
}

//抢单
function rushOder(orderID)
{
	var url = APIBasePath + "/ibs/order/getMyOrder";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {userOrderId:orderID}
	});
}

//提交订单
function submitOrder(productID, workID, styleID, count,remark)
{
	var url = APIBasePath + "/order/submitOrderNew";
	var product = {productId:productID, styleId:styleID, cartId:workID, count:count};
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {productJsonStr:JSON.stringify(product),orderType:1,remark:remark}
	});
}


function submitOrder2(productInfo, addressInfo,remark)
{
	var url = APIBasePath + "/order/submitOrderIBS";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {productJsonStr:JSON.stringify(productInfo),addressJsonStr:JSON.stringify(addressInfo), orderType:1, remark:remark}
	});
}


//交易流水
function transactionRecordsFetch(category, page)
{
	//category 1:支出 2:充值
	var url = APIBasePath + "/user/account/cashLogs";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {type:category,size:CountPerPage, index:page}
	});
}

//邮费流水
function carriageTransactionRecordsFetch(category, page)
{
	var url = APIBasePath + "/user/account/branchTransAccountlog";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {type:category, size:CountPerPage, index:page}
	});
}

//账户信息获取
function accountInfoFetch()
{
	//role Customer Business
	var url = APIBasePath + "/user/account/info";
	return createRequestPromise({
		url: url,
		method:"GET"
	});
}

//合作商自己的账户信息获取
function cooperativeInfoFetch()
{
	var url = APIBasePath + "/ibs/branch/getBranchInfo";
	return createRequestPromise({
		url: url,
		method:"GET"
	});
}

//合作商地址修改
function cooperativeAddressModify(name, phone, block)
{
	var url = APIBasePath + "/ibs/branch/editBranchAddress";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {name:name, phone:phone, streetdetail:block}
	});
}

//意见反馈
function submitFeedback(content)
{
	var url = APIBasePath + "/ibs/branch/addUserResponses";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {content:content}
	});
}

//微信支付二维码获取
function wechatPayQRCodeFetch(payID)
{
	var url = APIBasePath + "/pay/getWxCode_url";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {payId:payID}
	});
}

//充值
function recharge(amount, type)
{
	var url = APIBasePath + "/order/recharge";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {amount:amount,type:type}
	});
}

//通用运费模板获取
function generalCarriageFetch()
{
	var url = APIBasePath + "/cts/post/findPPostModelList";
	return createRequestPromise({
		url: url,
		method:"GET"
	});
}

function addGeneralCarriage(name, amount)
{
	var url = APIBasePath + "/cts/post/addPPostModel";

	return createRequestPromise({
		url: url,
		method:"POST",
		data: {name:name, amount:amount}
	})
}

function modifyGeneralCarriage(id, name, amount)
{
	var url = APIBasePath + "/cts/post/updatePPostModel";

	return createRequestPromise({
		url: url,
		method:"POST",
		data: {postModelId:id, name:name, amount:amount}
	})
}


//不可用运费模板获取
function forbiddenCarriageFetch(page)
{
	var url = APIBasePath + "/cts/post/findPostmodelareasList";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {size:CountPerPage, index:page}
	});
}

function addForbiddenCarriage(name, code, amount, templateID)
{
	var url = APIBasePath + "/cts/post/addPostmodelareas";
	var info = {areacode:code, areaname:name, amount:amount, postmodelid:templateID};
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {postModelJson:JSON.stringify(info)}
	})
}

function removeForbiddenCarriage(id)
{
	var url = APIBasePath + "/cts/post/delPostmodelareas";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {postId:id}
	});
}

//获取物流公司列表
function carriersFetch()
{
	var url = APIBasePath + "/post/getPostInfo";
	return createRequestPromise({
		url: url,
		method:"GET"
	});
}

//修改物流信息
function editShippingInfo(orderID, carrierName, carrierID, number)
{
	var url = APIBasePath + "/pbs/order/editLogistics";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {orderId:orderID, expressCom:carrierName, expressCode:carrierID, expressOrder:number}
	});
}

//合并打包并支付运费
function packOrdersAndShipping(orderType, orderIDs, carrierName, carrierID, shippingNo, carriage)
{
	var url = APIBasePath + "/pbs/order/MergeOrderLogistic";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {ordertype:orderType, orderIds:orderIDs.join(','), expressCom:carrierName, expressCode:carrierID, expressOrder:shippingNo, postage:carriage}
	});
}

//检测是否可合并打包
function packEnableCheck(orderIDs)
{
	var url = APIBasePath + "/pbs/order/isCanMergeOrderLogistic";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {orderIds:orderIDs.join(',')}
	});
}


//支付运费
function payCarriage(orderID, carriage)
{
	var url = APIBasePath + "/pbs/order/addPostAge";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {orderId:orderID, postage:carriage}
	});
}

//赠送记录(一对一)
function presentRecordsFetch(category, page, status, keyword)
{

	var url = APIBasePath + "/ibs/branch/findMyProductsForBranch";
	if(category == 'passivity'){
		var basePath = newAPIBasePath || APIBasePath;
		url = basePath + "/ibs/branch/findMyProductsforCustomer";
	}
	var inviteStatus = (status || 0) > 0 ? status : "";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {size:CountPerPage, index:page, inviteStatus:inviteStatus, keywords:keyword}
	});
}

//微商列表获取
function freelancesFetch(page)
{
	var url = APIBasePath + "/cts/agent/findWeiUserlist";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {size:CountPerPage, index:page}
	})
}

//微商订单列表获取
function freelanceOrdersFetch(uid, page)
{
	var url = APIBasePath + "/cts/order/findUserOrderOfWeiUser";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {size:CountPerPage, index:page, userId:uid}
	})
}



//消息通知列表获取
function notificationsFetch(page)
{
	var url = APIBasePath + "/ibs/branch/getSysMessageList";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {size:CountPerPage, index:page, startTimeStr:'', endTimeStr:''}
	});
}

//意见列表列表获取
function feedbacksFetch(page)
{
	var url = APIBasePath + "/cts/msg/getUserResponseList";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {size:CountPerPage, index:page, startTimeStr:'', endTimeStr:''}
	});
}

//发布通知
function postNotification(title, content)
{
	var url = APIBasePath + "/cts/msg/sendSysMessage";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {title:title, content:content}
	});
}


//产品列表获取
function productsFetch(page)
{
	var url = APIBasePath + "/cts/product/findPproductsList";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {size:CountPerPage, index:page}
	});
}

//面向客户的产品列表
function products4CustomerFetch()
{
	var url = APIBasePath + "/product/productlist";
	return createRequestPromise({
		url: url,
		method:"GET"
	});
}

//获取款式列表
function stylesFetch(productID)
{
	var url = APIBasePath + "/product/pro";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {pid:productID}
	});
}

//产品属性获取
function productPropertiesFetch(productID,page)
{
	var url = APIBasePath + "/cts/product/findProductStylesList";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: { productId:productID, size:CountPerPage, index:page}
	});
}

//模板列表获取
function templatesFetch(page, status)
{
	var url = APIBasePath + "/ibs/temp/getMyProductTempList";
	var statusValue = status == -1 ? "" : status;
	return createRequestPromise({
		url: url,
		method:"GET",
		data: { size:CountPerPage, index:page, status:statusValue}
	});
}

//模板对应作品列表获取
function templateWorksFetch(templateID, status, page, keyword)
{
	var url = APIBasePath + "/ibs/branch/findMyProductslistForTempId";
	var activeStatus = (status || 0) > 0 ? status : "";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: { size:CountPerPage, index:page, tempid:templateID, activeStatus:activeStatus, keywords:keyword}
	});
}

//模板对应客户列表获取
function templateUsersFetch(templateID, page)
{
	var url = APIBasePath + "/ibs/temp/getMyProductTempApplyCheckList";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: { size:CountPerPage, index:page, tempid:templateID}
	});
}

//模板对应员工列表获取
function templateStuffsFetch(templateID, page)
{
	var url = APIBasePath + "/ibs/temp/find_UBranchUserOfTempList";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: { size:CountPerPage, index:page, tempid:templateID}
	});
}

//获取模板二维码
function templateQRImageURLFetch(workID, type)
{
	var url = APIBasePath + "/ibs/temp/getProductTempRQcode";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {cartId:workID,type:type || 0}
	});
}

//创建模板
function createTemplate(params)
{
	var url = APIBasePath + "/ibs/temp/addMyProductTemp";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {myproductTempJson:JSON.stringify(params)}
	});
}

//修改模板
function modifyTemplate(params)
{
	var url = APIBasePath + "/ibs/temp/editMyProductTemp";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {myproductTempJson:JSON.stringify(params)}
	});
}


//待审核页面相关信息
function templateApplicationPendingSetting(templateID, QRCodeURL, pendingContent, guidelines, logoURL)
{
	var url = APIBasePath + "/ibs/temp/editTempCodeUrl";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {tempid:templateID, codeurl:QRCodeURL, codesm:pendingContent, discription:guidelines, logourl:logoURL}
	});
}

function templateApplicationLimitSetting(templateID, maxCount)
{
	var url = APIBasePath + "/ibs/temp/setTempMaxApplyCount";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {tempid:templateID, maxApplyCount:maxCount}
	});
}

function templateFinishConditionSetting(templateID, review, limitCount, humanCount, forceShare, wishCount, tipCount, isbranchaddress)
{
	var url = APIBasePath + "/ibs/temp/setTempCompletecondition";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {tempid:templateID, needverifer:review, maxapplyCount:limitCount,
			   maxCompleteCount:humanCount, needshared:forceShare, blesscount:wishCount,
			   amountlimit:tipCount, isbranchaddress:isbranchaddress}
	});
}

//删除模板
function removeTemplate(templateID)
{
	var url = APIBasePath + "/ibs/temp/deleteMyProductTemp";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {tempid:templateID}
	});
}

//启用禁用模板
function templateStatusSetting(templateID, status)
{
	var url = APIBasePath + "/ibs/temp/editMyProductTempStatus";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {tempid:templateID,type:status}
	});
}

//对员工启用禁用模板
function templateEnable4StuffSetting(templateID, uid, enable)
{
	var url = APIBasePath + "/ibs/temp/setUserTempPermission";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {tempid:templateID, userId:uid, status:enable ? 1 : 0}
	});
}

function templatePrivilege4StuffSetting(templateID, uid, privilege)
{
	var url = APIBasePath + "/ibs/temp/setUserTempVerfiyPermission";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {tempid:templateID, userId:uid, status:privilege ? 1 : 0}
	});
}

//申请使用某模板
function userTemplateApplicationReview(applicationID, enable)
{
	var url = APIBasePath + "/ibs/temp/audit_TempApplyUser";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {tempApplyId:applicationID, status:enable ? 1 : 2}
	});
}

//通过模板的用户作品审核
function userTemplateWorkReview(workID, enable, remark)
{
	//4作品审核不通过  5下单审核通过
	var url = APIBasePath + "/ibs/temp/audit_TempApplyProduct";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {cartid:workID, reason:remark, status:enable ? 5 : 4}
	});
}


//预设评论获取
function presetCommentsFetch(productID)
{
	var url = APIBasePath + "/myproduct/comment/findTemplist";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: { productId:productID}
	});
}

//添加评论分类
function editPresetCommentCategory(productID, categoryName, categoryID)
{
	var url = APIBasePath + "/myproduct/comment/modifyCommentTemp";
	var info = {productid:productID, tipclassname:categoryName, tipclassid:categoryID || ""};
	return createRequestPromise({
		url: url,
		method:"POST",
		data: { commentJson:JSON.stringify(info)}
	});
}

//删除评论分类
function removePresetCommentCategory(categoryID)
{
	var url = APIBasePath + "/myproduct/comment/delTipClass";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: { classId:categoryID}
	});
}

//添加评论
function addPresetComment(categoryID, commentID, content)
{
	var url = APIBasePath + "/myproduct/comment/modifyCommentTemp";
	var info = {tipclassid:categoryID, tips:[{tipid:commentID, content:content}]};
	return createRequestPromise({
		url: url,
		method:"POST",
		data: { commentJson:JSON.stringify(info)}
	});
}

//删除评论
function removePresetComment(commentID)
{
	var url = APIBasePath + "/myproduct/comment/delTip";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: { tipid:commentID}
	});
}




//获取Excel下载链接
function excelURLFetch(filters)
{
	var url = APIBasePath + "/pbs/order/orderExportExcel";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {myproductJson:JSON.stringify(filters)}
	});
}

//图片下载
function imageURLFetch(orderID)
{
	var url = APIBasePath + "/pbs/order/singleDownLoadImage";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {orderId:orderID,isDownload:1,fileDir:'C:\\Users\\kevin\\orderimg\\'}
	});
}

function workOriginImagesZipURLFetch(orderID)
{
	var url = APIBasePath + "/pbs/order/singleDownLoadOriginalImage";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {orderId:orderID,isDownload:1}
	});
}

//图片批量下载
function imageBatchURLFetch(filters)
{
	var url = APIBasePath + "/pbs/order/batchDownLoadImage";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {myproductJson:JSON.stringify(filters),isDownload:1,fileDir:'C:\\Users\\kevin\\orderimg\\'}
	});
}

//
function templateQRImageDownloadURLFetch(workID, uid, type)
{
	var url = APIBasePath + "/ibs/temp/downProductTempRQcode";
	return createRequestPromise({
		url: url,
		method:"POST",
		data: {cartId:workID,companyUserid:uid, type:type || 0}
	});
}

//获取Excel下载链接
function trafficsourceAnalyticsExcelURLFetch(uid, page, startDate, endDate)
{
	var url = APIBasePath + "/cts/weiuser/WeiUserRecommendExport";
	return createRequestPromise({
		url: url,
		method:"GET",
		data: {index:page, size:CountPerPage, userId:uid, startTime:startDate, endTime:endDate}
	});
}


function responseBaseHandler(response, successCallback, failCallback)
{
    var errorCode = "";
    var APIDefaultErrorCode = 400;

    if (response && response.Statu != "")
    {
		var status = response.Statu;

        var data = response.BaseModle || {};
        if (status == "1" && data){
            typeof successCallback == "function" && successCallback(data)
        }
        else if (status == "-1")
        {
        	WxNotificationCenter.postNotificationName("TokenInvalid");
        }
        else{
            errorCode = status;
        }
	}
    else{
        errorCode = 400;
    }

    if (errorCode){
		var message = response.StatusReson || '';
		var error = {code:errorCode, message:message};
        typeof failCallback == "function" && failCallback(error)
    }
}

var user = {
	worksFetch:function(page)
	{
		var basePath = APIBasePath;
		var url = basePath + "/user/myProduct/mylist";
		return createRequestPromise({
			url: url,
			method:"GET",
			data: {size:CountPerPage, index:page}
		})
	}
}

var ibs = {
	getBranchInfo:function()
	{
		var basePath = APIBasePath;
		var url = basePath + "/ibs/branch/getBranchInfo";
		return createRequestPromise({
			url: url,
			method:"GET",
			data: {}
		})
	},
	modifyBranchInfo:function(logoURL, adContent)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/ibs/branch/editBranchShopInfo";
		return createRequestPromise({
			url: url,
			method:"POST",
			data: {logo:logoURL, promotionstr:adContent || ''}
		})
	},
	transactionRecordsFetch:function(category, page)
	{
		//category 1:货款消费 2:充值 3:运费消耗
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/ibs/account/accountLog";
		return createRequestPromise({
			url: url,
			method:"GET",
			data: {type:category, size:CountPerPage, index:page}
		});
	},
	//模板基本信息获取
	templateBaseInfoFetch:function(templateID)
	{
		var url = APIBasePath + "/ibs/temp/getMyProductTempById";
		return createRequestPromise({
			url: url,
			method:"GET",
			data: { tempid:templateID }
		});
	},
	templateWorksExcelURLFetch:function(templateID, status, keyword)
	{
		var basePath = APIBasePath;
		var url = basePath + "/ibs/branch/tempProductExportExcel";
		var activeStatus = (status || 0) > 0 ? status : "";
		return createRequestPromise({
			url: url,
			method:"GET",
			data: {tempid:templateID, activeStatus:activeStatus, keywords:keyword}
		});
	},
	templateRemarkModify:function (templateID, remark)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/ibs/temp/editTempRemark";
		return createRequestPromise({
			url: url,
			method:"POST",
			data: {tempid:templateID, remark:remark}
		});
	},
	promotionBaseInfoSetting:function(templateID, QRCodeURL, pendingContent, logoURL, guidelines)
	{
		var url = APIBasePath + "/ibs/temp/editTempCodeUrl";
		return createRequestPromise({
			url: url,
			method:"POST",
			data: {tempid:templateID, codeurl:QRCodeURL, codesm:pendingContent, logourl:logoURL, discription:guidelines}
		});
	},
	//模板列表获取
	promotionsFetch:function(page, keyword)
	{
		var url = APIBasePath + "/ibs/temp/getMyProductTempList";
		return createRequestPromise({
			url: url,
			method:"GET",
			data: { size:CountPerPage, index:page, status:'',type:2, keywords:keyword || ""}
		});
	},
	createPromotion:function(params, products){
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/ibs/temp/addActivityCode";
		var productsJSON = JSON.stringify({stylelist:products});
		return createRequestPromise({
			url: url,
			method:"POST",
			data: {myproductTempJson:JSON.stringify(params), productstyleJson:productsJSON}
		});
	},
	//获取
	promotionCodesFetch:function(templateID, status, page, keyword)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/ibs/temp/findMyProductslistForActivityCode";

		var activeStatus = parseInt(status);
		activeStatus = activeStatus >= 0 ? activeStatus : "";
		return createRequestPromise({
			url: url,
			method:"GET",
			data: { size:CountPerPage, index:page, activeStatus:activeStatus, tempid:templateID, keywords:keyword}
		});
	},
	removePromotionCode:function(code){
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/ibs/temp/deleteActivityCode";
		return createRequestPromise({
			url: url,
			method:"POST",
			data: {codeno:code}
		});
	},
	promotionCodesExcelURLFetch:function(templateID, status, keyword)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/ibs/temp/activityCodeProductExportExcel";
		var activeStatus = (status || 0) > 0 ? status : "";
		return createRequestPromise({
			url: url,
			method:"GET",
			data: {tempid:templateID, activeStatus:activeStatus, keywords:keyword}
		});
	},
	codeWorkStatusDescFecth:function(status)
	{
		// 0未使用 1已使用 3制作已完成 4作品审核不通过5下单审核通过
		if(status == 0)
		{
			return "未使用"
		}
		else if(status == 1)
		{
			return "已使用"
		}
		else if(status == 2)
		{
			return "已拒绝"
		}
		else if(status == 3)
		{
			return "制作已完成"
		}
		else if(status == 4)
		{
			return "作品不通过"
		}
		else if(status == 5)
		{
			return "下单成功"
		}
		else if(status == 6)
		{
			return "活动已结束"
		}
		return "未知"
	}



}

var cts = {
	recharge:function(uid, amount)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/cts/account/chongzhi";
		return createRequestPromise({
			url: url,
			method:"POST",
			data: {amount:amount,branchuserid:uid}
		});
	},
	carriageRecharge:function(uid, amount)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/cts/account/rechargeTransAccount";
		return createRequestPromise({
			url: url,
			method:"POST",
			data: {amount:amount,branchuserid:uid}
		});
	},
	applicationListFetch:function(page, status, keyword)
	{
		var url = APIBasePath + '/cts/agent/findBranchApplylist';
		var statusValue = status >= 0 ? status : "";
		return createRequestPromise({
			url: url,
			method:"GET",
			data:{size:CountPerPage, index:page, status:statusValue,keywords:keyword}
		});
	},
	//影楼合作申请列表
	headquartersApplicationListFetch:function(page, status, keyword)
	{
		var url = APIBasePath + '/cts/agent/findAgentApplylist';
		var statusValue = status >= 0 ? status : "";
		return createRequestPromise({
			url: url,
			method:"GET",
			data:{size:CountPerPage, index:page, status:statusValue,keywords:keyword}
		});
	},
	//提交影楼合作申请
	sumbitApplication:function(headquarters, uid, info, areas)
	{
		var url = '';
		var data = {branchUserId:uid};
		if (headquarters)
		{
			url = APIBasePath + '/ibs/branch/cts_agentApplyNew';
			data.agentJson = JSON.stringify(info);
			data.areacodeJson = JSON.stringify({areacodelist:areas});
		}
		else
		{
			url = APIBasePath + '/ibs/branch/cts_branchApply';
			data.branchJson = JSON.stringify(info);
		}

		return createRequestPromise({
			url: url,
			method:"POST",
			data: data
		})
	},
	//影楼合作审核
	applicationReview:function(headquarters, storeID, action, remark)
	{
		//action 1:同意 2:拒绝
		var url = '';
		var data = {};
		data.msg = remark;
		data.status = action;
		console.log('headquarters:', headquarters)
		if (headquarters)
		{
			url = APIBasePath + '/cts/agent/audit_AgentApply';
			data.agentUserId = storeID;
		}
		else
		{
			url = APIBasePath + '/cts/agent/audit_BranchApply';
			data.branchUserId = storeID;
		}

		return createRequestPromise({
			url: url,
			method:"POST",
			data: data
		})
	},
	cooperatorUpgrade(uid){
		var url = newAPIBasePath + "/calendar/agent/transtopromoter";
		return createRequestPromise({
			url: url,
			method:"POST",
			data: {userid:uid}
		})
	},
	cooperativeTermination:function(uid){
		var basePath = newAPIBasePath || APIBasePath;
		var url = APIBasePath + "/cts/agent/agentTuiZhu";
		return createRequestPromise({
			url: url,
			method:"POST",
			data: {agentUserId:uid}
		})
	},
	businessRegionFetch:function(district)
	{
		var url = APIBasePath + '/ibs/branch/getAgentAreas';
		return createRequestPromise({
			url: url,
			method:"GET",
			data:{areaCode: district}
		});
	},
	businessRegionAvailableCheck:function(district, uid)
	{
		var url = APIBasePath + '/ibs/branch/checkAreaCodeIsApply';
		return createRequestPromise({
			url: url,
			method:"GET",
			data:{areacode: district, agentUserId:uid}
		});
	},
	addScenes:function(info)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/cts/scenes/addScenes";
		return createRequestPromise({
			url: url,
			method:"POST",
			data: {myScenseJson:JSON.stringify(info)}
		})
	},
	productScenesFetch:function(productID, page, keyword)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/cts/scenes/getScenseList";
		return createRequestPromise({
			url: url,
			method:"GET",
			data: { productid:productID, size:CountPerPage, index:page, keywords:keyword}
		});
	},
	stuffsFetch:function(page, keyword)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + '/cts/user/findCtsMemberlist';
		return createRequestPromise({
			url: url,
			method:"GET",
			data:{size:CountPerPage, index:page, keywords:keyword || ''}
		});
	},
	addStuff:function(phone)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/cts/user/addCtsUser";
		return createRequestPromise({
			url: url,
			method:"POST",
			data: {phone:phone}
		})
	},
	removeStuff:function(uid)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + "/cts/user/deleteCtsUser";
		return createRequestPromise({
			url: url,
			method:"POST",
			data: {userid:uid}
		})
	},
	editProduct:function(info)
	{
		var url = APIBasePath + "/cts/product/editPproducts";
		return createRequestPromise({
			url: url,
			method:"POST",
			data: {myproductJson:JSON.stringify(info)}
		})
	},
	editProductStyle:function(info)
	{
		var url = APIBasePath + "/cts/product/editProductStyles";
		return createRequestPromise({
			url: url,
			method:"POST",
			data: {myproductJson:JSON.stringify(info)}
		})
	},
	allAgenciesFetch:function()
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + '/cts/statistics/getAgentList';
		return createRequestPromise({
			url: url,
			method:"GET"
		});
	},
	agenciesFetch:function(page, keyword, sort)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + '/cts/agentdate/all';
		return createRequestPromise({
			url: url,
			method:"GET",
			data:{size:CountPerPage, index:page, type:sort, keyWord:keyword || ''}
		});
	},
	allEventsFetch:function(agencyID, status, page)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + '/cts/statistics/activityCountPage';
		return createRequestPromise({
			url: url,
			method:"GET",
			data:{size:CountPerPage, index:page, agentUserId:agencyID, status:status}
		});
	},
	eventDetailFetch:function(eventID, startDate, endDate, unitType)
	{
		var basePath = newAPIBasePath || APIBasePath;
		var url = basePath + '/cts/statistics/activityDetailsCountPage';
		return createRequestPromise({
			url: url,
			method:"GET",
			data:{tempid:eventID, starttime:startDate, endtime:endDate, type:unitType}
		});
	}







}

module.exports = {
				  init:init,
				  ibs:ibs,
				  cts:cts,
				  user:user,
				  getAPIBasePath:getAPIBasePath,
				  CountPerPage:CountPerPage,
				  failDefaultPromise:failDefaultPromise,
				  successDefaultPromise:successDefaultPromise,
				  login:login,
				  verifyCodeFetch:verifyCodeFetch,
				  passwordReset:passwordReset,
				  qiniuUploadKeyGenerate:qiniuUploadKeyGenerate,
				  uploadTokenFetch:uploadTokenFetch,
				  uploadBase64Image:uploadBase64Image,
				  provinceFetch:provinceFetch,
				  cityFetch:cityFetch,
				  districtFetch:districtFetch,
				  shippingInfoFetch:shippingInfoFetch,
				  stuffAccountsFetch:stuffAccountsFetch,
				  stuffAccountDelete:stuffAccountDelete,
				  stuffAccountAdd:stuffAccountAdd,
				  specialAffiliateURLFetch:specialAffiliateURLFetch,
				  applicationDetailFetch:applicationDetailFetch,
				  trafficsourcesApplicationDetailFetch:trafficsourcesApplicationDetailFetch,
				  trafficsourcesApplicationsFetch:trafficsourcesApplicationsFetch,
				  trafficsourcesApplicationReview:trafficsourcesApplicationReview,
				  removeTrafficsources:removeTrafficsources,
				  applicationStatusDescFecth:applicationStatusDescFecth,
				  invitationStatusDescFecth:invitationStatusDescFecth,
				  templateWorkStatusDescFecth:templateWorkStatusDescFecth,
				  workSourceDescFecth:workSourceDescFecth,
				  customersListFetch:customersListFetch,
				  latentCustomersListFetch:latentCustomersListFetch,
				  mineReferralsCustomersFetch:mineReferralsCustomersFetch,
				  referralsCustomersFetch:referralsCustomersFetch,
				  customerAdd:customerAdd,
				  customerDelete:customerDelete,
				  orderDetailFetch:orderDetailFetch,
				  orderStatusDescFecth:orderStatusDescFecth,
				  unownedOrderListFetch:unownedOrderListFetch,
				  createWork:createWork,
				  workInit:workInit,
				  workDetailFetch:workDetailFetch,
				  workDetail4EditFetch:workDetail4EditFetch,
				  orderWorkDetailFetch:orderWorkDetailFetch,
				  workTitleModify:workTitleModify,
				  workAuthorModify:workAuthorModify,
				  workPageModify:workPageModify,
				  workCoverModify:workCoverModify,
				  removeWorkPhoto:removeWorkPhoto,
				  clearWorkPhoto:clearWorkPhoto,
				  workAddressesFetch:workAddressesFetch,
				  mineOrdersListFetch:mineOrdersListFetch,
				  bargainOrdersFetch:bargainOrdersFetch,
				  customerOrdersListFetch:customerOrdersListFetch,
				  mineSpecialAffiliateOrdersFetch:mineSpecialAffiliateOrdersFetch,
				  specialAffiliateOrdersFetch:specialAffiliateOrdersFetch,
				  rushOder:rushOder,
				  submitOrder:submitOrder,
				  submitOrder2:submitOrder2,
				  transactionRecordsFetch:transactionRecordsFetch,
				  carriageTransactionRecordsFetch:carriageTransactionRecordsFetch,
				  accountInfoFetch:accountInfoFetch,
				  cooperativeInfoFetch:cooperativeInfoFetch,
				  cooperativeAddressModify:cooperativeAddressModify,
				  recharge:recharge,
				  wechatPayQRCodeFetch:wechatPayQRCodeFetch,
				  presentRecordsFetch:presentRecordsFetch,
				  factoryOrdersListFetch:factoryOrdersListFetch,
				  generalCarriageFetch:generalCarriageFetch,
				  addGeneralCarriage:addGeneralCarriage,
				  modifyGeneralCarriage:modifyGeneralCarriage,
				  forbiddenCarriageFetch:forbiddenCarriageFetch,
				  addForbiddenCarriage:addForbiddenCarriage,
				  removeForbiddenCarriage:removeForbiddenCarriage,
				  carriersFetch:carriersFetch,
				  editShippingInfo:editShippingInfo,
				  payCarriage:payCarriage,
				  packEnableCheck:packEnableCheck,
				  packOrdersAndShipping:packOrdersAndShipping,
				  notificationsFetch:notificationsFetch,
				  freelancesFetch:freelancesFetch,
				  freelanceOrdersFetch:freelanceOrdersFetch,
				  productsFetch:productsFetch,
				  products4CustomerFetch:products4CustomerFetch,
				  productPropertiesFetch:productPropertiesFetch,
				  stylesFetch:stylesFetch,
				  templatesFetch:templatesFetch,
				  templateWorksFetch:templateWorksFetch,
				  templateUsersFetch:templateUsersFetch,
				  templateStuffsFetch:templateStuffsFetch,
				  templateQRImageURLFetch:templateQRImageURLFetch,
				  createTemplate:createTemplate,
				  modifyTemplate:modifyTemplate,
				  templateApplicationPendingSetting:templateApplicationPendingSetting,
				  templateApplicationLimitSetting:templateApplicationLimitSetting,
				  templateFinishConditionSetting:templateFinishConditionSetting,
				  removeTemplate:removeTemplate,
				  templateStatusSetting:templateStatusSetting,
				  templateEnable4StuffSetting:templateEnable4StuffSetting,
				  templatePrivilege4StuffSetting:templatePrivilege4StuffSetting,
				  userTemplateApplicationReview:userTemplateApplicationReview,
				  userTemplateWorkReview:userTemplateWorkReview,
				  presetCommentsFetch:presetCommentsFetch,
				  editPresetCommentCategory:editPresetCommentCategory,
				  removePresetCommentCategory:removePresetCommentCategory,
				  addPresetComment:addPresetComment,
				  removePresetComment:removePresetComment,
				  postNotification:postNotification,
				  feedbacksFetch:feedbacksFetch,
				  submitFeedback:submitFeedback,
				  excelURLFetch:excelURLFetch,
				  imageURLFetch:imageURLFetch,
				  workOriginImagesZipURLFetch:workOriginImagesZipURLFetch,
				  imageBatchURLFetch:imageBatchURLFetch,
				  trafficsourceAnalyticsExcelURLFetch:trafficsourceAnalyticsExcelURLFetch,
				  templateQRImageDownloadURLFetch:templateQRImageDownloadURLFetch
				  }
