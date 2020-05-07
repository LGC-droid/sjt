//index.js
//获取应用实例
const app = getApp()

Page({

  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '商家详情',
      'color': true,
      'class': '3'
    },
    merchants:'',//商家信息
    is_merchants: false,//是否有商家信息
    is_jiazai: false,//上拉加载
    is_jiazai_val: '正在努力加载中…',
    page: 8,//分页   
  },
  onLoad: function (e) {
    console.log(e)
    var that = this;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });   
    app.baseGet(app.U({
      c: 'Merchant_api', a: 'merchant_details', q: {
        sid: e.sid,
        uid:that.data.uid
      }
    }), function (res) {
      console.log(res)
      wx.hideLoading()
      if (res.data.merchants.code == 200) {
        that.setData({
          is_merchants: true,
          merchants: res.data.merchants.data
        });
      }
      if (res.data.task_lst.code == 200) {
        that.setData({
          // is_merchants: true,
          task_lst: res.data.task_lst.data
        });
      }
    });

  },
  dask_det:function(e){ 
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id 
      wx.navigateTo({ url: '../task/details?id=' +id}); 
  }
  /**
    * 页面上拉触底事件的处理函数
    */
  // onReachBottom: function () {
  //   var that = this;
  //   // 显示加载图标 
  //   that.setData({
  //     is_jiazai: true
  //   })
  //   app.baseGet(app.U({
  //     c: 'Merchant_api', a: 'merchant_lst', q: {
  //       lat: that.data.latitude, lon: that.data.longitude, page: that.data.page
  //     }
  //   }), function (res) {
  //     if (res.data.merchant.code == 200) {
  //       that.setData({
  //         page: that.data.page + res.data.merchant.data.length,
  //         merchant: that.data.merchant.concat(res.data.merchant.data),
  //         is_jiazai: false,
  //       })
  //     } else {
  //       that.setData({
  //         is_jiazai_val: '没有更多商家了',
  //       })
  //     }
  //   });

  // }
})
