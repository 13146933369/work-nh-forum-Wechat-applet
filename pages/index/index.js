//index.js
//获取应用实例
const app = getApp()
var utils = require("../../utils/util.js")

Page({
  data: {
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    webUrl: "",
    hasUserInfo: false,
    phoneInfo : false,
    hasWeb : false,

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad(option) {
    var id = wx.getStorageSync("id")
    console.log(id)
    var isSignin = wx.getStorageSync("isSignin")
    var ukey = wx.getStorageSync("ukey")
    if (id ==""){
      this.setData({
        webUrl: "https://nhtiny.mtadservice.com/wxsp/index.html#/" + "?id=" + id + "&isSignin=" + isSignin + "&key=" + ukey
      })
    }else{
      this.setData({
        webUrl: "https://nhtiny.mtadservice.com/wxsp/index.html#/microFourm/microFourmDetails" + "?id=" + id + "&isSignin=" + isSignin + "&key=" + ukey
      })
    }

    
    console.log(this.data.webUrl)
  },
  onShow(){
    
   
  },
  getUserInfo: function (e) {
    var userInfo = e.detail.userInfo
    var isMobileState = wx.getStorageSync("isMobile")
    if(userInfo == undefined || userInfo == null || userInfo=={} || userInfo ==""){
      this.setData({
        hasUserInfo: true
      })
    }else{
      this.setData({
        hasUserInfo: true
      })
      console.log("向服务端发送数据---")
      var ukey = wx.getStorageSync("ukey")
      utils.sendUserInfo(ukey,userInfo) 
    }
    if (!isMobileState){
      this.showDialogPhone();
    }
  },
  //获取用户手机号的按钮没有显示 ， 用户不点机自然不会回调
  getPhoneNumber: function (e) {
    var key = wx.getStorageSync("ukey")
    console.log(key)
    if (e.detail.encryptedData!=undefined){
      var iv = e.detail.iv
      var encryptedData = e.detail.encryptedData
      console.log(1-iv);
      console.log(2 - encryptedData);
      //判断是否session是否过期
      wx.checkSession({
        success: function () {
          //发送请求到后台数据库
         
          utils.sendUserPhone(iv, encryptedData,key,function(){
            this.setData({
              phoneInfo: true
            })
          });
        },
        fail: function () {
          // session_key 已经失效，需要重新执行登录流程
          utils.wxLogin(function () {
            utils.sendUserPhone(iv, encryptedData,key,function(){
              this.setData({
                phoneInfo: true
              })
            });
          })
        }
      })
    }else{
      this.setData({
        phoneInfo: true
      })
    }
  },
  getMessage(e) {
    //分享参数赋值
    let that = this;
    console.log(e);
    let shareUrl = e.detail.data[e.detail.data.length - 1];
    that.shareUrl = JSON.parse(shareUrl);

  },


  onShareAppMessage: function (options) {
    let that = this;
    console.log(that.shareUrl.id)
    return {
      title: that.shareUrl.title,
      path: '/pages/logs/logs?id=' + that.shareUrl.id,
      imageUrl: that.shareUrl.imgageUrl,
      success(e) {
        wx.showShareMenu({
          withShareTicket: true
        })
      },
      fail(e) {},
      complete() {}
    }
  },
  // ===============================model setting
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
    var isInfo = wx.getStorageSync("isInfo")
    var isMobileState = wx.getStorageSync("isMobile")
    console.log(isMobileState)
    
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
    this.dialogPhone = this.selectComponent("#dialogPhone");

    if(isInfo == false){
      //没有用户信息显示获取用户信息
      this.dialog.showDialog();
      return
    }else{
      //有用户信息不显示用户信息
      this.setData({
        hasUserInfo: true
      })
    }
    //显示手机号对话框
    if (isMobileState==false){
      this.showDialogPhone();
      return
    }else{
      this.setData({
        phoneInfo: true
      })
    }
  },

  showDialog() {
    this.dialog.showDialog();
  },

  //取消事件
  _cancelEvent() {
    console.log('你点击了取消');
    this.dialog.hideDialog();
  },
  
  //点击确定登录按钮
  _confirmEvent() {
    console.log("点登陆")
    var msg = wx.getStorageSync("isInfo")
    if (msg==false){
      this.dialog.hideDialog();
      this.setData({
        hasUserInfo: true
      })

    }
    // if (this.data.hasUserInfo && (msg==true)) {
    //   console.log("444444444444444444444")

    //   var that = this
    //   setTimeout(function(){
    //     that.showDialogPhone();
    //   },1000)
    //   return
    // } else {
    //   this.setData({
    //     phoneInfo: true
    //   })
    // }
  },
  
  //===============  phone ====================
  showDialogPhone() {
    this.dialogPhone.showDialog();
  },
  //取消事件
  _cancelEventPhone() {
    console.log('你点击了取消');
    this.dialogPhone.hideDialog();
  },
  //确认事件
  _confirmEventPhone() {
    console.log('你点击了确定');
    this.dialogPhone.hideDialog();
    this.setData({
      phoneInfo: true
    })
  },
  openSettingMap(){
    var that = this
    wx.openSetting({
      success: function (data) {
        console.log(data.authSetting["scope.userLocation"])
        if (data.authSetting["scope.userLocation"] === true) {
          //授权成功之后，再调用chooseLocation选择地方
          that.dialogMap.hideDialog();
          // utils.wxGetLocation();
        } else {
          that.dialogMap.hideDialog();
        }
      }
    })
  },
  showDialogMap() {
    this.dialogMap.showDialog();
  },
  //取消事件
  _cancelEventMap() {
    console.log('你点击了取消');
    this.dialogMap.hideDialog();
  },
  //确认事件
  _confirmEventMap() {
    console.log('你点击了确定');
    this.dialogMap.hideDialog();
  }


})
