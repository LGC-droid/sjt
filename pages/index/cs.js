// pages/index/weixinlink.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '0',
      'return': '0',
      'color': true,
      'class': '3'
    },
  },
  jumpDetails: function (e) {
    // console.log(e.currentTarget.dataset.id)    
    var id = e.currentTarget.dataset.id
    wx.navigateToMiniProgram({
      appId: 'wx2c348cf579062e56',
      path: 'pages/restaurant/restaurant?poi_id=856417673301735&cat_id=0&aas=', // 写小程序跳转页面的路径，  可以正常传参
      envVersion: 'release', // 写对应的参数   开发版本：develop    体验版本：trial     正式版：release
      success(res) {
        // 打开成功
      }
    })

  },
  jumpDetails2: function (e) {
    // console.log(e.currentTarget.dataset.id)    
    var id = e.currentTarget.dataset.id
    wx.navigateToMiniProgram({
      appId: 'wxece3a9a4c82f58c9',

      path: 'pages/sharePid/shareWebView/index?pid=mm_758800168_1147650485_109841050156:1583478180_225_160540463', // 写小程序跳转页面的路径，  可以正常传参
      envVersion: 'release', // 写对应的参数   开发版本：develop    体验版本：trial     正式版：release
      success(res) {
        // 打开成功
      }
    })

  },
  dingyuexiaoxi() {
    wx.requestSubscribeMessage({
      tmplIds: ['jkWYg6MS-GvT_wWNub9Iq4ynpWc9Dwe-Nr9FXN5_EZA', '6J1rtXUo_3vCIH5B-fvUd8efiCiPqy5cmrQmfnpO27o'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
      success(res) {
        console.log('已授权接收订阅消息')
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})