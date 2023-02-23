
//app.js
var util = require('utils/util.js')
App({
  globalData: {
    terms: [],
    userInfo: null,
    //pssa.quantacenter.com/sign/public/index.php
    post_url: "https://pssa.quantacenter.com",
    rank: wx.getStorageSync('rank'),
    token: wx.getStorageSync('token')
  },
  onShow: function(){
    
  },
  onLaunch: function () {
    this.getTime();
    //console.log(wx.getStorageSync('token'));
  },
  getTime: function () {
    let date = util.formatTime(new Date())
    let year = date.split('/')[0];
    let month = date.split('/')[1];
    let day = date.split('/')[2].split(' ')[0];
    //console.log(date)
    //console.log(year)
    let term = ''
    let arr = [];
    for (let i = 2018; i <= year; i++) {
      let a = (i - 1) + '-' + i + '-' + 2;
      let b = i + '-' + (i + 1) + '-' + 1;
      if (i < year) {
        arr.push(a);
        arr.push(b);
      } else {
        if (month > 2 && month < 9) {
          arr.push(a);
          term = a
        } else {
          arr.push(a);
          arr.push(b);
          term = b
        }
      }
    }
    //console.log(term)
    arr.push('全部时段')
    arr.reverse()
    this.globalData.terms = arr
    this.globalData.year = year
    this.globalData.month = month
    this.globalData.day = day
    this.globalData.currentTerm = term
    // console.log(this.globalData.currentTerm)
    //console.log(this.globalData.terms)

  },
  stateObject: {
    '1': '未开始',
    '2': '已开始',
    '3': '已结束'
  }
})