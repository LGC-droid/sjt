const app = getApp()
var QQMapWX = require('../qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
var demo = new QQMapWX({
  key: 'IATBZ-P6N3W-UIURM-RDN35-A7FV3-FVBEU' // 必填
});
const util = require('../../../utils/util.js');
import {
  $wuxCountDown
} from '../../../pages/dist/index'
Page({
  data: {
    is_place_order: -1,
    c3: "00:00:00",
    c5: "00:00:00",
    actions3: [{
        name: '复制微信',
      },
      {
        name: '取消'
      },
    ],
    userInfo: {}

  },
  onLoad(e) {
    console.log(e)
    var that = this
    if (!this.c3) {
      this.c3 = new $wuxCountDown({
        date: +(new Date) + 60000 * 0,
        render(date) {
          const hours = this.leadingZeros(date.hours, 2) + ':'
          const min = this.leadingZeros(date.min, 2) + ':'
          const sec = this.leadingZeros(date.sec, 2)
          this.setData({
            c3: hours + min + sec,
          })
        },
        onEnd() {
          //that.c3.stop()

          if (that.data.uid) {
            that.user_jurisdiction()
          }

        },
      })
    }
    if (e.sid && e.tid && e.takeaway_platform){
      app.globalData.spid = e.spid;
      this.setData({
        sid: e.sid,
        tid: e.tid,
        takeaway_platform: e.takeaway_platform
      })
    } else if (e.scene){
      var scene =decodeURIComponent(e.scene);
      var spid=scene.split("-")[0];
      app.globalData.spid =spid  
      var sid=scene.split("-")[1];
      var tid=scene.split("-")[2];
      var takeaway_platform=scene.split("-")[3];
      this.setData({
        sid: sid,
        tid: tid,
        takeaway_platform:takeaway_platform
      })
    }else{
     return app.Tips({
        title: '参数错误'
      })
    }
    if (e.latitude && e.longitude) { 
      this.setData({
        latitude: e.latitude,
        longitude: e.longitude
      })
    }
     
  },
  //离开当前页面监听
  onUnload() {
    if (this.c3) {
      this.c3.stop() //关闭定时
    }

    if (this.c5) {
      this.c5.stop() //关闭定时
    }

  },
  getLocation() {
    var that = this
    wx.getLocation({
      altitude: true,
      isHighAccuracy: true,
      type: 'gcj02',
      success(res) { 
        // 调用接口转换成具体位置
        demo.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            console.log(res.result);
            that.setData({
              address: res.result.formatted_addresses.recommend,
              latitude: res.result.location.lat,
              longitude: res.result.location.lng,
              ad_info: res.result
            })
            if (app.globalData.uid) {
              util.set_user_ad_info(res.result, app.globalData.uid)
            }
            that.get_merchant_details()
          },
          fail: function (res) {
            that.setData({
              openSetting: 1
            })
          },

        })

      }
    })

  },
  get_merchant_details: function () {
    var that = this;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true,
    });
    app.baseGet(app.U({
      c: 'Merchant_api',
      a: 'merchant_details',
      q: {
        sid: that.data.sid,
        tid: that.data.tid,
        lat: that.data.latitude,
        lon: that.data.longitude,
        takeaway_platform: that.data.takeaway_platform,
        is_bwc: 1
      }
    }), function (res) {
      console.log(res)
      if (res.data.task_details.code == 200) {
        if (res.data.task_details.data.is_start_robbing == 0) {
          that.c5 = new $wuxCountDown({
            date: +(new Date) + 60000 * res.data.task_details.data.start_robbing_time,
            render(date) {
              const hours = this.leadingZeros(date.hours, 2) + ':'
              const min = this.leadingZeros(date.min, 2) + ':'
              const sec = this.leadingZeros(date.sec, 2)
              that.setData({
                c5: hours + min + sec,
              })
            },
            onEnd() {
              that.c5.stop()
            },
          })
        }
        that.setData({
          is_task: true,
          task_details: res.data.task_details.data,
          task: res.data.merchants.data.takeaway_platform
        });
      }else{
        return app.Tips({
          title: '商家任务已结束'
        });
      }
      if (res.data.merchants.code == 200) {
        that.setData({
          is_merchants: true,
          merchants: res.data.merchants.data,
          'parameter.title': res.data.merchants.data.mname
        });
      }else{
        return app.Tips({
          title: '商家任务已结束'
        });
      }
    });
  },
  user_jurisdiction: function () {
    var that = this;
    app.baseGet(app.U({
      c: 'User_order',
      a: 'user_jurisdiction',
      q: {
        uid: that.data.uid,
        tid: that.data.tid,
        takeaway_platform: that.data.takeaway_platform,
        is_bwc: 1
      }
    }), function (res) {
      console.log(res);
      that.setData({
        get_user_head_res: res.data.get_user_head_res
      });
      if (res.data.get_user_task_sum.code == 200) {
        that.setData({
          get_user_task_sum: res.data.get_user_task_sum.data,
        });
      } else {
        that.setData({
          get_user_task_sum: 0,
        });
      }
      if (res.data.is_place_order.code == 1) {

        that.setData({
          is_place_order: 1,
          order_id: res.data.is_place_order.order_id,
          rate_of_progress: res.data.is_place_order.data,
          order_validity: res.data.is_place_order.order_validity,
          remaining_seconds: res.data.is_place_order.remaining_seconds,
          bwc_is_pay: res.data.is_place_order.bwc_is_pay,
          residual_payment: res.data.is_place_order.residual_payment,
          is_daojishi: true
        });
        // console.log(res.data.is_place_order.remaining_seconds)
        // console.log(res.data.is_place_order.order_validity)
        if (res.data.is_place_order.bwc_is_pay == 0) {
          if (res.data.is_place_order.residual_payment > 0) {
            that.c3.start()
            that.c3.update(+(new Date) + 60000 * res.data.is_place_order.residual_payment)
          }
        } else {
          if (res.data.is_place_order.order_validity > 0) {
            that.c3.start()
            that.c3.update(+(new Date) + 60000 * res.data.is_place_order.order_validity)
          }
        }
      } else {
        that.setData({
          is_place_order: 0
        });

      }
      wx.hideLoading()
    });
  },
  //修改顶部导航颜色
  set_navibar_clor() {
    if (this.data.takeaway_platform == 1) { //美团
      // this.setData({
      //   'parameter.class_details': 'yellow'
      // })
      wx.setNavigationBarColor({
        frontColor: '#ffffff', // 必写项
        backgroundColor: '#FFD161', // 必写项

      })
    } else {
      // this.setData({
      //   'parameter.class_details': 'blue'
      // })
      wx.setNavigationBarColor({
        frontColor: '#ffffff', // 必写项
        backgroundColor: '#0396fd', // 必写项

      })
    }
  },
  onShow() {
  var that=this
    this.user_jurisdiction()
    // if (this.c3) {
    //   this.c3.start()
    // }
    this.set_navibar_clor()
    if (that.data.openSetting) { 
      wx.getSetting({
        success: function (e) {
          if (e.authSetting["scope.userLocation"]) {
            that.setData({
              openSetting: 0
            })
            that.getLocation()
          }
        },
      })
    }
  },

  onLoadFun: function (res) {
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid
      })
      if (!this.data.latitude || !this.data.longitude) {
        this.getLocation();
      }else{
        this.get_merchant_details()
      }
    }
  },

