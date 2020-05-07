// pages/explain/xiangqing.js
const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.baseGet(app.U({
      c: 'Public_api',
      a: 'shuoming',
      q: {
        id: options.id
      }
    }), function (res) {

      if (res.code == 200) {
        that.setData({
          shuoming: res.data.shuoming
        })
        WxParse.setImageDomain(app.globalData.url);
        WxParse.wxParse('content', 'html', res.data.shuoming.content, that, 0);
      } else {
        return app.Tips({
          title: '没有获取到数据'
        }, {
          tab: 3,
          url: 1
        });
      }
      console.log(app.globalData.is_gonglue)


    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "外卖返现，就上叮叮饭粒",
      imageUrl: "../../../imgs/share.png",
      path: '/pages/index/index?spid=' + app.globalData.uid,
    };
  }
})