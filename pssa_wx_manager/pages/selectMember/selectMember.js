// pages/selectMember/selectMember.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dept_index: 0,
    member: [],
    choose_college: [],
    choose_member: wx.getStorageSync('member') || [],
    selected_member: [],
    department: [],
    all_dept: [
      '全部单位', '英语语言文化学院', '经济贸易学院', '国际商务英语学院', '商学院', '会计学院', '金融学院', '西方语言文化学院', '日语语言文化学院', '东方语言文化学院', '中国语言文化学院', '法学院', '国际关系学院', '英语教育学院', '信息科学与技术学院', '社会与公共管理学院', '高级翻译学院', '新闻与传播学院', '艺术学院', '数学与统计学院', '继教公开学院', '国际学院', '创新创业教育学院', '学生处', '校团委', '学生就业指导中心', '研究生部', '关工委'],
    de: [
      "学生处",
      "信息科学与技术学院",
      "创新创业教育学院",
      "学生就业指导中心"
    ],
    peopleList: [],
    filterList: [],
    deptList: [],
    type: 1,
    selectMemberList: [],
    checked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let token = wx.getStorageSync('token')
    const selectMemberList = ['英语语言文化学院', '经济贸易学院', '国际商务英语学院', '商学院', '会计学院', '金融学院', '西方语言文化学院', '日语语言文化学院', '东方语言文化学院', '中国语言文化学院', '法学院', '国际关系学院', '英语教育学院', '信息科学与技术学院', '社会与公共管理学院', '高级翻译学院', '新闻与传播学院', '艺术学院',
    '数学与统计学院','继教公开学院','国际学院','创新创业教育学院',  '学生处', '校团委','学生就业指导中心', '研究生部','关工委'].map((item) => {
    return {
        checked: false,
        value: item
    }
})
    console.log(options)
    that.setData({
      pageType: options.pageType,
      token: token,
      type: options.type,
      selectMemberList: selectMemberList
    })
    if (options.pageType === 'select') {
      wx.setNavigationBarTitle({
        title: '人员选择',
      })

    } else if (options.pageType === 'add') {
      wx.setNavigationBarTitle({
        title: '补录名单',
      })
      that.setData({
        id: options.id
      })
    } else if (options.pageType === 'changeMember') {
      that.setData({
        id: options.id,
        type: options.type
      })
    } else {
      that.setData({
        id: options.id
      })
    }
  },


  getChecked: function(){
    let member = wx.getStorageSync('member')||[]
    let college = wx.getStorageSync('college')||[]
    let {peopleList, selectMemberList} = this.data
    if(college.length!==0){
      selectMemberList.forEach((item) => {
        if(college.findIndex((value) => value==item.major) !== -1){
          item.checked = true
        }
      })
    }

    if(member.length !== 0){
      peopleList.forEach((item) => {
        item.people.forEach((people) => {
          if(member.findIndex((id) => people.id == id) !==-1){
            people.checked = true
          }
        })
      })
    }

    this.setData({
      peopleList: peopleList,
      selectMemberList: selectMemberList
    })
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
    let {token} = this.data
    if (this.data.pageType === 'select' || this.data.pageType === 'makeUp') {
      wx.setNavigationBarTitle({
        title: this.data.pageType === 'select' ? '人员选择' : '补录名单'
      })
      wx.request({
        url: app.globalData.post_url+'/admin/getPeopleList',
        method: 'POST',
        dataType: 'json',
        header: {
          "content-type": "application/json",
          "Authorization": `Bearer ${token}`
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

          let deptList = ['全部']
          let peopleList = []

          data.forEach((item) => {
            let {major} = item
            item.checked = false
            let preMajor = '', length = peopleList.length
            if(length !== 0){
              preMajor=peopleList[length-1].major
            }

            if(preMajor === major){
              peopleList[length-1].people.push(item)
            }else{
              deptList.push(major)
              peopleList.push({
                checked: false,
                major: major,
                people: [item]
              })
            }
          })

          this.setData({
            deptList: deptList,
            peopleList: peopleList,
            //filterList: filterList
          }, this.getChecked)
        }
      })
    } else if (this.data.pageType === 'addMember') {
      wx.request({
        url: app.globalData.post_url,
        method: 'POST',
        dataType: 'json',
        header: {
          "content-type": "application/json"
        },
        data: {
          token: app.globalData.token,
          "type": 'B052',
          data: {
            id: this.data.id
          }
        },
        success: function(res0) {
          console.log(res0)
          if (res0.data.code === 200) {
            let member = [];
            let dept_state = [];
            let dept_on = [];
            let a = [];
            let member_on = [];
            for (let i = 0; i < res0.data.msg.member.length; i++) {
              if (res0.data.msg.member[i].member.length !== 0) {
                console.log(res0.data.msg.member[i].member.length)
                member.push(res0.data.msg.member[i])
                dept_state.push(true);
                dept_on.push(false);
                for (let j = 0; j < res0.data.msg.member[i].member.length; j++) {
                  a[j] = false;
                }
                member_on.push(a);
                a = [];
              } else {
              }
            }
            console.log(member)
            console.log(dept_on)
            console.log(member_on)
            console.log(dept_state)
            that.setData({
              state: res0.data.msg.select_state,
              member: member,
              dept_on: dept_on,
              member_on: member_on,
              dept_state: dept_state,
            })
            if(member.length === 0) {
              wx.showToast({
                title: '暂无人员报名',
                icon: 'none'
              })
            }
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
    } else if (this.data.pageType === 'changeMember') {
      wx.request({
        url: app.globalData.post_url,
        method: 'POST',
        dataType: 'json',
        header: {
          "content-type": "application/json"
        },
        data: {
          token: app.globalData.token,
          "type": 'B085',
          data: {
            id: this.data.id,
            type: this.data.type 
          }
        },
        success: function (res0) {
          console.log(res0)
          if (res0.data.code === 200) {
            if (that.data.selected_member.length === 0) {
              that.setData({
                choose_member:[],
              })
              for (let i=0; i<res0.data.msg.length; i++) {
                that.data.selected_member.push(res0.data.msg[i].user_id)
                that.data.choose_member.push(res0.data.msg[i].user_id)
              }
            } else {}
            that.setData({
              selected_member: that.data.selected_member,
              choose_member: that.data.choose_member
              })
          }
        }
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
          "type": 'B051',
          data: {
            college: this.data.all_dept
          }
        },
        success: function (res0) {
          console.log(res0)
          if (res0.data.code === 200) {
            let member = res0.data.msg;
            let dept_on = [];
            let dept_state = [];
            let a = [];
            let member_on = [{}];
            for (let i = 0; i < res0.data.msg.length; i++) {
              if (res0.data.msg[i].member) {
                dept_state[i] = true;
                dept_on[i] = false;
                for (let j = 0; j < res0.data.msg[i].member.length; j++) {
                  let index = that.data.choose_member.indexOf(res0.data.msg[i].member[j].user_id);
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
                dept_on[i] = false;
              }
            }
            that.setData({
              member: member,
              dept_on: dept_on,
              member_on: member_on,
              dept_state: dept_state,
              choose_member: that.data.choose_member,
            })
          }
        }
      })
    } else {
      wx.request({
        url: app.globalData.post_url,
        method: 'POST',
        dataType: 'json',
        header: {
          "content-type": "application/json"
        },
        data: {
          token: app.globalData.token,
          "type": 'B029',
          data: {
            id: this.data.id
          }
        },
        success: function(res0) {
          //console.log(res0)
          if (res0.data.code === 200) {
            let choose_on = [],
              member = res0.data.msg;
            for (let i = 0; i < res0.data.msg.length; i++) {
              choose_on[i] = false
            }
            //console.log(member)
            //console.log(choose_on)
            that.setData({
              member: member,
              choose_on: choose_on
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
    }
  },

  select: function () {
    wx.showToast({
      icon: 'none',
      title: '已经选择一次，无法再次选择',
    })
  },

  majorChecked: function(e){
    let {major:selectMajor} = e.currentTarget.dataset
    let {peopleList} = this.data
    peopleList.forEach((item) => {
      let {major, checked} = item
          if(selectMajor === major){
            let newChecked =!item.checked
            item.checked = newChecked
            item.people.forEach((people) => {
               people.checked = newChecked
             })
       }
    })
    this.setData({
      peopleList: peopleList
    })
  },

  peopleChecked: function(e){
    let {id, major: selectMajor} = e.currentTarget.dataset
    let {peopleList} = this.data
    peopleList.forEach((item) => {
      let {major} = item
      if(selectMajor === major){
        item.people.forEach((people) => {
           if(people.id === id){
             people.checked = !people.checked
           }
         })
      }
    })
    this.setData({
      peopleList: peopleList
    })
  },

  selectAlldept: function(e){
    let {checked, selectMemberList} = this.data
    selectMemberList.forEach((item) => {
      item.checked = !checked
    })
    this.setData({
      checked: !checked,
      selectMemberList: selectMemberList
    })
  },

  deptSelect: function(e){
    let {dept} = e.currentTarget.dataset
    let { selectMemberList} = this.data
    selectMemberList.forEach((item) => {
      if(item.value === dept){
        item.checked = !item.checked
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
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  getSearchKey: function (e) {
    this.search(e.detail.value)
  },

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
            "type": "B073",   //会议查看接口
            data: {
              search_key: key, // 两个同时为0是获取所有条数
            }
          },
          success: function (res0) {
            //console.log(res0.data.msg);
            if (res0.data.code === 200) {
              let member = [];
              let dept_on = [];
              let a = [];
              let member_on = [];
              for (let i = 0; i < res0.data.msg.length; i++) {
                if (res0.data.msg[i].member.length !== 0) {
                  member.push(res0.data.msg[i])
                  dept_on.push(false);
                  for (let j = 0; j < res0.data.msg[i].member.length; j++) {
                    a[j] = false;
                  }
                  member_on.push(a);
                  a = [];
                }
              }
              //console.log(member)
              //console.log(dept_on)
              //console.log(member_on)
              that.setData({
                member: member,
                dept_on: dept_on,
                member_on: member_on,
              })
            }
          }
        })
      },
    })
  },
  getDept: function(e) {
    this.data.department = this.data.all_dept[e.detail.value]
    this.setData({
      dept_index: e.detail.value,
      department: this.data.department
    })
  },
  chooseMember: function(e) {
    var that = this
    let index = e.currentTarget.dataset.index
    let num = e.currentTarget.dataset.num
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
        for (let i = 0; i < that.data.choose_college.length; i++) {
          if (that.data.member[index].college === that.data.choose_college[i]) {
            that.data.choose_college.splice(i, 1)
          } else {

          }
        }
        console.log(that.data.dept_on)
        console.log(that.data.choose_college)
        that.setData({
          dept_on: that.data.dept_on,
          choose_college: that.data.choose_college
        })
      } else {
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
    console.log(that.data.choose_member)

  },

  //选择学院
  chooseCollege: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    that.data.dept_on[index] = !that.data.dept_on[index]
    that.setData({
      dept_on: that.data.dept_on
    })
    if (that.data.dept_on[index]) {
      that.data.choose_college.push(that.data.member[index].college)
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
        choose_college: that.data.choose_college,
        member_on: that.data.member_on,
        choose_member: arr
      })
      console.log(that.data.choose_member)
      console.log(that.data.choose_college)
    } else {
      let arr = []
      for (let i = 0; i < that.data.choose_college.length; i++) {
        console.log(that.data.choose_college[i])
        if (that.data.member[index].college === that.data.choose_college[i]) {
          that.data.choose_college.splice(i, 1)
        } else {}
      }
      for (let i = 0; i < that.data.member[index].member.length; i++) {
        if (that.data.member_on[index][i] === true) {
          that.data.member_on[index][i] = false
        } else {
          that.data.member_on[index][i] = false
        }
      }
      that.setData({
        choose_college: that.data.choose_college,
        member_on: that.data.member_on,
        choose_member: arr
      })
      //console.log(that.data.choose_member)
      //console.log(that.data.choose_college, )
    }
  },

  switchDepar: function(e) {
    let value = e.detail.value
    this.setData({
      dept_index: value
    })
  },
  confirm: function() {
    let that = this
    let {peopleList, selectMemberList} = this.data
    let member = [], choose_college =[]
    selectMemberList.forEach((item)=> {
      if(item.checked){
        choose_college.push(item.value)
      }
    })

    peopleList.forEach((item) => {
      let people = item.people
      member.push(...people.filter((item)=>item.checked).map((item) => item.id))
  })

    if (that.data.pageType === "addMember") { 
      wx.showModal({
        title: '提示',
        content: '该操作仅可进行一次，请确认无误',
        confirmColor: "#00478b",
        success: (res) => {
          if (res.confirm) {
            wx.request({
              url: app.globalData.post_url,
              method: 'POST',
              dataType: 'json',
              header: {
                "content-type": "application/json"
              },
              data: {
                token: app.globalData.token,
                "type": 'B053',
                data: {
                  id: that.data.id,
                  member: that.data.choose_member
                }
              },
              success: function(res) {
                if (res.data.code === 200) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (res.data.code === 401) {
                  wx.showToast({
                    title: '身份已过期，请重新登录',
                    icon: 'none',
                    duration: 3000,
                    mask: true,
                  })
                  setTimeout(function() {
                    wx.removeStorage({
                      key: 'token',
                      success: function(res) {
                        wx.redirectTo({
                          url: '../login/login',
                        })
                      },
                    })
                  }, 1000)
                }
              }
            })

          } else if (res.cancel) {}
        }
      })
    } else if (that.data.pageType === "makeUp") {
      wx.showModal({
        title: '提示',
        content: '确认进行该操作吗，将无法取消',
        confirmColor: "#00478b",
        success: (res) => {
          if (res.confirm) {
            wx.request({
              url: app.globalData.post_url,
              method: 'POST',
              dataType: 'json',
              header: {
                "content-type": "application/json"
              },
              data: {
                token: app.globalData.token,
                "type": 'B050',
                data: {
                  id: that.data.id,
                  member: that.data.choose_member
                }
              },
              success: function (res) {
                if (res.data.code === 200) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (res.data.code === 401) {
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

          } else if (res.cancel) { }
        }
      })
    } else if (that.data.pageType === "changeMember") {
      wx.showModal({
        title: '提示',
        content: '确认修改吗',
        confirmColor: "#00478b",
        success: (res) => {
          if (res.confirm) {
            wx.showLoading({
              title: '进行中',
            })
            let that = this;
            for (let i = 0; i < that.data.selected_member.length; i++) {
              for (let j = 0; j < that.data.choose_member.length; j++) {
                if (that.data.selected_member[i] === that.data.choose_member[j]) {
                  // console.log(that.selected_member[i]);
                  // console.log(that.choose_member[j]);
                  that.data.selected_member.splice(i, 1);
                  that.data.choose_member.splice(j, 1);
                  break;
                }
              }
            }
            that.setData({
              selected_member: that.data.selected_member,
              choose_member: that.data.choose_member,
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
                "type": 'B084',
                data: {
                  id: that.data.id,
                  type: that.data.type,
                  delete: that.data.selected_member,
                  add: that.data.choose_member
                }
              },
              success: function (res) {
                if (res.data.code === 200) {
                  wx.hideLoading()
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (res.data.code === 401) {
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

          } else if (res.cancel) { }
        }
      })
    } else {
      wx.setStorageSync('member', member)
      wx.setStorageSync('college', choose_college)
      wx.showLoading({
        title: '正在保存',
        mask: true
      })
      wx.navigateBack({
        delta: 1
      })
    }
  }
})