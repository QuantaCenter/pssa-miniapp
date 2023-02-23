// pages/detail/detail.js
const app = getApp()
var options = {};
var rank = wx.getStorageSync("rank")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    folded: "",
    url: "https://sign.yiluzou.cn/sign/public/",
    need_folded: true,
    is_folded: true,
    hidden: false,
    message:'',
    content:'',
    rank: rank,
    meeting: {},
    stateObject: app.stateObject,
    token: '',
    meeting_id: '',
    tableData: []
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onPullDownRefresh: function () {
    this.getMeeting();
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    let token = wx.getStorageSync('token')
    let rank = wx.getStorageSync('rank')
    this.setData({
      meeting_id: options.id,
      options:options,
      token: token,
      rank: rank
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMeeting()
  },


  getMeeting: function () {
    //console.log(id)
    
    let {meeting_id, token} = this.data

    wx.showLoading({
      title: '加载中',
    })
    
        wx.request({
          url: app.globalData.post_url+'/admin/getMeeting',
          dataType: 'json',
          method: 'POST',
          header: {
            "contentType": "aplication/json",
            "Authorization": `Bearer ${token}`
          },
          data: {
            data: {
              meeting: meeting_id
            }
          },
          success: (res) => {
            let {code, msg, data} = res.data
            wx.hideLoading({
              success: (res) => {},
            })
            if(code !== 0){
              wx.showToast({
                title: '请求出错',
                icon: 'none'
              })
              wx.redirectTo({
                url: '../meeting/meeting',
              })
              return
            }
            let tableData = []
            if(data.type === 1){
              let preMajor = '';
              (data.people||[]).forEach((item) => {
                if(item.major !== preMajor){
                  preMajor = item.major;
                  tableData.push({
                    department: item.major,
                    info: [item]
                  })
                }else{
                  tableData[tableData.length-1].info.push(item)
                }
              })
            }else{
              tableData = data.majors||[]
            }
            this.setData({
              meeting: data,
              folded: data.introduction.length>40? data.introduction.slice(0, 40) + '......': '',
              need_folded: data.introduction.length>40,
              tableData: tableData
            })
          },
          fail: (err) => {
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: '请求出错',
              icon: 'none'
            })
            wx.redirectTo({
              url: '../meeting/meeting',
            })
          }
        })

    // wx.request({
    //   url: app.globalData.post_url,
    //   dataType: 'json',
    //   method: "POST",
    //   header: {
    //     "contentType": "aplication/json"
    //   },
    //   data: {
    //     'type': 'B005',
    //     token: app.globalData.token,
    //     data: {
    //       id: id
    //     }
    //   },
    //   success: function (res0) {
    //    console.log(res0)
    //     if (res0.data.code === 200) {
    //       let mem = [];
    //       for (let i = 0; i < res0.data.msg.member.length; i++) {
    //         if (res0.data.msg.member[i].info.length !== 0) {
    //           mem.push(res0.data.msg.member[i])
    //         }
    //       }
    //       that.setData({
    //         member: mem,
    //       })
    //       if (res0.data.msg.introduction.length > 40) {
    //         that.setData({
    //           meeting: res0.data.msg,
    //           folded: res0.data.msg.introduction.slice(0, 40) + '......',
    //           need_folded: true
    //         })
    //       } else {
    //         that.setData({
    //           meeting: res0.data.msg,
    //           meeting_id: id
    //         })
    //       }
    //     } else if (res0.data.code === 400) {
    //       wx.showToast({
    //         title: '会议查看错误，请刷新重试',
    //         icon: 'none'
    //       })
    //       wx.redirectTo({
    //         url: '../meeting/meeting',
    //       })
    //     } else {
    //       wx.showToast({
    //         title: res0.data.msg,
    //         icon: 'none'
    //       })
    //     }
    //     wx.hideLoading()
    //   }

    // })
  },
  //发送通知
  sendMsg: function () {
    this.setData({
      hidden: true,
    })
  },

  toNameList: function () {
    wx.showToast({
      title: '暂时无法补录',
      icon: 'none'
    })
    return
    if (!this.data.change) {
      let type = "addMember"
      wx.navigateTo({
        url: '../selectMember/selectMember?&id=' + this.data.meeting_id + '&pageType=makeUp',
      })
    }
  },
  getContent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  toSign: function (e) {
    var that = this;
    wx.showLoading({
      title: '正在发送',
      mask: true
    })
    wx.request({
      url: app.globalData.post_url,
      dataType: 'json',
      method: "POST",
      header: {
        "contentType": "aplication/json"
      },
      data: {
        'type': 'B066',   //发送给已报名接口
        token: app.globalData.token,
        data: {
          id: this.data.meeting_id,
          message: this.data.content
        }
      },
      success: function (res0) {
        //console.log(res0)
        if (res0.data.code === 200) {
          wx.showToast({
            title: '已发送',
            icon: 'none',
            duration: 3000,
            mask: true,
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
    this.setData({
      hidden: false,
    })
  },
  //发送给可报名接口
  toChoose: function (e) {
    var that = this;
    wx.showLoading({
      title: '正在发送',
      mask: true
    })
    wx.request({
      url: app.globalData.post_url,
      dataType: 'json',
      method: "POST",
      header: {
        "contentType": "aplication/json"
      },
      data: {
        'type': 'B067',   
        token: app.globalData.token,
        data: {
          id: this.data.meeting_id,
          message: this.data.content
        }
      },
      success: function (res0) {
        console.log(res0)
        if (res0.data.code === 200) {
          wx.showToast({
            title: '已发送',
            icon: 'none',
            duration: 3000,
            mask: true,
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
    this.setData({
      hidden: false,
    })
  },

  cancel: function () {
    this.setData({
      hidden: false,
    })
  },
  //请假审核详情查看
  toLeaveCheck: function () {
    wx.navigateTo({
      url: '../leaveCheck/leaveCheck?id=' + this.data.meeting_id,
    })
  },
  //
  toAttend: function () {
    wx.navigateTo({
      url: '../attend/attend?id=' + this.data.meeting_id + '&state=' + this.data.meeting.state +'&type=' + this.data.meeting.type,
    })
  },
  //补录
  toSelect: function () {
    wx.navigateTo({
      url: '../selectMember/selectMember?id=' + this.data.meeting_id + '&pageType=addMember',
    })
  },
  //会议详情显示
  fold: function () {
    this.setData({
      is_folded: !this.data.is_folded
    })
  },
  //删除会议
  deleteMeeting: function () {
    let {meeting_id, token} =this.data
    wx.showModal({
      title: '确认删除吗？',
      content: '删除后将无法恢复',
      confirmColor: "#00478b",
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中',
          })
          wx.request({
            url: app.globalData.post_url+'/super/deleteMeeting',
            dataType: 'json',
            method: "POST",
            header: {
              "contentType": "aplication/json",
              "Authorization": `Bearer ${token}`
            },
            data: {
              data: {
                meeting: meeting_id
              }
            },
            success: res => {
              wx.hideLoading({
                success: (res) => {},
              })
              let {code, msg} = res.data
              if(code !== 0){
                wx.showToast({
                  title: '操作失败',
                  icon: 'none'
                })
                return
              }
              wx.showToast({
                title: '删除成功',
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                })
              }, 500)
            }
          })
        }
      }
    })
  },
  //编辑会议
  toPublish: function () {
    wx.navigateTo({
      url: '../publish/publish?change=change&&meeting=' + JSON.stringify(this.data.meeting),
    })
  },
  //结束会议
  endMeeting: function () {
    let {token, meeting_id} = this.data
    wx.showModal({
      title: '提示',
      content: '确定结束会议吗',
      confirmColor: "#00478b",
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.post_url+'/admin/endMeeting',
            dataType: 'json',
            method: "POST",
            header: {
              "contentType": "aplication/json",
              "Authorization": `Bearer ${token}`
            },
            data: {
              data: {
                meeting: meeting_id
              }
            },
            success: res => {
              //console.log(res0)
              let {code} = res.data
              if(code != 0){
                wx.showToast({
                  title: '操作失败',
                  icon: 'none'
                })
                return
              }
              this.getMeeting()
            }
          })
        }
      }
    })

  },
  //开始会议
  startMeeting: function () {
    let {token, meeting_id} = this.data
    wx.showModal({
      title: '提示',
      content: '开始后将无法进行报名',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.post_url+'/admin/startMeeting',
            dataType: 'json',
            method: "POST",
            header: {
              "contentType": "aplication/json",
              "Authorization": `Bearer ${token}`
            },
            data: {
              data: {
                meeting: meeting_id
              }
            },
            success: res => {
              let {code} = res.data
              if(code != 0){
                wx.showToast({
                  title: '操作失败',
                  icon: 'none'
                })
                return
              }
              this.getMeeting()
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  //签到码
  signCode: function () {
    wx.navigateTo({
      url: '../showCode/showCode?code=sign&id=' + this.data.meeting_id
    })
  },
  signOutCode: function(){
    wx.navigateTo({
      url: '../showCode/showCode?code=signOut&id=' + this.data.meeting_id
    })
  },
  toSignList: function(){
    wx.navigateTo({
      url: '/pages/sign/sign?id='+this.data.meeting_id,
    })
  }
})