//跳转分销海报页面
yaoqing(){
  var info ={
    url:'pageB/pages/overlord/overlord_details',
    spid:this.data.uid,
    sid:this.data.sid,
    tid:this.data.tid,
    takeaway_platform:this.data.takeaway_platform,
    type:'overlord_details'

  }
  wx.navigateTo({
    url: '/pageB/pages/user_spread_code/index?info=' +JSON.stringify(info),
  })
},
  qiehuan() {
    if (this.data.takeaway_platform == 1) {
      this.setData({
        takeaway_platform: 2
      })
    } else {
      this.setData({
        takeaway_platform: 1
      })
    }
    this.set_navibar_clor();
    this.user_jurisdiction();
    this.get_merchant_details()
  },
  //跳转支付页面
  liji_zhifu() {
    this.c3.stop() //关闭定时
    wx.navigateTo({
      url: 'bwc_pay?oid=' + this.data.order_id,
    })
  },
  
  //用户上传凭证
  up_pingzheng() {
    var order_id = this.data.order_id;
    if (!order_id) return app.Tips({
      title: '您还没有领取返利活动'
    });
    var order = 'elm'
    if (this.data.takeaway_platform == 1) {
      order = 'mt'
    }
    console.log(this.data.takeaway_platform)
    console.log(order)
    app.globalData.order_type = order;
    wx.switchTab({
      url: '/pages/user_voucher/index'
    })
  },
  //用户领取返利活动
  linrenwu: function () {
    // if (this.data.user_task_sum <= 0) {
    //   return app.Tips({
    //     title: '您今日的领取名额已达上线'
    //   });
    // }
    if (this.data.is_place_order != 0) return
    var that = this;
    //订单完成通知 -订单即将过期提醒-平台审核失败通知
    wx.requestSubscribeMessage({
      tmplIds: ['jkWYg6MS-GvT_wWNub9Iq4ynpWc9Dwe-Nr9FXN5_EZA', 'tAKnN4Mj4nE2skgHokC5mr9PoTw69YSj10TdLAxUNzE', 'Rk9tET-ZSkz9ZkJUohU7eb1LK_cwdCm4P1uVomtKDwc'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
      success(res) {
        console.log('已授权接收订阅消息')
      },
    })
    wx.showModal({
      title: '领取提示',
      content: '确认是否领取霸王餐任务，支付1元抢占返现名额',
      cancelText: "不了谢谢", //默认是“取消” 
      confirmText: "抢名额", //默认是“确定”

      success: function (res) {
        if (res.confirm) {
          wx.showLoading && wx.showLoading({
            title: '加载中',
            mask: true
          });
          app.basePost(app.U({
            c: 'User_order',
            a: 'place_an_order',
          }), {
            uid: that.data.uid,
            tid: that.data.tid,
            sid: that.data.sid,
            takeaway_platform: that.data.takeaway_platform,
            is_bwc: 1
          }, function (res) {

            console.log(res)
            wx.hideLoading()
            if (res.data.status == 200) {
              // app.Tips({
              //   title: res.msg
              // });
              that.setData({
                order_id: res.data.result.order_id,
              })
              that.liji_zhifu()
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
  /**
   * 跳转美团商家小程序
   */
  jumpDetails_mt: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.navigateToMiniProgram({
      appId: 'wx2c348cf579062e56',
      path: 'pages/restaurant/restaurant?poi_id=' + that.data.merchants.mt_id,
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })

  },
  /**
   * 跳转饿了么商家小程序
   */
  jumpDetails_elm: function (e) {
    // console.log(e.currentTarget.dataset.id)
    var that = this
    var id = e.currentTarget.dataset.id
    wx.navigateToMiniProgram({
      appId: 'wxece3a9a4c82f58c9',
      path: 'pages/shop/shop/index?id=' + that.data.merchants.elm_id, // 写小程序跳转页面的路径，  可以正常传参
      envVersion: 'release', // 写对应的参数   开发版本：develop    体验版本：trial     正式版：release
      success(res) {
        // 打开成功
      }
    })

  },
  tianjia() {
    this.setData({
      visible3: true
    });
  },
  handleClick3({
    detail
  }) {
    const index = detail.index;
    console.log(index)
    if (index === 0) {
      wx.setClipboardData({
        data: 'fzwmfls',
        success: function (res) { //复制成功的操作
          wx.showToast({
            title: '客服已复制',
          })
        }
      })
    } else if (index === 1) {
      this.setData({
        visible3: false
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(this.data.userInfo)
    return {
      title: '1元吃霸王餐',
      // imageUrl: this.data.spreadList[0],
      imageUrl: "../../img/overlords.png",
      path: '/pageB/pages/overlord/overlord_details?spid=' + this.data.uid +'&takeaway_platform='+this.data.takeaway_platform+'&sid='+this.data.sid+'&tid='+this.data.tid,
    };
  },

})