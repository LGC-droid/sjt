//index.js
//获取应用实例
const app = getApp()

Page({

  data: {
    ISPAID:false,//是否是公众号进入
    parameter: {
      'navbar': '1',
      'return': '0',
      'title': '个人中心',
      'color': true,
      'class': '0'
    },
    tasks: '', //任务信息 
    isLogin: false, //是否登入 
  },
  /**
   * 授权回调
   */
  onLoadFun: function (res) {
    //  console.log(app.globalData)
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        openId:app.globalData.openId,
        isLogin: true,
      })
      this.getUserInfo();
    }
    if (app.globalData.PAID && !app.globalData.spid) {
      this.setData({
        ISPAID: true
      })
    }
    // 
    // if (!this.data.MyMenus.length) this.getMyMenus();
  },
  onShow() {
  if(this.data.uid){
    this.getUserInfo();
  }
    
  },
  getUserInfo: function () {
    var that = this;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
      c: 'User_api',
      a: 'get_personal_center',
      q: {
        uid: that.data.uid,
        openId: that.data.openId,
        is_distribution: 1
      }
    }), function (res) {
      console.log(res)
    //  console.log(res.data.personal_center.user_info)
      wx.hideLoading()
      if (res.data.personal_center.code == 200) {
        
        that.setData({
          order_sum: res.data.personal_center.data,
          user_info: res.data.personal_center.user_info,

        });
      }
      if (res.data.shuoming_info.code == 200) {
        that.setData({
          shuoming_info: res.data.shuoming_info.data
        })
      }
    });
  },
  //推广员
  distribution: function () {
    var that = this
    console.log(that.data)
    wx.navigateTo({
      url: '../../pageB/pages/user_spread_user/index',
    })


  },
  business_portal: function () {
    wx.reLaunch({
      url: "../business/index"
    });
  },
  myfaburenwu(e) {
    if (e.currentTarget.dataset.state == 'jinxing') {
      wx.switchTab({
        url: '/pages/user_voucher/index'
      })
      return
    }
    wx.navigateTo({
      url: "../../pageB/pages/user_order/index?state=" + e.currentTarget.dataset.state
    });
  },
  capital: function (e) {
    wx.navigateTo({
      url: "../../pageB/pages/capital/index?type=user"
    });
  },
  order: function (e) {
    console.log()
    var dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '../capital/order_record?uid=' + dataset.uid + '&type=user' + '&jltype=' + dataset.jltype
    });
  },
  fenxiang: function () {
    wx.navigateTo({
      url: '../../pageB/pages/invite_cash_back_activities_list/index',
      
    })
  },
  gohelp: function () {
    wx.navigateTo({
      url: '../../pageB/pages/explain/help',
    })
  },
  member:function(e){
    wx.navigateTo({
      url: '../../pageB/pages/member/member',
    })
  },
  wallet:function(){
    wx.navigateTo({
      url: '../../pageB/pages/wallet/wallet',
    })
  },
  click:function(){
    wx.navigateTo({
      url: '../../pageB/pages/member/member',
    })
  },
  wkf:function(){
    wx.showModal({
      title: '提示',
      content: '该功能暂未开放，敬请期待',
      showCancel:false,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } 
      }
    })
  },
  hezuo:function(){
    wx.navigateTo({
      url: '../../pageB/pages/cooperation/cooperation',
    })
  },
  //手机号授权
  getPhoneNumber(e){
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
  }
  })