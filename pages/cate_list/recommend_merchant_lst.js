//index.js
//获取应用实例
const app = getApp()

Page({

  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '推荐列表',
      'color': true,
      'class': '0'
    },
    store_condition: 1,
    takeaway_platform: 0,
    mask1Hidden: true,
    cate_name: '分类名称',
    is_merchant: false, //是否有推荐商家
    is_jiazai: false, //上拉加载
    is_jiazai_val: '正在努力加载中…',
    mtprogreen:'#FFD161',
    elmprogreen:'#0396FD',
    sortSelected: "平台选择",
    sortList: [{
        sort: "通用平台",
        takeaway_platform: "0",
      },
      {
        sort: "限美团",
        takeaway_platform: "1",
      }, {
        sort: "限饿了么",
        takeaway_platform: "2",
      }
    ],
    page: 8, //分页
  },
  mask1Cancel: function () {
    this.setData({
      mask1Hidden: true
    })
  },
  onOverallTag: function () {
    this.setData({
      mask1Hidden: false
    })
  },
  onTapTag: function (e) {
    this.setData({
      selected: e.currentTarget.dataset.index,
      store_condition: e.currentTarget.dataset.index,
      page: 8
    });
    this.get_request();
  },
  sortSelected: function (e) {
    this.setData({
      sortSelected: e.currentTarget.dataset.sort,
      takeaway_platform: e.currentTarget.dataset.takeaway_platform, //平台选择
      page: 8
    })
    this.get_request();
  },

  onLoad: function (e) {
    console.log(e)
    var that = this;
    if (e.takeaway_platform) {
      this.setData({
        takeaway_platform: e.takeaway_platform
      })
    }
    if (!e.longitude && !e.latitude) return app.Tips({
      title: '没有获取到经纬度'
    });
    this.setData({
      latitude: e.latitude,
      longitude: e.longitude,
    })
    app.baseGet(app.U({
      c: 'Merchant_api',
      a: 'recommend_merchant_lst',
      q: {
        lat: e.latitude,
        lon: e.longitude,
        store_condition: 0,
        takeaway_platform: e.takeaway_platform
      }
    }), function (res) {
      console.log(res)
      if (res.data.recommend_merchant.code == 200) {
        that.setData({
          is_merchant: true,
          recommend_merchant: res.data.recommend_merchant.data
        });
      }
    });

  },
  /**
   * 授权回调
   */
  onLoadFun: function (res) {
    console.log(app.globalData.uid)
    // this.getUserInfo();
    // if (!this.data.MyMenus.length) this.getMyMenus();
  },
  get_request: function () {
    var that = this;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
        c: 'Merchant_api',
        a: 'recommend_merchant_lst',
        q: {
          lat: that.data.latitude,
          lon: that.data.longitude,
          cid: that.data.cid,
          page: 0,
          store_condition: that.data.store_condition,
          takeaway_platform: that.data.takeaway_platform
        }

      }),
      function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.data.recommend_merchant.code == 200) {
          that.setData({
            is_merchant: true,
            is_jiazai: false,
            recommend_merchant: res.data.recommend_merchant.data,

          })
        } else {
          that.setData({
            is_merchant: false,
            is_jiazai: false,
          })
        }
      });

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // 显示加载图标 
    that.setData({
      is_jiazai: true
    })
    app.baseGet(app.U({
        c: 'Merchant_api',
        a: 'recommend_merchant_lst',
        q: {

          lat: that.data.latitude,
          lon: that.data.longitude,
          cid: that.data.cid,
          page: that.data.page,
          store_condition: that.data.store_condition,
          takeaway_platform: that.data.takeaway_platform
        }
      }),

      function (res) {
        console.log(res)
        if (res.data.recommend_merchant.code == 200) {
          that.setData({
            page: that.data.page + res.data.recommend_merchant.data.length,
            recommend_merchant: that.data.recommend_merchant.concat(res.data.recommend_merchant.data),
            is_jiazai: false,
          })
        } else {
          that.setData({
            is_jiazai_val: '没有更多商家了',
          })
        }
      });

  },
  onShow() {
    this.set_navibar_clor();
    
  },
  set_navibar_clor() {
    if (this.data.takeaway_platform == 1) { //美团
      // this.setData({
      //   'parameter.class_details': 'yellow'
      // })
      wx.setNavigationBarColor({
        frontColor: '#ffffff', // 必写项
        backgroundColor: '#FFD161', // 必写项

      })
    } else {
      // this.setData({
      //   'parameter.class_details': 'blue'
      // })
      wx.setNavigationBarColor({
        frontColor: '#ffffff', // 必写项
        backgroundColor: '#0396fd', // 必写项

      })
    }
  },
})