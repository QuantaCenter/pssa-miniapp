const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member: [],
    editing: false,
    index: 0,
    terms: ['出席', '缺席', '请假'],
    change_status: [],
    send_member:[],
    send_meeting:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    let that = this
    wx.request({
      url: app.globalData.post_url,
      method: 'POST',
      dataType: 'json',
      header: {
        "content-type": "application/json"
      },
      data: {
        token: app.globalData.token,
        "type": 'B044',
        data: {
          user_id:options.id,
        }
      },
      success: function (res) {
        console.log(res.data.msg)
        if (res.data.code === 200) {
          let term = []
          let term_index = []
          let arr = []
          let index = 0
          let change_member = []
          let change_meeting = []
          //将可更改状态人员存入数组
          for (let i = 0; i < res.data.msg.length; i++) {
            arr.push(res.data.msg[i].meeting_state);
            change_meeting.push(res.data.msg[i].meeting_id);
            change_member = arr
          }
          for (let i = 0; i < change_member.length; i++) {
            for (let j = 0; j < 3; j++) {
              if (change_member[i] === ['出席', '缺席', '请假'][j]) {
                index = j
                break
              }
            }
            term_index[i] = index
            term[i] = ['出席', '缺席', '请假']
          }
          that.setData({
            member: res.data.msg,
            username: options.username,
            period: options.period,
            id: options.id,
            options:options,
            term: term,
            term_index: term_index,
            change_member: change_member,
            change_meeting: change_meeting
          })
        }
      }
    })
  },
  onPullDownRefresh: function () {
    this.onLoad(this.data.options);
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
  },
  //重置密码
  reset: function() {
    wx.showModal({
      title: '提醒',
      content: '确认重置密码吗',
      confirmColor: "#00478b",
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在确认',
            mask: true
          })
          wx.request({
            url: app.globalData.post_url,
            method: 'POST',
            dataType: 'json',
            header: {
              "content-type": "application/json"
            },
            data: {
              token: app.globalData.token,
              "type": 'B039',
              data: {
                user_id: this.data.id,
              }
            },
            success: function (res0) {
              console.log(res0)
              if (res0.data.code === 200) {
                wx.showToast({
                  title: '已重置',
                  duration: 1000
                })
                setTimeout(function () {
                  
                }, 1000)
              } else if (res0.data.code === 401) {
                wx.showToast({
                  icon:'none',
                  title: '未登录',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.removeStorage({
                    key: 'token',
                    success: function (res) {
                      wx.redirectTo({
                        url: '../login/login',
                      })
                    },
                  })
                }, 1000)
              } else {
                wx.showToast({
                  title: res0.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })

        }

      }
    })
  },

  //获取当前选择状态
  selectOn: function (e) {
    let index
    if (e.currentTarget.dataset.index == 0) {
      index = e.currentTarget.dataset.index
    } else {
      index = e.currentTarget.dataset.index || this.data.last_index
    }
    this.setData({
      last_index: index
    })
    //console.log(this.data.last_index)
  },
  //更改成员出勤状态
  getStatus: function (e) {
    // console.log(e.detail.value)
    // this.data.term[this.data.last_index] = e.detail.value
    for (let i = 0; i < this.data.send_member.length; i++) {
      if (this.data.send_meeting[i] === this.data.change_meeting[this.data.last_index]) {
        this.data.send_member.splice(i, 1)
        this.data.send_meeting.splice(i, 1)
      }
    } 
    this.data.term_index[this.data.last_index] = e.detail.value;
    this.data.send_member.push(this.data.term[this.data.last_index][e.detail.value])
    this.data.send_meeting.push(this.data.change_meeting[this.data.last_index])
    // if (this.data.send_member.length !== 0){
      
    // } else {
    //   this.data.send_member.push(this.data.term[this.data.last_index][e.detail.value])
    //   this.data.send_meeting.push(this.data.change_meeting[this.data.last_index])
    // }
    this.setData({
      term_index: this.data.term_index,
      change_member: this.data.change_member,
      send_member: this.data.send_member,
      send_meeting: this.data.send_meeting,
    })
    console.log(this.data.send_member)
    console.log(this.data.send_meeting)
  },
  //更换编辑状态
  edit: function () {
    this.setData({
      editing: true
    })
  },
  //保存编辑状态
  save: function () {
    wx.showLoading({
      title: '正在保存',
      mask: true
    })
    let that = this
    wx.request({
      url: app.globalData.post_url,
      method: 'POST',
      dataType: 'json',
      header: {
        "content-type": "application/json"
      },
      data: {
        token: app.globalData.token,
        "type": 'B060',
        data: {
          user_id: that.data.id,
          meeting_id: that.data.send_meeting,
          state: that.data.send_member,
        }
      },
      success: function (res) {
        console.log(that.data.change_member)
        console.log(res)
        if (res.data.code === 200) {
          wx.hideLoading()
          wx.showToast({
            title: '保存成功',
            duration: 1000
          })
          // that.onShow()
          setTimeout(function () {
            wx.navigateBack()
          }, 1000)
        } else if (res.data.code === 401) {
          wx.showToast({
            title: '身份已过期，请重新登录',
            icon: 'none',
            duration: 3000,
            mask: true,
          })
          setTimeout(function () {
            wx.removeStorage({
              key: 'token',
              success: function (res) {
                wx.redirectTo({
                  url: '../login/login',
                })
              },
            })
          }, 1000)
        } else if (res.data.code === 400) {
          wx.showToast({
            title: '权限不足',
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }
      }
    })
  }
})

