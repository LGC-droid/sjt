var app = getApp();
var QQMapWX = require('../qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
var template = require("../tabbar_template/tabbar_template.js");
const util = require('../../../utils/util.js');
var demo = new QQMapWX({
  key: 'IATBZ-P6N3W-UIURM-RDN35-A7FV3-FVBEU' // 必填
});
const chooseLocation = requirePlugin('chooseLocation');
Page({
  data: {
    store_condition: 0, //排序
    takeaway_platform: 2, //平台选择（1：美团 2：饿了么）
    mask1Hidden: true,
    is_banners: false, //是否有轮播图
    is_cate: false, //是否有分类
    is_merchant: false, //是否有商家列表
    is_recommend_merchant: false, //是否有推荐商家
    is_jiazai: false, //上拉加载
    is_jiazai_val: '正在努力加载中…',
    sortSelected: "平台",
    latitude: '',
    longitude: '',
    chain_id: 0,
    // sortList: [
    //   {
    //     sort: "限美团",
    //     takeaway_platform: "1",
    //   }, {
    //     sort: "限饿了么",
    //     takeaway_platform: "2",
    //   }
    // ],
    page: 8, //分页
    scrollTop: 0,
    tab_bar_size: 150,
    parameter: {
      'navbar': '1',
      'return': '0',
      'color': true,
      'class': '3',
      'title': '叮叮饭粒',
    },
    showRule:{
      modalName:'',
      imgUrl: '',
    },
    filterId: 1,
    address: '选择地址>',
    current: '0',
    tab1: true,
    banners: [],
    merchant: [],
    hotList: [],
    shops: app.globalData.shops
  },
  onPageScroll: function (e) { //监听页面滚动 

    wx.createSelectorQuery()
    this.setData({
      scrollTop: e.scrollTop
    })
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
    console.log(e)
    this.setData({
      sortSelected: e.currentTarget.dataset.sort,
      takeaway_platform: e.currentTarget.dataset.takeaway_platform, //平台选择
      page: 8
    })
    this.get_request();
  },
  onLoad: function (options) {
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      })
    }
    if (options.PAID) app.globalData.PAID = options.PAID;  
    if (options.spid) app.globalData.spid = options.spid;
    if (options.scene) app.globalData.code = decodeURIComponent(options.scene);
    if (options.chain_id) {
      this.setData({
        chain_id: options.chain_id,
        title: options.title
      })
    }
    // if (options.spid)return app.Tips({ title: options.spid });
    // if (options.scene)return app.Tips({ title: decodeURIComponent(options.scene) });
    
    template.tabbar("tabBar", 1, this, options.chain_id, options.title)

  },
  getLocation() {
    var that = this
    wx.getLocation({
      altitude: true,
      isHighAccuracy: true,
      type: 'gcj02',
      success(res) { 

        // 调用接口转换成具体位置
        demo.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
           // console.log(res.result);
            that.setData({
              address: res.result.formatted_addresses.recommend,
              latitude: res.result.location.lat,
              longitude: res.result.location.lng,
              ad_info:res.result
            })
            if(app.globalData.uid){
              util.set_user_ad_info(res.result,app.globalData.uid)
            }
            that.ah()
          }

        })
      },
      fail: function (res) {
        that.setData({
          openSetting: 1
        })
      },

    })
  },
  /**
   * 授权回调
   */
  onLoadFun: function (res) {
    this.setData({
      uid: app.globalData.uid
    }) 
    this.getLocation()
  },
  onShow() {
    var that = this
    if (that.data.openSetting) { 
      wx.getSetting({
        success: function (e) {
          if (e.authSetting["scope.userLocation"]) {
            that.setData({
              openSetting: 0
            })
            that.getLocation()
          }
        },
      })
    }
    const location = chooseLocation.getLocation();
    console.log(location)
    if (location) { 
    // 调用接口转换成具体位置
    demo.reverseGeocoder({
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      success: function (res) {
        console.log(res.result);
        that.setData({
          address: res.result.formatted_addresses.recommend,
          latitude: res.result.location.lat,
          longitude: res.result.location.lng,
          ad_info:res.result
        })
        if(app.globalData.uid){
          util.set_user_ad_info(res.result,app.globalData.uid)
        }
        that.ah()
      } 
    })
    }

    //this.setData({ page:8})
    // this.get_request();
  },
  ah: function () { //初始化加载
    console.log(this.data.latitude)
    var that = this;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
      c: 'Merchant_api',
      a: 'chain_index',
      q: {
        uid:that.data.uid,
        lat: that.data.latitude,
        lon: that.data.longitude,
        takeaway_platform: that.data.takeaway_platform,
        store_condition: that.data.store_condition,
        chain_id: that.data.chain_id
      }
    }), function (res) {
      wx.hideLoading()
      console.log(res)
      // if(res.data.wechat_group_qr_code.length){
      //   that.setData({
      //    [ 'showRule.imgUrl']:app.globalData.url+ res.data.wechat_group_qr_code[0]
      //   })
      // }
      if (res.data.banner.code == 200) {
        that.setData({
          is_banners: true,
          banners: res.data.banner.data
        });
      }

      if (res.data.merchant.code == 200) {
        that.setData({
          is_merchant: true,
          merchant: res.data.merchant.data
        });
      } else {
        that.setData({
          is_merchant: false,
          merchant: []
        });
      }
    });
  },

  tapSearch: function () {
    wx.navigateTo({
      url: 'search'
    });
  },
  cate_list: function (e) {

    var data = e.currentTarget.dataset
    wx.navigateTo({
      url: '../cate_list/cate_list?id=' + data.id + '&cate_name=' + data.cate_name + '&takeaway_platform=' + this.data.takeaway_platform + '&latitude=' + this.data.latitude + '&longitude=' + this.data.longitude
    });
  },
  tapBanner: function (e) {
    var that=this
    console.log(e.currentTarget.dataset)
    var link = e.currentTarget.dataset.link; 
    if (e.currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: link
      });
    } else if (e.currentTarget.dataset.type == 2){
      wx.navigateTo({
        url: 'weixinlink?url=' + link
      });
    }
    else if (e.currentTarget.dataset.type == 3){
     
      that.showRule()
    }
   
  },
  showRule(e) {  
    if(this.data.showRule.modalName =='Images'){
      this.setData({
       [ 'showRule.modalName']: ''
      })
    }else{
      this.setData({
        ['showRule.modalName']: 'Images'
      })
    } 
  },
  /**
   *  下拉刷新
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 8
    })
    this.get_request(1);
  },
  /**
   *  调用商户数据
   */
  get_request: function (is_xiala) {
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
        page: 0,
        store_condition: that.data.store_condition,
        takeaway_platform: that.data.takeaway_platform,
        chain_id: that.data.chain_id
      }
    }), function (res) {
      if (is_xiala) {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();

      }
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
    console.log(that.data.page)
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
        page: that.data.page,
        store_condition: that.data.store_condition,
        takeaway_platform: that.data.takeaway_platform,
        chain_id: that.data.chain_id
      }
    }), function (res) {
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    return {
      imageUrl: "../../../imgs/wxw-logo.png",
      title: "外卖返现，就上叮叮饭粒",
      path: '/pageB/pages/chain/index?spid=' + app.globalData.uid + '&chain_id=' + this.data.chain_id + '&title=' + this.data.title,
    };
  },
  handleChangeScroll({
    detail
  }) {
    this.setData({
      current_scroll: detail.key
    });
  },
  goTop: function () {
    wx.pageScrollTo({

      scrollTop: this.data.tab_bar_size + 10,
      duration: 300
    })
  },
  handleChange({
    detail
  }) {
    this.goTop()
    var index = detail.key
    console.log(index)
    this.setData({
      current: detail.key,
      page: 8,
      store_condition: index
    });
    if (index == 0) {
      this.setData({
        tab1: true,
        tab2: false,
        tab3: false,

      })
    } else if (index == 1) {
      this.setData({
        tab1: false,
        tab2: true,
        tab3: false,
      })
    } else if (index == 2) {
      this.setData({
        tab1: false,
        tab2: false,
        tab3: true,
      })

    }
    this.get_request()
  },
  navigateToSearch: function () {
    //  wx.navigateTo({
    //    url: '../cityselect/cityselect'
    //  });
    var that = this
    const key = 'IATBZ-P6N3W-UIURM-RDN35-A7FV3-FVBEU'; //使用在腾讯位置服务申请的key
    const referer = '叮叮饭粒'; //调用插件的app的名称
    const location = JSON.stringify({
      latitude: that.data.latitude,
      longitude: that.data.longitude
    });
    const category = '生活服务,娱乐休闲';

    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`
    });
  },
  handleText() {
    $Toast({
      content: '这是文本提示'
    });
  },
  toSearchPage: function () {
    wx.navigateTo({
      url: '../goods_search/index?takeaway_platform=' + this.data.takeaway_platform + '&latitude=' + this.data.latitude + '&longitude=' + this.data.longitude,
    })
  },
})