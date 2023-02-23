//index.js
//获取应用实例
const app = getApp()
var arr = [];
var token = wx.getStorageSync("token")
Page({
  data: {
    inputState: true,
    elective: true,
    searchImg: true,
    searchValue: "",
    pageType: "",
    terms: app.globalData.terms,
    term_index: 0,
    year_index: 0,
    month_index: app.globalData.currentMonth,
    years: app.globalData.years,
    months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    type: '',
    //新变量
    term_option: app.termOption,
    term_index: 0,
    page: 1,
    pageSize: 6,
    aduitPage: 1,
    aduitTotal: 0,
    audit_last_page: 1,
    last_page: 1,
    meetings: [],
    aduitMeeting: [],
    pageType: '',
    token: '',
    checked: false,
    isSearch: false,
    searchList: []
  },
  /**
 * 生命周期函数--监听页面加载
 */

change:function(){
  let {checked, aduitMeeting} = this.data
  this.setData({
    checked: !checked
  })
  if(!checked){
    if(aduitMeeting.length == 0){
      this.getPendingList()
    }
  }
},

  getMeetingList: function(type){
    wx.showLoading({
      title: '加载中',
    })
    let {page, pageSize} = this.data 
    wx.getStorage({
      key: 'token',
      success: (token) => {
        wx.request({
          url: app.globalData.post_url+'/admin/getMeetingList',
          method: 'POST',
          dataType: 'json',
          header: {
            "content-type": "application/json",
            "Authorization": `Bearer ${token.data}`
          },
          data: {
            data: {
              page: page,
              per_page: pageSize
            }
          },
          success:  (res) => {
           //console.log(res0.data.msg);
            let {code, msg, data} =res.data
            wx.hideLoading({
              success: (res) => {},
            })
            if(code!=0){
              wx.showToast({
                title: '请求出错',
                icon: 'none'
              })
              return
            }
            let {meetings} = this.data
            let {data: meetingList, total, last_page} = data
            this.setData({
              meetings: [...meetings,...meetingList],
              page: page+1,
              total: total,
              last_page: last_page
            })
            // if (res0.data.code === 200) {
            //   that.setData({
            //     meetings: res0.data.msg,
            //   })
            //   for (let i = 0; i < res0.data.msg.length; i++) {
            //     let date = that.data.meetings[i].b_time.split('/');
            //     that.data.meetings[i].year = date[0];
            //     that.data.meetings[i].month = date[1];
            //     that.data.meetings[i].day = date[2];
            //     that.setData({
            //       meetings: that.data.meetings
            //     })
            //   }
            // } else if (res0.data.code === 400) {
            //   that.setData({
            //     meetings: []
            //   })
            // }
          }
        })
      }
    })
  },

  getPendingList: function(){
    wx.showLoading({
      title: '加载中',
    })
    let {aduitPage, pageSize, token, rank} = this.data
    wx.request({
      url: app.globalData.post_url+(rank==1?'/super/getPendingMeetingList': '/admin/getPendingMeetingList'),
      method: 'POST',
      dataType: 'json',
     header: {
       "content-type": "application/json",
       "Authorization": `Bearer ${token}`
     },
     data: {
      data: {
      page: aduitPage,
      per_page: pageSize
        }
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
       let {aduitMeeting} = this.data
            let {data: meetingList, total, last_page} = data
            this.setData({
              aduitMeeting: [...aduitMeeting,...meetingList],
              aduitPage: aduitPage+1,
              aduitTotal: total,
              audit_last_page: last_page
            })
     }
    })
  },

  getList: function(){
    let {pageType} = this.data
    
    if(!pageType){
      this.getMeetingList()
    }else if(pageType === 'meetingCheck'){
      wx.setNavigationBarTitle({
        title: '会议审核',
      })
      this.getPendingList()
    }
  },

  onLoad: function (options) { 
    let that = this
    let token = wx.getStorageSync('token')
    let rank = wx.getStorageSync('rank')
    that.setData({
      options:options,
      pageType: options.pageType||'',
      token: token,
      rank: rank
    }, this.getList)
    
    // if (options.pageType === 'meetingCheck') {
    //   wx.setNavigationBarTitle({
    //     title: '会议审核',
    //   })
    //   that.setData({
    //     inputState: false,
    //     pageType: "meetingCheck",
    //   })
    //   wx.getStorage({
    //     key: 'token',
    //     success: function (res) {
    //      //console.log(res.data),
    //         wx.request({
    //           url: app.globalData.post_url,
    //           method: 'POST',
    //           dataType: 'json',
    //           header: {
    //             "content-type": "application/json"
    //           },
    //           data: {
    //             token: res.data,
    //             type: "B033",   //会议审核接口
    //             data: {
    //               page: 0,
    //               size: 0,
    //               term: that.data.terms[0],
    //               },   
    //             },
    //           success: function (res0) {
    //            console.log(res0);
    //             if (res0.data.code === 200) {
    //               that.setData({
    //                 meetings: res0.data.msg,
    //               })
    //               for (let i=0;i<res0.data.msg.length;i++){
    //                 let date = that.data.meetings[i].b_time.split('/');
    //                 that.data.meetings[i].year = date[0];
    //                 that.data.meetings[i].month = date[1];
    //                 that.data.meetings[i].day = date[2];
    //                 that.setData({
    //                   meetings: that.data.meetings,
    //                   type: options.pageType
    //                 })
    //               }
                  
    //             } else if (res0.data.code === 400) {
    //               that.setData({
    //                 meetings: [],
    //               })
    //             }
    //           }
    //         })
    //     },
    //   })
    // } else if (options.pageType === 'addCheck') {
    //   wx.setNavigationBarTitle({
    //     title: '补录审核',
    //   })
    //   that.setData({
    //     inputState: false,
    //     pageType: "addCheck",
    //   })
    //   wx.getStorage({
    //     key: 'token',
    //     success: function (res) {
    //      //console.log(res.data),
    //         wx.request({
    //           url: app.globalData.post_url,
    //           method: 'POST',
    //           dataType: 'json',
    //           header: {
    //             "content-type": "application/json"
    //           },
    //           data: {
    //             token: res.data,
    //             type: "B062",   //补录审核接口
    //             data: {
    //               term: that.data.terms[0],
    //             },
    //           },
    //           success: function (res0) {
    //            //console.log(res0.data.msg);
    //             if (res0.data.code === 200) {
    //               that.setData({
    //                 meetings: res0.data.msg,
    //               })
    //               for (let i = 0; i < res0.data.msg.length; i++) {
    //                 let date = that.data.meetings[i].b_time.split('/');
    //                 that.data.meetings[i].year = date[0];
    //                 that.data.meetings[i].month = date[1];
    //                 that.data.meetings[i].day = date[2];
    //                 that.setData({
    //                   meetings: that.data.meetings,
    //                   type: options.pageType
    //                 })
    //               }

    //             }
    //           }
    //         })
    //     }
    //   })
    // } else {
      
    // }
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {

  },
  //改变学期
  switchTerm: function(e){
    let value = e.detail.value
    this.setData({
      term_index: value
    })
  },

  //搜索框聚焦
  searchFocus: function (e) {
    this.setData({
      searchImg: false,
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
    let {searchValue, meetingList, pageType, checked, aduitMeeting} = this.data
    let data = pageType == ''&&!checked? meetingList :aduitMeeting
    let searchList = data.filter((item) => {
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
  getSearchKey: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
    //this.search(e.detail.value)
  },
  //搜索方法
  search: function (key) {
    var that = this;
    if (key !== '') {
      this.setData({
        searchImg: false
      })
    }
    else {
      this.setData({
        searchImg: true
      })
    }
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
            "type": "B034",   //会议查看接口
            data: {
              search_key: key, // 两个同时为0是获取所有条数
              term: that.data.terms[that.data.term_index]
            }
          },
          success: function (res0) {
           //console.log(res0.data.msg);
            if (res0.data.code === 200) {
              that.setData({
                meetings: res0.data.msg,
              })
              for (let i = 0; i < res0.data.msg.length; i++) {
                let date = that.data.meetings[i].b_time.split('/');
                that.data.meetings[i].year = date[0];
                that.data.meetings[i].month = date[1];
                that.data.meetings[i].day = date[2];
                that.setData({
                  meetings: that.data.meetings
                })
              }
            }
          }
        })
      },
    })
  },

  toDetail: function (e) {
    ////console.log(e.currentTarget.dataset.mid)
    if (this.data.pageType === "meetingCheck"||this.data.checked) {
      wx.navigateTo({
        url: '../meetingCheck/meetingCheck?id=' + e.currentTarget.dataset.mid + '&pageType=check',
      })
    } else if (this.data.pageType === "addCheck"){
      wx.navigateTo({
        url: '../meetingCheck/meetingCheck?id=' + e.currentTarget.dataset.mid + '&pageType=add',
      })
    } else {
      wx.navigateTo({
        url: '../detail/detail?id=' + e.currentTarget.dataset.mid,
      })
    }
  },
  //改变时间查看
  switchYear: function (e) {
    var that = this;
    let year = that.data.years[e.detail.value]
    that.setData({
      year_index:e.detail.value
    })
    wx.request({
      url: app.globalData.post_url,
      method: "POST",
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      data: {
        token: token,
        type: 'B049',   //会议查看接口
        data: {
          year: year,
          month: that.data.months[that.data.month_index]
        }
      },
      success: function (res) {
      //console.log(res)
        if (res.data.code == 200) {
          that.setData({
            meetings: res.data.msg,
            year_index: e.detail.value
          })
          for (let i = 0; i < res.data.msg.length; i++) {
            let date = that.data.meetings[i].b_time.split('/');
            that.data.meetings[i].year = date[0];
            that.data.meetings[i].month = date[1];
            that.data.meetings[i].day = date[2];
            that.setData({
              meetings: that.data.meetings
            })
          }
        } else {
          that.setData({
            meetings: []
          })
        }
      },
    });
  },
  switchMonth: function (e) {
    var that = this;
    let month = that.data.months[e.detail.value]
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
        token: token,
        type: 'B049',   //会议查看接口
        data: {
          year: that.data.years[that.data.year_index],
          month: month
        }
      },
      success: function (res) {
      console.log(res)
        if (res.data.code == 200) {
          that.setData({
            meetings: res.data.msg,
            month_index: e.detail.value
          })
          for (let i = 0; i < res.data.msg.length; i++) {
            let date = that.data.meetings[i].b_time.split('/');
            that.data.meetings[i].year = date[0];
            that.data.meetings[i].month = date[1];
            that.data.meetings[i].day = date[2];
            that.setData({
              meetings: that.data.meetings
            })
          }
        } else {
          that.setData({
            meetings: []
          })
        }
      },
    });
  },
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
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showModal({
      title: '提示',
      content: '是否重新请求数据?',
      success: (res) => {
        if(res.confirm){
          if(this.data.pageType ==''&&!this.data.checked){
            this.setData({
              page:1,
              meetings: []
            }, this.getMeetingList)
          }else{
            this.setData({
              aduitPage:1,
              aduitMeeting: []
            }, this.getPendingList)
          }
        }
      }
    })
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let {page, last_page, aduitPage, audit_last_page,pageType, checked} = this.data
    if(pageType ==''&&!checked){
      if(page>last_page){
        wx.showToast({
          title: '没有更多数据',
          icon: 'none'
        })
        return
      }
      this.getMeetingList()
    }else{
      if(aduitPage>audit_last_page){
        wx.showToast({
          title: '没有更多数据',
          icon: 'none'
        })
        return
      }
      this.getPendingList()
    }
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

