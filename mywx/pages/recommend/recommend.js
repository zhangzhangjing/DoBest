//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    _num: 1,
    _url:'',
    commendList: [{
      id: 0,
      title:"漫游成都",
      pic:'compic2.jpg',
      url:0,
      style:"pic-item1"
    },
     {
      id: 1,
      title: "浪漫三亚",
      pic: 'compic1.jpg',
      url: 1,
      style: "pic-item2"
      },
      {
        id: 2,
        title: "春季温泉",
        pic: 'compic3.jpg',
        url: 2,
        style: "pic-item2"
      },
      {
        id: 3,
        title: "蓝色沸点KTV",
        pic: 'compic4.jpg',
        url: 3,
        style: "pic-item1"
      },
      {
        id: 4,
        title: "下午茶",
        pic: 'compic5.jpg',
        url: 4,
        style: "pic-item3"
      },
      {
        id: 5,
        title: "3D电影票",
        pic: 'compic6.jpg',
        url: 5,
        style: "pic-item3"
      }]
  },
  clickBtn: function (e) {
    console.log(e.target)
    console.log(e.target.dataset.num)
    this.setData({
      _num: e.target.dataset.num
    })
  },
  listClickDetail: function(e){
    console.log(e.currentTarget);
    console.log(e.currentTarget.dataset.url);
    wx.navigateTo({
      url: '../../pages/lists/index',
    })
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
  },
  getPicture:function (e) {
    var _that = this;
      wx.chooseImage({
          count: 9, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
              _that.setData({
                  pictures:tempFilePaths
              })

          }
      })
  }
})
