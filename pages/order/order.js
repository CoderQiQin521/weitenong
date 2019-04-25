// pages/order/order.js
var http = require('../../http/request')
var api = require('../../http/api')
var pay = require('../../utils/pay')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resData: [],
    actionsStatus: false,
    actions: [],
    did: 0,
    status: 0,
    isExt: false
  },
  onClose() {
    this.setData({ actionsStatus: false })
  },
  cancel(e) {
    let { did, status } = e.currentTarget.dataset
    this.setData({ did, status })
    http.request('GET', api.ApiUserReason).then(res => {
      if (res.error_code === 1) {
        this.setData({ actions: res.data, actionsStatus: true })
      }
    })
  },
  onSelect(e) {
    this.onClose()
    let reason = e.detail.name,
    did = this.data.did,
    status= this.data.status
    
    if(this.data.isExt) {
      http.request('POST', api.ApiUserTui, { did, reason }).then(res => {
        if (res.error_code === 0) {
          this.getOrder(status)
        }
      })
    }else {
      http.request('POST', api.ApiOrderDelete, { did, reason }).then(res => {
        if (res.error_code === 0) {
          this.getOrder(status)
        }
      })
    }
    http.request('POST', api.ApiOrderDelete, { did, reason }).then(res => {
      if (res.error_code === 0) {
        
        this.getOrder(status)
      }
      
    })
   
  },
  onPay(e) {
    let { did } = e.currentTarget.dataset
    http.request('GET', api.ApiPay + '?did='+ did).then(respay => {
      
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
  },
  toDetail(e) {
    let { did } = e.currentTarget.dataset
    wx.navigateTo({
      url: "/pages/orderDetail/orderDetail?did=" +  did
    })
  },
  evaluate(e) {
    let { did } = e.currentTarget.dataset
    wx.navigateTo({
      url: "/pages/evaluate/evaluate?did=" +  did
    })
  },
  refund(e) {
    this.cancel(e)
    this.setData({ isExt: true })
  },
  affirm(e) {
    let { did, status } = e.currentTarget.dataset
    let that = this
    wx.showModal({
      title: "是否收到商品?",
      success: function(res) {
        if ( res.confirm ) {
          http.request('POST', api.ApiUserTakegoods, { did }).then(res => {
            that.getOrder(status)
          })
        }
      }
    })
    
  },
  changeTab(e) {
    let status = e.detail.index - 1
    this.getOrder(status)
  },
  getOrder(status) {
    let obj = status !== -1 ? { status } : {}
    http.request('GET', api.ApiUserMydd, obj).then(res => {
      this.setData({ resData: res.error_code === 0 ? res.data : [] })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrder(-1)
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
    wx.removeStorage('order')
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