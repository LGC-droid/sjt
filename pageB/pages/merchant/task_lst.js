// pages/indent/indent.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '返利活动列表',
      'color': true,
      'class': '3',
      orderList:[]
    },
    sj_logo: wx.getStorageSync('xcx_logo_url'),
    logo:'',
    currentData: 0,
    task_lst: []//任务列表task_lst
  },
   


  /**
    * 切换类型
   */
  statusClick: function (e) {
    var status = e.currentTarget.dataset.status;
    if (status == this.data.orderStatus) return;
    this.setData({ orderStatus: status, loadend: false, page: 1, orderList: [] });
    this.getOrderList();
  },
  getOrderList: function () {
    var that = this;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
      c: 'Task_api', a: 'merchant_task_lst', q: {
        uid: that.data.uid,
        orderStatus: that.data.orderStatus
      }
    }), function (res) {
      console.log(res)
      wx.hideLoading()
      if (res.data.get_task_lst.code == 200) {
        that.setData({
          orderList: res.data.get_task_lst.data,
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    // var sid =2
     if (options.status) this.setData({ orderStatus: options.status });
    if (options.uid) this.setData({ uid: options.uid });
    if (options.logo) this.setData({ logo: options.logo }); 
    // if (sid) this.setData({ sid: sid, orderStatus:0});
    
  },
 onShow(){
   this.getOrderList();
 },
  goOrderDetails:function(e){
    var dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: 'merchant_details?sid=' + dataset.sid + '&tid=' + dataset.tid+"&type=shangjia",
    })
  }, 
  cancelOrder: function (e) {
    var tid = e.currentTarget.dataset.tid
    var that = this;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
      c: 'Task_api', a: 'del_task', q: {
        tid: tid,
         
      }
    }), function (res) { 
      wx.hideLoading()
      if (res.data.status == 200) {
        app.Tips({ title: '删除成功' });
        
        setTimeout(function () {
          that.onShow()
        }, 1000) 
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})