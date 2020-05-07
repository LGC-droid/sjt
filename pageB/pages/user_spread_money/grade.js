// pages/index/grade.js
const app = getApp();
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

  },
  onLoadFun: function () {
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        isLogin: true,
      })
      
      this.get_distribution_level();
    }

  },
  get_distribution_level:function(){
    var that = this;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
      c: 'Distribution_api',
      a: 'get_distribution_level',
      q: {
        uid: that.data.uid,
      }
    }), function (res) {
      console.log(res)
      wx.hideLoading()
      if(res.data.status==200){
        that.setData({
          dabiao_info:res.data.result.dabiao_info,
          distribution_proportion:res.data.result.distribution_proportion
         })
      }else{
        return app.Tips({ title: res.msg});
      }
    });
  },
  fxdds: function () {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '返现订单数=使用叮叮饭粒平台，提交订单审核，通过并完成外卖订单返现',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
  yqhy: function () {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '成功邀请好友=开通合伙人后，通过合伙人分销链接，邀请好友使用叮叮饭粒，并完成订单',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
  fenxiao: function () {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '分销订单数=开通合伙人后，好友成为对应一级分销用户，30天内邀请的好友产生的返现订单累计达到30单',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
  ddhy: function () {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '叮叮会员=开通叮叮饭粒会员，且周期内会员未到期',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
  yaoqing:function(){
    wx.navigateTo({
      url: '../user_spread_code/index',
    })
  },
  govip: function () {
    wx.navigateTo({
      url: '../member/payment',
    })
  },
  goindex:function(){
    wx.switchTab({
      url: '../../../pages/index/index',
    })
  }
})