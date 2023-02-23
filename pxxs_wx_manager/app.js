//app.js
var util = require('utils/util.js')
App({
  globalData: {
    term: [],
    terms: [],
    userInfo: null,
    post_url: "https://pssa.quantacenter.com",
    rank: wx.getStorageSync('rank'),
    token: wx.getStorageSync('token')
  },
  onLaunch: function () {
    this.getTime();
  },
  getTime: function () {
    let date = util.formatTime(new Date())
    let year = date.split('/')[0];
    let month = date.split('/')[1];
    let term = '';
    let arr = [];
    let y = [];
    for (let i = 2018; i <= year; i++) {
      y.push('' + i);
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
    arr.reverse()
    y.reverse()
    //console.log(y)
    // console.log(arr)
    this.globalData.term= term
    this.globalData.terms = arr
    this.globalData.years = y
    this.globalData.currentYear = year
    this.globalData.currentMonth = month - 1
  },
  termOption: [
    '2020-2021-2',
    '2020-2021-1',
    '2019-2020-2',
    '2019-2020-1'
  ],
  stateObject: {
    '1': '未开始',
    '2': '已开始',
    '3': '已结束'
  }
})