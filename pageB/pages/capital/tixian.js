const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '提现',
      'color': true,
      'class': '0'
    },
    type: 1, //类型:1=用户，2=商户,3=分销
    capital: 15,
    showModal: false,
    lick_capital: '',
    id: ''
  },
  /**
   * 授权回调
   */
  onLoadFun: function (res) {
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        openId: app.globalData.openId,
        isLogin: true
      })
    }
    // 
    // if (!this.data.MyMenus.length) this.getMyMenus();
    this.getCashWithdrawalInfo()
  },
  getCashWithdrawalInfo: function () {
    var that = this;
    app.baseGet(app.U({
      c: 'Cash_withdrawal',
      a: 'is_user_cash_withdrawal',
      q: {
        uid: that.data.uid
      }
    }), function (res) {
      that.setData({
        mobile:res.data.info.mobile
      })
      console.log(res)
      if (res.data.info.code == 200) {
        return app.Tips({
          title: '您正在申请提现，请不要重复操作'
        }, {
          tab: 3,
          url: 1
        });
      }

    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.capital) {
      this.setData({
        capital: options.capital
      })
    }
    if (options.type) {
      this.setData({
        type: options.type
      })
    }
  },
  lick_capital() {

    this.setData({
      lick_capital: this.data.capital,
      money: this.data.capital
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



  inputTitle: function (e) {
    console.log(e)
    this.setData({
      money: e.detail.value
    })
  },
  //手机号授权
  getPhoneNumber(e){
    console.log(1)
    var that = this;  
    wx.getStorage({
      key:'cache_key',
      success:function(res){ 
        if(res.data){
          var cache_key = res.data;
          if (e.detail.iv) { 
            app.basePost(app.U({
              c: 'Login',
              a: 'getPhoneNumber'
            }), {
             iv : e.detail.iv,
             encryptedData:e.detail.encryptedData,
            cache_key :cache_key,
            uid:that.data.uid 
            }, function (res) {
              console.log(res)
              that.getCashWithdrawalInfo()
              return app.Tips({ title: res.msg });
            });
          } else { 
            return app.Tips({ title: '用户信息获取失败!' });
          }
        }else{
          return app.Tips({ title: '用户信息获取失败!' });
        }
      },
      fail:function(){
        return app.Tips({ title: '授权失败，未能获取到本地key' });
      }
    })
  },
  modalcnt: function () {
    var that = this
  
    if (!that.data.isLogin) return app.Tips({
      title: '登入失败'
    });
    if (!that.data.money) return app.Tips({
      title: '请输入有效金额'
    });
    if (that.data.money < 1) return app.Tips({
      title: '提现金额必须大于1元'
    });
    if (parseInt(that.data.money) > parseInt(that.data.capital)) return app.Tips({
      title: '可提现余额不足'
    });

    // wx.navigateTo({
    //   url: "yinhangka?money=" + that.data.money +'&type='+that.data.type
    // });
    // return
    that.subRefund();
  },
  /**
   * 提交审核
   */
  subRefund: function (e) {
    var expiration = wx.getStorageSync("cash_ithdrawal_time"); //拿到过期时间
    if (expiration) {
      var timestamp = Date.parse(new Date()); //拿到现在时间
      //进行时间比较
      if (expiration < timestamp) { //过期了，清空缓存，跳转到登录
        console.log("缓存已过期");
        wx.clearStorageSync(); //清空缓存 

      } else {
        return app.Tips({
          title: '请24小时后在进行次操作'
        }, {
          tab: 3,
          url: 2
        });

      }
    }
  
    var that = this;
    //提现完成通知-平台审核失败通知
    wx.requestSubscribeMessage({
      tmplIds: ['6J1rtXUo_3vCIH5B-fvUd8efiCiPqy5cmrQmfnpO27o', 'Rk9tET-ZSkz9ZkJUohU7eaz6H7Qm1YYsevmIwtqf8ec'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
      success(res) {
        console.log('已授权接收订阅消息')
      },
    })
    //收集form表单 
    // app.baseGet(app.U({ c: 'public_api', a: 'get_form_id', q: { formId: formId}}),null,null,true); 
    wx.showModal({
      title: '确认提现吗',
      content: '每24小时内仅限提取一次~',
      success(res) {
        if (res.confirm) {
          app.basePost(app.U({
            c: 'Cash_withdrawal',
            a: 'set_user_cash_withdrawal'
          }), {
            // opening_bank: opening_bank || '',
            // bank_card_number: value.bank_card_number || '',
            // cardholder: value.cardholder || '',
            // payment_code: that.data.payment_code.join(',') || '',
            money: that.data.money,
            uid: that.data.uid,
            id: that.data.id,
            type: that.data.type
          }, function (res) {
            //存一个过期时间
            var timestamp = Date.parse(new Date());
            var expiration = timestamp + 86400; //（24小时）
            wx.setStorageSync("cash_ithdrawal_time", expiration);
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