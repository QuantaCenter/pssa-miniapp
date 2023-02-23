// pages/teacher/publish/publish.js
const app = getApp()
let edit_member = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rank: app.globalData.rank,
    all_level: ['国家级', '省市级', '校级'],
    must: false,
    chosen: false,
    introduction: '',
    date: '',
    term_index: 0,
    hiddenName: false,
    hiddenPos: false,
    member: [],
    all_dept: [
      '其他', '英语语言文化学院', '经济贸易学院', '国际商务英语学院', '商学院', '会计学院', '金融学院', '西方语言文化学院', '日语语言文化学院', '东方语言文化学院', '中国语言文化学院', '法学院', '国际关系学院', '英语教育学院', '信息科学与技术学院', '社会与公共管理学院', '高级翻译学院', '新闻与传播学院', '艺术学院', '数学与统计学院', '继教公开学院', '国际学院', '创新创业教育学院', '学生处', '校团委', '学生就业指导中心', '研究生部', '关工委'],
    all_kind: ["思想理论教育和价值引领", "党团和班级建设", "学风建设", "学生日常事务管理", "心理健康教育与咨询工作", "网络思想政治教育", "校园危机事件应对", "职业规划与就业创业指导", "理论和实践研究", "非其他"
    ],
    status: '待审核',
    term: app.globalData.currentTerm,
    term1: "",
    term2: "",
    term3: "",
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  //人员选择显示
  onShow: function () {
    var member = wx.getStorageSync('member')
    let a = this.data.term.split('-')
    this.term1 = a[0];
    this.term2 = a[1];
    this.term3 = a[2];
    this.setData({
      member: member,
      term1:this.term1,
      term2:this.term2,
      term3:this.term3
    })
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
  getName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //清除图标
  bindKeyFocus: function (e) {
    this.setData({
      hiddenName: true,
    })
  },
  bindPosFocus: function () {
    this.setData({
      hiddenPos: true,
    })
  },
  //失去焦点隐藏清除图标
  bindKeyBlur: function () {
    this.setData({
      hiddenName: false,
    })
  },
  bindPosBlur: function () {
    this.setData({
      hiddenPos: false,
    })
  },
  clearName: function () {
    this.setData({
      name: ""
    })
  },
  clearPos: function () {
    this.setData({
      position: ""
    })
  },
  //类别
  getKind: function (e) {
    this.setData({
      kind_index: e.detail.value,
      kind: this.data.all_kind[e.detail.value]
    })
  },
  //会议级别
  getLevel: function (e) {
    this.setData({
      level_index: e.detail.value,
      level: this.data.all_level[e.detail.value]
    })
  },
  //主办单位
  getHost: function (e) {
    this.setData({
      host_index: e.detail.value,
      host: this.data.all_dept[e.detail.value]
    })
  },
  inputHost: function (e) {
    if (this.data.host === "其他") {
      this.setData({
        input_host: e.detail.value
      })
    }
  },
  //派出单位
  getDept: function (e) {
    this.setData({
      department_index: e.detail.value,
      department: this.data.all_dept[e.detail.value]
    })
  },
  inputDept: function (e) {
    if (this.data.department === "其他") {
      this.setData({
        input_dept: e.detail.value
      })
    }
  },
  //地点
  getPos: function (e) {
    this.setData({
      position: e.detail.value
    })
  },
  getPer: function (e) {
    this.setData({
      period: e.detail.value
    })
  },
  //日期
  startDate: function (e) {
    let date = e.detail.value.split('-')
    this.setData({
      start_date: e.detail.value,
      date1: date[0],
      date2: date[1],
      date3: date[2]
    })
  },
  endDate: function (e) {
    let date = e.detail.value.split('-')
    this.setData({
      end_date: e.detail.value,
      date4: date[0],
      date5: date[1],
      date6: date[2]
    })
  },
  //开始时间
  getStart: function (e) {
    let date = e.detail.value.split(':')
    this.setData({
      start_time: e.detail.value,
      time1: date[0],
      time2: date[1]
    })
    //console.log(e.detail.value)
  },
  //结束时间
  getOver: function (e) {
    let date = e.detail.value.split(':')
    this.setData({
      end_time: e.detail.value,
      time3: date[0],
      time4: date[1]
    })
  },

  //选择人员
  toNameList: function () {
    if (!this.data.change) {
      wx.navigateTo({
        url: '../select/select',
      })
    }
  },
  //简介
  getDesc: function (e) {
    this.setData({
      introduction: e.detail.value
    })
  },
  //是否必修
  getMust: function () {
    this.setData({
      must: true,
      chosen: false,
      type: 1
    })
  },
  getChosen: function () {
    this.setData({
      chosen: true,
      must: false,
      type: 2
    })
  },
  
  //提交补录申请
  publish: function () {
    let that = this
    wx.showModal({  
      title: '确认提交申请吗',
      content: '请仔细核查会议内容',
      confirmColor: "#00478b",
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在提交',
            mask: true
          })
          if (that.data.photo) {
            wx.request({
              url: app.globalData.post_url,
              dataType: 'json',
              method: "POST",
              header: {
                "contentType": "aplication/json"
              },
              data:{
                type: 'A014',
                token: app.globalData.token,
                data: {
                  name: this.data.name,
                  date1: this.data.date1,
                  date2: this.data.date2,
                  date3: this.data.date3,
                  date4: this.data.date4,
                  date5: this.data.date5,
                  date6: this.data.date6,
                  term1: this.data.term1,
                  term2: this.data.term2,
                  term3: this.data.term3,
                  time1: this.data.time1,
                  time2: this.data.time2,
                  time3: this.data.time3,
                  time4: this.data.time4,
                  position: this.data.position,
                  level: this.data.level,      //会议规模
                  department: this.data.host === "其他" ? this.data.input_host : this.data.host,     //主办单位
                  sending_unit: this.data.host === "其他" ? (this.data.department === "其他" ? this.data.input_dept : this.data.department) : this.data.host,
                  introduction: this.data.introduction,
                  period: this.data.period,
                  category: this.data.kind,
                  member: wx.getStorageSync('member')
                },
              },
              success: function (res) {
                console.log(res)
                if (res.data.code === 200) {
                  wx.removeStorageSync('member')
                  wx.removeStorageSync('college')
                  let count = 0
                  let id = res.data.msg
                  that.uploadPic(id, count)
                  wx.showToast({
                    title: '已提交',
                    duration: 1000
                  })
                  
                } else if (res.data.code === 400){
                  wx.showToast({
                    icon:'none',
                    title: res.data.msg,
                    duration: 1000
                  })
                } else if (res.data.code === 401) {
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
                    title: 'fail',
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })
          } else {
            wx.showToast({
              icon:'none',
              title: '未上传相关图片',
              duration: 1000
            })
          }
        }
      }
    })

  },
  
