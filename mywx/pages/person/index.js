var common = require("common.js");
// pages/person/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ScreenBrightness:0.5,
    screenLight:0.5,
    phoneNum: '10086'
  },

  changeScreenLight: function (e) {
    var that = this;
    //滑动拉杆获得值  
    wx.setScreenBrightness({
      value: parseFloat(e.detail.value).toFixed(1)
    })
    //给屏幕亮度赋值  
    wx.getScreenBrightness({
      success: function (res) {
        that.setData({
          ScreenBrightness: parseFloat(res.value).toFixed(1)
        })
      }
    })
  },
  phoneNumTap: function () {
    var that = this;
    // 提示呼叫号码还是将号码添加到手机通讯录  
    wx.showActionSheet({
      itemList: ['呼叫', '添加联系人'],
      success: function (res) {
        if (res.tapIndex === 0) {
          // 呼叫号码  
          wx.makePhoneCall({
            phoneNumber: that.data.phoneNum,
          })
        } else if (res.tapIndex == 1) {
          // 添加到手机通讯录  
          wx.addPhoneContact({
            firstName: '测试电话',//联系人姓名  
            mobilePhoneNumber: that.data.phoneNum,//联系人手机号  
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    common.myContent();    //需要执行才能生效哈
    wx.getScreenBrightness({
      success: function(res){
          var light = parseFloat(res.value).toFixed(1);
          that.setData({
            screenLight: light,
            ScreenBrightness: light
          })
      }
    })
  },

  scanBtn:function(){
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  },
  setScreenBright:function(){
    wx.setScreenBrightness({
      value:0,
      success:(res) =>{
        console.log("屏幕亮度最暗")
      }
    })
  }
})