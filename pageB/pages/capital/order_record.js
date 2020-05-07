const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TopIndex: 0,
    showView1: true,
    showView2: false,
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '账单记录',
      'color': true,
      'class': '0'
    },
  },
  get_user_cash_withdrawal(e) {
    var dataset = e.currentTarget.dataset

    wx.navigateTo({
      url: 'yinhangka?id=' + dataset.id + '&money=' + dataset.money + '&type=' + dataset.type,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 'merchant') {
      this.setData({
        text_val_one: '消费记录',
        text_val_two: '充值记录',
        type: 'merchant'
      })
    } else {
      this.setData({
        text_val_one: '余额记录',
        text_val_two: '提现记录',
        type: 'user'
      })

    }
    // showView1: (options.jltype == "yj" ? true : false)
    // showView2: (options.jltype == "tx" ? true : false)
    if (options.jltype == "tx") {
      this.setData({
        showView2: true,
        showView1: false
      })
    } else {
      this.setData({
        showView1: true,
        showView2: false,
      })
    }
    this.get_info(options)
  },
  get_info: function (options) {
    var that = this;

    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    var url = 'get_user_record'
    if (options.type == 'merchant') {
      url = 'get_merchant_record'
    }
    app.baseGet(app.U({
      c: 'Capital_Api',
      a: url,
      q: {
        uid: options.uid
      }
    }), function (res) {
      console.log(res)
      wx.hideLoading()
      if (res.data.val_one.code == 200) {

        that.setData({
          is_val_one: true,
          val_one: res.data.val_one.data
        });
      } else {
        that.setData({
          is_val_one: false
        })
      }
      if (res.data.val_two.code == 200) {

        that.setData({
          is_val_two: true,
          val_two: res.data.val_two.data
        });
      } else {
        that.setData({
          is_val_two: false
        })
      }
    });
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
  changstyle: function (e) {
    let index = e.currentTarget.dataset.index; /*定义index等于当前页面的dataset.index*/
    this.setData({
      TopIndex: index,
      /*定义当前数据的TopIndex等于  index 等于dataset.index*/
    })
    console.log(TopIndex);
  },
  onChangeShowState: function (e) {
    var that = this;
    var ID = e.target.id;
    console.log(ID);
    if (ID == "view") {
      that.setData({
        showView1: false,
        showView2: true,

      })
    }
    if (ID == "food") {
      that.setData({
        showView1: true,
        showView2: false,

      })
    }

  },
})