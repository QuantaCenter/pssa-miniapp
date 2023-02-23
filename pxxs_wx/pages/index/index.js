
var util = require("../../utils/util.js");
const app = getApp()
var arr = [];

Page({
  data: {
    elective : true,  
    searchImg: true,
    searchValue: "",
    terms: app.globalData.terms,
    term_index: 1,
    token: '',
    page: 1,
    pageSize: 5,
    total: 0,
    last_page: 1,
    meetingList: [],
    isSearch: false,
    searchList: []
  },
  onShow: function () {
  
    // var that = this;
    // //验证token获取会议

    // wx.getStorage({
    //   key: 'token',
    //   success: function (res) {
    //    console.log(res),
    //     wx.request({
    //       url: app.globalData.post_url,
    //       method: 'POST',
    //       dataType: 'json',
    //       header: {
    //         "content-type": "application/json"
    //       },
    //       data: {
    //         token: res.data,
    //         "type": "A010",
    //         data: []
    //       },
    //       success: function (res0) {
    //        console.log(res0);
    //         if (res0.data.code === 200) {
    //           that.setData({
    //             meetings: res0.data.msg,
    //           })
    //         } else if (res0.data.code === 401) {
    //           wx.showToast({
    //             title: '身份已过期，请重新登录',
    //             icon: 'none',
    //             duration: 3000,
    //             mask: true,
    //           })
    //           setTimeout(function () {
    //             wx.removeStorage({
    //               key: 'token',
    //               success: function (res) {
    //                 wx.redirectTo({
    //                   url: '../login/login',
    //                 })
    //               },
    //             })
    //           }, 1000)
    //         }
    //       }
    //     })
    //   },
    // })
  },
  
  onLoad: function () {
    try{
      let token = wx.getStorageSync('token')
      this.setData({
        token: token
      },this.getMeetingList)
    }catch(e){
      wx.showToast({
        title: '登录状态过期',
        icon: 'none'
      })
      console.log(e)
    }
  },

  getMeetingList: function(){
    let {page, pageSize, token, meetingList}=this.data
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.post_url+'/user/getMeetingList',
      method:'POST',
      data: {
        data: {
          page: page,
          per_page: pageSize
        }
      },
      header: {
        'content-type': 'application/json', 'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        let {code, msg, data} = res.data
        wx.hideLoading({
          success: (res) => {},
        })
        if(code !== 0){
          wx.showToast({
            title: msg,
            icon: 'none'
          })
          return
        }
        let {total,current_page,last_page, data:list } = data
        meetingList.push(...list)
        this.setData({
          meetingList: meetingList,
          total: total,
          page: page+1,
          last_page: last_page
        })
      },
      fail: (err) => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '服务器出粗',
          icon:'none'
        })
      }
    })
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {

  },
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      meetingList: []
    }, this.getMeetingList)
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
  },
  //搜索框聚焦
  searchFocus: function(e) {
    this.setData({
      searchImg:false,
    })
  },
  //搜索框失去焦点
  searchBlur: function() {
    let {searchValue} = this.data
    if(searchValue.trim() === ''){
      this.setData({
        isSearch: false
      })
      return
    }
    this.setData({
      searchImg: searchValue != '',
      isSearch: true
    }, this.searchMeeting)
  },
  searchMeeting: function(){
    let {searchValue, meetingList} = this.data
    let searchList = meetingList.filter((item) => {
      return item.name.indexOf(searchValue)!==-1
    })
    if(searchList.length ==0){
      wx.showToast({
        title: '搜索不到相应活动',
        icon: 'none'
      })
    }
    this.setData({
      searchList: searchList
    })
  },
  //输入时调用搜索方法
  input1: function(e){
    this.setData({
      searchValue: e.detail.value
    })
  },
  //搜索方法
  search: function (key) {
    //console.log(key)
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.globalData.post_url,
          method: 'POST',
          dataType: 'json',
          header: {
            "content-type": "application/json"
          },
          data: {
            token: res.data,
            "type": "A013",   //会议查看接口
            data: {
              search_key: key, // 两个同时为0是获取所有条数
              term: that.data.terms[that.data.term_index]
            }
          },
          success: function (res0) {
           // console.log(res0);
            if (res0.data.code === 200) {
              that.setData({
                meetings: res0.data.msg,
              })
              
            } else if (res0.data.code === 401) {
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
          }
        })
      },
    })
  },
  toDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.mid + '&type=' + e.currentTarget.dataset.type
    })
  },
  tabNow: function () {
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.globalData.post_url,
          method: 'POST',
          dataType: 'json',
          header: {
            "content-type": "application/json"
          },
          data: {
            token: res.data,
            "type": "A008",
            data: ''
          },
          success: function (res0) {
            // //console.log(res0);
            if (res0.data.code === 200) {
              that.setData({
                meetings: res0.data.msg,
                top_selected: true
              })
            } else if (res0.data.code === 401) {
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
          }
        })
      },
    })

    // this.setData({
    //   top_selected: true
    // })
  },
  tabPre: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.globalData.post_url,
          method: 'POST',
          dataType: 'json',
          header: {
            "content-type": "application/json"
          },
          data: {
            token: res.data,
            "type": "A015",
            data: ''
          },
          success: function (res0) {
            wx.hideLoading()
            if (res0.data.code === 200) {
              that.setData({
                pre_meetings: res0.data.msg,
                top_selected: false
              })
            } else {
              that.setData({
                top_selected: false
              })
            }
          }
        })
      },
    })
  },
  /**
 * 生命周期函数--监听页面加载
 */





  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },


  /**
   * 生命周期函数--监听页面卸载
   */


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let {page, last_page} = this.data
    if(page>last_page){
      wx.showToast({
        title: '没有更多数据',
        icon: 'none'
      })
      return
    }
    this.getMeetingList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

