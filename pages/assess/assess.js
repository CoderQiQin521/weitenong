// pages/assess/assess.js
var http = require('../../http/request')
var api = require('../../http/api')
var utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gid: 0,
    resData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({ gid: options.gid })
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
    http.request('GET', api.ApiGoodsAssess, { gid: this.data.gid }).then(res => {
      if (res.error_code === 0) {
        res.data.forEach(item => {
          item.addtime *= 1000
          item.addtime = utils.formatTime(new Date(item.addtime))
        })
        
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