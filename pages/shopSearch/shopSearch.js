// pages/shopSearch/shopSearch.js
var http = require('../../http/request')
var api = require('../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    resData: [],
    hotArr: [],
    shopid: null
  },
  inputWord(e) {
    let word = e.detail.trim()
    if (word === "") {
      this.setData({ resData: [] })
    }
    this.setData({ keyword: word })
  },
  onSearch() {
    http.request('POST', api.ApiShopSearchLister, { shopid: this.data.shopid, keywords: this.data.keyword }).then(res => {
      if (res.error_code === 0) {
        console.log(res);
        this.setData({ resData: res.data })
      }else if (res.error_code === 1) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
      console.log(res);
    })
  },
  select(e) {
    let hot = e.currentTarget.dataset.hot
    this.setData({ keyword: hot })
    this.onSearch()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let shopid = options.shopid
    this.setData({ shopid: shopid })
    http.request('GET', api.ApiShopSearch, { shopid: shopid }).then(res => {
      if (res.error_code === 0) {
        this.setData({ hotArr: res.data })
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