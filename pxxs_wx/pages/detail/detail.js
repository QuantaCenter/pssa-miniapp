// pages/detail/detail.js
const app = getApp()
var options = {};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "https://pssa.quantacenter.com/sign/public/",
    folded: "",
    need_folded: false,
    is_folded: false,
    hidden:false,
    leaveReason: '',
    b_time: [],
    stateObject: app.stateObject,
    e_time: [],
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onPullDownRefresh: function () {
    // this.onLoad(options);
    this.getMeeting()
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
  },
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '正在加载',
    //   mask: true
    // })
    try{
      let token = wx.getStorageSync('token')
      this.setData({
        id: options.id,
        type: options.type,
        options:options,
        token: token
      }, this.getMeeting)
    }catch(e){
      wx.showToast({
        title: '登录状态过期',
        icon: 'none'
      })
      console.log(e)
    }
    // this.getMeeting(options.id)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },


  getMeeting: function () {
    var that = this;
    let {type, id, token} = this.data
    //console.log(type)
    if(type === "3"){
      return
    }
    wx.showLoading({
      title: "加载中"
    })
    
      wx.request({
        url: app.globalData.post_url+'/user/getMeeting',
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
        success:  (res) => {
         console.log(res)
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
         let is_folded = data.introduction.length>40
         this.setData({
          meeting: data,
          folded: is_folded? data.introduction.slice(0, 40)+'.....' : data.introduction,
          need_folded: is_folded,
         })

         //console.log(res0.data.msg)
          //console.log(that.data.b_time)
         
        },
        fail: (err) => {
          wx.hideLoading({
            success: (res) => {},
          })
          wx.showToast({
            title: '服务器出错',
            icon: 'none'
          })
        }
      })
      
  },

  signUp: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定报名吗，报名后将无法取消',
      confirmColor: "#00478b",
      success: (res) => {
        let {token, id} = this.data
        if (res.confirm) {
          wx.showLoading({
            title: '正在报名',
            mask: true
          })

          wx.request({
            url: app.globalData.post_url+'/user/signUp',
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
            success:  (res) => {
             
             let {code, msg} = res.data
             wx.hideLoading({
               success: (res) => {},
             })
             if(code !== 0){
               wx.showToast({
                icon:'none',
                title: code,
                duration: 1000,
                mask: true,
              })
               return
             }
             wx.showToast({
              title: '报名成功',
              duration: 1000,
              mask: true,
            })
            this.getMeeting();
            }
          })
        } else if (res.cancel) {

        }
      }
    })

  },

  scanCode: function(type){
    let config = type=='checkIn'? {
      url: '/user/checkIn',
      successWord: '签到成功',
      failWord: '签到成功'
    } : {
      url: '/user/checkOut',
      successWord: '签退成功',
      failWord: '签退失败'
    }
    let {token}= this.data
    wx.scanCode({
      onlyFromCamera: true,
      success:  (res) => {
       //console.log(res)
        let result = JSON.parse(res.result) || false
        if(result){
          wx.request({
            url: app.globalData.post_url+config.url,
            dataType: 'json',
            method: "POST",
            header: {
            "contentType": "aplication/json",
            'Authorization': `Bearer ${token}`
            },
           data: {
             data: {
                secret: result.code,
                meeting: result.meeting
              }
            },
            success: (res) => {
              let {code, msg} = res.data
              if(code !== 0){
                wx.showToast({
                  title: '请重新扫码',
                  icon: 'none'
                })
                return
              }
              this.getMeeting()
              setTimeout(() => {
                wx.navigateTo({
                  url: '../index/success?word='+config.successWord+"&id="+result.meeting,
                })
              }, 0)
              
            },
            fail: (err) => {
              wx.navigateTo({
                url: '../index/fail?word='+config.failWord,
              })
            }
          })
        }else{
          wx.showToast({
            title: '请重新扫码',
            icon: 'none'
          })
        }
      },
      fail: function (res) {
       //console.log(res)
        wx.navigateTo({
          url: '../index/fail?word='+config.failWord,
        })
      }
    })
  },

  checkOutMeeting:function(){
    this.scanCode('checkOut')
  },

  checkInMeeting: function (e) {
    //console.log(e.currentTarget.dataset.meetingId);
  
    // arr[e.currentTarget.dataset.index] = true;
    this.scanCode('checkIn')
  },
  fold: function () {
    this.setData({
      is_folded: !this.data.is_folded
    })
  },
  askForLeave: function () {
    var that = this;
    this.setData({
      hidden:true,
      leaveReason:'',
    })
  },
  getReason: function (e) {
    this.setData({
      leaveReason: e.detail.value
    })
    //console.log(this.data.leaveReason)
  },
  checkReason: function(){
    wx.request({
      url: app.globalData.post_url,
      dataType: 'json',
      method: "POST",
      header: {
        "contentType": "aplication/json"
      },
      data: {
        'type': 'A018',
        token: app.globalData.token,
        data: {
          id: this.data.id,
        }
      },
      success: function (res0) {
        wx:wx.showModal({
          title: '未通过原因',
          content: res0.data.msg || '无',
          showCancel: false,
        })
      }
    })
  },
  confirm: function(e) {
    var that = this;
    let {leaveReason, id, token} =this.data
    if (leaveReason === '') {
      wx.showModal({
        title: '提示',
        content: '请输入理由',
        showCancel: false,
      })
      return
    }
    
      wx.showLoading({
        title: '正在请假',
        mask: true
      })
      wx.request({
        url: app.globalData.post_url+'/user/askLeave',
        dataType: 'json',
        method: "POST",
        header: {
          "contentType": "aplication/json",
          'Authorization': `Bearer ${token}`
        },
        data: {
          data: {
            meeting: id,
            reason: leaveReason
          }
        },
        success: (res) => {
          //console.log(res0)
          let {code, msg} =res.data
          wx.hideLoading()
      
          if(code !== 0){
            wx.showToast({
              icon: 'none',
              title: '请假失败',
            })
            return
          }

          wx.showToast({
            title: '已提交申请',
          })
          this.setData({
            hidden: false,
          }, this.getMeeting)
        }
      })
      
    
    
  },
  cancel: function() {
    // leaveReason = '',
    this.setData({
      hidden:false,
    })
  },
})

