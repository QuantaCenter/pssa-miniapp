var terms = [];
var app = getApp();
// pages/me/me.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    terms: app.globalData.terms,
    term_index: 0,
    end_meeting: [],
    sign_meeting: []
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try{
      let token = wx.getStorageSync('token')
      this.setData({
        token: token
      }, this.getUserInfo)
    }catch(e){
      wx.showToast({
        title: '登录状态过期',
        icon: 'none'
      })
      console.log(e)
    }
  },

  getAttendInfo: function(){
    wx.request({
      url: app.globalData.post_url+'/user/getPresenceInfo',
      data: {
        "data": {
          "term": ""
        }
      },
      method: "POST",
       header: { 
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
  },

  getUserInfo:  function(){
    let {token} = this.data
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.post_url+"/index/getUserInfo",
      method: "POST",
      header: { 
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        let {code, msg, data} = res.data
        wx.hideLoading({
          success: (res) => {},
        })
        if(code !== 0){
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          })
          return
        }
        this.setData({
          userInfo: data
        })
        this.switchTerm()
        this.getList()
      }
    })
  },

  getList: function(){
    let {token} = this.data
    // /user/getSignedMeetingList
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.post_url+"/user/getSignedMeetingList",
      method: "POST",
      header: { 
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        let {code, msg, data} = res.data
        wx.hideLoading({
          success: (res) => {},
        })
        if(code !== 0){
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          })
          return
        }
        
        let signList = [], endList = []
         data.forEach(item => {
           if(item.state == 3) endList.push(item);
           else signList.push(item);
         })

        this.setData({
          end_meeting: endList,
          sign_meeting: signList
        })
      }
    })
  },

  onPullDownRefresh: function () {
    this.getUserInfo()
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // var that = this;
    // let token = wx.getStorageSync('token')
    // wx.request({
    //   url: app.globalData.post_url,
    //   method: "POST",
    //   dataType: 'json',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   data: {
    //     token: token,
    //     type: 'A004',
    //     data: {
    //       term: "all"
    //     }
    //   },
    //   success: function (res) {
    //    console.log(res)
    //     let sign_meeting = []
    //     let end_meeting = []
    //     let j = 0
    //     let k = 0
    //     if (res.data.code == 200) {
    //       console.log(res)
    //       for (let i = 0; i < res.data.msg.meeting.length; i++) {
    //         if (res.data.msg.meeting[i].state === "已结束") {
    //           end_meeting[j] = res.data.msg.meeting[i]
    //           j++
    //         } else {
    //             sign_meeting[k] = res.data.msg.meeting[i]
    //             k++
    //         }
    //       }
    //       that.setData({
    //         info:res.data.msg,
    //         meetings: res.data.msg.meeting,
    //         sign_meeting: sign_meeting,
    //         end_meeting: end_meeting,
    //         token:token
    //       })

    //     } else if (res.data.code === 401) {
    //       wx.showToast({
    //         title: '身份已过期，请重新登录',
    //         icon: 'none',
    //         duration: 3000,
    //         mask: true,
    //       })
    //       // setTimeout(function () {
    //       //   wx.removeStorage({
    //       //     key: 'token',
    //       //     success: function (res) {
    //       //       wx.redirectTo({
    //       //         url: '../login/login',
    //       //       })
    //       //     },
    //       //   })
    //       // }, 1000)
    //     }
    //   },
    // });
  },

  changeTerm:function(e){
    let value = e.detail.value
    this.setData({
      term_index: value
    }, this.switchTerm)
  },

  switchTerm: function () {
    let {token, term_index, terms} = this.data
    let pdata = terms[term_index].replace("-","");
    let tdata = pdata.replace("-","")
    //console.log(tdata)
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.post_url+'/user/getPresenceInfo',
      method: "POST",
      dataType: 'json',
      header: { 
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
         },
      data: {
        data: {
          term: tdata === '全部时段' ? '' : tdata
        }
      },
      success: (res) => {
        let {code, msg, data} = res.data
      if(code !== 0){
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
        return
      }
      this.setData({
        attendInfo: data
      })
      wx.hideLoading({
        success: (res) => {},
      })
      },
      fail: () => {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }
      // success: function (res) {
      //   console.log(res)
      //   let sign_meeting = []
      //   let end_meeting = []
      //   let j = 0
      //   let k = 0
      //   //console.log(sign_meeting.length)
      //   if (res.data.code == 200) {
      //     for (let i = 0; i < res.data.msg.meeting.length; i++) {
      //       if (res.data.msg.meeting[i].state === "已结束") {
      //         end_meeting[j] = res.data.msg.meeting[i]
      //         j++
      //       } else {
      //         sign_meeting[k] = res.data.msg.meeting[i]
      //         k++
      //       }
      //     }
      //     that.setData({
      //       info: res.data.msg,
      //       meetings: res.data.msg.meeting,
      //       sign_meeting: sign_meeting,
      //       end_meeting: end_meeting,
      //       term_index: e.detail.value
      //     })
      //     //console.log(that.data.sign_meeting)
      //     //console.log(that.data.end_meeting)

      //   } else {
      //   }
      // },
    });
  },

  toDetail: function (e) {
   // console.log(e.currentTarget.dataset.mid)
   // console.log(e.currentTarget.dataset.type)
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.mid + '&type=' + e.currentTarget.dataset.type
    })
  },
})