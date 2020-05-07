//index.js
//获取应用实例
const app = getApp()

Page({

  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '搜索列表',
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
    if (e.search_criteria) {
      this.setData({
        search_criteria: e.search_criteria,
      })
    }
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
      a: 'merchant_lst',
      q: {
        lat: e.latitude,
        lon: e.longitude,
        search_criteria: e.search_criteria,
        takeaway_platform: e.takeaway_platform
      }
    }), function (res) {
      console.log(res)
      if (res.data.merchant.code == 200) {
        that.setData({
          is_merchant: true,
          merchant: res.data.merchant.data
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
        a: 'merchant_lst',
        q: {
          lat: that.data.latitude,
          lon: that.data.longitude,
          search_criteria: that.data.search_criteria,
          page: 0,
          store_condition: that.data.store_condition,
          takeaway_platform: that.data.takeaway_platform
        }

      }),
      function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.data.merchant.code == 200) {
          that.setData({
            is_merchant: true,
            is_jiazai: false,
            merchant: res.data.merchant.data,

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
        a: 'merchant_lst',
        q: {

          lat: that.data.latitude,
          lon: that.data.longitude,
          search_criteria: that.data.search_criteria,
          page: that.data.page,
          store_condition: that.data.store_condition,
          takeaway_platform: that.data.takeaway_platform
        }
      }),

      function (res) {
        console.log(res)
        if (res.data.merchant.code == 200) {
          that.setData({
            page: that.data.page + res.data.merchant.data.length,
            merchant: that.data.merchant.concat(res.data.merchant.data),
            is_jiazai: false,
          })
        } else {
          that.setData({
            is_jiazai_val: '没有更多商家了',
          })
        }
      });

  },

})