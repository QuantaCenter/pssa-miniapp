// pages/add/add.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    token: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    try{
      let token = wx.getStorageSync('token')
      this.setData({
        token: token
      },this.getDetail)
    }catch(e){
      wx.showToast({
        title: '登录状态过期',
        icon: 'none'
      })
      console.log(e)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  getDetail: function() {
    var that = this;
    var term = app.globalData.currentTerm;
    //验证token获取会议
    //console.log(app.globalData.currentTerm)
    let a = term.split('-')
    let b = a[0] + a[1] + a[2]
    this.setData({
      term: b
    })
    //https://pssa.quantacenter.com/user/getPostRecordList
    // console.log(that.data.term)
    wx.getStorage({
      key: 'token',
      success: function (res) {
        // console.log(res.data),
          wx.request({
            url: app.globalData.post_url,
            method: 'POST',
            dataType: 'json',
            header: {
              "content-type": "application/json"
            },
            data: {
              token: res.data,
              "type": "A016",
              data: {
                term: that.data.term
              }
            },
            success: function (res0) {
              console.log(res0);
              if (res0.data.code === 200) {
                that.setData({
                  meetings: res0.data.msg,
                })
              }
            }
          })
      },
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getDetail();
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  toDetail: function(e) {
    //console.log(e.currentTarget.dataset.mid)
    //console.log(e.currentTarget.dataset.type)
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.mid + '&type=3'
    })
  },
  edit: function() {
    wx.navigateTo({
      url: '../edit/edit',
    })
  }
})