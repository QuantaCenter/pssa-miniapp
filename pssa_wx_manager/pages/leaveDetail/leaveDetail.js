// pages/leaveDetail/leaveDetail.js
const app = getApp()
var options = {};
var rank = wx.getStorageSync("rank")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    reason: '',
    member: [],
    is_all: false,
    choose_on: [],
    choose_member: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    this.setData({
      meeting_id: options.id,
      options:options
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDetail(this.data.meeting_id)
  },
  getDetail: function (id) {
    //console.log(id)
    var that = this;
    wx.request({
      url: app.globalData.post_url,
      dataType: 'json',
      method: "POST",
      header: {
        "contentType": "aplication/json"
      },
      data: {
        token: app.globalData.token,
        type: 'B035',
        data: {
          id: this.data.meeting_id
        },
      },
      success: function (res0) {
        console.log(res0)
        if (res0.data.code === 200) {
          let choose_on = [];
          for (let i = 0; i < res0.data.msg.length; i++) {
            choose_on[i] = false
          }
          that.setData({
            member: res0.data.msg,
            choose_on: choose_on
          })
        }

        wx.hideLoading()
      }

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
    // this.onLoad(this.data.options);
    this.onShow()
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  askForReason: function () {
    var that = this;
    this.setData({
      hidden: true,
      reason: '',
    })
  },
  getReason: function (e) {
    this.setData({
      reason: e.detail.value
    })
    // console.log(this.data.reason)
  },
  //选择
  choose: function (e) {
    var that = this
    let index = e.currentTarget.dataset.index
    //console.log(index)
    that.data.choose_on[index] = !that.data.choose_on[index]
    if (that.data.choose_on[index]) {
      that.data.choose_member.push(that.data.member[index].user_id)
      // for (var i=0; i < that.data.choose_member.length; i++) {
      //   if (!that.data.choose_on[i]) {
      //     that.data.is_all = !that.data.is_all
      //   }
      // }
      that.setData({
        is_all: that.data.is_all
      })
    }
    else {
      if (that.data.is_all) {
        that.data.is_all = !that.data.is_all
        that.setData({
          is_all: that.data.is_all
        })
      }
      for (var i = 0; i < that.data.choose_member.length; i++) {
        if (that.data.choose_member[i] == that.data.member[index].user_id) {
          that.data.choose_member.splice(i, 1)
        }
      }
    }
    that.setData({
      choose_on: that.data.choose_on,
      choose_member: that.data.choose_member
    })
    //console.log(that.data.choose_member)

  },
  //选择全部
  chooseAll: function () {
    var that = this
    that.setData({
      is_all: !that.data.is_all
    })
    if (that.data.is_all) {
      let arr = []
      for (let i = 0; i < that.data.member.length; i++) {
        if (that.data.choose_on[i] == true) {
          arr.push(that.data.member[i].user_id)
        } else {
          that.data.choose_on[i] = true;
          arr.push(that.data.member[i].user_id)
        }
      }
      that.setData({
        choose_on: that.data.choose_on,
        choose_member: arr
      })
      //console.log(that.data.choose_member)
      //console.log(that.data.choose_on)
    }
  },
  //取消全选
  chooseNone: function () {
    var that = this
    that.setData({
      is_all: !that.data.is_all,
      choose_member: []
    })
    if (!that.data.is_all) {
      let arr = []

      for (let i = 0; i < that.data.member.length; i++) {
        if (that.data.choose_on[i] == true) {
          that.data.choose_on[i] = false
        } else {
          that.data.choose_on[i] = false
        } 1
      }
      that.setData({
        choose_on: that.data.choose_on,
        choose_member: arr
      })
      //console.log(that.data.choose_member)
    }
  },
  //不通过
  fail: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定不通过吗，操作后将无法取消',
      confirmColor: "#00478b",
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.post_url,
            method: 'POST',
            dataType: 'json',
            header: {
              "content-type": "application/json"
            },
            data: {
              token: app.globalData.token,
              type: 'B042',   //不通过接口
              data: {
                id: that.data.meeting_id,
                user_id: that.data.choose_member,
                reason: that.data.reason
              }
            },
            success: function (res0) {
              console.log(res0)
              if (res0.data.code === 200) {
                wx.showToast({
                  title: '操作成功',
                  icon: 'none',
                  duration: 3000,
                  mask: true,
                })
                that.getDetail()
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../leaveCheck/leaveCheck',
                  })
                }, 1000)
              }
            }
          })
        }
      }

    })
  },
  
  //通过
  pass: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定通过吗，操作后将无法取消',
      confirmColor: "#00478b",
      success: (res) => {  
        if (res.confirm) {
          wx.request({
            url: app.globalData.post_url,
            method: 'POST',
            dataType: 'json',
            header: {
              "content-type": "application/json"
            },
            data: {
              token: app.globalData.token,
              type: 'B040',   // 通过接口
              data: {
                id: that.data.meeting_id,
                user_id: that.data.choose_member
              }
            },
            success: function (res0) {
              //console.log(res0)
              if (res0.data.code === 200) {
                wx.showToast({
                  title: '已通过',
                  icon: 'none',
                  duration: 3000,
                  mask: true,
                })
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../leaveCheck/leaveCheck',
                  })
                }, 1000)
              }

            }
          })
        }
      }

    })
  },
  cancel: function () {
    this.setData({
      hidden: false,
    })
  },
})