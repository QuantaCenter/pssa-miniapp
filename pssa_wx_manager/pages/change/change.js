var old_pass = '';
var new_pass1 = '';
var new_pass2 = '';
var app = getApp();
// pages/change/change.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cahnged: false,
    old_error: false,
    new_error: false,
    old_pass: '',
    new_pass1: '',
    new_pass2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.onLoad();
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  oldPass: function (e) {
    this.setData({
      old_pass:  e.detail.value
    })
  },
  newPass1: function (e) {
    this.setData({
      new_pass1:  e.detail.value
    })
  },
  newPass2: function (e) {
    let new_pass2 = e.detail.value
    let {new_pass1} = this.data
  
    if (new_pass2 == new_pass1) {
      this.setData({
        new_error: false,
      })
    } else if (new_pass2 != new_pass1 && !this.data.new_error) {
      this.setData({
        new_error: true
      })
    }
    this.setData({
      new_pass2: new_pass2
    })
  },
  changePass: function () {
    var that = this;
    var token = wx.getStorageSync("token")
    let {old_pass, new_pass2} = this.data
    that.setData({
      changed: true
    })
    wx.request({
      url: app.globalData.post_url+'/index/changePassword',
      method: "POST",
      dataType: 'json',
      header: { 'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
      data: {
        "data": {
          "password_old": old_pass,
          "password_new": new_pass2
        }
      },
      success: function (res) {
        // console.log(res.data);
        let {code} = res.data
        if(code !== 0){
          that.setData({
            changed: false,
            old_error: true
          })
          return
        }
        wx.showToast({
          title: '请重新登录',
          icon: 'none',
        })
        setTimeout(function () {
          wx.removeStorageSync("token");
          wx.reLaunch({
            url: '../login/login',
          })
        }, 1000)
       
      },

    });
  }
})