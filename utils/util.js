const common = require("./common.js")

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')

}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//用户登录
function wxLogin(func){
  wx.login({
    success:function(res){
      console.log(res.code)
      if(res.code){
        wx.request({
          url: common.baseUrl + common.loginPath,
          data : {code:res.code},
          header:{
            'content-type': 'application/x-www-form-urlencoded'
          },
          method : 'POST',
          success : function(res){
            console.log(res)
            if(res.data.status == '2110'){
              wx.setStorageSync('isInfo', res.data.data.isInfo);
              wx.setStorageSync('isMobile', res.data.data.isMobile);    
              wx.setStorageSync('ukey',res.data.data.key);
              wx.setStorageSync('isSignin', res.data.data.isSignin);
              if(func){
                func();
              }
              console.log("-----登录成功！------")
              console.log(res.data)
            }else{
              console.log(res.data.status)
            }
          }
        })
      }
    },
    fail:function(){
      console.log("网络错误！")
    },
    complete:function(){}
  })
}
//获取用户信息
function wxGetUserInfo(app){
  //只要用户默认授权过 就可以直接获取用户信息
  wx.getSetting({
    success: res => {
      console.log(res.authSetting['scope.userInfo'])
      console.log("--- app 环境下进入获取用户信息接口 ---")
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            app.globalData.userInfo = res.userInfo
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (app.userInfoReadyCallback) {
              app.userInfoReadyCallback(res)
            }
          }
        })
      }
    }
  })
}


//获取用户的地理位置
function wxGetLocation(ukey, latitude ,longitude){
  wx.getLocation({
    type : 'wgs84',
    success: function(res) {
      console.log("============ 获取用户的位置信息 ===========")
      var latitude = res.latitude//纬度，浮点数，范围为-90~90，负数表示南纬
      var longitude = res.longitude//经度，浮点数，范围为-180~180，负数表示西经
      //发送请求 
      wx.request({
        url: common.baseUrl + common.getLocationPath,
        data: { 
          ukey : ukey,
          latitude: latitude,
          longitude: longitude
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
        }
      })
    },
  })
}

//登录发送用户信息
function sendUserInfo(ukey,info){
  wx.request({
    url: common.baseUrl + common.loginInfo,
    method : 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data:{
      key : ukey,
      nickname : info.nickName,
      headimgurl: info.avatarUrl,
      sex : info.gender,
      country: info.country,
      province: info.province,
      city : info.city
    },
    success: function (res) {
      // console.log(res.data)
    }
  })
}
//发送用户手机号（数据加密）
function sendUserPhone(iv, encryptedData,key,fun){
  wx.request({
    url: common.baseUrl + common.getPhonePath,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      key: key,
      iv : iv,
      encryptedData : encryptedData,
    },
    success: function (res) {
      fun()
    }
  })
}

module.exports = {
  formatTime: formatTime,
  wxLogin : wxLogin,
  wxGetUserInfo: wxGetUserInfo,
  sendUserInfo: sendUserInfo,
  sendUserPhone: sendUserPhone,
  wxGetLocation, wxGetLocation
}
