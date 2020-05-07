// pages/distribution-posters/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '分销海报'
    },
    imgUrls: [],
    indicatorDots: false,
    circular: false,
    autoplay: false,
    interval: 3000,
    duration: 500,
    swiperIndex: 0,
    spreadList: [],
    userInfo: {},
    poster: '',
    type:'index',
    url:'pages/index/index'
  },
  onLoadFun: function () {
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        isLogin: true, 
      })
      if(this.data.type=='index'){
        this.setData({
          scene:app.globalData.uid
        })
      }
      var data = {
        openId: app.globalData.openId,
        uid: app.globalData.uid,
      }
      this.getUserInfo(data);

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.info){
        var info  = JSON.parse(options.info)
        var scene = info.spid+'-'+info.sid+'-'+info.tid+'-'+info.takeaway_platform
        if(info.type=='merchant_details' || info.type=='overlord_details'){ 
          //scene :spid-sid-tid-takeaway_platform
          this.setData({
            scene:scene,
            type:info.type,
            url:info.url
          })
        }  
    }   
      // console.log(options.url)
      // var url ='/pages/index/index'
      // if(options.url){
      //   url =options.url
      // }
      // this.setData({
      //   url:url
      // })
  },
  bindchange(e) {
    var spreadList = this.data.spreadList;
    this.setData({
      swiperIndex: e.detail.current,
      poster: spreadList[e.detail.current].poster,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
        openId: data.openId,
        is_distribution: 0
      }
    }), function (res) {
     // console.log(res)
      // wx.hideLoading()
      if (res.data.status == 200) {
        that.setData({
          userInfo: res.data.result.user_info
        }); 
        var data = {
          uname: res.data.result.user_info.nickname,
          uid: res.data.result.user_info.id,
        }

        that.userSpreadBannerList(data);
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.userSpreadBannerList();
  },
  savePosterPath: function () {
    var that = this;
    wx.downloadFile({
      url: that.data.poster,
      success(resFile) {
        console.log(resFile.tempFilePath)
        if (resFile.statusCode === 200) {
          wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.writePhotosAlbum']) {
                wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success() {
                    wx.saveImageToPhotosAlbum({
                      filePath: resFile.tempFilePath,
                      success: function (res) {
                        wx.showToast({
                          title: '保存成功',
                          icon: 'success',
                          duration: 1500,
                        })
                      },
                      fail: function (res) {
                        wx.showToast({
                          title: res.errMsg,
                          icon: 'none',
                          duration: 1500,
                        })
                      },
                      complete: function (res) {},
                    })
                  }
                })
              } else {
                wx.saveImageToPhotosAlbum({
                  filePath: resFile.tempFilePath,
                  success: function (res) {
                    wx.showToast({
                      title: '保存成功',
                      icon: 'success',
                      duration: 1500,
                    })
                  },
                  fail: function (res) {
                    wx.showToast({
                      title: res.errMsg,
                      icon: 'none',
                      duration: 1500,
                    })
                  },
                  complete: function (res) {},
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: resFile.errMsg,
            icon: 'none',
            duration: 1000,
            mask: true,
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 1000,
          mask: true,
        })
      }
    })
  },
  userSpreadBannerList: function (data) { 
    var that = this;
    // wx.showLoading({
    //   title: '获取中',
    //   mask: true,
    // })
    app.baseGet(app.U({
      c: 'Distribution_api',
      a: 'user_spread_banner_list',
      q: {
        pid: data.uid,
        uname: data.uname,
        url:that.data.url,
        scene:that.data.scene
      }
    }), function (res) {
      console.log(res);

      wx.hideLoading();
      that.setData({
        spreadList: res.data,
        poster: res.data[0].poster
      });
    }, function (res) {
      wx.hideLoading();
    });
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
    return {
      title: this.data.userInfo.nickname + '-邀请您使用叮叮饭粒',
      // imageUrl: this.data.spreadList[0],
      imageUrl: "../../../imgs/share.png",
      path: '/'+this.data.url+'?scene=' + this.data.scene,
    };
  }
})