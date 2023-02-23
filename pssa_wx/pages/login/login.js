// pages/login/login.js

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
    password: ''
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
    // console.log(options)
    // console.log(app)
    wx.clearStorage('token')
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res) {
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
    this.setData({
      loging: true,
    })
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          // console.log(res.code)
          wx.showLoading({
            title: '登录中'
          })
          wx.request({
            url: app.globalData.post_url+'/index/login',
            method: "POST",
            dataType: 'json',
            header: { 'content-type': 'application/json', 'Authorization': 'Bearer login' },
            data: {
              // "token": 'login',
              // "type": 'A001',
              // "data": {
              //   "username": username,
              //   "password": password,
              //   "code": res.code
              // }\
              data: {
                number: username,
                password: password
              }
            },
            success: function (res) {
              console.log(res)
              let {data, code} = res.data
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


              // if (res.data.code == 200) {
              //   app.globalData.token = res.data.msg
              //   wx.setStorageSync('token', res.data.msg)
              //   //console.log(wx.getStorageSync('token'))
              //   wx.reLaunch({
              //     url: '../index/index',
              //   })
              // } else if (res.data.code === 401) {
              //   wx.removeStorage({
              //     key: 'token',
              //     success: function (res) {
              //       wx.redirectTo({
              //         url: '../state/state',
              //       })
              //     },
              //   })
              // } else if (res.data.code == 404) {
              //   that.setData({
              //     loging: false,
              //     user_error: true
              //   })
              //   setTimeout(
              //     function () {
              //       that.setData({
              //         user_error: false
              //       })
              //     }, 2000)
              // } else if (res.data.code == 405) {
              //   that.setData({
              //     loging: false,
              //     pass_error: true
              //   })
              //   setTimeout(
              //     function () {
              //       that.setData({
              //         pass_error: false
              //       })
              //     }, 2000)

              // } else {
              //   wx.showToast({
              //     title: res.data.msg,
              //     duration: 2000,
              //     icon: 'none'
              //   })
              //   that.setData({
              //     loging: false,
              //   })
              // }
              wx.hideLoading()
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
    // wx.requestSubscribeMessage({
    //   tmplIds: ['QL0-3Nd_kQYKksx_XEkRG-UB7HwMo_P-FKN0iwRZtn4'],
    //   success(res) {
    //     wx.login({
    //       success: function (res) {
    //         if (res.code) {
    //           //发起网络请求
    //           // console.log(res.code)
    //           wx.showLoading({
    //             title: '登录中'
    //           })
    //           wx.request({
    //             url: app.globalData.post_url,
    //             method: "POST",
    //             dataType: 'json',
    //             header: { 'content-type': 'application/json' },
    //             data: {
    //               "token": 'login',
    //               "type": 'A001',
    //               "data": {
    //                 "username": username,
    //                 "password": password,
    //                 "code": res.code
    //               }
    //             },
    //             success: function (res) {
    //               // console.log(res)
    //               if (res.data.code == 200) {
    //                 app.globalData.token = res.data.msg
    //                 wx.setStorageSync('token', res.data.msg)
    //                 wx.reLaunch({
    //                   url: '../index/index',
    //                 })
    //               } else if (res.data.code === 401) {
    //                 wx.removeStorage({
    //                   key: 'token',
    //                   success: function (res) {
    //                     wx.redirectTo({
    //                       url: '../state/state',
    //                     })
    //                   },
    //                 })
    //               } else if (res.data.code == 404) {
    //                 that.setData({
    //                   loging: false,
    //                   user_error: true
    //                 })
    //                 setTimeout(
    //                   function () {
    //                     that.setData({
    //                       user_error: false
    //                     })
    //                   }, 2000)
    //               } else if (res.data.code == 405) {
    //                 that.setData({
    //                   loging: false,
    //                   pass_error: true
    //                 })
    //                 setTimeout(
    //                   function () {
    //                     that.setData({
    //                       pass_error: false
    //                     })
    //                   }, 2000)

    //               } else {
    //                 wx.showToast({
    //                   title: res.data.msg,
    //                   duration: 2000,
    //                   icon: 'none'
    //                 })
    //                 that.setData({
    //                   loging: false,
    //                 })
    //               }
    //             }
    //           })
    //         } else {
    //           console.log('获取用户登录态失败！' + res.errMsg)
    //         }
    //       }
    //     });
    //   }
    // })

    
  }
})