// pages/sign/sign.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    id: '',
    tableData: [],
    checked: false
  },

  selectAll: function(){
    let {checked, tableData} = this.data
    checked = !checked
    tableData.forEach((item) => {
      item.checked = checked
    })
    this.setData({
      checked: checked,
      tableData: tableData
    })
  },

  select: function(e){
    let {user}= e.currentTarget.dataset
    let {tableData} = this.data
    tableData.forEach((item) => {
      if(item.user === user){
        item.checked = !item.checked
      }
    })
    this.setData({
      tableData: tableData
    })
  },

  handleGrant:function(){
    let {token, tableData, id} = this.data
    let people = tableData.filter(({checked}) => checked).map(({user}) => user)
    if(people.length === 0){
      wx.showToast({
        title: '您还没有选择人员',
        icon: 'none'
      })
      return
    }
    
    wx.showModal({
      title: '提示',
      content: '是否通过选中人员',
      success: (res) => {
        if(res.confirm){
          wx.showLoading({
            title: '通过中',
          })
          wx.request({
            url: app.globalData.post_url+'/super/grantSignUp',
            dataType: 'json',
            method: "POST",
            header: {
              "contentType": "aplication/json",
              "Authorization": `Bearer ${token}`
            },
            data: {
              data: {
                meeting: id,
                people: people,
              }
            },
            success: (res) => {
              wx.hideLoading({
                success: (res) => {},
              })
              let {code, msg} = res.data
              if(code!==0){
                wx.showToast({
                  title: msg,
                  icon: 'none'
                })
                return
              }
              wx.showToast({
                title: '操作成功',
              })
            },
            fail: (err) => {
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

  getSignList: function(){
    let {token, id} = this.data
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.post_url+'/super/getSignUpList',
      dataType: 'json',
      method: "POST",
      header: {
        "contentType": "aplication/json",
        "Authorization": `Bearer ${token}`
      },
      data: {
        data: {
          meeting: id
        }
      },
      success: res => {
        wx.hideLoading({
          success: (res) => {},
        })
        let {code, msg, data} = res.data
        if(code !== 0){
          wx.showToast({
            title: msg,
            icon: 'none'
          })
          return
        }
        if(data.length === 0){
          wx.showToast({
            title: '暂时没有人报名',
            icon: 'none'
          })
        }
        data = data.map((item) => {
          return {
            ...item,
            checked: false
          }
        })
        this.setData({
          tableData: data
        })
      },
      fail: err => {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token')
    this.setData({
      token: token,
      id: options.id||''
    }, this.getSignList)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})