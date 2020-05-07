


//app.js

//请配置请求url
//请修改开发者工具中【详情】->【AppID】改为自己的Appid
//请前往后台【小程序】->【小程序配置】填写自己的 appId and AppSecret 
 const URL = 'https://www.dingdingfan.cn';
//const URL = 'https://by.dingdingfan.cn';
 //const URL = 'http://www.sjt-xcx.com';
const util = require('utils/util.js');

App({
 
  onLaunch: function (option) { 
    this.autoUpdate()
    if (URL == '') {
      console.error("请配置请求url\n请修改开发者工具中【详情】->【AppID】改为自己的Appid\n请前往后台【小程序】->【小程序配置】填写自己的 appId and AppSecret");
      return false;
    }
    //console.log(option)
    // if (option.query.hasOwnProperty('scene') && option.scene == 1047) this.globalData.code = option.query.scene;
    // if (option.query.hasOwnProperty('scene') && option.scene == 1001) this.globalData.spid = option.query.scene;
   // this.getMyMenus();
    // 获取导航高度；
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 97;
      }, fail(err) {
        console.log(err);
      }
    })
  },
  autoUpdate: function () {
    let _this = this
    // 获取小程序更新机制的兼容，由于更新的功能基础库要1.9.90以上版本才支持，所以此处要做低版本的兼容处理
    if (wx.canIUse('getUpdateManager')) {
      // wx.getUpdateManager接口，可以获知是否有新版本的小程序、新版本是否下载好以及应用新版本的能力，会返回一个UpdateManager实例
      const updateManager = wx.getUpdateManager()
      // 检查小程序是否有新版本发布，onCheckForUpdate：当小程序向后台请求完新版本信息，会通知这个版本告知检查结果
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          // 检测到新版本，需要更新，给出提示
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，是否下载新版本并重启小程序',
            success: function (res) {
              if (res.confirm) {
                // 用户确定更新小程序，小程序下载和更新静默进行
                _this.downLoadAndUpdate(updateManager)
              } else if (res.cancel) {
                // 若用户点击了取消按钮，二次弹窗，强制更新，如果用户选择取消后不需要进行任何操作，则以下内容可忽略
                wx.showModal({
                  title: '提示',
                  content: '本次版本更新涉及到新功能的添加，旧版本将无法正常使用',
                  showCancel: false, // 隐藏取消按钮
                  confirmText: '确认更新', // 只保留更新按钮
                  success: function (res) {
                    if (res.confirm) {
                      // 下载新版本，重启应用
                      _this.downLoadAndUpdate(updateManager)
                    }
                  }
                })
              }
            }
          })
        }
      })
    } else {
      // 在最新版本客户端上体验小程序
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试',
      })
    }
  },
  // 下载小程序最新版本并重启
  downLoadAndUpdate: function (updateManager) {
    wx.showLoading()
    // 静默下载更新小程序新版本，onUpdateReady：当新版本下载完成回调
    updateManager.onUpdateReady(function () {
      wx.hideLoading()
      // applyUpdate：强制当前小程序应用上新版本并重启
      updateManager.applyUpdate()
    })
    // onUpdateFailed：当新版本下载失败回调
    updateManager.onUpdateFailed(function () {
      // 下载新版本失败
      wx.showModal({
        title: '已有新版本',
        content: '新版本已经上线了，请删除当前小程序，重新搜索打开',
      })
    })
  } ,
  globalData: {
    navHeight: 0,
    routineStyle: '#ffffff',
    openPages: '',
    spid: 0,
    PAID: '',
    code: 0,
    urlImages: '',
    url: URL,
    token: '',
    isLog: false,
    MyMenus: [],
    header: {
      'content-type': 'application/json',
      'token': ''
    }
  },
  /**
   * 
   * 获取个人中心图标
  */
  // getMyMenus: function () {
  //   var that = this;
  //   if (that.globalData.MyMenus.legnth) return;
  //   that.baseGet(that.U({ c: 'public_api', a: 'get_my_naviga' }, that.globalData.url), function (res) {
  //     that.globalData.MyMenus = res.data.routine_my_menus;
  //   });
  // },
  /*
  * POST 访问快捷方法
  * @param string | object url 访问地址
  * @param callable successCallback 成功执行函数
  * @param callable errorCallback 失败执行函数
  * @param object header 访问header头
  */
  basePost: function (url, data, successCallback, errorCallback, header) {
    if (header == undefined) header = this.globalData.header;
    header['token'] = this.globalData.token;
    util.basePost(url, data, successCallback, errorCallback, header);
  },
  /*
  * GET 访问快捷方法
  * @param string | object url 访问地址
  * @param callable successCallback 成功执行函数
  * @param callable errorCallback 失败执行函数
  * @param isMsg 错误信息提醒 默认提醒
  * @param object header 访问header头
  */
  baseGet: function (url, successCallback, errorCallback, isMsg, header) {
    if (header == undefined) header = this.globalData.header;
    header['token'] = this.globalData.token;
    util.baseGet(url, successCallback, errorCallback, isMsg, header);
  },
  /*
  * 信息提示 + 跳转
  * @param object opt {title:'提示语',icon:''} | url
  * @param object to_url 跳转url 有5种跳转方式 {tab:1-5,url:跳转地址}
  */
  Tips: function (opt, to_url) {
    return util.Tips(opt, to_url);
  },
  /*
  * 访问Url拼接
  * @param object opt {c:'控制器',a:'方法',q:{get参数},p:{parma参数}}
  * @param url 接口访问地址
  * @return string
  */
  U: function (opt, url) {
    return util.U(opt, url);
  },
  /**
   * 快捷调取助手函数
  */
  help: function () {
    return util.$h;
  },
  /*
  * 合并数组
  * @param array list 请求返回数据
  * @param array sp 原始数组
  * @return array
  */
  SplitArray: function (list, sp) { return util.SplitArray(list, sp) },
})