// 上传图片
  getPic: function (e) {
    let that = this
    wx.chooseImage({
      count:4,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        if (that.data.photo) {
          if (that.data.photo.length < 3) {
            for (let i = 0; i < res.tempFiles.length; i++) {
                console.log(that.data.img)
                that.data.photo.push(res.tempFiles[i])
              that.setData({
                photo: that.data.photo,
              })
              if (that.data.photo.length === 3) {
                wx.showToast({
                  icon: 'none',
                  title: '最多上传3张图',
                })
                break
              }
            }

          } else {
            wx.showToast({
              icon: 'none',
              title: '最多上传3张图',
            })
          }
        } else {
          that.setData({
            photo: res.tempFiles,
          })
        }
      }
    })
  },
  //删除图片
  deletePic: function (e) {
    let that = this
    console.log(e.currentTarget.dataset)
    let index = e.currentTarget.dataset.index
    let imgList = that.data.photo
    imgList.splice(index, 1)
    that.setData({
      photo: imgList
    })
  },
  uploadPic: function (id,count) {
    let that = this
    let num = count + 1
    let pic = that.data.photo[count].path
    wx.uploadFile({
      url: app.globalData.post_url,
      filePath: pic,
      name: 'pic' + num,
      formData: {
        'token': app.globalData.token,
        'type': 'A020',
        'data': JSON.stringify({
          id: id
        })

      },
      success: (res) => {
        console.log(res)
      },
      complete: (res) => {
        count++;
        if(count === that.data.photo.length) {
          if(res.statusCode === 200){
            // wx.showToast({
            //   title: '图片上传成功',
            //   duration: 1000
            // })
            setTimeout(function () {
              
            }, 1000)
          }
        }
        else {
          //递归上传下一张图片
          that.uploadPic(id,count)
        }
      }
    })  
  }
})