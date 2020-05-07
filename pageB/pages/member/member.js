const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 授权回调
   */
  onLoadFun: function (res) {
    //  console.log(app.globalData)
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        isLogin: true,
      })
      this.getMemberInfo()
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getMemberInfo: function () {
    var that = this;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
      c: 'Member_api',
      a: 'index',
      q: {
        uid: that.data.uid,
      }
    }), function (res) {
      // console.log(res)
      wx.hideLoading()
      if (res.data.status == 200) {
        that.setData({
          minimum_amount: res.data.result.minimum_amount,
          CURRENT: res.data.result.red_envelope_display.CURRENT,
          NEXT: res.data.result.red_envelope_display.NEXT,
        });
        if (res.data.result.banner.code == 200) {
          that.setData({
            is_banner: true,
            banner_data: res.data.result.banner.data[0],
          });
        }
      } else if (res.data.status == 300) {
        wx.redirectTo({
          url: '/pageB/pages/member/membership'
        })
      } else {
        return app.Tips({
          title: '数据错误'
        }, {
          tab: 3,
          url: 1
        });
      }

    });
  },

  renews: function (options) {
    wx.navigateTo({
      url: '../member/payment',
    })
  },
  wallet: function () {
    wx.navigateTo({
      url: '../wallet/wallet',
    })
  },
  tqone: function () {
    wx.showModal({
      title: '会员增值红包',
      content: '①购买叮叮饭粒会员后，会员有效期内每隔31天您可以免费获得总计24元的叮叮饭粒增值返现红包；②增值返现红包（12个2元）为系统发放，购买会员后本月红包即刻生效③所获得的会员红包为叮叮饭粒无门槛增值红包，可用在叮叮饭粒会员返现支持门店（霸王餐订单不可使用）。④所获得会员红包需在发放即日起31天内使用，未使用红包将自动过期失效，请关注红包有效期。',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
  tqtwo: function () {
    wx.showModal({
      title: '积分获取特权',
      content: '待开放',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
  tqthree: function () {
    wx.showModal({
      title: '叮叮合伙人升级特权',
      content: '待开放',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  }
})