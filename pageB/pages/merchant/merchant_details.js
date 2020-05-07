//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
const util = require('../../../utils/util.js');
var QQMapWX = require('../qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
var demo = new QQMapWX({
  key: 'IATBZ-P6N3W-UIURM-RDN35-A7FV3-FVBEU' // 必填
});
Page({

  data: {
    showRule: {
      modalName: '',
      imgUrl: '',
    },
    actions3: [{
        name: '复制微信',
      },
      {
        name: '取消'
      }
    ],
    contents: '88888888',
    task_details: '', //返利活动信息 
    is_merchants: false,
    is_recommend_merchant: false,
    is_task: false, //是否有返利活动详情
    is_jiazai_val: '正在努力加载中…',
    get_user_task_sum: 0, //可接返利活动数
    takeaway_platform: 2,
    imgUrl: 'http://www.dingdingfan.cn/uploads/20200313/88712e80378819b50206fdd37e7d5b3f.jpg',
  },
  fuzhi() {
    wx.setClipboardData({
      data: this.data.merchants.uname,
      success: function (res) { //复制成功的操作
      }
    });
  },
  shengqing(e) {
    wx.redirectTo({
      url: '/pageB/pages/user_spread_user/shuoming?is_shenqing=1&uid=' + this.data.uid,
    })
  },
  onLoad: function (e) {
    if (e.sid && e.tid && e.takeaway_platform) {
      app.globalData.spid = e.spid;
      this.setData({
        sid: e.sid,
        tid: e.tid,
        takeaway_platform: e.takeaway_platform
      })
    } else if (e.scene) {
      var scene = decodeURIComponent(e.scene);
      var spid = scene.split("-")[0];
      app.globalData.spid = spid
      var sid = scene.split("-")[1];
      var tid = scene.split("-")[2];
      var takeaway_platform = scene.split("-")[3];
      this.setData({
        sid: sid,
        tid: tid,
        takeaway_platform: takeaway_platform
      })
    } else {
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
    var that =this
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
      mask: true
    });
    app.baseGet(app.U({
      c: 'Merchant_api',
      a: 'merchant_details',
      q: {
        sid: that.data.sid,
        tid: that.data.tid,
        lat: that.data.latitude,
        lon: that.data.longitude,
        takeaway_platform: that.data.takeaway_platform
      }
    }), function (res) {
      console.log(res)

      wx.hideLoading()
      if (res.data.wechat_group_qr_code.length) {
        that.setData({
          is_banners: true,
          ['showRule.imgUrl']: app.globalData.url + res.data.wechat_group_qr_code[0]
        })
      }
      if (res.data.task_details.code == 200) {
        that.setData({
          is_task: true,
          task_details: res.data.task_details.data,
          task: res.data.merchants.data.takeaway_platform
        });
        console.log(res.data.merchants);
        // WxParse.setImageDomain(app.globalData.url);
        //WxParse.wxParse('describe_content', 'html', res.data.task_details.data.describe_content, that, 0);
      }
      if (res.data.merchants.code == 200) {
        that.setData({
          is_merchants: true,
          merchants: res.data.merchants.data,
          'parameter.title': res.data.merchants.data.mname
        });
        if (res.data.recommend_merchant.code == 200) {
          that.setData({
            is_recommend_merchant: true,
            recommend_merchant: res.data.recommend_merchant.data
          });
        }
        // WxParse.setImageDomain(app.globalData.url);
        // WxParse.wxParse('content', 'html', res.data.merchants.data.content, that, 0);
      }
    });
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
  /**
   * 授权回调
   */ 
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
      this.user_jurisdiction(); 
    }
    // 
    // if (!this.data.MyMenus.length) this.getMyMenus();
  },

  user_jurisdiction: function () {
    var that = this;
    app.baseGet(app.U({
      c: 'User_order',
      a: 'user_jurisdiction',
      q: {
        uid: that.data.uid,
        tid: that.data.tid,
        takeaway_platform: that.data.takeaway_platform
      }
    }), function (res) {
      console.log(res);
      that.setData({
        get_user_head_res: res.data.get_user_head_res
      });

      if (res.data.is_place_order.code == 0) {
        that.setData({
          is_place_order: 0
        });
      } else {
        that.setData({
          is_place_order: 1,
          order_id: res.data.is_place_order.order_id,
          rate_of_progress: res.data.is_place_order.data
        });
      }

      if (res.data.get_user_task_sum.code == 200) {

        that.setData({
          get_user_task_sum: res.data.get_user_task_sum.data,
        });
      } else {
        that.setData({
          get_user_task_sum: 0,
        });
      }
      if (res.data.is_distribution.code == 200) {
        that.setData({
          is_distribution: 1,
        });
      } else {
        that.setData({
          is_distribution: 0,
        });
      }

      // if (res.data.is_not_popup_sum.code == 200) {
      //   wx.setStorageSync('is_not_popup_sum', true)
      // }
    });
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
    if (this.data.user_task_sum <= 0) {
      return app.Tips({
        title: '您今日的领取名额已达上线'
      });
    }
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
      content: '今天您还有' + that.data.get_user_task_sum + '次抢名额的机会~',
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
            takeaway_platform: that.data.takeaway_platform
          }, function (res) {

            console.log(res)
            wx.hideLoading()
            if (res.data.status == 200) {
              app.Tips({
                title: res.msg
              });
              setTimeout(function () {
                that.user_jurisdiction()
                that.get_merchant_details()
              }, 1000)
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
   * 点击下单弹窗二维码
   */
  previewImg(e) {
    var code_image = this.data.merchants.code_image
    var imgArr = [];
    //imgArr[0] = this.data.merchants.code_image
    var img = app.globalData.url + '/' + code_image
    imgArr.push(img)
    console.log(imgArr)
    wx.previewImage({
      current: img, //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式 
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
  //跳转分销海报页面
  yaoqing() {
    var info = {
      url: 'pageB/pages/merchant/merchant_details',
      spid: this.data.uid,
      sid: this.data.sid,
      tid: this.data.tid,
      takeaway_platform: this.data.takeaway_platform,
      type: 'merchant_details'

    }

    wx.navigateTo({
      url: '/pageB/pages/user_spread_code/index?info=' + JSON.stringify(info),
    })
  },

  /**
   * 用户点击右上角分享
   */

  onShareAppMessage: function (options) {
    var that = this; // 设置转发内容

    var shareObj = {
      title: "外卖返现，就上叮叮饭粒！",
      imageUrl: "../../../imgs/share.png",
      path: 'pageB/pages/merchant/merchant_details?spid=' + this.data.uid + '&sid=' + this.data.sid + '&tid=' + this.data.tid + '&takeaway_platform=' + this.data.takeaway_platform,
      //　path: '路径', // 默认是当前页面，必须是以‘/’开头的完整路径
      //　　imgUrl: '', //转发时显示的图片路径，支持网络和本地，不传则使用当前页默认截图。
      success: function (res) { // 转发成功之后的回调　　　　　

        if (res.errMsg == 'shareAppMessage:ok') {}
      },
      fail: function () { // 转发失败之后的回调

        if (res.errMsg == 'shareAppMessage:fail cancel') { // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') { // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function () { // 转发结束之后的回调（转发成不成功都会执行）
      }
    };

    // 返回shareObj

    return shareObj;

    // 来自页面内的按钮的转发

    if (options.from == 'button') {
      var dataid = options.target.dataset; //上方data-id=shareBtn设置的值
      // 此处可以修改 shareObj 中的内容
      shareObj.path = 'pageB/pages/merchant/merchant_details?spid=' + this.data.uid + '&sid=' + this.data.sid + '&tid=' + this.data.tid + '&takeaway_platform=' + this.data.takeaway_platform;
    } // 返回shareObj

    return shareObj;
  },
  gotimg: function (options) {
    wx.navigateTo({
      url: '../../pages/user_spread_code/index',
    })
  },
  gotShare: function () {
    console.log(1)
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
  gohelp: function () {
    wx.navigateTo({
      url: '../explain/help',
    })
  },
  showRule(e) {
    if (this.data.showRule.modalName == 'Images') {
      this.setData({
        ['showRule.modalName']: ''
      })
    } else {
      this.setData({
        ['showRule.modalName']: 'Images'
      })
    }
    console.log(this.data.showRule)
  },

})