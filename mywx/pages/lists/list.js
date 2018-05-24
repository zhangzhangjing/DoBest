var app = getApp()
// pages/lists/list.js
Page({
  data: {
    map_width: 380,
    map_height: 380
  },
  onLoad: function (options) {
    var that = this;
    // 获取定位，并把位置标示出来
    app.getLocationInfo(function (locationInfo) {
      console.log('map', locationInfo);
      that.setData({
        longitude: locationInfo.longitude
        , latitude: locationInfo.latitude
        , markers: [
          {
            id: 0
            , iconPath: "../../images/icons/pos.png"
            , longitude: locationInfo.longitude
            , latitude: locationInfo.latitude
            , width: 30
            , height: 30
          }
        ]
      })
  })

  wx.getSystemInfo({
    success: function (res) {
      console.log('getSystemInfo');
      console.log(res.windowWidth);
      that.setData({
        map_width: res.windowWidth
        , map_height: res.windowWidth
        , controls: [{
          id: 1,
          iconPath: '../../images/icons/pos1.png',
          position: {
            left: res.windowWidth / 2 - 8,
            top: res.windowWidth / 2 - 16,
            width: 30,
            height: 30
          },
          clickable: true
        }]
      })
    }
  })
},

  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },

   getLngLat: function () {
    var that = this;
    this.mapCtx = wx.createMapContext("myMap");
    this.mapCtx.getCenterLocation({
      success: function (res) {

        that.setData({
          longitude: res.longitude
          , latitude: res.latitude
          , markers: [
            {
              id: 0
              , iconPath: "../../images/icons/pos.png"
              , longitude: res.longitude
              , latitude: res.latitude
              , width: 30
              , height: 30
            }
          ]
        })

      }
    })
  }
  , regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置
    if(e.type == 'end') {
      this.getLngLat()
    }
  }
  , markertap(e) {
    console.log(e)
  },

  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap')
  },

})