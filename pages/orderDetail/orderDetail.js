// pages/orderDetail/orderDetail.js
var http = require('../../http/request')
var api = require('../../http/api')
var utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resData: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let did = options.did
    http.request('GET', api.ApiUserDetaildd + '?did=' + did ).then(res => {
      if (res.error_code === 0) {
        let data = res.data
        switch (data.status) {
          case 0:
            data.status = '待付款'
            break;
          case 1:
            data.status = '待发货'
            break;
          case 2:
            data.status = '待收货'
            break;
          case 3:
            data.status = '待评价'
            break;
          case 4:
            data.status = '售后/退款'
            break;
          case 5:
            data.status = '退货中'
            break;
          case 6:
            data.status = '已退货'
            break;
          default:
            break;
        }
        data.time = utils.formatTime(new Date(data.time * 1000))
        data.fu_time = data.fu_time ? utils.formatTime(new Date(data.fu_time * 1000)) : '---'
        data.fa_time = data.fa_time ? utils.formatTime(new Date(data.fa_time * 1000)) : '---'
        data.end_time = data.end_time ? utils.formatTime(new Date(data.end_time * 1000)) : '---'

        this.setData({
          resData: data
        })
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