// pages/collect/collect.js
var http = require('../../http/request')
var api = require('../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodData: [],
    shopData: []
  },
  onSwipeCellShop(event) {
    let { shopid } = event.currentTarget.dataset,
        shopData = this.data.shopData,
        index = shopData.findIndex(item => item.shopid === shopid)


    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
         // ApiGoodsCollect
        http.request('POST', api.ApiShopCollect, { shopid, collect: 0 }).then(res => {
          if (res.error_code === 0) {
            shopData.splice(index, 1)
            this.setData({ shopData })
          }
        })
        instance.close();
        break;
    }
  },
  onSwipeCellGood(event) {
    let { gid } = event.currentTarget.dataset,
        goodData = this.data.goodData,
        index = goodData.findIndex(item => item.gid === gid)

    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
         // ApiGoodsCollect
        http.request('POST', api.ApiGoodsCollect, { gid }).then(res => {
          if (res.error_code === 0) {
            console.log(res);
            goodData.splice(index, 1)
            this.setData({ goodData })
          }
        })
        instance.close();
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.request('GET', api.ApiUserCollect).then(res => {
      if (res.error_code === 0) {
        this.setData({ goodData: res.data })
      }
    })
    http.request('GET', api.ApiUserShopCollect).then(res => {
      if (res.error_code === 0) {
        this.setData({ shopData: res.data })
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