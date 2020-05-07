const app = getApp()
import {
  $wuxDialog
} from '../../../pages/dist/index'
Page({
  data: {
    oid: '',
    current: '0',
    tab1: true,
    current_scroll: 'tab1',
    is_tatus: true,
    list: [{
        'number': '3',
        'coupon': '优惠券',
        'name': '3元增值券',
        'time': '2021-05-04',
        'text': 'xxxxxxxxxxxxxxxxx',
        'state': true
      },
      {
        'number': '3',
        'coupon': '优惠券',
        'name': '3元增值券',
        'time': '2021-05-04',
        'text': 'xxxxxxxxxxxxxxxxx',
        'state': false
      },
      {
        'number': '3',
        'coupon': '优惠券',
        'name': '3元增值券',
        'time': '2021-05-04',
        'text': 'xxxxxxxxxxxxxxxxx',
        'state': false
      }
    ],
    checked: false
  },
  onLoad(e) {

    if (e.oid) {
      this.setData({
        oid: e.oid,
        order_index: e.order_index
      })
    }
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
  getMemberInfo: function () {
    var that = this;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
      c: 'User_cashback_increases_api',
      a: 'index',
      q: {
        uid: that.data.uid,
        oid: that.data.oid,
      }
    }), function (res) {
      console.log(res)
      wx.hideLoading()
      if (res.data.status == 200) {
        that.setData({
          coupon: res.data.result.coupon,
          member_status: res.data.result.member_status,
        });
      } else {
        return app.Tips({
          title: res.msg
        }, {
          tab: 3,
          url: 1
        });
      }

    });
  },
  // handleChange({detail}) {
  //   var index = detail.key
  //   console.log(index)
  //   this.setData({
  //     current: detail.key,

  //   });
  //   if (index == 0) {
  //     this.setData({
  //       tab1: true,
  //       tab2: false,

  //     })
  //   } else if (index == 1) {
  //     this.setData({
  //       tab1: false,
  //       tab2: true,

  //     })
  //   } 

  // },
  goIndex(e) {
    console.log(e)
    var type = e.currentTarget.dataset.type,
      id = e.currentTarget.dataset.id,
      state = e.currentTarget.dataset.state,
      cashback_increases_value = e.currentTarget.dataset.cashback_increases_value

    if (state == 1) {
      var order_index = this.data.order_index //对应订单的下标
      var pages = getCurrentPages(); // 获取页面栈

      if (pages.length > 1) {
        var currPage = pages[pages.length - 1]; // 当前页面
        var prevPage = pages[pages.length - 2]; // 上一个页面 
        prevPage.setData({
          ['orderInfo[' + order_index + '].uci_id']: id,
          ['orderInfo[' + order_index + '].cashback_increases_value']: cashback_increases_value,
          ['orderInfo[' + order_index + '].uci_type']: type,
          ['orderInfo[' + order_index + '].total_commission']: parseFloat(prevPage.data.orderInfo[order_index].total_commission_yuanshi) + parseFloat(cashback_increases_value),

          no_cashback_increases: true
        })
        wx.navigateBack({
          delta: 1
        })
      }


    }


    // console.log('每个index',index)

  },
  immediately: function (e) {
    wx.switchTab({
      url: '../../../pages/index/index',
    })
  },
  prompt() {
    var that = this
    const alert = (content) => {
      $wuxDialog('#wux-dialog--alert').alert({
        resetOnClose: true,
        title: '提示',
        content: content,
      })
    }

    $wuxDialog().prompt({
      resetOnClose: true,
      title: '兑换优惠券',
      content: '请输入优惠券兑换码',
      fieldtype: 'text',
      maxlength: 32,
      defaultText: '',
      onConfirm(e, coupon_code) {
        console.log(coupon_code.length)
        if (coupon_code.length != 32) {
          return app.Tips({
            title: '请输入正确的兑换码'
          });
        }
        app.basePost(app.U({
          c: 'User_cashback_increases_api',
          a: 'coupon_exchange'
        }), {
          uid: that.data.uid,
          coupon_code: coupon_code,
        }, function (res) {
          if (res.data.status == 200) {
            app.Tips({
              title: '兑换成功',
              icon: 'success'
            });
            setTimeout(function () {
              that.getMemberInfo();
            }, 1000)
          } else {
            return app.Tips({
              title: res.msg
            });
          }

        });
      },
    })
  },
  click: function () {
    wx.navigateTo({
      url: '../member/payment',
    })
  },
  shuoming:function(){
    wx.navigateTo({
      url: '../wallet/shuoming',
    })
  }
})