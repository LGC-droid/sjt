// pages/my-promotion/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '合伙人',
      'color': true,
      'class': '0'
    },
    userInfo: [],
    yesterdayPrice: 0.00,
    isClone: false,
    current: '0',
    tab1: true,
    current_scroll: 'tab1',
    starttime: ['2020-01-01'],
    endtime: ['2020-01-01'],
  },
  onLoadFun: function () {
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        isLogin: true,
      })
      var data = {
        openId: app.globalData.openId,
        uid: app.globalData.uid,
      }
      this.getUserInfo(data);
      this.get_data_display();
    }

    // this.yesterdayCommission();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    var todays = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(); 
      date.setTime(date.getTime()); 
      this.setData({
        'starttime[0]': todays,
        'endtime[0]': todays,
      })
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
    // if (app.globalData.isLog && this.data.isClone){
    //   this.getUserInfo();
    //   this.yesterdayCommission();
    // }
  },
  /**
   * 获取个人用户信息
   */
  getUserInfo: function (data) {

    var that = this;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
      c: 'User_api',
      a: 'get_distribution_center',
      q: {
        uid: data.uid,
      }
    }), function (res) {
      console.log(res)
      wx.hideLoading()
      if (res.data.status == 200) {
        that.setData({
          distribution_examine: res.data.result.distribution_examine,
        });
      } else if (res.data.status == 300) {
        wx.redirectTo({
          url: '/pageB/pages/user_spread_user/shuoming?is_shenqing=1&uid=' + data.uid,
        })
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
  get_data_display: function () {
    var that = this;
    var date = this.data.starttime[0] + ' 00:00:00 - ' + this.data.endtime[0] + ' 23:59:59'
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
        c: 'Distribution_api',
        a: 'get_data_display',
        q: {
          uid: that.data.uid,
          date: date || '',
        }
      }),
      function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.data.status == 200) {
          that.setData({
            data_display:res.data.result.data_display
          })
        }
      });

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isClone: true
    });
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


  handleChange({
    detail
  }) {
    var index = detail.key;
    var that =this
    var date = new Date();
    console.log(index)
    this.setData({
      current: detail.key,
    });
    var todays = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    if (index == 0) { 
      date.setTime(date.getTime()); 
      this.setData({
        'starttime[0]': todays,
        'endtime[0]': todays,
        tab1: true,
        tab2: false,
        tab3: false,
        tab4: false
      })
    } else if (index == 1) { 
      date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
      var yesterdays = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(); 
      this.setData({
        'starttime[0]': yesterdays,
        'endtime[0]': yesterdays,
        tab1: false,
        tab2: true,
        tab3: false,
        tab4: false
      })
    } else if (index == 2) {
      
      date.setTime(date.getTime() - 7* 24 * 60 * 60 * 1000);
      var weeks = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();  
      console.log(weeks)
      this.setData({
        'starttime[0]': weeks,
        'endtime[0]': todays,
        tab1: false,
        tab2: false,
        tab3: true,
        tab4: false
      })

    } else if (index == 3) { 
      date.setTime(date.getTime() - 30 *24 * 60 * 60 * 1000);
      var months = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();  
      this.setData({
        'starttime[0]': months,
        'endtime[0]': todays,
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: true
      })

    }
    that.get_data_display()
  },
  shuoming() {
    wx.navigateTo({
      url: '/pageB/pages/explain/xiangqing?id=4',
    })
  },
  huodong() {
    wx.navigateTo({
      url: '../invite_cash_back_activities_list/index',
    })
  },
  profit: function (options) {
    wx.navigateTo({
      url: '../user_spread_money/profit',
    })
  },
  gograde: function (options) {
    wx.navigateTo({
      url: '../user_spread_money/grade', //这个是要加载的页面的路径
    })
  },
  estimate: function (options) {
    wx.navigateTo({
      url: '../../../pageC/pages/estimate/estimate', //这个是要加载的页面的路径
    })
  },
})