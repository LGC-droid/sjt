var app = getApp();
Component({
  properties: {
    showRule: {
      type: Object,
      value: {
        modalName: '',
        imgUrl: '',
      },
    },
  },
  data: {},
  attached: function () {},
  methods: {
    hideRule(e) {
      this.setData({
        ['showRule.modalName']: null
      })
    },

    //点击保存图片
    savePosterPath() {
      let that = this,
        url = this.data.showRule.imgUrl
      //若二维码未加载完毕，加个动画提高用户体验
      wx.showToast({
        icon: 'loading',
        title: '正在保存图片',
        duration: 1000
      })
      //判断用户是否授权"保存到相册"
      wx.getSetting({
        success(res) {
          //没有权限，发起授权
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() { //用户允许授权，保存图片到相册
                that.savePhoto(url);
              },
              fail() { //用户点击拒绝授权，跳转到设置页，引导用户授权
                wx.openSetting({
                  success() {
                    wx.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success() {
                        that.savePhoto(url);
                      }
                    })
                  }
                })
              }
            })
          } else { //用户已授权，保存到相册 
            that.savePhoto(url)
          }
        }
      })
    },
    //保存图片到相册，提示保存成功
    savePhoto(url) {
      var that = this
      wx.downloadFile({
        url: url,
        success: function (res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                title: '保存成功',
                icon: "success",
                duration: 1000
              })
            }
          })
        }
      })
    }
  },

})