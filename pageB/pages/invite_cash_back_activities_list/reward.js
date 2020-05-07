const app = getApp()
Page({
  data: {
    current: 'tab1',
    tab1: true,
    current_scroll: 'tab1',
    is_complete:0
  },

  handleChange({
    detail
  }) {
    var index = detail.key
    console.log(index)
    this.setData({
      current: detail.key,

    });
    if (index == 'tab1') {
      this.setData({
        tab1: true,
        tab2: false,
        is_complete:0
      })
     
    } else if (index == 'tab2') {
      this.setData({
        tab1: false,
        tab2: true,
        is_complete:1
      })
    }
    this.get_request()
  },
 onLoad(e){
   console.log(e)
   this.setData({
     uid:e.uid,
     icbal_id:e.icbal_id,
     register_bonus:e.register_bonus,
     complete_bonus:e.complete_bonus,
   })
   this.get_request()
 },
 get_request(){
  var that = this;
  wx.showLoading && wx.showLoading({
    title: '加载中',
    mask: true
  });
  app.baseGet(app.U({
    c: 'invite_cash_back_activities_list_api', a: 'get_subordinate_user_list', q: {
      uid: that.data.uid,icbal_id: that.data.icbal_id,is_complete: that.data.is_complete,
    }
  }), function (res) { 
    console.log(res)
    wx.hideLoading()
    if (res.data.status == 200) {
      that.setData({  
        subordinate_user_list: res.data.result.subordinate_user_list,
        complete_count: res.data.result.complete_count,
        register_count: res.data.result.register_count,
      })
    }  else{ 
      return app.Tips({ title: res.msg  }); 
    }
  });
},

});