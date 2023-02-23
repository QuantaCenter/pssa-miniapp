const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member: [],
    term: app.globalData.term,
    all_term: app.globalData.terms,
    year_index: 0,
    month_index: app.globalData.currentMonth,
    years: app.globalData.years,
    months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    all_dept: [
      '全部单位', '英语语言文化学院', '经济贸易学院', '国际商务英语学院', '商学院', '会计学院', '金融学院', '西方语言文化学院', '日语语言文化学院', '东方语言文化学院', '中国语言文化学院', '法学院', '国际关系学院', '英语教育学院', '信息科学与技术学院', '社会与公共管理学院', '高级翻译学院', '新闻与传播学院', '艺术学院', '数学与统计学院', '继教公开学院', '国际学院', '创新创业教育学院', '学生处', '校团委', '学生就业指导中心', '研究生部', '关工委'],
    index: 0,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let a = this.data.term.split('-')
    let term1 = a[0];
    let term2 = a[1];
    let term3 = a[2];
    this.setData({
      wTerm: term1 + term2 + term3,
      options: options,
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
        "type": 'B013',
        data: {
          "page": 0,
          "size": 0,
          "term": this.data.term
        }
      },
      success: function (res) {
       //console.log(res.data.msg)
        if (res.data.code === 200) {
          that.setData({
            member: res.data.msg,
          })
        }
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
  onReachBottom: function (e) {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  //切换单位获取职工信息
  switchDepar: function (e) {
    var that = this;
    let deptmt = that.data.all_dept[e.detail.value]
   //console.log(e.detail.value)
    wx.request({
      url: app.globalData.post_url,
      method: "POST",
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      data: {
        token: app.globalData.token,
        type: 'B061',
        data: {
          year: that.data.years[that.data.year_index],
          month: that.data.months[that.data.month_index],
          college: deptmt,
          term: this.data.term
        }
      },
      success: function (res) {
       //console.log(res)
        if (res.data.code == 200) {
          that.setData({
            member: res.data.msg,
            index: e.detail.value
          })

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
        }
      },
    });
  },
  //获取更多
  getMore: function () {
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
        "type": 'B013',
        data: {
          "page": this.data.page,
          "size": 20,
          "term":that.data.term
        }
      },
      success: function (res) {
        //console.log(res)
        if (res.data.code === 200) {
          that.setData({
            member: res.data.msg,
            page: ++that.data.page
          })
        } else if (res.data.code === 401) {
          wx.showToast({
            title: '身份已过期，请重新登录',
            icon: 'none',
            duration: 3000,
            mask:true,
          })
          setTimeout(function() {
            wx.removeStorage({
              key: 'token',
              success: function (res) {
                wx.redirectTo({
                  url: '../login/login',
                })
              },
            })
          },1000)
        }
      }
    })
  },
  toDetail: function (e) {
    //console.log(e.currentTarget.dataset.mid)
    wx.navigateTo({
      url: '../memberDetail/memberDetail?id=' + e.currentTarget.dataset.mid + '&username=' + e.currentTarget.dataset.username + '&period=' + e.currentTarget.dataset.period,
    })
  },
  //搜索
  getSearchKey: function (e) {
    this.setData({
      key: e.detail.value
    })
  },
  search: function () {
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
        "type": 'B015',
        data: {
          search_key: that.data.key,
          term: that.data.term
        }
      },
      success: function (res) {
        //console.log(res)
        if (res.data.code === 200) {
          wx.navigateTo({
            url: '../memberDetail/memberDetail?id=' + res.data.msg[0].user_id + '&username=' + res.data.msg[0].username + '&period=' + res.data.msg[0].period,
          })
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
        }else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  
  switchYear: function (e) {
    var that = this;
    let year = that.data.years[e.detail.value]
    that.setData({
      year_index: e.detail.value
    })
    wx.request({
      url: app.globalData.post_url,
      method: "POST",
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      data: {
        token: app.globalData.token,
        "type": "B059",
        data: {
          year: that.data.years[that.data.year_index],
          month: that.data.months[that.data.month_index],
          term: that.data.wTerm
        }
      },
      success: function (res) {
        //console.log(res)
        if (res.data.code == 200) {
          that.setData({
            member: res.data.msg,
            year_index: e.detail.value
          })
        }
      },
    });
  },
  switchMonth: function (e) {
    var that = this;
    let month = that.data.months[e.detail.value]
   //console.log(that.data.term)
    that.setData({
      month_index: e.detail.value
    })
    wx.request({
      url: app.globalData.post_url,
      method: "POST",
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      data: {
        token: app.globalData.token,
        "type": "B059",
        data: {
          year: that.data.years[that.data.year_index],
          month: that.data.months[that.data.month_index],
          term: that.data.wTerm
        }
      },
      success: function (res) {
       //console.log(res)
        if (res.data.code == 200) {
          that.setData({
            member: res.data.msg,
            month_index: e.detail.value
          })
        }
      },
    });
  },
})

