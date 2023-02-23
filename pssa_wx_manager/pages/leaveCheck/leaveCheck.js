// pages/leaveCheck/leaveCheck.js
const app = getApp()
var options = {};
var rank = wx.getStorageSync("rank")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    token: '',
    id: '',
    rejectid: '',
    hidden: false,
    reason: ''
  },
  getCheckList(){
    let {token, id} = this.data
    wx.showLoading({
      title: '加载中'
    })
    let request = id? {} : {
      meeting: id
    }

    wx.request({
      url: app.globalData.post_url+'/super/getAskLeaveList',
      dataType: 'json',
      method: "POST",
      header: {
        "contentType": "aplication/json",
        'Authorization': `Bearer ${token}`
      },
      data: {
        data: request
      },
      success: (res) => {
        wx.hideLoading({
          success: (res) => {},
        })
        let {code, msg, data} =res.data
        if(code !== 0){
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          })
          return
        }
        this.setData({
          data: data
        })
      },
      fail: (err) => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token')
    let id =options.id||''
    this.setData({
      token: token,
      id: id
    }, this.getCheckList)
  },

  getReason: function(e){
    this.setData({
      reason:e.detail.value 
    })
  },

  reject: function(e){
    let {id} = e.currentTarget.dataset
    this.setData({
      rejectid: id,
      hidden: true
    })
  },

  cancel: function(e){
    this.setData({
      rejectid: '',
      hidden: false
    })
  },

  checkFail: function(e){
    let {token, rejectid, reason} = this.data
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.globalData.post_url+'/super/grantAskLeave',
      dataType: 'json',
      method: "POST",
      header: {
        "contentType": "aplication/json",
        'Authorization': `Bearer ${token}`
      },
      data: {
        data: {
          leave: rejectid,
          reason: reason
        }
      },
      success: (res) => {
        wx.hideLoading({
          success: (res) => {},
        })
        let {code, msg, data} =res.data
        if(code !== 0){
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          })
          return
        }
        wx.showToast({
          title: '操作成功',
        })
        this.setData({
          hidden: false,
          rejectid: ''
        }, this.getCheckList)
        
      },
      fail: (err) => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      }
    })
  },

  grant: function(e){
    let {id} = e.currentTarget.dataset
    let {token} = this.data
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.globalData.post_url+'/super/grantAskLeave',
      dataType: 'json',
      method: "POST",
      header: {
        "contentType": "aplication/json",
        'Authorization': `Bearer ${token}`
      },
      data: {
        data: {
          leave: id
        }
      },
      success: (res) => {
        wx.hideLoading({
          success: (res) => {},
        })
        let {code, msg, data} =res.data
        if(code !== 0){
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          })
          return
        }
        wx.showToast({
          title: '操作成功',
        })
        this.getCheckList()
      },
      fail: (err) => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      }
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
    this.onLoad(this.data.options);
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

  toLeaveDetail: function (e) {
    //console.log(e.currentTarget.dataset.mid)
    let id = this.data.meetings[e.currentTarget.dataset.mid].meeting_id
    //console.log(id)
    wx.navigateTo({
      url: '../leaveDetail/leaveDetail?id=' + id,
    })
  }
})