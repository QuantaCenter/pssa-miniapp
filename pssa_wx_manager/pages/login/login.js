// pages/login/login.js
var username = '';
var password = '';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loging: false,
    user_error: false,
    pass_error: false,
    state: 'teacher',
    username: '',
    password: '',
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // //console.log(options)
   // console.log(app)
    wx.getStorage({
      key: 'token',
      success: function(res) {
        if(res) {
          wx.reLaunch({
            url: '../index/index',
          })
        }
      },
    })
  },

  getUsername: function (e) {
    this.setData({
      username: e.detail.value
    })
  
    // console.log(username);
  },
  getPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
    // console.log(password);
  },
  login: function () {
    var that = this;
    let {username, password} = this.data
    // console.log("login");
    this.setData({
      loging: true,
    })
    wx.showLoading({
      title: '登录中',
    })
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.post_url+'/index/login',
            method: "POST",
            dataType: 'json',
            header: { 
              'content-type': 'application/json',
              'Authorization': 'Bearer login'
            },
            data: {
              "data": {
                "number": username,
                "password": password,
              }
            },
            success: function (res) {
              let {code, msg, data} = res.data
              wx.hideLoading()
              if(code != 0){
                wx.showToast({
                  title: '工号或密码错误',
                  icon: 'none'
                })
                that.setData({
                  loging: false
                })
                return
              }

              app.globalData.rank = data.role
              app.globalData.token = data.token
              wx.setStorageSync('token', data.token)
              wx.setStorageSync('rank', data.role)
              wx.reLaunch({
                 url: '../index/index',
               })
              
        
            },
            fail: () => {
              this.setData({
                loging: false
              })
              wx.hideLoading({
                success: (res) => {},
              })
              wx.showToast({
                title: '服务器出错',
                icon:'none'
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });


  }
})