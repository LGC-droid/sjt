const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
      name: 'name0'
  },
  
  onShareAppMessage: function () {
    return {
      title: "外卖返现，就上叮叮饭粒",
      imageUrl: "../../../imgs/share.png",
      path: '/pages/index/index?spid=' + app.globalData.uid,
    };
  }
});