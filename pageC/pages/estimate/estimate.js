import * as echarts from '../../ec-canvas/echarts';
import {
  $wuxCalendar
} from '../../../pages/dist/index'
var Chart = null;
const app = getApp();
Page({
  data: {
    hiddenName: true,
    type: 0,
    page: 0,
    limit: 8,
    recordList: [],
    recordCount: 0,
    status: false,
    ec: {
      onInit: function (canvas, width, height) {
        chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart);
        return chart;
      },
      lazyLoad: true // 延迟加载
    },
    starttime: ['2019/8/01'],
    endtime: ['2020/01/01'],
  },
  onLoad: function (options) {
    var date = new Date();
    var todays = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    date.setTime(date.getTime());
    this.setData({
      'starttime[0]': todays,
      'endtime[0]': todays,
      
    })
    this.echartsComponnet = this.selectComponent('#mychart');
  },
  onReady() {},
  //初始化图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(Chart)
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function (Chart) {
    Chart.clear(); // 清除
    Chart.setOption(this.getOption()); //获取新数据
  },
  // 图表配置项
  getOption() {
    var self = this;
    var option = {
      title: { //标题
        // text: '折线图',
        left: 'center'
      },
      renderAsImage: true, //支持渲染为图片模式
      color: ["#FFC34F", "#FF6D60", "#44B2FB"], //图例图标颜色
      legend: {
        show: true,
        itemGap: 25, //每个图例间的间隔
        top: 30,
        x: 30, //水平安放位置,离容器左侧的距离  'left'
        z: 100,
        textStyle: {
          color: '#383838'
        },
        data: [ //图例具体内容
          {
            name: '订单收益', //图例名字
            textStyle: { //图例文本样式
              fontSize: 13,
              color: '#383838'
            },
            icon: 'roundRect' //图例项的 icon，可以是图片
          },

        ]
      },
      grid: { //网格
        left: 30,
        top: 100,
        containLabel: true, //grid 区域是否包含坐标轴的刻度标签
      },
      xAxis: { //横坐标
        type: 'category',
        name: '日期', //横坐标名称
        nameTextStyle: { //在name值存在下，设置name的样式
          color: 'red',
          fontStyle: 'normal'
        },
        nameLocation: 'end',
        splitLine: { //坐标轴在 grid 区域中的分隔线。
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
        boundaryGap: false, //1.true 数据点在2个刻度直接  2.fals 数据点在分割线上，即刻度值上
        data: this.data.riqi,
        axisLabel: {
          textStyle: {
            fontSize: 11,
            color: '#5D5D5D'
          }
        }
      },
      yAxis: { //纵坐标
        type: 'value',
        position: 'left',
        name: '总收益', //纵坐标名称
        nameTextStyle: { //在name值存在下，设置name的样式
          color: 'red',
          fontStyle: 'normal'
        },
        splitNumber: 5, //坐标轴的分割段数
        splitLine: { //坐标轴在 grid 区域中的分隔线。
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
      },
      series: [{
        name: '订单收益',
        type: 'line',
        data: this.data.shouyi,
        symbol: 'none',
        itemStyle: {
          normal: {
            lineStyle: {
              color: '#FFC34F'
            }
          }
        }
      }, ],
    }
    return option;
  },
  //自定义
  click: function (e) {
    this.setData({
      hiddenName: false,
      xingqi: 0,
      yue: 0,
      zidingyi: 1
    })
  },
  //自定义开始时间
  openCalendar1() {
    $wuxCalendar().open({
      value: this.data.starttime,
      minDate: '2019/8/1',
      
      onChange: (values, displayValues) => {
        console.log('onChange', values, displayValues)
        if (this.data.starttime[0] != displayValues[0]) { 
          this.setData({
            starttime: displayValues,
            page: 0, 
          })
          this.get_data_display();
        }

      },

    })
  },
  //自定义结束时间
  openCalendar2() {
    $wuxCalendar().open({
      value: this.data.endtime,
      minDate: '2019/8/1',
      
      onChange: (values, displayValues) => {
        console.log('onChange', values, displayValues)

        if (this.data.endtime[0] != displayValues[0]) { 
          this.setData({
            endtime: displayValues,
            page: 0, 
          })
          this.get_data_display();
        }

      },
    })

  },

  onLoadFun: function () {
    if (app.globalData.uid) {
      this.setData({
        uid: app.globalData.uid,
        isLogin: true,
      })
      var data = {
        openId: app.globalData.openId,
        uid: app.globalData.uid,
      }
      this.get_data_display();
    }

    // this.yesterdayCommission();
  },
  get_data_display: function (is_xiala = 0) {
    var that = this;
    var date = this.data.starttime[0] + ' 00:00:00 - ' + this.data.endtime[0] + ' 23:59:59' 
    var page = that.data.page;
    var limit = that.data.limit;
    var status = that.data.status;
    var recordList = that.data.recordList;
    var recordListNew = [];
    if (status == true) return;
    wx.showLoading && wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.baseGet(app.U({
        c: 'Distribution_api',
        a: 'get_data_display',
        q: {
          uid: that.data.uid,
          date: date || '',
          is_list: 1,
          page: page,
          limit: limit,
        }
      }),
      function (res) {
        console.log(res)

        var orderlist = res.data.result.orderlist;
        wx.hideLoading()
        if (res.data.status == 200) {
          if (is_xiala == 1) {
            that.setData({
              data_display: res.data.result.data_display,
              orderlist: that.data.orderlist.concat(orderlist),
              page: that.data.page + orderlist.length,
              riqi: that.data.riqi.concat(res.data.result.riqi),
              shouyi: that.data.shouyi.concat(res.data.result.shouyi),
            })
          } else {
            that.setData({
              data_display: res.data.result.data_display,
              orderlist: orderlist,
              page: that.data.page + orderlist.length,
              riqi: res.data.result.riqi,
              shouyi: res.data.result.shouyi,
            })
          }
          //如果是第一次绘制
          if (!Chart) {
            that.init_echarts(); //初始化图表
          } else {
            that.setOption(Chart); //更新数据
          }
        }
      });
  },
  //近7天
  week: function (e) {

    var week = new Date();
    week.setTime(week.getTime() - 7 * 24 * 60 * 60 * 1000);
    var weeks = week.getFullYear() + "/" + (week.getMonth() + 1) + "/" + week.getDate();
    var today = new Date();
    today.setTime(today.getTime());
    var todays = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
    console.log(weeks)
    this.setData({
      'starttime[0]': weeks,
      'endtime[0]': todays,
      page: 0,
      xingqi: 1,
      yue: 0,
      zidingyi: 0,
      hiddenName: true
    })
    this.get_data_display()
  },
  //近30天
  month: function () {
    var month = new Date();
    month.setTime(month.getTime() - 30 * 24 * 60 * 60 * 1000);
    var months = month.getFullYear() + "/" + (month.getMonth() + 1) + "/" + month.getDate();
    var today = new Date();
    today.setTime(today.getTime());
    var todays = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
    this.setData({
      'starttime[0]': months,
      'endtime[0]': todays,
      page: 0,
      xingqi: 0,
      yue: 1,
      zidingyi: 0,
      hiddenName: true
    })


    this.get_data_display()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    this.get_data_display(1);
  },
});