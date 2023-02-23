// pages/teacher/showCode/showCode.js
const app = getApp()
var util = require('../../utils/util.js')
var inter
var n = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pre_url: ''
  },

  showCode: function () {
    
    let {type, id, token} = this.data
    wx.request({
      url: app.globalData.post_url+(type==='sign'? '/admin/getCheckInQrcode': '/admin/getCheckOutQrcode'),
      dataType: 'json',
      method: "POST",
      header: {
        "contentType": "aplication/json",
        "Authorization": `Bearer ${token}`
      },
      data: {
        data: {
          meeting: id
        }
      },
      success: res => {
        // console.log(res0)
        let {code, data} = res.data
        if(code != 0){
          wx.showToast({
            title: '请求出错',
            icon: 'none'
          })
          return
        }

        this.setData({
          pre_url: data.qrcode
        })
        
        inter = setTimeout(() => {
            this.showCode()
        }, 10000)
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token')
    this.setData({
      type: options.code, //sign
      id: options.id,
      token: token
    }, this.showCode)
   
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
    clearInterval(inter)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(inter)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.showCode()
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
  
})