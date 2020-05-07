const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '我的钱包',
      'color': true,
      'class': '0'
    },
    moneyValue: '',
    capital: 0
  },
  xyb: function () {
    wx.navigateTo({
      url: '../tixiancg/tixiancg'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //options.type ='merchant'
    this.setData({
      type: options.type
    })
  },
  /**
   * 授权回调
   */
  onLoadFun: function (res) {
    console.log()
    var fangfa = 'get_personal_center'
    if (this.data.type == 'merchant') {
      fangfa = 'get_merchant_personal_center'
    }
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        isLogin: true
      })
      var data = {
        openId: app.globalData.openId,
        uid: app.globalData.uid,
        fangfa: fangfa
      }
      this.getUserInfo(data);
    }
    // 
    // if (!this.data.MyMenus.length) this.getMyMenus();
  },
  getUserInfo: function (data) {

    var that = this;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
      c: 'User_api',
      a: data.fangfa,
      q: {
        uid: data.uid,
        openId: data.openId,
        is_distribution: 0
      }
    }), function (res) {
      console.log(res)
      wx.hideLoading()
      if (that.data.type == 'merchant') {
        if (res.data.merchants.code == 200) {
          that.setData({
            capital: res.data.merchants.data.balance
          });
        }
      } else {
        if (res.data.personal_center.user_info) {
          that.setData({
            capital: res.data.personal_center.user_info.money
          });
        }
      }
    });
  },
  tx: function () {
    wx.navigateTo({
      url: 'tixian?capital=' + this.data.capital
    });
  },
  cz: function () {
    wx.navigateTo({
      url: '../tixian2/tixian2'
    });
  },
  order: function (e) {
    console.log()
    var dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: 'order_record?uid=' + dataset.uid + '&type=' + dataset.type
    });
  },
  recharge: function () {
    wx.navigateTo({
      url: 'recharge'
    });
  },

  inputTitle: function (e) {
    this.setData({
      moneyValue: e.detail.value
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

})