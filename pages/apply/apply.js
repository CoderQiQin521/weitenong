// pages/apply/apply.js
var http = require('../../http/request')
var api = require('../../http/api')
var utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resData: {},
    formData: {
      usernames: "",
      name: "",
      phone: "",
      content: "",
      addr: ""
    },
    usernames: ""
  },
  inputName(e) {
    let str = e.detail.trim(),
    formData = this.data.formData
    formData.usernames = str
    this.setData({
      formData
    })
  },
  inputShopName(e) {
    let str = e.detail.trim(),
    formData = this.data.formData
    formData.name = str
    this.setData({
      formData
    })
  },
  inputShopDesc(e) {
    let str = e.detail.trim(),
    formData = this.data.formData
    formData.content = str
    this.setData({
      formData
    })
  },
  inputPhone(e) {
    let str = e.detail.trim(),
    formData = this.data.formData
    formData.phone = str
    this.setData({
      formData
    })
  },
  inputAddr(e) {
    let str = e.detail.trim(),
    formData = this.data.formData
    formData.addr = str
    this.setData({
      formData
    })
  },
  submit() {
    let formData = this.data.formData
    var bol = true
    for(let k in formData) {
      if(formData[k] === "") {
        bol = false
        break
      }
    }
    if (bol) {
      if (!utils.verifyPhone(formData.phone - 0)) {
        wx.showToast({
          title: '手机号码格式不正确',
          icon: 'none'
        })
        return
      }
      http.request('POST', api.ApiShopApplySave, formData).then(res => {
        if (res.error_code === 0) {
          wx.reLaunch({
            url: '/pages/result/result?type=3'
          })
        }else {
          wx.reLaunch({
            url: '/pages/result/result?type=4'
          })
        }
      })
    }else {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
    }
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
    
    http.request('GET', api.ApiShopApply).then(res => {
      if (res.error_code === 0) {
        this.setData({ resData: res.data })
      }
    })
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