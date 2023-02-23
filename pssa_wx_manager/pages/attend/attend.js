// pages/teacher/sign_list/sign_list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editing: false,
    last_index: 0,
    term_index: [0,1],
    selectOn: [],
    data: [],
    index: 0,
    token: '',
    id: '',
    stateOption: {
      '0': '已报名',
      '-1': '未签到',
      '1': '已签到',
      '2': '出席',
      '3': '早退',
      '4': '迟到',
      '7': '未报名',
      '8': '缺席',
      '9': '请假',
  }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // console.log(options)
    let that = this
    let token = wx.getStorageSync('token')
    
    let {id, state, type} = options
    //获取出勤会议信息
    this.setData({
      token: token,
      id: id,
      state: state,
      type: type
    }, this.getAttendList)
  },

  getAttendList: function(){
    let {token, id} = this.data
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.post_url+'/admin/getMeetingAttendance',
      dataType: 'json',
      method: "POST",
      header: {
        "contentType": "aplication/json",
        'Authorization': `Bearer ${token}`
      },
      data: {
        data: {
          meeting: id
        }
      },
      success: (res) => {
        wx.hideLoading({
          success: (res) => {},
        })
        let {code, msg, data} = res.data
        if(code != 0){
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          })
          return
        }
        let info= {
          ask_leave: 0,
          absence: 0,
          attend: 0
        }
        data.forEach((item) => {
          if(item.status === 9){
            info.ask_leave++
          }else if(item.status === 2){
            info.attend++
          }else if(item.status === 8){
            info.absence++
          }
        })
        this.setData({
          data: data,
          info: info
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
    this.onLoad();
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
    //console.log(e.detail.value)
    // this.data.term[this.data.last_index] = e.detail.value
    this.data.term_index[this.data.last_index] = e.detail.value
    this.data.change_member[this.data.last_index].status = this.data.term[this.data.last_index][e.detail.value]
    this.setData({
      term_index: this.data.term_index,
      change_member: this.data.change_member
    })
    console.log(this.data.change_member)
  },
  //更换编辑状态
  edit: function () {
    this.setData({
      editing: true
    })
  },
  //保存编辑状态
  change: function () {
    // wx.showLoading({
    //   title: '正在保存',
    //   mask: true
    // })
    let that = this
    let change_arr = [];
    let a = that.data.change_member;
    let b = that.data.member;
    for (let i = 0; i < a.length; i++) {
      if (a[i].status !== b[i].state) {
        console.log(a[i]);
        if (change_arr.length !== 0) {
          for (let j = 0; j < change_arr.length; j++) {
            if (a[i].user_id === change_arr[j].user_id) {
              change_arr[j].status = a[i].status
            } else if (a[i].user_id !== change_arr[j].user_id && j === change_arr.length - 1) {
              change_arr.push(a[i])
            }
          }
        } else {
          change_arr.push(a[i])
        }
        console.log(change_arr)
      }
    };
    wx.request({
      url: app.globalData.post_url,
      method: 'POST',
      dataType: 'json',
      header: {
        "content-type": "application/json"
      },
      data: {
        token: app.globalData.token,
        "type": 'B021',
        data: { 
          user_id: change_arr,
          meeting: that.data.meeting_id
        }
      },
      success: function (res) {
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