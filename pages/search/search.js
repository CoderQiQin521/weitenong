// pages/search/search.js
var http = require('../../http/request')
var api = require('../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keywords: '',
    currentSelect: 0,
    price: true,
    resData: []
  },
  toShop(e) {
    wx.navigateTo({
      url: '/pages/shop/shop?shopid=' + e.currentTarget.dataset.shopid
    })
  },
  changeOrder(e) {
    let order = e.currentTarget.dataset.order - 0,
    currentSelect = e.currentTarget.id - 0

    if (currentSelect === 2) {
      this.setData({ price: !this.data.price })
      if(this.data.price) {

        this.search(1)
        
      }else{
        this.search(2)
      }

    }
    

    if(currentSelect === this.data.currentSelect) return
    if(order === 0) {
      this.search()
    }else {
      this.search(order)
    }
    this.setData({ currentSelect })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ keywords: options.keywords })
    this.search()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  search(sort) {
    var obj = sort ? { sort, keywords: this.data.keywords } : { keywords: this.data.keywords }

    http.request('POST', api.Api.goods.search, obj).then(res => {
      if (res.error_code === 0) {
        this.setData({ resData: res.data })
      }
    })
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