// pages/select/select.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dept_index: 0,
    choose_member:[],
    member: [],
    department:[],
    all_dept: [
      '全部单位', '英语语言文化学院', '经济贸易学院', '国际商务英语学院', '商学院', '会计学院', '金融学院', '西方语言文化学院', '日语语言文化学院', '东方语言文化学院', '中国语言文化学院', '法学院', '国际关系学院', '英语教育学院', '信息科学与技术学院', '社会与公关管理学院', '高级翻译学院', '新闻与传播学院', '艺术学院', '数学与统计学院', '继教公开学院', '国际学院', '创新创业教育学院', '学生处', '校团委', '学生就业指导中心', '研究生部', '关工委'],
    de: [
      "学生处",
      "信息科学与技术学院", 
      "创新创业教育学院",
      "学生就业指导中心" 
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    let member = []
    wx.request({
      url: app.globalData.post_url,
      method: 'POST',
      dataType: 'json',
      header: {
        "content-type": "application/json"
      },
      data: {
        token: app.globalData.token,
        "type": 'A015',
        data: {
          "college": this.data.all_dept
        }
      },
      success: function(res0) {
       //console.log(res0)
        if (res0.data.code === 200) {
          let choose_member = wx.getStorageSync('member') || [];
          console.log(choose_member)
          member = res0.data.msg;
          let dept_on = [];
          let dept_state = [];
          let a = [];
          let member_on = [{}];
          for (let i = 0; i < res0.data.msg.length; i++) {
            if (res0.data.msg[i].member) {
              dept_state[i] = true;
              dept_on[i] = false;
              for (let j = 0; j < res0.data.msg[i].member.length; j++) {
                let index = choose_member.indexOf(res0.data.msg[i].member[j].user_id);
               //console.log(index)
                if (index !== -1) {
                  a[j] = true;
                } else {
                  a[j] = false;
                }
              }
              member_on[i] = a;
              a = [];
            }
            else {
              dept_state[i] = false;
            }
          }
          console.log(member_on)
          that.setData({
            member: member,
            dept_state: dept_state,
            dept_on: dept_on,
            member_on: member_on,
            choose_member:choose_member
          })
        }
        else if (res0.data.code === 401) {
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
  getDept: function(e) {
    this.data.department = this.data.all_dept[e.detail.value]
    this.setData({
      dept_index: e.detail.value,
      department: this.data.department
    })
  },
  choose: function(e) {
    var that = this
    let index = e.currentTarget.dataset.index
    let num = e.currentTarget.dataset.num
    //console.log(index)
    //console.log(num)
    that.data.member_on[index][num] = !that.data.member_on[index][num]
    if (that.data.member_on[index][num]) {
      that.data.choose_member.push(that.data.member[index].member[num].user_id)
      // for (var i=0; i < that.data.choose_member.length; i++) {
      //   if (!that.data.choose_on[i]) {
      //     that.data.is_all = !that.data.is_all
      //   }
      // }
    } else {
      if (that.data.dept_on[index]) {
        that.data.dept_on[index] = !that.data.dept_on[index]
        that.setData({
          dept_on: that.data.dept_on
        })
      }
      for (var i = 0; i < that.data.choose_member.length; i++) {
        if (that.data.choose_member[i] == that.data.member[index].member[num].user_id) {
          that.data.choose_member.splice(i, 1)
        }
      }
    }
    that.setData({
      member_on: that.data.member_on,
      choose_member: that.data.choose_member
    })
    //console.log(that.data.choose_member)

  },

  //选择学院
  chooseAll: function(e) {
    var that = this
    let index = e.currentTarget.dataset.index
    that.data.dept_on[index] = !that.data.dept_on[index]
    that.setData({
      dept_on: that.data.dept_on
    })
    if (that.data.dept_on[index]) {
      let arr = that.data.choose_member
      for (let i = 0; i < that.data.member[index].member.length; i++) {
        if (that.data.member_on[index][i] === true) {
          arr.push(that.data.member[index].member[i].user_id)
        } else {
          that.data.member_on[index][i] = true;
          arr.push(that.data.member[index].member[i].user_id)
        }
      }
      that.setData({
        member_on: that.data.member_on,
        choose_member: arr
      })
      //console.log(that.data.choose_member)
    } else {
      let arr = []
      for (let i = 0; i < that.data.member[index].member.length; i++) {
        if (that.data.member_on[index][i] === true) {
          that.data.member_on[index][i] = false
        } else {
          that.data.member_on[index][i] = false
        }
      }
      that.setData({
        member_on: that.data.member_on,
        choose_member: arr
      })
      //console.log(that.data.choose_member)
    }
  },
  
  switchDepar: function (e) {
    var that = this;
    if (that.data.all_dept[e.detail.value] === "全部单位") {
      that.data.department.push(that.data.all_dept[e.detail.value]); 
      let department = that.data.all_dept
      department.shift()
      //console.log(department)
      //console.log(that.data.all_dept)
      this.setData({
        dept_index: e.detail.value,
        department: department
      })
    }
    else {
      if (that.data.all_dept[0] !== "全部单位") {
        that.data.all_dept.unshift("全部单位")
        this.setData({
          all_dept: that.data.all_dept
        })
      }
      //console.log(that.data.all_dept)
      that.data.department = [];
      that.data.department.push(that.data.all_dept[e.detail.value]);
      this.setData({
        dept_index: e.detail.value,
        department: this.data.department
      })
    }
    //console.log(that.data.department)
    wx.request({
      url: app.globalData.post_url,
      method: "POST",
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      data: {
        token: app.globalData.token,
        type: 'A015',
        data: {
          college: that.data.department[0] === "全部单位" ? that.data.all_dept : that.data.department
        }
      },
      success: function (res0) {
       //console.log(res0)
        if (res0.data.code === 200) {
          that.data.member = res0.data.msg;
          let dept_on = [];
          let dept_state = [];
          let a = [];
          let member_on = [{}];
          for (let i = 0; i < res0.data.msg.length; i++) {
            if (res0.data.msg[i].member) {
              dept_state[i] = true;
              dept_on[i] = false;
              for (let j = 0; j < res0.data.msg[i].member.length; j++) {
                let index = that.data.member.indexOf(res0.data.msg[i].member[j].user_id);
               //console.log(index)
                if (index !== -1) {
                  a[j] = true;
                } else {
                  a[j] = false;
                }
              }
              member_on[i] = a;
              a = [];
            }
            else {
              dept_state[i] = false;
            }
          }
          //console.log(that.data.member)
          //console.log(dept_on)
          //console.log(member_on)
          that.setData({
            member: that.data.member,
            dept_on: dept_on,
            dept_state: dept_state,
            member_on: member_on,
          })
        }
        else if (res0.data.code === 401) {
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
    });
    that.data.department.pop()
  },
  confirm: function () {
    let that = this
    wx.setStorageSync('member', that.data.choose_member)
    console.log(wx.getStorageSync('member'))
    wx.showLoading({
      title: '正在保存',
      mask: true
    })
    setTimeout(function () {
      wx.removeStorage({
        key: 'token',
        success: function (res) {
          wx.navigateBack({
            delta: 1
          })
        },
      })
    }, 1000)
  }
})