const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      {'first':'首次开通','month':'一个月','money':'15','bdy':'20'},
      {'first':'限时折扣活动','month':'三个月','money':'60','bdy':'99'},
      {'first':'单价每月最便宜','month':'十二月','money':'150','bdy':'299'}
    ],
    MemberRechargeRules:[],//全部数据
    SelectionMemberRechargeRules:[],//选中的数据
    LastTime:'开通会员红包，享受三种会员特权',
    idx : 0
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
      this.getMemberInfo()
    } 
    //  
  },
  getMemberInfo: function () {
    var that = this;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
      c: 'Member_api',
      a: 'payment_index',
      q: {
        uid: that.data.uid, 
      }
    }), function (res) {
     console.log(res)
      wx.hideLoading()
      if (res.data.status == 200) {
        that.setData({
          LastTime: res.data.result.LastTime,
          MemberRechargeRules: res.data.result.MemberRechargeRules,  
          SelectionMemberRechargeRules:res.data.result.MemberRechargeRules[0],  
        });
        if(res.data.result.banner.code ==200){
          that.setData({
            is_banner:true,
            banner_data: res.data.result.banner.data[0], 
          });
        }
      } else {
        return app.Tips({
          title: '数据错误'
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

  },

  
  goIndex (e) { 
    let index = e.currentTarget.dataset.index;  
    this.setData({
     idx: index,
     SelectionMemberRechargeRules:this.data.MemberRechargeRules[index]
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
   var that=this
    app.basePost(app.U({ c: 'User_member_wxpay', a: 'pay_wechat_api' }), {
     uid: that.data.uid,
      openid: that.data.openid, 
      val:that.data.SelectionMemberRechargeRules.val
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
            app.Tips({title:'开通成功'},{tab:4,url:'/pageB/pages/member/member'})
          
          },
          fail: function (res) { //支付失败 
           console.log(res)
          }
        });

      } else {
        return app.Tips({ title: res.msg })
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
})