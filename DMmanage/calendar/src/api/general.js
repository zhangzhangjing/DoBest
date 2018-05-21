import {createRequestPromise,CountPerPage} from 'common/js/api_base.js'
import { base64Encode } from 'common/js/base64'
import YiyaUtil from 'common/js/YiyaUtil';
var $ = require("jquery");

var APIBasePath = '';
var newAPIBasePath = '';

var exports = {
    init:function(aAPIBasePath, anewAPIBasePath) {
        APIBasePath = aAPIBasePath;
        newAPIBasePath = anewAPIBasePath;
    },
    login(phone, password){
        var url = APIBasePath + '/login/loginPhone';
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{phone:phone, pwd:password}
    	});
    },
    passwordReset(phone, password, code){
        var url = APIBasePath + '/user/info/updatePwd';
    	return createRequestPromise({
    		url: url,
    		method:"POST",
            data:{phone:phone,vcode:code,pwd:password}
    	});
    },
    //获取验证码
    verifyCodeFetch(phone, type)
    {
    	//type: 1 绑定手机，2 找回密码，3 登录
    	var url = APIBasePath + "/sms/sendMsg";
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: {phone:phone, type:type}
    	});
    },
    //获取省份
    provinceFetch()
    {
    	var url = APIBasePath + '/region/getlist';
    	return createRequestPromise({
    		url: url,
    		method:"GET",
			data: {code: '', 'type': 0} 
			
    	});
    },
    cityFetch(province)
    {
    	var url = APIBasePath + '/region/getlist';
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: {code: province, 'type': 1}
    	});
    },
    districtFetch(city)
    {
    	var url = APIBasePath + '/region/getlist';
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: {code: city, 'type': 2}
    	});
    },
    uploadTokenFetch(){
        var url = APIBasePath + '/upload/getUploadToken';
    	return createRequestPromise({
    		url: url,
    		method:"GET"
    	});
    },
    qiniuUploadKeyGenerate(bashPath, imageWidth, imageHeight){
    	var key = "";
    	if(bashPath){
    		key = bashPath + "/";
    	}
    	key += YiyaUtil.getUniqid(5) + "_" + Date.now();
    	if(imageWidth && imageHeight){
    		key += "_" + imageWidth + "x" + imageHeight;
    	}
    	return key;
    },
    uploadBase64ImageToQiniu(token, base64Data, imageWidth, imageHeight)
    {
    	var imageKey = this.qiniuUploadKeyGenerate("", imageWidth, imageHeight);
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
    },
    uploadBlobToQiniu(token, blob, imageWidth, imageHeight)
    {
    	var imageKey = this.qiniuUploadKeyGenerate("", imageWidth, imageHeight);
    	var url = 'https://up.qbox.me';
        var formData = new FormData();
        formData.append("token", token);
        formData.append("key", imageKey);
        formData.append("file", blob);

        return new Promise(function(resolve, reject){
    		$.ajax({
    		    url: url,
    		    method:"POST",
                processData: false,
                contentType: false,
    		    data: formData,
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
    },
    uploadBase64Image(image, imageWidth, imageHeight)
    {
    	return new Promise((resolve, reject) => {
            this.uploadTokenFetch().then(response => {
                var upToken = response.upToken;
                return this.uploadBase64ImageToQiniu(upToken, image, imageWidth, imageHeight);
            }).then(response => {
                resolve(response);
//              console.log(response)
//              console.log(444444444444444444444444)
            }).catch(error => {
                reject(error);
            });
        });//end Promise
    },
    uploadBlob(blob, imageWidth, imageHeight)
    {
    	return new Promise((resolve, reject) => {
            this.uploadTokenFetch().then(response => {
                var upToken = response.upToken;
                return this.uploadBlobToQiniu(upToken, blob, imageWidth, imageHeight);
            }).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });//end Promise
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
    shippingInfoFetch(carrier, shippingNo)
    {
    	var url = APIBasePath + '/post/getlogistics';
    	return createRequestPromise({
    		url: url,
    		method:"GET",
    		data: {expressCode: carrier, expressCom: shippingNo}
    	});
    }


}

module.exports = exports
