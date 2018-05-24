//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    nickName:'',
    avartar:'',
  },
  onLoad: function () {
    let that = this;
    wx.getUserInfo({
      success: function (res) {
        var myInfo = res.userInfo;
        that.nickName = myInfo.nickName;
        that.avartar = myInfo.avatarUrl;
        that.setData({
          nickName: that.nickName,
          avartar: that.avartar
        })
      }
    })
  },
  changePic:function(e){
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          avartar: tempFilePaths
        })
      }
    })
  },
  makePhoneCall:function(){
    wx.makePhoneCall({
      phoneNumber: '10086' //仅为示例，并非真实的电话号码
    })
  },
  pathTocom:function(e){
    wx.navigateTo({
      url: '../../pages/lists/list'
    })
    console.log(111)
  }
  
})
