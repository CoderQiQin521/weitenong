// pages/createOrder/createOrder.js
var http = require('../../http/request')
var api = require('../../http/api')
var pay = require('../../utils/pay')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resData: {},
    type: 1,
    nowData: {},
    addData: {},
    pay: false,
    content: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.num && options.sid) {
      this.setData({ type: 2, nowData: options })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  inputContent(e) {
    let content = e.detail.trim()
    this.setData({ content })
  },
  onPay() {
    let { addData: {aid}, content } = this.data
    if (!aid) {
      wx.showToast({
        title: '请选择配送地址',
        icon: 'none'
      })
      return
    }
    this.setData({ pay: true })
    if (this.data.type === 1) { // 加入购物车支付
      http.request('POST', api.ApiCarPan, { aid, content, freight: this.data.resData.freight }).then(res => {
        if (res.error_code === 0) {
          http.request('GET', api.ApiPay + '?did='+ res.data.did).then(respay => {
            pay.pay(respay).then(res => {
              wx.showToast({
                title: '支付成功'
              })
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/result/result?type=1'
                })
              } ,2000)
            })
          })
        }
      })
    }else { // 立即购买支付
      let nowData = this.data.nowData
      nowData.aid = aid
      nowData.content = content
      nowData.freight = this.data.resData.freight
      http.request('POST', api.ApiGoodsSdd, nowData).then(res => {
        if (res.error_code === 0) {
          http.request('GET', api.ApiPay + '?did='+ res.data.did).then(respay => {
            pay.pay(respay).then(res => {
              wx.showToast({
                title: '支付成功'
              })
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/result/result?type=1'
                })
              } ,2000)
            })
          })
        }
      })
    }
    //ApiGoodsSdd
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let aid = wx.getStorageSync('aid')
    
    if(aid) {
      http.request('GET', api.ApiUserAddrDetail + "?aid=" + aid).then(res => {
        if (res.error_code === 0) {
          let data = res.data
          
          this.setData({
            addData: data
          })
        }
      })
    }else {
      http.request('GET', api.ApiAddrDefault).then(res => {
        if (res.error_code === 0) {
          this.setData({ addData: res.data });
        }
      })
    }
    if (this.data.type === 1) {
      http.request('GET', api.ApiCarBuy).then(res => {
        if (res.error_code === 0) {
          this.setData({ resData: res.data })
        }
      })
    }else {
      http.request('POST', api.ApiGoodsBuy, this.data.nowData).then(res => {
        if (res.error_code === 0) {
          this.setData({ resData: res.data })
        }
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.removeStorageSync('aid')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('aid')
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