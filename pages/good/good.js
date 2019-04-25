// pages/good/good.js
var http = require('../../http/request')
var api = require('../../http/api')
var utils = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gid: null,
    goodData: {},
    show: false,
    addCart: false,
    collect: 0,
    specindex: 0,
    specid: 0,
    count: 1,
    goodSpec: {},
    car_cou: 0,
    addData: {},
    buyType: 1
  },
  openGoodSheet(e) {
    let { type } = e.currentTarget.dataset
    this.setData({ buyType: type })

    http.request('GET', api.ApiGoodsSpec, { gid: this.data.gid }).then(res => {
      if (res.error_code === 0) {
        let data = res.data
        if (data.spec.length === 0) {
          wx.showToast({
            title: '商品数据sid错误',
            icon: 'none'
          })
          return
        }
        this.setData({ count: 1, addCart: true, goodSpec: data, specid: data.spec[this.data.specindex].sid });
      }
    })
  },
  addCar() {
    let { gid, count: num, specid: sid, buyType } = this.data

    gid = parseInt(gid)  

    if (buyType === 1) {
      http.request('GET', api.ApiGoodsAddCar, { gid, num, sid }).then(res => {
        this.onClose()
        wx.showToast({
          title: res.msg,
          icon: res.error_code === 0 ? 'success' : 'none'
        })
        
        this.setData({
          car_cou: res.error_code === 0 ? this.data.car_cou + this.data.count : this.data.car_cou
        })
      })
    }else if(buyType === 2) {
      wx.navigateTo({
        url: '/pages/createOrder/createOrder?gid=' + gid + '&num=' + num + '&sid=' + sid
      })
    }
  },
  selectSpec(e) {
    let { index, specid } = e.currentTarget.dataset
    this.setData({ specindex: index, specid: specid });
  },
  // 改变数量
  changeCount(e) {
    this.setData({ count: e.detail })
  },
  // 收藏
  collect() {
    let gid = this.data.gid
    http.request('POST', api.ApiGoodsCollect, { gid }).then(res => {
      this.setData({
        collect: this.data.collect === 0 ? 1 : 0
      })
    })
  },
  // 关闭弹窗
  onClose() {
    this.setData({ show: false, addCart: false });
  },
  toShop(e) {
    let shopid = e.currentTarget.dataset.shopid
    wx.navigateTo({
      url: '/pages/shop/shop?shopid=' + shopid
    })
  },
  previewImage(e) {
    let urls = this.data.goodData.banner.map(item => item.image),
        img = e.currentTarget.dataset.img
    wx.previewImage({
      current: img,
      urls: urls
    })
  },
  callPhone(e) {
    let phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ gid: options.gid });
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
    http.request('GET', api.ApiGoodsDetail + "?gid=" + this.data.gid).then(res => {
      if (res.error_code === 0) {
        let data = res.data
        data.assess.forEach(item => {
          item.addtime *= 1000
          item.addtime = utils.formatTime(new Date(item.addtime))
        })
        data.goods.g_content = data.goods.g_content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
        wx.setNavigationBarTitle({ title: res.data.goods.g_name })
        this.setData({ goodData: res.data, collect: res.data.collect, car_cou: res.data.car_cou });
        console.log(res.data);
        
      }
    })
    http.request('GET', api.ApiAddrDefault).then(res => {
      if (res.error_code === 0) {
        this.setData({ addData: res.data });
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