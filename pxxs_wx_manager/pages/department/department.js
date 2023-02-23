// pages/department/department.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchIcon: true,
    searchValue: "",
    term: app.globalData.term,
    year_index: 0,
    month_index: app.globalData.currentMonth,
    years: app.globalData.years,
    months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    key: '',
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let a = that.data.term.split('-');
    let wTerm = a[0] + a[1] + a[2];
    that.setData({
      wTerm: wTerm,
      options:options
    })
    //按主办单位
    if (options.pageType === '1') {
      that.setData({
        pageType: options.pageType,
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
          "type": 'B054',
          data: {
            year: that.data.years[that.data.year_index],
            month: that.data.months[that.data.month_index],
            term: that.data.term
          }
        },
        success: function(res) {
         console .log(res)
          if (res.data.code === 200) {
            that.setData({
              info: res.data.msg,
            })
          }
        }
      })
    } else {
      //按派出单位查看
      that.setData({
        pageType: 2
      })
      //console .log(that.data.years[that.data.year_index])
      //console .log(that.data.months[that.data.month_index])
      wx.request({
        url: app.globalData.post_url,
        method: 'POST',
        dataType: 'json',
        header: {
          "content-type": "application/json"
        },
        data: {
          token: app.globalData.token,
          "type": 'B055',
          data: {
            year: that.data.years[that.data.year_index],
            month: that.data.months[that.data.month_index],
            term: that.data.term
          }
        },
        success: function(res) {
         //console .log(res)
          if (res.data.code === 200) {
            that.setData({
              info: res.data.msg,
            })
          }
        }
      })
    }
    //console.log(that.data.pageType)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onPullDownRefresh: function () {
    this.onLoad(this.data.options);
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
  },
  //搜索框聚焦
  searchFocus: function(e) {
    this.setData({
      searchIcon: false,
    })
  },
  getSearchKey: function(e) {
    this.setData({
      key: e.detail.value
    })
  },
  //失去焦点时搜索
  search: function() {
    let that = this
    let searchValue = this.data.key
    if (searchValue != '') {
      that.setData({
        searchIcon: false
      })
    } else {
      that.setData({
        searchIcon: true
      })
    }
    wx.request({
      url: app.globalData.post_url,
      method: 'POST',
      dataType: 'json',
      header: {
        "content-type": "application/json"
      },
      data: {
        token: app.globalData.token,
        "type": that.data.pageType === '1' ? 'B057' : 'B058',
        data: {
          department: this.data.key,
          year: that.data.years[that.data.year_index],
          month: that.data.months[that.data.month_index],
        }
      },
      success: function(res) {
        console.log(res)
        if (res.data.code === 200) {
          that.setData({
            info: res.data.msg,
          })
        } else {
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
        "type": that.data.pageType == 1 ? 'B054' : 'B055',
        data: {
          year: that.data.years[that.data.year_index],
          month: that.data.months[that.data.month_index],
          term: that.data.wTerm
        }
      },
      success: function (res) {
        //console .log(res)
        if (res.data.code == 200) {
          that.setData({
            info: res.data.msg,
            year_index: e.detail.value
          })
        }
      },
    });
  },
  switchMonth: function (e) {
    var that = this;
    let month = that.data.months[e.detail.value]
    //console .log(month)
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
        "type": that.data.pageType == 1 ? 'B054' : 'B055',
        data: {
          year: that.data.years[that.data.year_index],
          month: that.data.months[that.data.month_index],
          term: that.data.wTerm
        }
      },
      success: function (res) {
       //console .log(res)
        if (res.data.code == 200) {
          that.setData({
            info: res.data.msg,
            month_index: e.detail.value
          })
        }
      },
    });
  },
  // toDetail: function (e) {
  //  //console.log(e.currentTarget.dataset.name)
  //   wx.navigateTo({
  //     url: '../deptDetail/deptDetail?name=' + e.currentTarget.dataset.name,
  //   })
  // },
})