// pages/discover/discover.js
var http = require('../../http/request')
var api = require('../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    resData: {},
    active: 1,
    goodsArr: []
  },
  inputWord(e) {
    let word = e.detail.trim()
    this.setData({ keyword: word })
  },
  onSearch() {
    wx.navigateTo({
      url: "/pages/search/search?keywords="+this.data.keyword
    })
  },
  select(e) {
    let id = e.currentTarget.dataset.typeid
    this.setData({ active: id })
    this.getGoods(id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.request('GET', api.ApiIndexKinds).then(res => {
      if (res.error_code === 0) {
        this.setData({ resData: res.data })
        this.getGoods(this.data.active)
      }
    })
  },
  getGoods(id) {
    let goods = this.data.resData.find(item => item.type_id === id)
    
    this.setData({ goodsArr: goods.goods })
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