// pages/index/success.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    word: '',
    speech_num: 0,
    talk_num: 0,
    comment: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      word: options.word || "签退成功",
      meeting_id: options.id || null
    })
  },

  handleInput: function(e){
    this.setData({
      comment: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  setSpeech: function (e) {
    // console.log(e.currentTarget.dataset.num)
    this.setData({
      speech_num: Number(e.currentTarget.dataset.num)
    })
  },
  setTalk: function (e) {
    // console.log(e)
    this.setData({
      talk_num: Number(e.currentTarget.dataset.num)
    })
  },
  comment: function (e) {
    if (this.data.speech_num <= 0 || this.data.talk_num <= 0) {
      wx.showToast({
        title: '还没给星哦',
        duration: 1000
      })
      return false
    }
    if (this.data.word === '签到成功') {
      wx.navigateBack()
    } else {
      wx.showLoading({
        title: '正在评论',
        mask: true
      })
      let that = this
      let token = wx.getStorageSync('token')
      wx.request({
        url: app.globalData.post_url+'/user/commentMeeting',
        method: 'POST',
        dataType: 'json',
        header: {
          "content-type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        data: {
          data: {
            "meeting": this.data.meeting_id,
            "speaker": this.data.speech_num,
            "event": this.data.talk_num,
            "comment": this.data.comment
          }
        },
        success: function (res) {
          // console.log(res0);
          wx.hideLoading()
          let {code, msg} = res.data
          if(code !==0){
            wx.showToast({
              title: '评论失败',
              icon: 'none'
            })
            return
          }
          wx.showToast({
            title: '评价成功',
          })
          wx.switchTab({
            url: '../index/index',
          })
          // if (res0.data.code === 200) {
          //   wx.switchTab({
          //     url: '../index/index',
          //   })
          // } else if (res0.data.code === 401) {
          //   wx.removeStorage({
          //     key: 'token',
          //     success: function (res) {
          //       wx.redirectTo({
          //         url: '../state/state',
          //       })
          //     },
          //   })
          // } else {
          //   wx.showToast({
          //     title: '评论失败',
          //     duration: 1000
          //   })
          // }
        }
      })
    }
  }

})