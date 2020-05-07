// pages/promoter-list/index.js
import {
  $wuxSelect,
} from '../../../pages/dist/index';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '合伙人列表',
      'color': true,
      'class': '0'
    },
    total: 0,
    totalLevel: 0,
    teamCount: 0,
    page: 0,
    limit: 20,
    keyword: '',
    sort: '',
    grade: 0,
    status: false,
    recordList: [],
    type: 1,
    jihuo: 0,
    title1: ['全部会员'],
    title2: ['全部'],
    scrollTop: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onLoadFun: function () {
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        isLogin: true,
      })
      console.log(app.globalData.uid)
      this.userSpreadNewList();
    }

    // this.yesterdayCommission();
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

  },
  // setSort: function (e) {
  //   var that = this;
  //   that.setData({
  //     sort: e.currentTarget.dataset.sort,
  //     page: 0,
  //     limit: 20,
  //     status: false,
  //     recordList: [],
  //   });
  //   that.userSpreadNewList();
  // },
  setKeyword: function (e) {
    this.setData({
      keyword: e.detail.value
    });
  },
  setRecordList: function () {
    this.setData({
      page: 0,
      limit: 20,
      status: false,
      recordList: [],
    });
    this.userSpreadNewList();
  },
  // setType: function (e) {
  //   if (this.data.grade != e.currentTarget.dataset.grade) {
  //     this.setData({
  //       grade: e.currentTarget.dataset.grade,
  //       page: 0,
  //       limit: 20,
  //       keyword: '',
  //       sort: '',
  //       status: false,
  //       recordList: [],
  //     });
  //     this.userSpreadNewList();
  //   }
  // },
  userSpreadNewList: function () {
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    var page = that.data.page;
    var limit = that.data.limit;
    var grade = that.data.grade;
    var jihuo = that.data.jihuo;
    // var status = that.data.status;
    var keyword = that.data.keyword;
    // var sort = that.data.sort;
    // var recordList = that.data.recordList;
    // var recordListNew = [];
    // if (status == true) return;
    
    app.baseGet(app.U({
      c: 'Distribution_api',
      a: 'user_spread_new_list2',
      q: {
        uid: that.data.uid,
        page: page,
        limit: limit,
        keyword: keyword,
        // sort: sort,
        grade: grade,
        jihuo: jihuo
      }
    }), function (res) {
      wx.hideLoading()
      console.log(res)
      that.setData({
        lists:res.data.list
      })
      // var len = res.data.list.length;
      // var recordListData = res.data.list;
      // recordListNew = recordList.concat(recordListData);
      // that.setData({
      //   total: res.data.total,
      //   totalLevel: res.data.totalLevel,
      //   teamCount: Number(res.data.total) + Number(res.data.totalLevel),
      //   status: limit > len,
      //   differ_sum: res.data.differ_sum,
      //   page: limit + page,
      //   recordList: recordListNew
      // });
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
    this.userSpreadNewList();
  },
  onClick1() {
    $wuxSelect('#wux-select1').open({
      value: this.data.value,
      options: [
        // '审批退款申请',
        '全部会员',
        '直属会员',
        '间接会员',
      ],
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          if (options[index] == '直属会员') {
            var grade = 1
          } else if (options[index] == '间接会员') {
            var grade = 2
          } else if (options[index] == '全部会员') {
            var grade = 3
          }
          this.setData({
            title1: options[index],
            grade: grade,
            page: 0
          })
          this.userSpreadNewList()
        }
      },
    })
  },
  onClick2() {
    $wuxSelect('#wux-select1').open({
      value: this.data.value,
      options: [
        '全部',
        '已激活',
        '未激活',
      ],
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (options[index] == '全部') {
          var jihuo = 0
        } else if (options[index] == '未激活') {
          var jihuo = 1
        } else if (options[index] == '已激活') {
          var jihuo = 2
        }
        if (index !== -1) {
          this.setData({
            title2: options[index],
            jihuo: jihuo,
            page: 0
          })
          this.userSpreadNewList()
        }
      },
    })
  },


})