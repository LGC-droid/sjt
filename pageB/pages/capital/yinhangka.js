// pages/apply-return/index.js
const app = getApp();
const util = require('../../../utils/util.js');
const bank = [
  '请选择您的收款方式',
  '支付宝',
  '微信',

]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      zfb_type: false,
      'navbar': '1',
      'return': '1',
      'title': "提现详情",
      'color': false
    },
    payment_code: [],
    orderInfo: {},
    RefundArray: [],
    index: 0,
    orderId: 0,
    bankArray: bank,
    id: '',
    type: 1, //类型:1=用户，2=商户,3=分销
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
    var that = this
    if (that.data.bankArray[that.data.index] == '支付宝') {
      that.setData({
        zfb_type: true
      })
    } else {
      that.setData({
        zfb_type: false
      })
    }
  },
  /**
   * 授权回调
   * 
   */
  onLoadFun: function () {
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        openId: app.globalData.openId,
        isLogin: true
      })
      this.getCashWithdrawalInfo();
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  options.money=2
    if (!options.money) return app.Tips({
      title: '金额有误'
    }, {
      tab: 3,
      url: 1
    });
    this.setData({
      money: options.money
    });
    if (options.id) this.setData({
      id: options.id
    });
    if (options.type) this.setData({
      type: options.type
    });
  },

  /**
   * 用户保存的收款数据
   * 
   */
  user_soukuan: function () {
    var that = this;
    app.baseGet(app.U({
      c: 'Cash_withdrawal',
      a: 'get_user_shoukuan',
      q: {
        uid: that.data.uid
      }
    }), function (res) {
      console.log(res)
      if (res.data.info.code == 200) {
        if (res.data.info.data.payment_code) {
          that.setData({
            payment_code: res.data.info.data.payment_code.split(",")

          });
        }
        for (var i = 0; i < that.data.bankArray.length; i++) {
          if (that.data.bankArray[i] == res.data.info.data.opening_bank) {
            that.setData({
              index: i
            })

          }
        }

        if (that.data.bankArray[that.data.index] == '支付宝') {
          that.setData({
            zfb_type: true
          })
        }
        that.setData({
          orderInfo: res.data.info.data,


        });
      }

    });
  },
  /**
   * 获取订单详情
   * 
   */
  getCashWithdrawalInfo: function () {
    var that = this;
    if (!that.data.id) {
      this.user_soukuan();
      return;
    }
    app.baseGet(app.U({
      c: 'Cash_withdrawal',
      a: 'get_user_cash_withdrawal',
      q: {
        uid: that.data.uid,
        id: that.data.id
      }
    }), function (res) {
      console.log(res)
      if (res.data.info.code == 200) {
        if (res.data.info.data.payment_code) {
          that.setData({
            payment_code: res.data.info.data.payment_code.split(",")

          });
        }
        for (var i = 0; i < that.data.bankArray.length; i++) {
          if (that.data.bankArray[i] == res.data.info.data.opening_bank) {
            that.setData({
              index: i
            })

          }
        }
        if (that.data.bankArray[that.data.index] == '支付宝') {
          that.setData({
            zfb_type: true
          })
        }
        that.setData({
          orderInfo: res.data.info.data,


        });
      }

    });
  },


  /**
   * 删除图片
   * 
   */
  DelPic: function (e) {

    var index = e.target.dataset.index,
      that = this,
      pic = this.data.payment_code[index];
    app.basePost(app.U({
      c: 'public_api',
      a: 'delete_image'
    }), {
      pic: pic.replace(app.globalData.url, '')
    }, function (res) {
      that.data.payment_code.splice(index, 1);
      that.setData({
        payment_code: that.data.payment_code
      });
    });
  },

  /**
   * 上传文件
   * 
   */
  uploadpic: function () {
    var that = this;
    if (that.data.orderInfo.examine_status == 0) return
    util.uploadImageOne(app.U({
      c: 'public_api',
      a: 'upload'
    }), function (res) {

      that.data.payment_code.push(app.globalData.url + res.data.url);
      that.setData({
        payment_code: that.data.payment_code
      });
    });
  },
  /**
   * 点击查看大图
   */
  previewImg(e) {
    console.log(e)
    var that = this
    //  var code_image = this.data.merchants.code_image
    var imgArr = that.data.payment_code;
    //imgArr[0] = this.data.merchants.code_image
    var img = e.currentTarget.dataset.img
    console.log(imgArr)
    wx.previewImage({
      current: img, //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式 
    })
  },

  /**
   * 提交审核
   */
  subRefund: function (e) {
    console.log(e)
    var that = this,
      formId = e.detail.formId,
      value = e.detail.value;
    var opening_bank = '';
    // if(that.data.index !=0){
    //   opening_bank = that.data.bankArray[that.data.index]
    // }  
    // if (!value.bank_card_number && !that.data.payment_code.length){
    //   return app.Tips({ title: '账号和收款码必须选择其中之一' });
    // }
    //收集form表单 
    // app.baseGet(app.U({ c: 'public_api', a: 'get_form_id', q: { formId: formId}}),null,null,true); 
    wx.showModal({
      title: '确认提现吗',
      content: '请检查信息，确认无误后进行提交',
      success(res) {
        if (res.confirm) {
          app.basePost(app.U({
            c: 'Cash_withdrawal',
            a: 'set_user_cash_withdrawal'
          }), {
            // opening_bank: opening_bank || '',
            // bank_card_number: value.bank_card_number || '',
            // cardholder: value.cardholder ||'',
            // payment_code: that.data.payment_code.join(','),
            money: that.data.money,
            uid: that.data.uid,
            id: that.data.id,
            type: that.data.type
          }, function (res) {
            return app.Tips({
              title: '提交成功',
              icon: 'success'
            }, {
              tab: 3,
              url: 2
            });

          }, function (res) {
            return app.Tips({
              title: res.msg
            });
          });

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },



})