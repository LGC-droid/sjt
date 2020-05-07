// pages/apply-return/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '订单列表',
      'color': true,
      'class': '0'
    },
    reason_wap_img: [],
    orderInfo: {},
    RefundArray: [],
    index: 0,
    orderId: 0,
    type: 'wancheng'
  },
  /**
   * 授权回调
   * 
   */
  onLoadFun: function () {
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        openId: app.globalData.openId
      })
      this.getOrderLst();
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.state) this.setData({
      type: options.state
    })
  },
  /**
   *获取用户下的订单列表
   * 
   */
  getOrderLst: function () {
    var that = this;
    app.baseGet(app.U({
      c: 'User_order',
      a: 'get_order_lst',
      q: {
        uid: that.data.uid,
        type: that.data.type
      }
    }), function (res) {
      console.log(res)
      if (res.data.info.code == 200) {
        that.setData({
          orderInfo: res.data.info.data,
        });
      } else {
        return app.Tips({
          title: '暂没待有订单列表'
        }, {
          tab: 3,
          url: 1
        });
      }

    });
  },
  show(e) {
    console.log(e)
    var dataset = e.currentTarget.dataset
    var rate_of_progress = e.currentTarget.dataset.rate_of_progress


    if (rate_of_progress == 0) {
      wx.navigateTo({
        url: "../merchant/merchant_details?sid=" + dataset.sid + '&tid=' + dataset.tid
      });
    } else if (rate_of_progress == 1 || rate_of_progress == -1) {
      wx.navigateTo({
        url: "../user_voucher/index?oid=" + dataset.id
      });
    }

  }

})