// if (result.type) {
          //   wx.request({
          //     url: app.globalData.post_url,
          //     method: "POST",
          //     dataType: 'json',
          //     header: { 'content-type': 'application/json' },
          //     data: {
          //       "token": token,
          //       "type": "A007",
          //       "data": {
          //         "code_id": result.code_id,
          //         "meeting_id": result.meeting_id
          //       }
          //     },
          //     success: function (res) {
          //      //console.log(res)
          //       if (res.data.code == 200) {
          //         wx.navigateTo({
          //           url: '../index/success?word=你已签到',
          //         })
          //       } else {
          //         wx.navigateTo({
          //           url: '../index/fail?word=签到失败',
          //         })
          //       }

          //     },
          //     fail: function (res) {
          //       wx.navigateTo({
          //         url: '../index/fail?word=签到失败',
          //       })
          //     }
          //   })
          // } else {
          //   wx.request({
          //     url: app.globalData.post_url,
          //     method: "POST",
          //     dataType: 'json',
          //     header: { 'content-type': 'application/json' },
          //     data: {
          //       "token": token,
          //       "type": "A007",
          //       "data": {
          //         "code_id": result.code_id,
          //         "meeting_id": result.meeting_id
          //       }
          //     },
          //     success: function (res) {
          //      //console.log(res)
          //       //console.log(JSON.parse(res.result).code_id)
          //       //console.log(JSON.parse(res.result).meeting_id)
          //       if (res.data.code == 200) {
          //         wx.navigateTo({
          //           url: '../index/success?word=签到成功',
          //         })
          //       } else {
          //         wx.navigateTo({
          //           url: '../index/fail?word=签到失败',
          //         })
          //       }

          //     },
          //     fail: function (res) {
          //       wx.navigateTo({
          //         url: '../index/fail?word=签到失败',
          //       })
          //     }
          //   })
          // }