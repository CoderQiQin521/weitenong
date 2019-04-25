// pages/shop/shop.js
var http = require('../../http/request')
var api = require('../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resData: {},
    shopid: null,
    collect: 0,
    follow: 0
  },
  collect(e) {
    let collect = this.data.collect === 0 ? 1 : 0,
        newcollect = collect === 1 ? 1 : -1
    this.setData({ collect: collect, follow: this.data.follow + newcollect })
    http.request('POST', api.ApiShopCollect, { shopid: this.data.shopid, collect: this.data.collect }).then(res => {
      if (res.error_code === 0) {
        console.log(res.msg);
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let shopid = options.shopid
    this.setData({ shopid: shopid })
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
    http.request('GET', api.ApiShop + "?shopid=" + this.data.shopid).then(res => {
      if (res.error_code === 0) {
        wx.setNavigationBarTitle({ title: res.data.shop.name })
        this.setData({ resData: res.data, collect: res.data.shop.collect, follow: res.data.shop.follow })
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