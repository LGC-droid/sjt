import {
  $wuxSelect,
  $wuxCalendar,
} from '../../../pages/dist/index';
const app = getApp();
Page({
  data: {
    memo:0,
    title1: ['全部会员'],
    title2: ['全部'],
    starttime: ['2019/8/1'],
    endtime: ['2020/01/01'],
    scrollTop: 0,
    page: 0,
    limit: 8,
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
            var memo = 1
          } else if (options[index] == '间接会员') {
            var memo = 2
          } else if (options[index] == '全部会员') {
            var memo = 0
          }
          this.setData({
            title1: options[index],
            memo: memo,
            page: 0
          }) 
          this.getRecordOrderList()
        }
      },
    })
  },
  // onClick2() {
  //   $wuxSelect('#wux-select1').open({
  //     value: this.data.value,
  //     options: [
  //       '全部',
  //       '今天',
  //       '昨天',
  //     ],
  //     onConfirm: (value, index, options) => {
  //       console.log('onConfirm', value, index, options)
  //       if (options[index] == '全部') {
  //         var status = 0
  //       } else if (options[index] == '今天') {
  //         var status = 1
  //       } else if (options[index] == '昨天') {
  //         var status = -1
  //       }
  //       if (index !== -1) {
  //         this.setData({
  //           title2: options[index],
  //           status: status,
  //           page: 8
  //         })
  //         var date = this.data.starttime[0] + ' 00:00:00 - ' + this.data.endtime[0] + ' 23:59:59'
  //         this.getRecordOrderList()
  //       }
  //     },
  //   })
  // },
  openCalendar1() {
    $wuxCalendar().open({
      value: this.data.starttime,
      minDate: '2019/8/1',
      maxDate: this.data.maxDate,
      onChange: (values, displayValues) => {
        console.log('onChange', values, displayValues)
        if (this.data.starttime[0] != displayValues[0]) { 
          console.log(displayValues)
          this.setData({
            starttime: displayValues,
            page: 0, 
          })
          this.getRecordOrderList();
        }
        
      },
    })
  },
  openCalendar2() {
    $wuxCalendar().open({
      value: this.data.endtime,
      minDate: '2019/11/31',
      maxDate: this.data.maxDate,
      onChange: (values, displayValues) => {
        if (this.data.endtime[0] != displayValues[0]) { 
          this.setData({
            endtime: displayValues,
            page: 0, 
          })
          this.getRecordOrderList()
        }
      },
    })
  },
  onLoad: function (options) {
    var date = new Date();
    var todays = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    date.setTime(date.getTime());
    this.setData({
      'starttime[0]': todays,
      'endtime[0]': todays,
      maxDate:todays
    })
  },
  onLoadFun: function () {
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        isLogin: true,
      })

      this.getRecordOrderList();
    }
  },
  getRecordOrderList: function (is_xiala = 0 ) {
    var that = this;
    var page = that.data.page;
    var memo =that.data.memo;
    var limit = that.data.limit;
    var date = this.data.starttime[0] + ' 00:00:00 - ' + this.data.endtime[0] + ' 23:59:59'
    // var status = that.data.status;
    // var recordList = that.data.recordList;
    // var recordListNew = [];
    // if (status == true) return;
    app.baseGet(app.U({
      c: 'Distribution_api',
      a: 'get_record_order_list2',
      q: {
        page: page,
        limit: limit,
        uid: that.data.uid,
        date: date || '',
        memo:memo
      }
    }), function (res) {
      var list = res.data.list;
      console.log(res)
      if (is_xiala == 1) {
        that.setData({
          list: that.data.list.concat(list),
          danshu: that.data.page + list.length,
          page: that.data.page + list.length,
        })
      } else {
        that.setData({
          list: res.data.list,
          danshu: that.data.page + list.length,
          page: that.data.page + list.length,
        })
      }
      
      console.log(page)
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    this.getRecordOrderList(1);
  },
  
})