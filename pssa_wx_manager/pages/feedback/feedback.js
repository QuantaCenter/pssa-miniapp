// pages/feedback/feedback.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member:[],
    member_on:[],
    all_on:false,
    choose_member:[],
    term: app.globalData.term
  },


  chooseMember: function (e) {
    var that = this
    let index = e.currentTarget.dataset.index
    that.data.member_on[index] = !that.data.member_on[index]
    if (that.data.member_on[index]) {
      that.data.choose_member.push(that.data.member[index].feedback_id)
    } else {
      if (that.data.all_on) {
        that.data.all_on = !that.data.all_on
      }
      for (var i = 0; i < that.data.choose_member.length; i++) {
        if (that.data.choose_member[i] == that.data.member[index].feedback_id) {
          that.data.choose_member.splice(i, 1)
        }
      }
    }
    that.setData({
      all_on: that.data.all_on,
      member_on: that.data.member_on,
      choose_member: that.data.choose_member
    })
    console.log(that.data.choose_member)
  },
  chooseAll: function() {
    let that = this
    let arr = that.data.choose_member
    that.data.all_on = !that.data.all_on
    that.setData({
      all_on: that.data.all_on,
    })
    if (that.data.all_on) {
      for (let i = 0; i < that.data.member.length; i++) {
        if (that.data.member_on[i] === true) {
          arr.push(that.data.member[i].feedback_id)
        } else {
          that.data.member_on[i] = true;
          arr.push(that.data.member[i].feedback_id)
        }
      }
      that.setData({
        member_on: that.data.member_on,
        choose_member: arr
      })
      console.log(that.data.choose_member)
    } else {
      let arr = []
      for (let i = 0; i < that.data.member.length; i++) {
        if (that.data.member_on[i] === true) {
          that.data.member_on[i] = false
        } else {
          that.data.member_on[i] = false
        }
      }
      that.setData({
        member_on: that.data.member_on,
        choose_member: arr
      })
    }
  },
  deleteFb: function () {
    let that = this
    wx.showModal({
      title: '确认删除吗？',
      content: '删除后将无法恢复',
      confirmColor: "#00478b",
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.post_url,
            dataType: 'json',
            method: "POST",
            header: {
              "contentType": "aplication/json"
            },
            data: {
              type: 'B076',
              token: app.globalData.token,
              data: {
                id: this.data.choose_member
              }
            },
            success: res0 => {
              console.log(res0)
              if (res0.data.code == 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000,
                  mask: true
                })
                setTimeout(function () {
                  that.onShow()
                }, 1000)
              } else {
                wx.showToast({
                  title: '删除失败,' + res0.data.msg,
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
              }
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  toDetail: function (e) {
      wx.navigateTo({
        url: '../feedbackDetail/feedbackDetail?id=' + e.currentTarget.dataset.id,
      })

  },
  getDetail: function () {
    let that = this
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
            type: "B074",   //反馈展示接口
            data: {
              term: that.data.term
            },
          },
          success: function (res0) {
            console.log(res0);
            if (res0.data.code === 200) {
              that.setData({
                member: res0.data.msg,
              })
              for (let i = 0; i < that.data.member.length; i++) {
                that.data.member_on.push(false)
                if (that.data.member[i].feedback.length > 6){
                  that.data.member[i].feedback = that.data.member[i].feedback.slice(0, 6) + '...'
                }
              }
              that.setData({
                member_on: that.data.member_on,
                member: that.data.member,
              })
              console.log(that.data.member_on)
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
    let a = this.data.term.split('-')
    let term1 = a[0];
    let term2 = a[1];
    let term3 = a[2];
    this.setData({
      term: term1 + term2 + term3,
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