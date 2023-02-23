// pages/set/set.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logouted: false,
    arrow_message: false
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
  logout: function () {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？确定后将无法取消',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage()
          wx.clearStorageSync()
          wx.reLaunch({
            url: '../login/login',
          })
        }
      }
      
    })
  },
  issue: function () {
    wx.redirectTo({
      url: '../feedBack/feedBack',
    })
    // wx.downloadFile({
    //   url: 'https://ppms.yiluzou.cn/ppms/public/static/teacher_issue.docx',
    //   success: function (res) {
    //     var filePath = res.tempFilePath
    //     wx.openDocument({
    //       filePath: filePath,
    //       success: function (res) {
    //         //console.log('打开文档成功')
    //       },
    //       fail: function (rse) {
    //         //console.log(res)
    //       }
    //     })
    //   }
    // })
  }
})