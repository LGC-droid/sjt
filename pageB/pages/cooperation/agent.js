// pageB/pages/cooperation/agent.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    name: '',
    phone: '',
    wechat_number: ''
  },
  /**
   * 授权回调
   */
  onLoadFun: function (res) {
    console.log(app.globalData)

    this.setData({
      uid: app.globalData.uid
    })

  },
  name: function (e) {
    this.setData({
      name: e.detail.value
    });
  },
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  wechat_number: function (e) {
    this.setData({
      wechat_number: e.detail.value
    });
  },
  address: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  tijiao: function () {
    var that = this;
    var up_data = {};
    if (!that.data.address) {
      return app.Tips({
        title: '代理城市不能为空'
      });
    }
    if (!that.data.name) {
      return app.Tips({
        title: '代理人姓名不能为空'
      });
    }
    if (!that.data.phone) {
      return app.Tips({
        title: '手机号不能为空'
      });
    }
    if (!that.data.wechat_number) {
      return app.Tips({
        title: '微信号不能为空'
      });
    }
    up_data = {
      uid: that.data.uid,
      address: that.data.address,
      name: that.data.name,
      phone: that.data.phone,
      wechat_number: that.data.wechat_number,
      type: 2
    }
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.basePost(app.U({
      c: 'Cooperation_form',
      a: 'insert_msg'
    }), up_data, function (res) {
      console.log(res)
      wx.hideLoading()
      return app.Tips({
        title: res.msg,
        icon: 'success'
      });
    });
  }
})