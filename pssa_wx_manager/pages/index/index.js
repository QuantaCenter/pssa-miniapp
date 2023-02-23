// pages/teacher/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabname: [
      '会议查看',
      '会议发布',
      '会议审核',
      '请假审核',
    ],
    common: [
      '出勤查看',
      '单位查看',
    ],
    tabShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(app);
    //根据权限显示界面
    this.setData({
      tabShow: app.globalData.rank == 1 ? true:false,
      tabname: app.globalData.rank == 1 ? [
        '会议查看',
        '会议发布',
        '会议审核',
        '请假审核',
      ]:[
        '会议查看',
        '会议申请',
      ]
    })
    let that = this
    
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
    this.setData({
      tab: [
        false,
        false,
        false,
        false,
      ]
    })
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
  tabtab: function (e) {
    //console.log(e.target.dataset.tab)
    let tab = this.data.tab
    tab[e.target.dataset.tab] = true
    this.setData({
      tab: tab
    })
    if (app.globalData.rank == 1) {
      switch (e.target.dataset.tab) {
        case 0:
          wx.navigateTo({
            url: '../meeting/meeting',
          })
          break;
        case 1:
          wx.navigateTo({
            url: '../type/type?pageType=publish',
          })
          break;
        case 2:
          wx.navigateTo({
            url: '../type/type?pageType=meetingCheck',
          })
          break;
        case 3:
          wx.navigateTo({
            url: '../leaveCheck/leaveCheck',
          })
          break;
        default:
          break;
      }
    } else {
      switch (e.target.dataset.tab) {
        case 0:
          wx.navigateTo({
            url: '../meeting/meeting',
          })
          break;
        case 1:
          wx.navigateTo({
            url: '../type/type?pageType=publish',
          })
          break;
        default:
          break;
      }
    }
  },
  check: function (e) {
    let tab = this.data.tab
    tab[e.target.dataset.tab] = true
    this.setData({
      tab:tab
    })
    switch (e.target.dataset.tab) {
      case 0:
      wx.navigateTo({
        url: '../nameList/nameList',
      })
      break;
      case 1:
      wx.navigateTo({
        url: '../type/type?pageType=department',
      })
      break;
      default:
      break;
    }
  },
  setting: function () {
    wx.navigateTo({
      url: '../set/set',
    })
  }
})