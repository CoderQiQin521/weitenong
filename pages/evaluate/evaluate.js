// pages/evaluate/evaluate.js
var http = require('../../http/request')
var api = require('../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    did: 0,
    resData: {},
    rate: 5,
    assess: []
  },
  changeRate(e) {
    let gid = e.currentTarget.dataset.gid,
    rate = e.detail,
    assess = this.data.assess
    assess.forEach(item => {
      if (item.gid === gid) {
        item.num = rate
      }
    })
    this.setData({ assess });
  },
  changeMsg(e) {
    let gid = e.currentTarget.dataset.gid,
    msg = e.detail.trim(),
    assess = this.data.assess
    assess.forEach(item => {
      if (item.gid === gid) {
        item.content = msg
      }
    })
    this.setData({ assess });
  },
  submit() {
    let did = this.data.did,
    assess = this.data.assess

    http.request('POST', api.ApiSaveAssess, { did, assess }).then(res => {
      if (res.error_code === 0) {
        wx.reLaunch({
          url: '/pages/result/result?type=5'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let did = options.did
    this.setData({ did })
    http.request('GET', api.ApiUserAssess, { did }).then(res => {
      if (res.error_code === 0) {
        var resAssess = []
        for (let index = 0; index < res.data.goods.length; index++) {
          const element = res.data.goods[index];
          resAssess.push({
            gid: element.gid,
            num: 5,
            content: ''
          })
        }
        this.setData({ resData: res.data, assess: resAssess });
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