//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    _num: 1,
    commendList: [{
      id: 0,
      title:"漫游成都",
      pic:'compic2.jpg',
      url:"www.baidu.com",
      style:"pic-item1"
    }, {
      id: 1,
      title: "浪漫三亚",
      pic: 'compic1.jpg',
      url: "www.baidu.com",
      style: "pic-item2"
      },{
        id: 2,
        title: "春季温泉",
        pic: 'compic3.jpg',
        url: "www.baidu.com",
        style: "pic-item2"
      },
      {
        id: 3,
        title: "蓝色沸点KTV",
        pic: 'compic4.jpg',
        url: "www.baidu.com",
        style: "pic-item1"
      },
      {
        id: 4,
        title: "下午茶",
        pic: 'compic5.jpg',
        url: "www.baidu.com",
        style: "pic-item3"
      },
      {
        id: 5,
        title: "3D电影票",
        pic: 'compic6.jpg',
        url: "www.baidu.com",
        style: "pic-item3"
      }]
  },
  
 
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  }
})
