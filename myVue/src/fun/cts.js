var $ = require("jquery");
var publicPath = '';

// import {createRequestPromise} from './api_base'
var createRequestPromise =  require('./api_base.js')


var exports = {
  init:function(publicPath) {
    publicPath = publicPath;
  },
  getListMsg:function(){
  //   var url = publicPath + ""
  //   return createRequestPromise({
  //   url: url,
  //   method:"GET",
  //   data:{index:page}
  // });
    console.log("调用了module.exports内容！")
    alert("点击了！")
  },
}


module.exports = exports


// console.log('b 开始');
// exports.done = false;
// const app = require('./api.js');
// console.log('在 b 中，a.done = %j', a.done);
// exports.done = true;
// console.log('b 结束');

// var app = require('./api.js');
// app.sayName('hello');//hello
