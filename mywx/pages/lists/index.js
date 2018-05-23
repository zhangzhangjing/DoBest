//index.js
//获取应用实例
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath;

Page({
  data: {
    src: '',
    username: '',
    tel: '',
    remember: 1,
    items: [
      { name: 'remeber', value: '记住内容', checked: 'true'},
    ]
  },
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          username: res.data[1],
          tel: res.data[2]
        })
      }
    })
  },
  start: function () {
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('开始录音')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  //停止录音
  stop: function () {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
    })
  },
  //播放声音
  play: function () {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },
  playMusic:function(){
    innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
    innerAudioContext.autoplay = true
    console.log("开始播放音乐")
  },
  bindButtonTap: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },
  checkboxChange: function (e) {
    // var list = this.items
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var value = e.detail.value
    var remember = 0
    if (value[0]){
      remember = 1
    }else{
      remember = 0
    }
    this.setData({
      remember: remember
    })
  },
  searchBox:function(e){
    this.setData({
      name: e.detail.value.username,
      tel: e.detail.value.tel
    })
    var check = this.data.remember;
    var name = this.data.name;
    var tel = this.data.tel;
    if (!name){
      wx.showToast({
        title: '请填写姓名！',
        icon: 'loading',
        duration: 1000
      }) 
      return
    }
    if (!tel) {
      wx.showToast({
        title: '请填写电话！',
        icon: 'loading',
        duration: 1000
      })
      return
    }
    if (check){
      wx.setStorage({
        key: "userInfo",
        data: [check, name, tel]
      })
    }else{
      wx.removeStorage({
        key: 'userInfo',
        success: function (res) {
          console.log(res.data)
        }
      })
    }
    
    
  }
  
})
