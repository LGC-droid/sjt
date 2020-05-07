const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.baseGet(app.U({
      c: 'Member_api',
      a: 'wkt_index',
      q: {
        // uid: that.data.uid, 
      }
    }), function (res) {
     // console.log(res) 
      if (res.data.status == 200) {
        that.setData({
          minimum_amount: res.data.result.minimum_amount 
        }); 
      }  else {
        return app.Tips({
          title: '数据错误'
        }, {
          tab: 3,
          url: 1
        });
      }
     
    });
  },

  renews: function (options) {
    wx.navigateTo({
      url: '../member/payment', 
    })
  },
})