// pages/detail/detail.js
const app = getApp()
var options = {};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "https://sign.yiluzou.cn/sign/public/",
    meeting: [],
    member: [],
    folded: "",
    need_folded: true,
    is_folded: true,
    hidden: false,
    message: '',
    meeting_id: '',
    reason:'',
    token: '',
    tableData: [],
    stateOption: {
      "0": "未审核",
      "1": "审核通过",
      "2": "不通过"
    }
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
    // this.getMeeting(options.id)
    let token = wx.getStorageSync('token')
    let rank = wx.getStorageSync('rank')
    this.setData({
      meeting_id: options.id,
      pageType: options.pageType,
      options:options,
      token: token,
      rank: rank
    })
    console.log(options)
    console.log(this.data.pageType)
    this.getMeeting(this.data.meeting_id)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onPullDownRefresh: function () {
    this.onLoad(this.data.options);
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
  }, 
  onShow: function () {},
  getMeeting: function (id) {
    wx.showLoading({
      title: '加载中',
    })
    let {meeting_id, token} = this.data
    wx.request({
      url: app.globalData.post_url+'/admin/getPendingMeeting',
      dataType: 'json',
      method: 'POST',
      header: {
        "contentType": "aplication/json",
        'Authorization': `Bearer ${token}`
      },
      data: {
        data: {
          meeting: meeting_id
        }
      },
      success: (res) => {
        wx.hideLoading({
          success: (res) => {},
        })
        let {code, msg, data} = res.data
        if(code !== 0){
          wx.showToast({
            title: '请求出错',
            icon: 'none'
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
              tableData = data.major||[]
            }
            this.setData({
              meeting: data,
              folded: data.introduction.length>40? res0.data.msg.introduction.slice(0, 40) + '......': '',
              need_folded: data.introduction.length>40,
              tableData: tableData
            })
      },
      fail: (err) => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    })
  },
  askForReason: function () {
    var that = this;
    this.setData({
      hidden: true,
      reason: '',
    })
  },
  getReason: function (e) {
    this.setData({
      reason: e.detail.value
    })
    //console.log(this.data.reason)
  },
  cancel: function () {
    this.setData({
      hidden: false,
    })
  },
  //显示姓名
  showMore: function (e) {
    var that = this
    let index = e.currentTarget.dataset.index
    this.data.showMore[index] = !this.data.showMore[index]
    //console.log(index)
    this.setData({
      showMore: this.data.showMore
    })
  },
  //会议详情显示
  fold: function () {
    this.setData({
      is_folded: !this.data.is_folded
    })
  },
  checkFail: function() {
    let that = this
    let {token, meeting_id,reason} = this.data
    wx.showModal({
      title: '提示',
      content: '确定不通过该会议申请吗，确定后无法取消',
      confirmColor: "#00478b",
      success: (res)=> {
        wx.showLoading({
          title: '正在进行',
        })
        if (res.confirm) {
          wx.request({
            url: app.globalData.post_url+'/super/rejectMeeting',
            dataType: 'json',
            method: "POST",
            header: {
              "contentType": "aplication/json",
              'Authorization': `Bearer ${token}`
            },
            data: {
              data: {
                "meeting": meeting_id,
                "reason":  reason
              }
            },
            success:  (res) => {
              wx.hideLoading({
                success: (res) => {},
              })
              let {code, msg} =res.data
              if(code!==0){
                wx.showToast({
                  title: '请求出错',
                  icon: 'none'
                })
                return
              }
              wx.showToast({
                title: '操作成功',
              })
              this.setData({
                hidden: false
              })
              this.getMeeting()
            },
            fail: () => {
              wx.hideLoading()
              wx.showToast({
                title: '服务器出错',
                icon: 'none'
              })
            }
          })
        }
      
      }
    })
  },
  
  checkPass: function () {
    let that = this
    let {token, meeting_id} = this.data
    wx.showModal({
      title: '提示',
      content: '确定通过该会议申请吗，确定后无法取消',
      confirmColor: "#00478b",
      success: (res) => {
        wx.showLoading({
          title: '正在进行',
        })
        if (res.confirm) {
          wx.request({
            url: app.globalData.post_url+'/super/grantMeeting',
            dataType: 'json',
            method: "POST",
            header: {
              "contentType": "aplication/json",
              'Authorization': `Bearer ${token}`
            },
            data: {
              data: {
                meeting: meeting_id
              }
            },
            success:  (res) => {
              //console.log(res0)
              wx.hideLoading()
              let {code, msg} =res.data
              if(code!==0){
                wx.showToast({
                  title: '请求出错',
                  icon: 'none'
                })
                return
              }
              wx.showToast({
                title: '操作成功',
              })
              this.getMeeting()
            },
            fail: () => {
              wx.hideLoading()
              wx.showToast({
                title: '服务器出错',
                icon: 'none'
              })
            }
          })
        }
      
      }
    })
  },

  showReason: function(){
    wx.showModal({
      showCancel: false,
      title: '不通过原因',
      content: this.data.meeting.reason
    })
  }
})