var $ = require("jquery");
var publicPath = '';
//
var cts = require('./cts.js')
var createRequestPromise =  require('./api_base.js')
//
function init(config)
{
  publicPath = config.publicPath || publicPath;
}


module.exports = {
  publicPath:publicPath,
  cts:cts,
  init:init,
}

var app = {
  name: 'jingjing',
  version: '1.0.0',
  sayName: function(name){
    console.log("hello！"+this.name);
  }
}
module.exports = app;

app.sayName('111');


// module.exports = {
//   ready: function () {
//   }
// }
