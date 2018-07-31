
var $ = require("jquery");
import {Promise} from 'core-js';

// 每页条数
export const CountPerPage = 10;

export function successDefaultPromise(data){
	return new Promise(function(resolve, reject){resolve(data || {})});
}

export function failDefaultPromise(){
	return new Promise(function(resolve, reject){reject({code:0, message:''})});
}

export function createRequestPromise(options)
{
	if (!(options && options.url))
	{
		return failDefaultPromise();
	}

	// var headers = {'ticket':getToken()};
	if(options.headers){
		// headers = Object.assign({}, headers, options.headers);
	}

	var config = {
    SecretId:'AKIDpa9YlneOzXvQnzl3pPnzJJO6tbIzuO9t ',
    SecretKey:'1xqkZAqXFrz0vhIiwQqW8ZorjRyNbhcL'
  }

	return new Promise(function(resolve, reject){
    $.ajax({
		    url: options.url,
		    method:options.method || "POST",
		    data: options.data || {},
		    headers: {'ticket':'YYc687579f-de31-4155-ad4c-f811c6cd7817'},
		    dataType: 'json',
		    xhrFields: { withCredentials: true },
		    crossDomain: true,
		    success: function( response ) {
		    	responseBaseHandler(response, data => { resolve(data); }, error => { reject(error); })
		    },
		    error:function(error){
          console.log("出错了！")
		      reject(error);
		    }
		});
	});
}

function getToken(){
	return sessionStorage.getItem('ticket') || localStorage.getItem("ticket");
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
          errorCode = status;
        	// WxNotificationCenter.postNotificationName("TokenInvalid");
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
