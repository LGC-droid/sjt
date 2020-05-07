var app = getApp();
Component({
  properties: {
    parameter:{
      type: Object,
      value:{
        class:'0'
      },
    }, 
  },
  data: {
    navH: ""
  },
  ready: function(){
    
    this.setClass();
    var pages = getCurrentPages();
    if (pages.length <= 1) this.setData({'parameter.return':-1});
  },
  attached: function () {
    this.setData({
      navH: app.globalData.navHeight
    });
    this.get_logo_url();
  },
  methods: {
    get_logo_url: function () {
      if (wx.getStorageSync('logo_url')) return this.setData({ logo_url: wx.getStorageSync('logo_url') });
      app.baseGet(app.U({ c: 'Public_api', a: 'get_logo_url' }), function (res) {
        wx.setStorageSync('logo_url', res.data.logo_url);
        this.setData({ logo_url: res.data.logo_url });
      }.bind(this));
    },
    return:function(){
      wx.navigateBack();
    },
//     return_index:function(){
// wx.switchTab({
//   url: '/pages/index/index',
// }) 
//     },
    setGoodsSearch:function(){
       wx.navigateTo({
         url: '/pages/goods_search/index',
       })
    },
    setClass:function(){
      var color = '';
      switch (this.data.parameter.class) {
        case "0": case 'on':
          color = 'on'
          break;
        case '1': case 'black':
          color = 'black'
          break;
        case '2': case 'gray':
          color = 'gray'
          break;
        case '3': case 'blue':
          color = 'blue'
          break;
        case '4': case 'yellow':
          color = 'yellow'
          break;
        default:
          break;
      }
      this.setData({
        'parameter.class': color
      })
    }
  }
})