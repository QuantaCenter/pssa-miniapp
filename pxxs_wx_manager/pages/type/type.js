// pages/type/type.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options) {
    let that = this
    if (options.pageType === 'department') {
      wx.setNavigationBarTitle({
        title: '单位查看',
      })
      that.setData({
        pageType: "department",
      })
    } else if (options.pageType === 'meetingCheck') {
      wx.setNavigationBarTitle({
        title: '会议审核',
      })
      that.setData({
        pageType: "meetingCheck",
      })
    } else {
      that.setData({
        pageType: "publish",
      })
    }
  },
  toMust: function() {
    wx.navigateTo({
      url: '../publish/publish?pageType=2',
    })
  },
  toElect: function() {
    wx.navigateTo({
      url: '../publish/publish?pageType=1',
    })
  },
  toHost: function () {
    wx.navigateTo({
      url: '../department/department?pageType=1',
    })
  },
  toSend: function () {
    wx.navigateTo({
      url: '../department/department?pageType=2',
    })
  },
  toMeetingCheck: function () {
    wx.navigateTo({
      url: '../meeting/meeting?pageType=meetingCheck',
    })
  },
  toAddCheck: function () {
    wx.navigateTo({
      url: '../meeting/meeting?pageType=addCheck',
    })
  },
})