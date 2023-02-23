// pages/feedbackDetail/feedbackDetail.js
const app = new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "https://sign.yiluzou.cn/sign/public/",
  },


  getDetail: function () {
    let that = this
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.globalData.post_url,
          method: 'POST',
          dataType: 'json',
          header: {
            "content-type": "application/json"
          },
          data: {
            token: res.data,
            type: "B075",   //反馈展示接口
            data: {
              id: that.data.id
            },
          },
          success: function (res0) {
            console.log(res0);
            if (res0.data.code === 200) {
              
              that.setData({
                info: res0.data.msg              })
            }
          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id:options.id
    })
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
    this.getDetail()
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

  }
})