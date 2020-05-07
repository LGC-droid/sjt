//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    add_activity:false,
    user_msg:[]
  },
 
  OpeningActivities(e) {
    var uid = this.data.uid, that = this,activity_id=this.data.activity.id 
    app.basePost(app.U({ c: 'invite_cash_back_activities_list_api', a: 'opening_activities' }), { uid: uid,icbal_id:activity_id},function(res){ 
      console.log(res)
      if (res.data.status == 200) {
        that.get_request()
      }else{
        return app.Tips({ title: res.msg  }); 
      }
      // this.setData({
      //   add_activity: false
      // })
    });
   
  },
  showRule(e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideRule(e) {
    this.setData({
      modalName: null
    })
  },

  onLoadFun: function (res) { 
    if (app.globalData.uid) {
      this.setData({ uid: app.globalData.uid, isLogin: true,
       url : app.globalData.url
      }) 
      this.get_request()
    }else{
      return app.Tips({ title:'未获取到用户ID'  }, { tab: 3, url: 1 }); 
    }
  }, 
  get_request(){
    var that = this;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
      c: 'invite_cash_back_activities_list_api', a: 'index', q: {
        uid: app.globalData.uid
      }
    }), function (res) { 
      console.log(res)
      wx.hideLoading()
      if (res.data.status == 200) {
        that.setData({ 
          add_activity: false,
          activity: res.data.result.activity,
          user_msg: res.data.result.user_msg,

        })
      } else if (res.data.status == 300) {
        that.setData({
          activity: res.data.result.activity,
          add_activity: true,

        })
      } else{ 
        return app.Tips({ title: res.msg  }, { tab: 3, url: 1 }); 
      }
    });
  },
  //分销海报跳转
  fenxiang:function(){
    wx.navigateTo({
      url: '/pageB/pages/user_spread_code/index',
    })
  },
  //领取奖励金
  ReceiveAwards(e){ 
    var uid = this.data.uid, that = this,activity_id=this.data.activity.id,index=e.currentTarget.dataset.index
    app.basePost(app.U({ c: 'invite_cash_back_activities_list_api', a: 'receive_awards' }), { uid: uid,icbal_id:activity_id,index:index},function(res){ 
      console.log(res)
      if (res.data.status == 200) {
        app.Tips({ title: res.msg  }); 
        setTimeout(function () {
         
          that.get_request()
          }, 1500)
      }else{
        return app.Tips({ title: res.msg  }); 
      } 
    });
   
  },
  onShareAppMessage: function () {
    return {
      title: "外卖返现，就上叮叮饭粒",
      imageUrl: "../../../imgs/share.png",
      path: '/pages/index/index?spid=' + app.globalData.uid,
    };
  }
})
