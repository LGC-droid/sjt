// pageC/pages/commentary/commentary.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlimg:'../../img/hebing.png',
    urlimgelm:'../../img/elm.png',
    urlimgmt:'../../img/mt.png',
    type:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ type: options.type});
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
    var that = this
    var type = that.data.type;
    console.log(type)
    if (type == 1) {
      this.setData({ urls:that.data.urlimg });
    } else if (type == 2) {
      this.setData({ urls:that.data.urlimgelm });
    }else if(type==3){
      this.setData({ urls:that.data.urlimgmt });
    }
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