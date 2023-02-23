// pages/teacher/publish/publish.js
const app = getApp()
let edit_member = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    term: app.globalData.term,
    rank: app.globalData.rank,
    all_level: ['国家级', '省市级', '校级'],
    introduction: '',
    s_date: '',
    e_date: '',
    date2: '',
    host: '',
    input_host: '',
    term_index: 0,
    hiddenName: false,
    hiddenPos: false,
    hiddenPer: false,
    member: [{}],
    all_dept: [
      '其他', '英语语言文化学院', '经济贸易学院', '国际商务英语学院', '商学院', '会计学院', '金融学院', '西方语言文化学院', '日语语言文化学院', '东方语言文化学院', '中国语言文化学院', '法学院', '国际关系学院', '英语教育学院', '信息科学与技术学院', '社会与公共管理学院', '高级翻译学院', '新闻与传播学院', '艺术学院', '数学与统计学院', '继教公开学院', '国际学院', '创新创业教育学院', '学生处', '校团委', '学生就业指导中心', '研究生部', '关工委'],
    all_category: [ "思想理论教育和价值引领","党团和班级建设","学风建设","学生日常事务管理","心理健康教育与咨询工作","网络思想政治教育","校园危机事件应对","职业规划与就业创业指导","理论和实践研究","非其他"],
    status: '',
    token: '',
    deadline_date: '',
    deadline_time: ''
  },

  getDeadLine: function(e){
    //新加的字段不必与先前的一致
    this.setData({
      deadline_date: e.detail.value
    })
  },

  getDeadTime: function(e){
    this.setData({
      deadline_time: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let token = wx.getStorageSync('token')
    let rank = wx.getStorageSync('rank')
    if (rank == 2) {
      wx.setNavigationBarTitle({
        title: '会议申请',
      })
    }
    if (options.meeting) {
      //console.log(JSON.parse(options.meeting))
      let data = JSON.parse(options.meeting)
      let {all_dept} = this.data
      // //console.log(data.member)
      edit_member = data.member
      let starttime = data.starttime.split(' '),
       endtime = data.endtime.split(' '),
       deadline = data.deadline.split(' '),
       send_unit = data.send_unit,
       hold_unit = data.hold_unit,
       sendInList = true,
       holdInList = true;

       if(all_dept.findIndex((item) => item===send_unit) === -1){
         sendInList = false
       }

       if(all_dept.findIndex((item) => item===hold_unit) === -1){
          holdInList = false
      }
      
      this.setData({
        rank: rank,
        name: data.name,
        id: data.id,
        position: data.position,
        type: data.type, //会议是否必修
        level: data.level, //会议规模 
        department: sendInList? send_unit: '其它', //派出单位 
        host: holdInList? hold_unit : '其它', //主办单位
        input_host:holdInList? '': hold_unit,
        input_dept: sendInList? '' : send_unit,
        introduction: data.introduction,
        period: data.score,
        s_date: starttime[0],
        e_date: endtime[0],
        satrt_time: starttime[1].slice(0, 5),
        end_time: endtime[1].slice(0, 5),
        deadline_date: deadline[0],
        deadline_time: deadline[1].slice(0, 5),
        category:data.category,
        change: options.change == 'change' ? true : false,
        status: data.state,
        token: token
      })
    } else if (options.pageType) {
      console.log(options.pageType)
      this.setData({
        type: options.pageType,
        token: token,
        rank: rank
      })
      console.log(this.data.type)
    } else {
      edit_member = {}
      this.setData({
        change: options.change == 'change' ? true : false,
        rank: rank,
        token: token
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  //人员选择显示
  onShow: function() {
    let a = app.globalData.term.split('-')
    var member = wx.getStorageSync('member')
    this.setData({
      member: member,
      term1: a[0],
      term2: a[1],
      term3: a[2],
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  //清除图标
  bindKeyFocus: function(e) {
    this.setData({
      hiddenName: true,
    })
  },
  bindPosFocus: function() {
    this.setData({
      hiddenPos: true,
    })
  },
  bindPerFocus: function() {
    this.setData({
      hiddenPos: true,
    })
  },
  //失去焦点隐藏清除图标
  bindKeyBlur: function() {
    this.setData({
      hiddenName: false,
    })
  },
  bindPosBlur: function() {
    this.setData({
      hiddenPos: false,
    })
  },
  bindPerBlur: function() {
    this.setData({
      hiddenPer: false,
    })
  },
  clearName: function() {
    this.setData({
      name: ""
    })
  },
  clearPeriod: function() {
    this.setData({
      period: ""
    })
  },
  clearPos: function() {
    this.setData({
      position: ""
    })
  },
  
  //会议级别
  getLevel: function(e) {
    //console.log(this.data.all_level[e.detail.value])
    this.setData({
      level_index: e.detail.value,
      level: this.data.all_level[e.detail.value]
    })
  },
  getCategory: function (e) {
    this.setData({
      ctg_index: e.detail.value,
      category: this.data.all_category[e.detail.value]
    })
  },
  getHost: function(e) {
      this.setData({
        host_index: e.detail.value,
        host: this.data.all_dept[e.detail.value]
      })
  },
  inputHost:function (e) {
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
  getPos: function(e) {
    this.setData({
      position: e.detail.value
    })
  },
  getPer: function(e) {
    this.setData({
      period: e.detail.value
    })
  },
  //日期
  getDate1: function(e) {
    let date = e.detail.value.split('-')
    this.setData({
      s_date: e.detail.value,
      date1: date[0],
      date2: date[1],
      date3: date[2]
    })
  },
  getDate2: function(e) {
    let date = e.detail.value.split('-')
    this.setData({
      e_date: e.detail.value,
      date4: date[0],
      date5: date[1],
      date6: date[2]
    })
  },
  //开始时间
  getStart: function(e) {
    let date = e.detail.value.split(':')
    this.setData({
      satrt_time: e.detail.value,
      time1: date[0],
      time2: date[1]
    })
    //console.log(e.detail.value)
  },
  //结束时间
  getOver: function(e) {
    let date = e.detail.value.split(':')
    this.setData({
      end_time: e.detail.value,
      time3: date[0],
      time4: date[1]
    })
  },

  //选择人员
  toNameList: function() {
    if (!this.data.change) {
      wx.navigateTo({
        url: '../selectMember/selectMember?pageType=select&type='+this.data.type,
      })
    } else {
      wx.navigateTo({
        url: '../selectMember/selectMember?&id=' + this.data.meeting_id + '&type=' + this.data.type + '&pageType=changeMember',

      })
    }
  },
  //简介
  getDesc: function(e) {
    this.setData({
      introduction: e.detail.value
    })
  },

  edit: function(){
    let {token, type, id} = this.data
    wx.showModal({
      title: "提示",
      content: '是否编辑会议？',
      success: (res) => {
        if(res.confirm){
          wx.showLoading({
            title: '修改中',
            icon: 'none'
          })
          wx.request({
            url: app.globalData.post_url+'/super/editMeeting',
            method: 'POST',
            dataType: 'json',
            header: {
              "content-type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            data: {
              data: {
                "meeting": {
                  id: id,
                  "name": this.data.name,
                  "starttime": `${this.data.s_date} ${this.data.satrt_time}:00`,
                  "endtime": `${this.data.e_date} ${this.data.end_time}:00`,
                  "position": this.data.position,
                  "term": "202020212",
                  "level": this.data.level,
                  "hold_unit": this.data.host === "其他" ? this.data.input_host : this.data.host, //主办单位
                  "send_unit": this.data.host === "其他" ? (this.data.department === "其他" ? this.data.input_dept : this.data.department) : this.data.host,
                  "introduction": this.data.introduction,
                  "category": this.data.category,
                  "type": parseInt(this.data.type),
                  "score": this.data.period,
                  "deadline": type==2? `${this.data.deadline_date} ${this.data.deadline_time}:00` : `${this.data.s_date} ${this.data.satrt_time}:00`
                },
              }
            },
            success:(res) => {
              wx.hideLoading({
                success: (res) => {},
              })
              let {code, msg} =res.data
              if(code !== 0){
                wx.showToast({
                  title: msg,
                  icon: 'none'
                })
                return
              }
              wx.showToast({
                title: '修改成功'
              })
              wx.navigateBack({
                delta: 1,
              })
            },
            fail:() => {
              wx.hideLoading({
                success: (res) => {},
              })
              wx.showToast({
                title: '服务器出错',
                icon:'none'
              })
            }
          })
        }
      }
    })
  },

  //发布/提交会议申请
  publish: function() {
    let that = this
    let {token, rank, type} = this.data
    let url = rank == 1? `/super/${type==1? 'publishCompulsoryMeeting' : 'publishSelectiveMeeting'}`
                    : `/admin/${type==1? 'applyCompulsoryMeeting' : 'applySelectiveMeeting'}`
    let member = wx.getStorageSync('member')||[]
    let college = wx.getStorageSync('college')||[]
    if((type==1&&member.length==0)||(type==2&&college.length==0)){
      wx.showToast({
        title: '请选择人员',
        icon: 'none'
      })
      return
    }
    wx.showModal({
      title: '确认' + (rank == 1 ? '发布会议' : '提交会议申请') + '吗',
      content: '请仔细核查会议内容',
      confirmColor: "#00478b",
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在发布',
            mask: true
          })
          wx.request({
            url: app.globalData.post_url+url,
            method: 'POST',
            dataType: 'json',
            header: {
              "content-type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            data: {
              data: {
                "meeting": {
                  "name": this.data.name,
                  "starttime": `${this.data.date1}-${this.data.date2}-${this.data.date3} ${this.data.time1}:${this.data.time2}:00`,
                  "endtime": `${this.data.date4}-${this.data.date5}-${this.data.date6} ${this.data.time3}:${this.data.time4}:00`,
                  "position": this.data.position,
                  "term": "202020212",
                  "level": this.data.level,
                  "hold_unit": this.data.host === "其他" ? this.data.input_host : this.data.host, //主办单位
                  "send_unit": this.data.host === "其他" ? (this.data.department === "其他" ? this.data.input_dept : this.data.department) : this.data.host,
                  "introduction": this.data.introduction,
                  "category": this.data.category,
                  "type": parseInt(this.data.type),
                  "score": this.data.period,
                  "deadline": type==2? `${this.data.deadline_date} ${this.data.deadline_time}:00` : `${this.data.date1}-${this.data.date2}-${this.data.date3} ${this.data.time1}:${this.data.time2}:00`
                },
                [type==1? 'people' : 'major']: type==1? member : college
              }
            },
            success: (res) => {
              let {code, msg} = res.data
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
              wx.removeStorageSync('member')
              wx.removeStorageSync('college')
              wx.showToast({
                title: '已提交',
              })
              wx.redirectTo({
                url: '../index/index',
              })
            },
            fail: () => {
              wx.hideLoading({
                success: (res) => {},
              })
              wx.showToast({
                title: '请求失败',
                icon: "none"
              })
            }
          })

        }

      }
    })

  },
  sendMsg: function (id) {
    wx.request({
      url: app.globalData.post_url,
      dataType: 'json',
      method: "POST",
      header: {
        "contentType": "aplication/json"
      },
      data: {
        'type': 'B066',   //发送通知接口
        token: app.globalData.token,
        data: {
          id: id,
        }
      },
      success: function (res0) {
        //console.log(res0)
        if (res0.data.code === 200) {
        } 
      }
    })
  },


  //上传图片
  // getPic: function (e) {
  //   let that = this
  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       that.setData({
  //         photo: res.tempFilePaths[0]
  //       })
  //     }
  //   })
  // },
})