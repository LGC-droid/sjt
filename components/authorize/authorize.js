var app = getApp();
import {
  $wuxCountDown
} from '../../pages/dist/index'
Component({
  properties: {
    window:{
      type: Boolean,
      value: false,
    },
    redbaos:{
      type: Boolean,
      value: false,
    },  
    iShidden: {
      type: Boolean,
      value: true,
    },
    //是否自动登录
    isAuto: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    cloneIner: null,
    loading:false,
    is_index:false
  },
  ready: function () { 
    var pages = getCurrentPages();
    if (pages.length <= 1) this.setData({ 'is_index': true });
  },
  pageLifetimes: {
    hide: function () {
      // if (this.c3) {
      //   this.c3.stop() //关闭定时
      // }
      //关闭页面时销毁定时器
      if (this.data.cloneIner) clearInterval(this.data.cloneIner);
    },
    show: function () {
      //打开页面销毁定时器
      if (this.data.cloneIner) clearInterval(this.data.cloneIner);
    },
  },
  detached() {
    if (this.data.cloneIner) clearInterval(this.data.cloneIner);
  },
  attached() { 
 
    this.get_logo_url();
    this.setAuthStatus();
  },
  methods: {
    get_logo_url: function () {
      if (wx.getStorageSync('xcx_logo_url')) return this.setData({ logo_url: wx.getStorageSync('logo_url') });
      app.baseGet(app.U({ c: 'Login', a: 'get_logo_url' }), function (res) { 
        wx.setStorageSync('xcx_logo_url', res.data.logo_url);
        this.setData({ logo_url: res.data.logo_url });
      }.bind(this));
    },
    //监听登录状态
    WatchIsLogin: function () {
      this.data.cloneIner = setInterval(function () {
        //防止死循环,超过错误次数终止监听
        if (this.getErrorCount()) return clearInterval(this.data.cloneIner);
        if (app.globalData.uid == '' && this.data.loading===false) this.setAuthStatus();
      }.bind(this),800);
      this.setData({ cloneIner: this.data.cloneIner });
    },
    //检测登录状态并执行自动登录
    setAuthStatus() {
     // console.log(app)
  
      var that = this;
      that.setErrorCount();
      wx.getSetting({
        success(res) {  
          if (!res.authSetting['scope.userInfo']) {
            //没有授权不会自动弹出登录框
            if (that.data.isAuto === false) return;
            //自动弹出授权
            that.setData({ iShidden: false });
          } else {
            //自动登录
         
            that.setData({ iShidden: true }); 
         
            if (app.globalData.uid) { 
              // if (app.globalData.is_authentication != "undefined" && app.globalData.is_authentication != 2) {
              //   wx.reLaunch({
              //     url: "../earnest/guide",
              //     success: function (res) { },
              //     fail: function (res) { },
              //   })
              // }
              that.triggerEvent('onLoadFun', app.globalData.uid);
               //调用赠券接口
               that.new_users_send_coupons(app.globalData.uid);
              that.WatchIsLogin();
            } else {
              wx.showLoading({ title: '正在登录中' });
              that.getUserInfoBydecryptCode();
            }
          }
        }
      })
    },
    //访问服务器获得cache_key
    setCode(code, successFn, errotFn) {
    
      var that = this;
      that.setData({ loading: true });
      app.basePost(app.U({ c: 'Login', a: 'setCode' }), { code: code }, function (res) { 
        that.setData({ loading: false });
        wx.setStorage({ key: 'cache_key', data: res.data.cache_key});
        successFn && successFn(res);
      }, function (res) { 
        that.setData({ loading: false });
        if (errotFn) errotFn(res);
        else return app.Tips({ title: '获取cache_key失败' });
      }); 
    },
    //获取code
    getSessionKey(code, successFn, errotFn) { 
      var that = this;
      wx.checkSession({
        success: function (res) {
          
          wx.getStorage({
            key:'cache_key',
            success:function(res){
              
              if (res.data){
                successFn && successFn();
              }else{
               that.setCode(code, successFn, errotFn);
              }
            },
            fail(res){
          
              that.setCode(code, successFn, errotFn);
            },
          });
        },
        fail: function () { 
          that.setCode(code, successFn, errotFn);
        }
      });
    },
    login:function(){
      var that=this;
      wx.login({
        success: function (res) {
          if (!res.code) return app.Tips({ title: '登录失败！' + res.errMsg });
          //获取cache_key并缓存
          that.getSessionKey(res.code, function () {
            that.getUserInfoBydecryptCode();
          });
        },
        fail() {
          wx.hideLoading();
        }
      })
    },
    //授权
    setUserInfo(e) {
      wx.showLoading({ title: '正在登录中' });
      this.login();
    },
    coupon_close(){
      this.setData({ window: false });
    },
    close: function () {
      if (this.data.isAuto) return;
      this.setData({ iShidden: true });
    },
    quxiao(){
      this.setData({ iShidden: true });
      wx.removeStorageSync('xcx_logo_url')
    },
    //登录获取访问权限
    getUserInfoBydecryptCode: function () {
      var that = this;
    
      if (this.getErrorCount()){
        this.setData({ iShidden: false, ErrorCount: 0 });
        return app.Tips({ title: '获取code失败,请重新授权尝试获取！' });
      } 
 
      wx.getStorage({
        key:'cache_key',
        success:function(res){ 
        //  console.log(res)
          if(res.data){
            var cache_key = res.data;
            wx.getUserInfo({
              lang: 'zh_CN',
              success: function (res) {
                
                var pdata = {};
                pdata.spid = app.globalData.spid;//获取推广人ID
                pdata.code = app.globalData.code;//获取推广人分享二维码ID
                pdata.PAID=app.globalData.PAID;//通过公众号进入的公众号ID
                if (res.iv) {
                  pdata.iv = encodeURI(res.iv);
                  pdata.encryptedData = res.encryptedData;
                  pdata.cache_key = cache_key;
                  //获取用户信息生成访问token
                  that.setData({ loading: true });
                  app.basePost(app.U({ c: 'login', a: 'index' }), pdata, function (res) { 
                    //console.log(res)
                    that.setData({ loading: false });
                    if (res.data.status == 'hidden') return app.Tips({ title: '抱歉，您已被禁止登录!' });
                    else if (res.data.status == 410) {
                      wx.clearStorage();
                      wx.hideLoading();
                      that.setErrorCount();
                      that.login();
                      return false;
                    } 
                    //取消登录提示
                    wx.hideLoading();
                    //关闭登录弹出窗口
                    that.setData({ iShidden: true, ErrorCount: 0 });
                    //保存token和记录登录状态
                    app.globalData.is_authentication = res.data.is_authentication;
                    // app.globalData.token = res.data.token;
                    app.globalData.isLog = true;
                    app.globalData.uid = res.data.uid; 
                    app.globalData.PAID = res.data.PAID; 
                    app.globalData.openId = res.data.openId;
                    //执行登录完成回调
                    that.triggerEvent('onLoadFun', app.globalData.uid);
                    //调用赠券接口
                    that.new_users_send_coupons(app.globalData.uid);
                    //清除定时器
                    if (that.data.cloneIner) clearInterval(that.data.cloneIner);
                    //监听登录状态
                    that.WatchIsLogin();
                  }, function (res) {
                    that.setData({ loading: false });
                    wx.hideLoading();
                    that.setErrorCount();
                    wx.clearStorage();
                    return app.Tips({ title: res.msg });
                  });
                } else {
                  wx.hideLoading();
                  wx.clearStorage();
                  that.setErrorCount();
                  return app.Tips({ title: '用户信息获取失败!' });
                }
              },
              fail: function () {
                wx.hideLoading();
                wx.clearStorage();
                that.setErrorCount();
                if (that.data.isAuto) that.login();
              },
            })
          }else{
            wx.hideLoading();
            wx.clearStorage();
            that.setErrorCount();
            if (that.data.isAuto) that.login();
            return false;
          }
        },
        fail:function(){
          wx.hideLoading();
          wx.clearStorage();
          that.setErrorCount();
          if (that.data.isAuto) that.login();
        }
      })
    },
    /**
     * 处理错误次数,防止死循环
     * 
    */
    setErrorCount: function () {
      if (!this.data.ErrorCount) this.data.ErrorCount = 1;
      else this.data.ErrorCount++;
      this.setData({ ErrorCount: this.data.ErrorCount });
    },

    new_users_send_coupons(uid){
      var that=this
      app.baseGet(app.U({
        c: 'Public_api',
        a: 'new_users_send_coupons',
        q: {
          uid:uid, 
        }
      }), function (res) {  
        if(res.data.new_users_send_coupons.code ==200){
          that.setData({
            window: res.data.new_users_send_coupons.info.length ? true : false,
            couponList:res.data.new_users_send_coupons.info 
          }) 
        } 
        if(res.data.new_users_send_coupons.code ==210){
          that.setData({
            redbaos: res.data.new_users_send_coupons.info ? true : false,
            redbaosInfo:res.data.new_users_send_coupons.info, 
          })  
         if(!that.c3){ 
          that.c3 = new $wuxCountDown({
            date: +(new Date) + 60000 * res.data.new_users_send_coupons.info.end_time,
            render(date) {
              const hours = this.leadingZeros(date.hours, 2) + ':'
              const min = this.leadingZeros(date.min, 2) + ':'
              const sec = this.leadingZeros(date.sec, 2)
              that.setData({
                c3: hours + min + sec,
              })
            },
            onEnd() {
              that.c3.stop()
            },
          })
         }else{
            that.c3.start()
            that.c3.update(+(new Date) + 60000 * res.data.new_users_send_coupons.info.end_time)
         }
          
        } 
        
      
        // that.setData({ couponList: res.data });
        // if (!res.data.length) that.setData({ window: false });
      });
    },
    /**
     * 获取错误次数,是否终止监听
     * 
    */
    getErrorCount: function () {
      return this.data.ErrorCount >= 10 ? true : false;
    }
  },
})