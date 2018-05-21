//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    _num: 1,
    imgUrl:'../../images/zan.png',
    opacity: 1,
    isHideLoadMore:false,
    communityList: [{
      id: 0,
      username:"重庆新闻网",
      userPic:'compic2.jpg',
      content:"多少红颜悴，多少相思碎，唯留血染墨香哭乱冢。 ",
      createtime:"今天 14：28",
      zan:0,
      _src:false,
      pictures: ['compic1.jpg', 'compic2.jpg', 'compic3.jpg'],
    }, {
        id: 1,
        username: "Angular",
        userPic: 'compic1.jpg',
        content: "苍茫大地一剑尽挽破，何处繁华笙歌落。斜倚云端千壶掩寂寞，纵使他人空笑我。",
        createtime: "2018-5-8 12：23",
        zan: 1,
        pictures: ['compic5.jpg']
      },{
        id: 2,
        username: "周星驰",
        userPic: 'compic3.jpg',
        content: " 寄君一曲，不问曲终人聚散。",
        createtime: "今天 14：28",
        zan: 1,
        pictures: ['compic1.jpg', 'compic5.jpg']
      },
      {
        id: 3,
        username: "张兴义",
        userPic: 'compic6.jpg',
        content: "灯火星星，人声杳杳，歌不尽乱世烽火。",
        createtime: "2018-4-9 12：23",
        zan: 0,
        pictures: ['compic1.jpg', 'compic2.jpg', 'compic3.jpg']
      },
      {
        id: 4,
        username: "大圣",
        userPic: 'compic5.jpg',
        content: "一年老一年，一日没一日，一秋又一秋，一辈催一辈 一聚一离别，一喜一伤悲，一榻一身卧，一生一梦里 寻一夥相识，他一会咱一会 那一般相知，吹一会唱一会。",
        createtime: "2018-4-9 12：23",
        zan: 0,
        pictures: ['compic1.jpg','compic3.jpg']
      },
      {
        id: 5,
        username: "四月梅花",
        userPic: 'compic6.jpg',
        content: "[◆．” 莪菂丗堺,.﹏;*.只剩﹌.棒棒糖* .？ ┽☆ρs﹎..偶是↘ㄚi个贪玩旳╭ →孩孑?_? わ ↘。",
        createtime: "今天 10：28",
        zan: 1,
        pictures: ['compic1.jpg' , 'compic6.jpg', 'compic4.jpg']
      },
      {
        id: 6,
        username: "重庆新闻网",
        userPic: 'compic2.jpg',
        content: "多少红颜悴，多少相思碎，唯留血染墨香哭乱冢。 ",
        createtime: "今天 14：28",
        zan: 0,
        _src: false,
        pictures: ['compic1.jpg', 'compic2.jpg', 'compic3.jpg'],
      }]
  },
<<<<<<< HEAD
  
  clickZan: function (list,way){
    console.log(list);
    console.log(way);
    const length = this.data.communityList.length
=======
 
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  //加载更多
  onReachBottom: function () {
    console.log('加载更多')
    setTimeout(() => {
      this.setData({
        isHideLoadMore: true,
        communityList: [
          {
            id: 7,
            username: "Angular",
            userPic: 'compic1.jpg',
            content: "苍茫大地一剑尽挽破，何处繁华笙歌落。斜倚云端千壶掩寂寞，纵使他人空笑我。",
            createtime: "2018-5-8 12：23",
            zan: 1,
            pictures: ['compic5.jpg']
          }, {
            id: 8,
            username: "周星驰",
            userPic: 'compic3.jpg',
            content: " 寄君一曲，不问曲终人聚散。",
            createtime: "今天 14：28",
            zan: 1,
            pictures: ['compic1.jpg', 'compic5.jpg']
          },
          {
            id: 9,
            username: "张兴义",
            userPic: 'compic6.jpg',
            content: "灯火星星，人声杳杳，歌不尽乱世烽火。",
            createtime: "2018-4-9 12：23",
            zan: 0,
            pictures: ['compic1.jpg', 'compic2.jpg', 'compic3.jpg']
          },
          {
            id: 10,
            username: "大圣",
            userPic: 'compic5.jpg',
            content: "一年老一年，一日没一日，一秋又一秋，一辈催一辈 一聚一离别，一喜一伤悲，一榻一身卧，一生一梦里 寻一夥相识，他一会咱一会 那一般相知，吹一会唱一会。",
            createtime: "2018-4-9 12：23",
            zan: 0,
            pictures: ['compic1.jpg', 'compic3.jpg']
          },
          {
            id: 11,
            username: "四月梅花",
            userPic: 'compic6.jpg',
            content: "[◆．” 莪菂丗堺,.﹏;*.只剩﹌.棒棒糖* .？ ┽☆ρs﹎..偶是↘ㄚi个贪玩旳╭ →孩孑?_? わ ↘。",
            createtime: "今天 10：28",
            zan: 1,
            pictures: ['compic1.jpg', 'compic6.jpg', 'compic4.jpg']
          }
        ],
      })
    }, 1000)
  },

  clickZan: function (e) {
>>>>>>> d5a28991fe0760eddd361a14e05695d50fc28f12
    var List = this.data.communityList;
    console.log(List);
    var cla = e.currentTarget.id;
    let that = this;
    var flag = 0;
    console.log(cla);
    for (var index in List) {
      if (List[index].id == cla) {
        if (List[index].zan) {
          flag = 0;
        } else {
          flag = 1;
        }
        List[index].zan = flag;
        that.setData({
          communityList: that.data.communityList
        })
      }
    }

  },
})
