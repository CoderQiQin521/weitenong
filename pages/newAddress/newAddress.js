// pages/newAddress/newAddress.js
var http = require('../../http/request')
var api = require('../../http/api')
var util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aid: 0,
    username: '',
    phone: '',
    addr: [],
    addrs: '',
    isOld: false
  },
  inputName(e) {
    let username = e.detail.trim()
    if (username === '') return
    this.setData({ username })
  },
  inputPhone(e) {
    let phone = e.detail.trim()
    
    this.setData({ phone })
  },
  bindRegionChange(e) {
    let addr = e.detail.value
    this.setData({
      addr
    })
  },
  inputAddrs(e) {
    let addrs = e.detail.trim()
    this.setData({ addrs })
  },
  onSave(e) {
    let thatData = this.data
    let { aid, username, phone, addr, addrs } = thatData

    if (username === "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return
    }
    
    if (!util.verifyPhone(phone - 0)) {
      wx.showToast({
        title: '号码格式不正确',
        icon: 'none'
      })
      return
    }

    if (addr.length === 0) {
      wx.showToast({
        title: '请选择地区',
        icon: 'none'
      })
      return
    }
    if (addrs === "") {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none'
      })
      return
    }
    let post = { username, phone, addr: addr.join(' '), addrs }
    
    if (aid) {
      http.request('POST', api.ApiUserAddrUsave, { aid: aid, username, phone, addr: addr.join(' '), addrs }).then(res => {
        if (res.error_code === 0) {
          wx.navigateBack()
        }else if(res.error_code === 1) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    } else {
      http.request('POST', api.ApiUserAddrsave, post).then(res => {
        if (res.error_code === 0) {
          wx.navigateBack()
        }else if(res.error_code === 1) {
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
    let aid = options.aid
    if (aid) {
      this.setData({ aid })
      wx.setNavigationBarTitle({ title: '修改地址' })
      
      http.request('GET', api.ApiUserAddrDetail + "?aid=" + aid).then(res => {
        if (res.error_code === 0) {
          let data = res.data
          this.setData({
            username: data.username,
            phone: data.phone,
            addr: data.addr.split(' '),
            addrs:  data.addrs
          })
        }else if(res.error_code === 1) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
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