// pages/overlord/overlord.js
const app = getApp()
// var WxParse = require('../../../wxParse/wxParse.js');
const util = require('../../../utils/util.js');
import {
  $wuxCountDown
} from '../../../pages/dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c5: "00:00:00",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // sortSelected: function (e) {
  //   this.setData({
  //     sortSelected: e.currentTarget.dataset.sort,
  //     takeaway_platform: e.currentTarget.dataset.takeaway_platform, //平台选择
  //   })
  //   this.get_request();
  // },

  onLoad: function (e) {
    if (e.spid) app.globalData.spid = e.spid;
    if (e.scene) app.globalData.code = decodeURIComponent(e.scene);
    console.log(e)
    if (e.spid) app.globalData.spid = e.spid;
    var that = this;
    if (e.takeaway_platform) {
      this.setData({
        takeaway_platform: e.takeaway_platform
      })
    }
    if (!e.longitude && !e.latitude){
      that.getLocation()
      return;
    };
    this.setData({
      latitude: e.latitude,
      longitude: e.longitude,
    })
    that.get_request()

  },
  get_request(){
    var that=this
    app.baseGet(app.U({
      c: 'Merchant_api',
      a: 'recommend_merchant_lst',
      q: {
        lat: that.data.latitude,
        lon: that.data.longitude,
        store_condition: 0,
        takeaway_platform: that.data.takeaway_platform,
        is_bwc: 1
      }
    }), function (res) {
      console.log(res)
      if (res.data.recommend_merchant.code == 200) {
        console.log(res.data.recommend_merchant.bwc_status.is_start_robbing)
        if (res.data.recommend_merchant.bwc_status.is_start_robbing == 0) {
          that.c5 = new $wuxCountDown({
            date: +(new Date) + 60000 * res.data.recommend_merchant.bwc_status.start_robbing_time,
            render(date) {
              const hours = this.leadingZeros(date.hours, 2) + ':'
              const min = this.leadingZeros(date.min, 2) + ':'
              const sec = this.leadingZeros(date.sec, 2)
              that.setData({
                c5: hours + min + sec,
              })
            },
            onEnd() {
              that.c5.stop()
            },
          })
        }
        that.setData({
          is_merchant: true,
          recommend_merchant: res.data.recommend_merchant.data,
          bwc_status: res.data.recommend_merchant.bwc_status
        });

      }

    });

  },
  getLocation() {
    var that = this
    wx.getLocation({
      altitude: true,
      isHighAccuracy: true,
      type: 'gcj02',
      success(res) {

        const latitude = res.latitude
        const longitude = res.longitude

        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        that.get_request()
      }
    })

  },
  /**
   * 授权回调
   */
  onLoadFun: function (res) {
    console.log(app.globalData.uid)
    // this.getUserInfo();
    // if (!this.data.MyMenus.length) this.getMyMenus();
  },
  // get_request: function () {
  //   var that = this;
  //   wx.showLoading && wx.showLoading({
  //     title: '加载中',
  //     mask: true
  //   });
  //   app.baseGet(app.U({
  //       c: 'Merchant_api',
  //       a: 'recommend_merchant_lst',
  //       q: {
  //         lat: that.data.latitude,
  //         lon: that.data.longitude,
  //         cid: that.data.cid,
  //         page: 0,
  //         store_condition: that.data.store_condition,
  //         takeaway_platform: that.data.takeaway_platform,
  //         is_bwc:1
  //       }

  //     }),
  //     function (res) {
  //       console.log(res)
  //       wx.hideLoading()
  //       if (res.data.recommend_merchant.code == 200) {
  //         that.setData({
  //           is_merchant: true,
  //           is_jiazai: false,
  //           recommend_merchant: res.data.recommend_merchant.data,

  //         })
  //       } else {
  //         that.setData({
  //           is_merchant: false,
  //           is_jiazai: false,
  //         })
  //       }
  //     });

  // },
  onUnload() {

    if (this.data.recommend_merchant.bwc_status == 0) {
      this.c5.stop() //关闭定时
    }

  },
  onShareAppMessage: function () {

    return {
      title: "1元吃霸王餐",
      imageUrl: "../../img/overlords.png",
      path: '/pageB/pages/overlord/overlord?spid=' + app.globalData.uid+'&takeaway_platform='+this.data.takeaway_platform,
    };
  },
})