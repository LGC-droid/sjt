const app = getApp()
import {
  $wuxCountDown
} from '../../../pages/dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c4: "00:00:00",
    buttons: [{
        type: 'balanced',
        block: true,
        text: '确定',
      },

    ],
  },
  /**
   * 授权回调
   */
  onLoadFun: function (res) {
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        openid: app.globalData.openId,
        isLogin: true,
      })
      if (!this.c4) {
        this.cancel_order()
      }
      this.ger_request()
    }
    //  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.oid) return app.Tips({
      title: '订单不存在'
    }, {
      tab: 3,
      url: 1
    })
    this.setData({
      oid: options.oid,
    }) 
  },
  ger_request() {
    var that = this
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
      c: 'User_order',
      a: 'get_order',
      q: {
        oid: that.data.oid
      }
    }), function (res) {
      console.log(res)
      wx.hideLoading()
      if (res.data.info.code == 200) {
        if (res.data.info.data.bwc_is_pay == 1) {
          that.c4.stop()
          return app.Tips({
            title: '订单已支付'
          }, {
            tab: 3,
            url: '1'
          })
        } 
        if (res.data.info.data.rate_of_progress !=0) {
          that.c4.stop()
          return app.Tips({
            title: '订单支付凭证已过期'
          }, {
            tab: 3,
            url: '1'
          })
        } 
        var residual_payment = res.data.info.data.residual_payment
        // console.log(residual_payment) 
        that.setData({
          residual_payment: residual_payment
        });
        that.c4.update(+(new Date) + 60000 * residual_payment)
      } else {
        that.c4.stop() 
        return app.Tips({
          title: res.msg
        }, {
          tab: 3,
          url: '1'
        })
      }

    });
  },
  /**
   * 取消任务
   */
  cancel_order(e) {
    var that = this
    this.c4 = new $wuxCountDown({
      date: +(new Date) + 60000 * 1800,
      render(date) {
        const hours = this.leadingZeros(date.hours, 2) + ':'
        const min = this.leadingZeros(date.min, 2) + ':'
        const sec = this.leadingZeros(date.sec, 2)
        this.setData({
          c4: hours + min + sec,
        })
      },
      onEnd() {
        console.log('倒计时回调，取消当前订单')
        app.basePost(app.U({
          c: 'User_order',
          a: 'place_cancel_order'
        }), {
          uid: that.data.uid,
          id: that.data.oid,
          cancel_automatically: 1 //是否自动取消
        }, function (res) {
          if (res.data.status == 200) {
            var pages = getCurrentPages(); // 获取页面栈 
            var prevPage = pages[pages.length - 2]; // 上一个页面 
            if (!prevPage) return
            if (prevPage.route != 'pageB/pages/overlord/overlord_details') return
            prevPage.setData({
              no_cashback_increases: true
            })
            app.Tips({
              title: res.msg
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500);
          } else {
            console.log(res)
          }
        });
      },
    })
  },
  /**
   *发起微信支付
   */
  wx_play: function () {
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this
    app.basePost(app.U({
      c: 'User_bwc_wxpay',
      a: 'pay_wechat_api'
    }), {
      uid: that.data.uid,
      openid: that.data.openid,
      oid: that.data.oid
    }, function (res) {
      if (res.data.status == 200) {
        var data = res.data.result.zhifu_data
        console.log(data)
        wx.hideLoading()
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: 'MD5',
          paySign: data.paySign,
          success: function (res) {
            console.log(res);
            var pages = getCurrentPages(); // 获取页面栈 
            var prevPage = pages[pages.length - 2]; // 上一个页面 
            prevPage.setData({
              no_cashback_increases: true
            })
            // app.Tips({title:'支付成功'},{tab:4,url:'/pageB/pages/member/member'})
            that.c4.stop() //关闭定时
            app.Tips({
              title: '支付成功,正在为您跳转~'
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 3000);
          },
          fail: function (res) { //支付失败 
            console.log(res)
          }
        });

      } else {
        return app.Tips({
          title: res.msg
        })
      }
    })
  },
  showRule(e) {

    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideRule(e) {
    this.setData({
      modalName: null
    })
  },
  onClick(e) {
    console.log(e)
    const {
      index
    } = e.detail

    index === 0 && wx.showModal({
      title: 'Thank you for your support!',
      showCancel: !1,
    })

    index === 1 && wx.navigateBack()
  },
})