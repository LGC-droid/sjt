// pages/user_voucher/shuoming.js
const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '合伙人规则',
      'color': false
    },
    is_shenqing: 0
  },
  onLoadFun: function (res) {
    console.log(app.globalData)
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid
      })


    }

    // 
    // if (!this.data.MyMenus.length) this.getMyMenus();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.is_shenqing) {
      that.setData({
        is_shenqing: 1,
      })
    }
    app.baseGet(app.U({
      c: 'Public_api',
      a: 'shuoming',
      q: {
        type: 2
      }
    }), function (res) {


      if (res.code == 200) {

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

  },
  //推广员
  distribution: function () {
    var that = this
    wx.showModal({
      title: '申请提示',
      content: '请确认成为推广人员',
      cancelText: "取消", //默认是“取消”

      confirmText: "确认", //默认是“确定”

      success: function (res) {
        console.log(res)
        if (res.confirm) {
          wx.showLoading && wx.showLoading({
            title: '加载中',
            mask: true
          });
          app.baseGet(app.U({
            c: 'Distribution_api',
            a: 'submission_of_examine',
            q: {
              uid: that.data.uid

            }
          }), function (res) {
            console.log(res)
            wx.hideLoading()
            if (res.data.status == 200) {
              return app.Tips({
                title: res.msg
              }, {
                tab: 5,
                url: '/pageB/pages/user_spread_user/index'
              });
            } else {
              return app.Tips({
                title: res.msg
              });
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })



  },
})