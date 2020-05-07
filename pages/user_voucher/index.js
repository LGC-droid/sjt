// pages/apply-return/index.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_num: '',
    no_refresh: false,
    order: 'elm',
    orderInfo: {},
    showRule: {
      modalName: '',
      imgUrl: '',
    },
  },
  onLoadFun: function () {
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        openId: app.globalData.openId,
      })
      this.getOrderLst();
    }
  },
  onShow() {
    /*
     *图片上传时，禁止刷新开关打开
     */
    if (this.data.no_refresh) {
      this.setData({
        no_refresh: false
      })
      return;
    }
    /*
     *选择优惠券回传后开关打开
     */
    if (this.data.no_cashback_increases) {
      this.setData({
        no_cashback_increases: false
      })
      return;
    }
    if (this.data.uid) {
      this.getOrderLst();
    }
  },
  onLoad: function (options) {
    //this.setData({ oid: options.oid });
    // if (!wx.getStorageSync('is_not_popup_sum')) {
    //   if (!app.globalData.is_gonglue) {
    //     wx.navigateTo({
    //       url: 'shuoming',
    //     })
    //   }
    // }  

  },
  tapBanner: function (e) {
    var that = this
    var link = e.currentTarget.dataset.link;
    if (e.currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: link
      });
    } else if (e.currentTarget.dataset.type == 2) {
      wx.navigateTo({
        url: 'weixinlink?url=' + link
      });
    } else if (e.currentTarget.dataset.type == 3) {

      that.showRule()
    }

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
  },
  radioChange(e) {
    this.setData({
      rate_of_progress: e.detail.value
    })
  },

  getOrderLst: function () {
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    app.baseGet(app.U({
      c: 'User_order',
      a: 'get_order_lst',
      q: {
        uid: that.data.uid,
        type: 'jinxing',

      }
    }), function (res) {
      wx.hideLoading()
      console.log(res)
      if (res.data.banner.code == 200) {
        that.setData({
          is_banners: true,
          banners: res.data.banner.data[0]
        });
      }
      if (res.data.wechat_group_qr_code.length) {
        that.setData({
          ['showRule.imgUrl']: app.globalData.url + res.data.wechat_group_qr_code[0]
        })
      }
      if (res.data.info.code == 200) {
        console.log(res.data.info.mobile)
        that.setData({
          orderInfo: res.data.info.data,
          mobile: res.data.info.mobile
        });
      } else {
        that.setData({
          orderInfo: [],

        });
        return app.Tips({
          title: '暂没待有订单列表'
        });
      }

    });
  },
  //图片上传
  chooseImage: function (e) {
    this.setData({
      no_refresh: true
    });
    let that = this;
    let cer_namexs = e.currentTarget.dataset.cer_namexs; //证件名 
    let cer_name = e.currentTarget.dataset.cer_name; //证件名 
    let arrayItem = that.data.orderInfo; //获取循环数组对象
    var rate_of_progress = e.currentTarget.dataset.rate_of_progress
    arrayItem[e.target.dataset.index].haoping_imagesxs
    var previewImgArr = [];
    if (rate_of_progress == 1) {
      if (cer_name == 'haoping_images') {
        var url = arrayItem[e.target.dataset.index].haoping_imagesxs
      } else {
        var url = arrayItem[e.target.dataset.index].det_imagesxs
      }
      previewImgArr[0] = arrayItem[e.target.dataset.index].haoping_imagesxs
      previewImgArr[1] = arrayItem[e.target.dataset.index].det_imagesxs
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: previewImgArr // 需要预览的图片http链接列表
      })
      return
    }
    util.uploadImageOne(app.U({
      c: 'public_api',
      a: 'upload'
    }), function (res) {

      let index = 0;
      if (cer_name == 'haoping_images') {
        arrayItem[e.target.dataset.index].haoping_imagesxs = app.globalData.url + '/' + res.data.url
        arrayItem[e.target.dataset.index].haoping_images = res.data.url
      } else {
        arrayItem[e.target.dataset.index].det_imagesxs = app.globalData.url + '/' + res.data.url
        arrayItem[e.target.dataset.index].det_images = res.data.url
      }
      console.log('ces')
      that.setData({
        orderInfo: arrayItem
      });
    });

  },

  showList(e) {
    let index = 0;
    let arrayItem = this.data.orderInfo; //获取循环数组对象
    for (let item of arrayItem) {
      //如果当前点击的对象id和循环对象里的id一致

      if (item.id == e.target.dataset.id) {
        //判断当前对象中的isShow是否为true（true为显示，其他为隐藏） 
        if (arrayItem[index].isShow == "" || arrayItem[index].isShow == undefined) {
          arrayItem[index].isShow = "true"
        } else {
          arrayItem[index].isShow = ""
        }
      } else { // 选中一个关闭其他
        arrayItem[index].isShow = ""
      }

      index++;
    }
    //将数据动态绑定 
    this.setData({
      orderInfo: arrayItem,
      order_num: '' //清空订单号
    })
  },
  //订单号
  order_num(e) {
    var index = e.currentTarget.dataset.index
    let arrayItem = this.data.orderInfo; //获取循环数组对象 
    arrayItem[index].order_num = e.detail.value
    this.setData({
      order_num: e.detail.value,
      orderInfo: arrayItem
    })
  },
  //订单备注
  reason_wap_explain(e) {
    var index = e.currentTarget.dataset.index
    let arrayItem = this.data.orderInfo; //获取循环数组对象 
    arrayItem[index].reason_wap_explain = e.detail.value
    this.setData({
      reason_wap_explain: e.detail.value,
      orderInfo: arrayItem
    })
  },
  /**
   * 取消任务
   */
  cancel_order(e) {
    var that = this,
      oid = e.target.dataset.oid,
      tid = e.target.dataset.tid
    // console.log(tid)
    if (!oid) return app.Tips({
      title: '获取订单ID失败'
    })
    wx.showModal({
      title: '确认要取消任务吗',
      content: '任务视为放弃，并恢复您的任务数',
      success(res) {
        if (res.confirm) {
          app.basePost(app.U({
            c: 'User_order',
            a: 'place_cancel_order'
          }), {
            uid: that.data.uid,
            id: oid,
            tid: tid
          }, function (res) {
            if (res.data.status == 200) {
              app.Tips({
                title: '取消任务成功',
                icon: 'success'
              });
              setTimeout(function () {
                that.getOrderLst();
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
   * 增值券选择
   */
  ChoiceCashbackIncreases(e) {
    var index = e.currentTarget.dataset.index,
      oid = e.currentTarget.dataset.oid
    //console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '/pageB/pages/wallet/wallet?oid=' + oid + '&order_index=' + index,
    })
  },
  /**
   * 提交审核
   */

  subRefund: function (e) {
    // console.log(this.data.orderInfo[e.target.dataset.index])
    // return
    var that = this,
      oid = e.target.dataset.oid
    if (!oid) return app.Tips({
      title: '获取订单ID失败'
    })
    if (that.data.orderInfo[e.target.dataset.index].order_num) {
      if (that.data.orderInfo[e.target.dataset.index].order_num.length < 15) return app.Tips({
        title: '请输入正确的订单编号'
      })
    } else {
      return app.Tips({
        title: '请输入正确的订单编号'
      })
    }

    if (that.data.orderInfo[e.target.dataset.index].takeaway_platform == 1) {
      if (that.data.orderInfo[e.target.dataset.index].haoping_images == '') return app.Tips({
        title: '请上传带图五星好评'
      })
      if (that.data.orderInfo[e.target.dataset.index].det_images == '') return app.Tips({
        title: '请上传订单详情页面'
      })
    }
    if (that.data.orderInfo[e.target.dataset.index].is_elm_open_upload_pictures == 1) {
      if (that.data.orderInfo[e.target.dataset.index].haoping_images == '') return app.Tips({
        title: '请上传带图五星好评'
      })
      if (that.data.orderInfo[e.target.dataset.index].det_images == '') return app.Tips({
        title: '请上传订单详情页面'
      })

    }
    var data = {
      order_num: that.data.orderInfo[e.target.dataset.index].order_num,
      haoping_images: that.data.orderInfo[e.target.dataset.index].haoping_images || '',
      det_images: that.data.orderInfo[e.target.dataset.index].det_images || '',
      id: oid,
      uci_id: that.data.orderInfo[e.target.dataset.index].uci_id || '',
      reason_wap_explain: that.data.orderInfo[e.target.dataset.index].reason_wap_explain || '',
    }
    //收集form表单 
    // app.baseGet(app.U({ c: 'public_api', a: 'get_form_id', q: { formId: formId}}),null,null,true);
    wx.showModal({
      title: '确认提交审核吗',
      content: '请检查信息，确认无误后进行提交',
      success(res) {
        if (res.confirm) {
          app.basePost(app.U({
            c: 'User_order',
            a: 'submission_of_credentials'
          }), data, function (res) {
            if (res.data.status == 200) {
              app.Tips({
                title: '提交成功',
                icon: 'success'
              });
              setTimeout(function () {

                that.getOrderLst();
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
  details: function (e) {
    console.log(e)
    var is_bwc = e.currentTarget.dataset.is_bwc;
    var sid = e.currentTarget.dataset.sid;
    var takeaway_platform = e.currentTarget.dataset.takeaway_platform;
    var uid = e.currentTarget.dataset.uid;
    var task_id = e.currentTarget.dataset.task_id;

    if (is_bwc == 0) {
      wx.navigateTo({
        url: '../../pageB/pages/merchant/merchant_details?sid=' + sid + '&takeaway_platform=' + takeaway_platform + '&uid=' + uid + '&tid=' + task_id
      })
    } else {
      wx.navigateTo({
        url: '../../pageB/pages/overlord/overlord_details?sid=' + sid + '&takeaway_platform=' + takeaway_platform + '&uid=' + uid + '&tid=' + task_id,
      })
    }
  },
  /**
   * 跳转美团商家小程序
   */
  jumpDetails_mt: function (e) {
    var that = this
    console.log(e)
    var id = e.currentTarget.dataset.mt_id;

    console.log(id)
    wx.navigateToMiniProgram({
      appId: 'wx2c348cf579062e56',
      path: 'pages/restaurant/restaurant?poi_id=' + id,
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
    var id = e.currentTarget.dataset.elm_id
    wx.navigateToMiniProgram({
      appId: 'wxece3a9a4c82f58c9',
      path: 'pages/shop/shop/index?id=' + id, // 写小程序跳转页面的路径，  可以正常传参
      envVersion: 'release', // 写对应的参数   开发版本：develop    体验版本：trial     正式版：release
      success(res) {
        // 打开成功
      }
    })

  },
  commentary: function () {
    wx.navigateTo({
      url: '../../pageC/pages/commentary/commentary?type=' + 1,
    })
  },
  commentaryelm: function () {
    wx.navigateTo({
      url: '../../pageC/pages/commentary/commentary?type=' + 2,
    })
  },
  commentarymt: function () {
    wx.navigateTo({
      url: '../../pageC/pages/commentary/commentary?type=' + 3,
    })
  },
  //手机号授权
  getPhoneNumber(e) {
    var that = this;
    wx.getStorage({
      key: 'cache_key',
      success: function (res) {
        if (res.data) {
          var cache_key = res.data;
          if (e.detail.iv) {
            app.basePost(app.U({
              c: 'Login',
              a: 'getPhoneNumber'
            }), {
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData,
              cache_key: cache_key,
              uid: that.data.uid
            }, function (res) {
              return app.Tips({
                title: res.msg
              });
            });
          } else {
            return app.Tips({
              title: '用户信息获取失败!'
            });
          }
        } else {
          return app.Tips({
            title: '用户信息获取失败!'
          });
        }
      },
      fail: function () {
        return app.Tips({
          title: '授权失败，未能获取到本地key'
        });
      }
    })
  }
})