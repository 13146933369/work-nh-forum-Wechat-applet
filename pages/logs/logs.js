//logs.js
const utils = require('../../utils/util.js')

Page({
  data: {
    logs: [],
  },
  onLoad: function (query) {
    wx.setStorageSync("id",query.id)
    utils.wxLogin(function () {
      wx.redirectTo({
        url: '/pages/index/index',
      })
      
    });
  }
})
