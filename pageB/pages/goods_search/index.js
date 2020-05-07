// pages/searchGood/index.js
var app = getApp();
var wayIndex = -1;
var school_area = '';
var grade = '';
// 当联想词数量较多，使列表高度超过340rpx，那设置style的height属性为340rpx，小于340rpx的不设置height，由联想词列表自身填充
// 结合上面wxml的<scroll-view>
var arrayHeight = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '商家搜索',
      'color': false,
     
    },
    searchValue: '', //点击结果项之后替换到文本框的值
    adapterSource: ["weixin", "wechat", "android", "Android", "IOS", "java", "javascript", "微信小程序", "微信公众号", "微信开发者工具"], //本地匹配源
    bindSource: [], //绑定到页面的数据，根据用户输入动态变化
    hideScroll: true,
    host_product: [],
    searchValue: '',
    focus: true,
    bastList: [],
    hotSearchList: [],
    first: 0,
    limit: 8,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) { 
    this.setData({
      latitude: e.latitude,
      longitude: e.longitude,
      takeaway_platform: e.takeaway_platform
    })
    this.getSearchInfo()
  },
  getSearchInfo: function () {
    var that = this; 
    app.baseGet(app.U({
      c: 'Public_api',
      a: 'get_search_info',
      q: {
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        takeaway_platform: that.data.takeaway_platform,
      }
    }), function (res) {
    
      if (res.data.status == 200) {
        that.setData({
          adapterSource: res.data.result.msg,
          
        }); 
      }   
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // setValue: function (event) {
  //   this.setData({
  //     searchValue: event.detail.value
  //   });
  // },
  searchBut: function () {
    var that = this; 
    if (that.data.searchValue.length > 0) {
      wx.navigateTo({
        url: 'search_list?search_criteria=' + that.data.searchValue + '&takeaway_platform=' + that.data.takeaway_platform + '&latitude=' + that.data.latitude + '&longitude=' + that.data.longitude
      })
    } else {
      wx.showToast({
        title: '请输入要搜索的商家名称',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
    }
  },
 //当键盘输入时，触发input事件
 bindinput: function (e) {
  //用户实时输入值
  var that=this
  var prefix = e.detail.value
  //匹配的结果
  var newSource = []
  if (prefix != "") { 
    // 对于数组array进行遍历，功能函数中的参数 `e`就是遍历时的数组元素值。
    that.data.adapterSource.forEach(function (e) {  
      // 用户输入的字符串如果在数组中某个元素中出现，将该元素存到newSource中
      if (e.indexOf(prefix) != -1) { 
        newSource.push(e)
      }
    })
  };
  // 如果匹配结果存在，那么将其返回，相反则返回空数组
  if (newSource.length != 0) {
    this.setData({
      // 匹配结果存在，显示自动联想词下拉列表
      hideScroll: false,
      bindSource: newSource,
      arrayHeight: newSource.length * 71
    })
  } else {
    this.setData({
      // 匹配无结果，不现实下拉列表
      hideScroll: true,
      bindSource: []
    })
  }
  this.setData({
    searchValue: prefix
  });
},

// 用户点击选择某个联想字符串时，获取该联想词，并清空提醒联想词数组
itemtap: function (e) {
  this.setData({
    // .id在wxml中被赋值为{{item}}，即当前遍历的元素值
    searchValue: e.target.id,
    // 当用户选择某个联想词，隐藏下拉列表
    hideScroll: true,
    bindSource: []
  })
  this.searchBut() 
}, 
})