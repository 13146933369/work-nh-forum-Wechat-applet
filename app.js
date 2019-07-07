//app.js
var utils = require("./utils/util.js")
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //用户登录  登录成功获取用户信息
  },
  globalData: {
    userInfo: null,
  }
})