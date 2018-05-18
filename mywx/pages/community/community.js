//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    _num: 1,
    imgUrl:'../../images/zan.png',
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
  
  clickZan:function(e){
    this.setData({
      imgUrl: '../../images/zan1.png'
    })
  }
})
