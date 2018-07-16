var $ = require("jquery");
var publicPath = 'http://192.168.2.118:8888';

// import {createRequestPromise} from './api_base'
// var createRequestPromise =  require('./api_base.js')
var api_b =  require('./api_base.js')


var exports = {
  init:function(publicPath) {
    publicPath = publicPath;
  },
  //获取产品列表
  getProductList:function(){
    var url = publicPath + "/cts/cts/ti_product/getTiproductsByPage"
    return api_b.createRequestPromise({
      url:url,
      headers:"11",
      method:"GET",
      data:{isAll:1, index:1, size:10}
    })

  },
}




module.exports = exports

