// pages/cart/cart.js
var http = require('../../http/request')
var api = require('../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resData: [],
    checkedAll: 0,
    total: 0
  },
  totalPrice() {
    let total = 0,
    goods = this.data.resData
    goods.forEach(item => {
      item.goods.forEach(i => {
        if (i.status) total += i.price * i.num
      })
    })
    this.setData({
      total: total * 100
    })
  },
  changeCount(e) {
    let count = e.detail,
    cid = e.currentTarget.dataset.cid
    http.request('POST', api.ApiCarNum, { cid: cid, num: count }).then(res => {
      if (res.error_code === 0) {
        this.getData()
      }
    })
  },
  checkedOne(e) {
    let cid = e.currentTarget.dataset.cid
    http.request('GET', api.ApiCarOne + "?cid=" + cid).then(res => {
      if (res.error_code === 0) {
        this.getData()
      }
    })
  },
  checkedShop(e) {
    let shopid = e.currentTarget.dataset.shopid,
    check = e.currentTarget.dataset.check ? 0 : 1
    http.request('POST', api.ApiCarShopAll, { type: check, shopid: shopid }).then(res => {
      if (res.error_code === 0) {
        this.getData()
      }
    })
  },
  checkedAll() {
    var type = this.data.checkedAll ? 0 : 1
    http.request('GET', api.ApiCarAll + '?type=' + type).then(res => {
      if (res.error_code === 0) {
        this.getData()
      }
    })
  },
  delete() {
    let that = this
    wx.showModal({
      title: "是否删除所选商品?",
      success: function(res) {
        if ( res.confirm ) {
          http.request('POST', api.ApiCarDelete).then(res => {
            if (res.error_code === 0) {
              that.setData({ resData: [] });
            }
          })
        }
      }
    })
    
  },
  onSubmit() {
    wx.navigateTo({
      url: "/pages/createOrder/createOrder"
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
  getData() {
    http.request('GET', api.ApiCarLister).then(res => {
      if (res.error_code === 0) {
        this.setData({ resData: res.data.goods, checkedAll: res.data.checkall });
        this.totalPrice()
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
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