# pssa-miniapp

## 项目简介
广外培训学时小程序端，基于微信小程序原生技术栈开发，相关问题可查阅 (微信开发文档)[https://developers.weixin.qq.com/miniprogram/dev/framework/]

- pssa_wx 培训学时用户端
- pssa_wx_manager 培训学时管理端

## 注意
新版培训学时，小程序侧是没有进行大的改动的，基本上就是对原有请求接口进行修改并且改了部分样式。目前小程序的管理端和用户端都存在部分接口没有更新的问题，导致功能存在缺陷，后续可以和后台同学沟通下将这部分完成。  

下面示例是项目中两种接口的请求格式。
``` javascript
// 旧版接口请求方式
// token 写在data中
// 请求url为 baseURl，相关模块通过type区分
{
    url: app.globalData.post_url,
    method: 'POST',
    dataType: 'json',
    header: {
        "content-type": "application/json"
    },
    data: {
        token: res.data,
        "type": "A016",
        data: {
            term: that.data.term
        }
    },
}

// 新版接口请求方式
// token 写在header中及 请求url为 baseURl + 模块路径

{
      url: app.globalData.post_url+'/index/changePassword',
      method: "POST",
      dataType: 'json',
      header: { 
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: {
        "data": {
          "password_old": old_pass,
          "password_new": new_pass2
        }
      },
}
```