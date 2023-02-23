// pages/feedback/feedback.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    term: app.globalData.currentTerm,
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let a = this.data.term.split('-')
    let term1 = a[0];
    let term2 = a[1];
    let term3 = a[2];
    this.setData({
      term: term1 + term2 + term3,
    })
    //console.log(this.data.term)
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

  },
  getTitle: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  getContent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  getPic: function (e) {
    let that = this
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let img = [];
        //console.log(res)
        if (that.data.img) {
          if (that.data.img.length < 3){
            for (let i = 0; i < res.tempFiles.length; i++) {
              //console.log(that.data.img)
              that.data.img.push(res.tempFiles[i])
            }
            that.setData({
              img: that.data.img,
            })
          } else {
            wx.showToast({
              title: '最多上传3张图',
            })
          }
        } else {
          that.setData({
            img: res.tempFiles,
          })
        }
      }
    })
  },
  deletePic: function (e) {
    let that = this
    //console.log(e.currentTarget.dataset)
    let index = e.currentTarget.dataset.index
    let imgList = that.data.img
    imgList.splice(index,1)
    that.setData({
      img:imgList
    })
  },
  uploadPic: function (id, count) {
    let that = this
    let num = count + 1
    let pic = that.data.img[count].path
    wx.uploadFile({
      url: app.globalData.post_url,
      filePath: pic,
      name: 'pic' + num,
      formData: {
        'token': app.globalData.token,
        'type': 'A022',
        'data': JSON.stringify({
          id: id
        })

      },
      success: (res) => {
        //console.log(res)
      },
      complete: (res) => {
        count++;
        if (count === that.data.img.length) {
          if (res.statusCode === 200) {
            // wx.showToast({
            //   title: '图片上传成功',
            //   duration: 1000
            // })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 3000)
          }
        }
        else {
          //递归上传下一张图片
          that.uploadPic(id, count)
        }
      }
    })
  },
  submit: function (e) {
    let that = this
    let {content} = this.data
    wx.showModal({
      title: '提示',
      content: '确认提交反馈吗',
      confirmColor: "#00478b",
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在提交',
            mask: true
          })
          var that = this;
          wx.request({
            url: app.globalData.post_url+'/index/feedback',
            dataType: 'json',
            method: "POST",
            header: {
              "contentType": "aplication/json"
            },
            data: {
              data: {
                feedback: content
              }
            },
            success: function (res) {
              //console.log(res0)
              let {code, msg} =res.data
              wx.hideLoading({
                success: (res) => {},
              })
              if(code !== 0){
                wx.showToast({
                  title: msg,
                  icon: 'nonde'
                })
                return
              }
              wx.showToast({
                title: '提交成功',
              })
              wx.navigateBack({
                delta: 1,
              })
              // if (res0.data.code == 200) {
              //    wx.showToast({
              //     title: '提交成功',
              //     duration: 1000,
              //     mask: true,
              //   })
              //   if (that.data.img) {
              //     let count = 0
              //     let id = res0.data.msg
              //     that.uploadPic(id, count)
              //   } else {
              //     setTimeout(function () {
              //       wx.navigateBack({
              //         delta: 1
              //       })
              //     }, 3000)
                  
              //   }
              // }
              // else if (res0.data.code == 400) {

              // } else {
              //   wx.showToast({
              //     title: '提交失败',
              //     duration: 1000,
              //     mask: true,
              //   })
              // }
            }
          })
        } else if (res.cancel) {

        }
      }
    })

  },
})