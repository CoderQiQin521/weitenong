// pages/bindPhone/bindPhone.js
var http = require('../../http/request')
var api = require('../../http/api')
var utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeStatus: false,
    codeMsg: '获取验证码',
    phone: '',
    code: ''
  },
  inputPhone(e) {
    let phone = e.detail.trim()
    this.setData({ phone })
  },
  inputCode(e) {
    let code = e.detail.trim()
    this.setData({ code })
  },
  countDown() {
    let time = 60
    var t = setInterval(() => {
      time--
      this.setData({ codeStatus: true, codeMsg: '重新发送' + time + 's' })
      if (time <= 0) {
        this.setData({ codeStatus: false, codeMsg: '获取验证码' })
        clearInterval(t)
      }
    }, 1000)
  },
  sendCode() {
    let { phone } = this.data

    if (!utils.verifyPhone(phone - 0)) {
      wx.showToast({
        title: '手机号码格式不正确',
        icon: 'none'
      })
      return
    }
    http.request('POST', api.ApiGetCode, { phone }).then(res => {
      wx.showToast({
        title: res.msg,
        icon: res.error_code === 0 ? 'success' : 'none'
      })
      if (res.error_code === 0) {
        this.countDown()
      }
    })
  },
  submit() {
    let { phone, code } = this.data
    if (!utils.verifyPhone(phone - 0)) {
      wx.showToast({
        title: '手机号码格式不正确',
        icon: 'none'
      })
      return
    }
    http.request('POST', api.ApiSavePhone, { phone, code }).then(res => {
      wx.showToast({
        title: res.msg,
        icon: res.error_code === 0 ? 'sucess' : 'none'
      })
      if (res.error_code === 0) {
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/user/user'
          })
        }, 2000)
      }
    })
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