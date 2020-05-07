const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '充值',
      'color': true,
      'class': '3'
    },
    showModal: false
  },
  /**
   * 授权回调
   */
  onLoadFun: function (res) {
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        openId: app.globalData.openId,
        isLogin: true
      })
    }
    // 
    // if (!this.data.MyMenus.length) this.getMyMenus();
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

  inputTitle: function (e) {
    this.setData({
      money: e.detail.value
    })
  },

  modalcnt: function () {
    var that = this

    if (!that.data.isLogin) return app.Tips({
      title: '登入失败'
    });
    if (!that.data.money) return app.Tips({
      title: '请输入有效金额'
    });
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    wx.request({
      url: app.U({
        c: 'Recharge_api',
        a: 'Merchant_recharge'
      }),
      method: 'post',
      data: {
        uid: that.data.uid,
        openid: that.data.openId,
        money: that.data.money
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading()
        var data = res.data.data.data
        console.log(data)
        if (data.code == 200) {
          wx.requestPayment({
            timeStamp: data.zhifu_data.timeStamp,
            nonceStr: data.zhifu_data.nonceStr,
            package: data.zhifu_data.package,
            signType: 'MD5',
            paySign: data.zhifu_data.paySign,
            success: function (res) {
              // console.log(res);
              return app.Tips({
                title: '充值成功'
              }, {
                tab: 3,
                url: 1
              });
            },
            fail: function (res) { //支付失败 

            }
          });
        } else {

        }


      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  }

})