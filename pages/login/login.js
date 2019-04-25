// pages/login/login.js
var http = require('../../http/request')
var api = require('../../http/api')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: ''
  },
  onGotUserInfo(e) {
    // 授权成功
    if(e.detail.errMsg === "getUserInfo:ok") {
      let globalData = app.globalData
      http.request('POST', api.ApiLogin, {
        code: globalData.code,
        nickname: e.detail.userInfo.nickName,
        image: e.detail.userInfo.avatarUrl,
        fid: 0
      }).then(res => {
        if (res.error_code === 0) {
          wx.setStorageSync('uid', res.data.uid)
          wx.showToast({
            title: res.msg
          })
          wx.switchTab({
            url: "/pages/index/index"
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.request('GET', api.ApiLogo).then(res => {
      if (res.error_code === 0) {
        this.setData({logo: res.data.pclogo})
      }
    })
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